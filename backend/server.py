import os
import sys
import json
import uuid
import logging
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add parent directory and scraper directory to python path to allow clean module imports
current_dir = Path(__file__).parent.resolve()
parent_dir = current_dir.parent.resolve()
sys.path.append(str(parent_dir))
sys.path.append(str(parent_dir / "scraper"))
sys.path.append(str(parent_dir / "scraper" / "reddit_scraper"))

from scraper.reddit_scraper.main import run_scraper
from rag_pipeline import RagPipeline

# Configure logging
logging.basicConfig(
  level=logging.INFO,
  format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("backend.server")

# Instantiate FastAPI application
app = FastAPI(
  title="Reddit Review Analyzer API",
  description="LangChain-powered RAG backend for Reddit discussion analysis",
  version="1.0.0"
)

# Configure CORS Middleware
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"], # In production, restrict this to specific origins (e.g. localhost:5173)
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Initialize the LangChain RAG pipeline
logger.info("Initializing LangChain RAG Coordinator...")
try:
  rag_pipeline = RagPipeline()
  logger.info("RAG Coordinator successfully initialized.")
except Exception as e:
  logger.error(f"Failed to initialize RAG Coordinator: {e}")
  rag_pipeline = None

# Input schemas
class AnalyzeRequest(BaseModel):
  query: str

class ChatRequest(BaseModel):
  session_id: str
  question: str

@app.post("/api/analyze")
async def analyze_query(request: AnalyzeRequest):
  query = request.query.strip()
  if not query:
    raise HTTPException(status_code=400, detail="Search query cannot be empty.")
    
  session_id = f"session_{uuid.uuid4().hex[:12]}"
  logger.info(f"New analysis request received: '{query}' | Assigned Session: {session_id}")

  output_file = parent_dir / "scraper" / "output.json"
  
  # 1. Trigger the Playwright Scraper
  try:
    logger.info(f"Triggering Playwright Reddit Scraper for query: '{query}'...")
    # Scrape 30 posts with 12 comments each for robust analysis
    await run_scraper(
      query=query,
      posts_limit=30,
      comments_limit=12,
      output_file=str(output_file),
      headless=False
    )
    logger.info("Playwright Reddit Scraper completed successfully.")
  except Exception as e:
    logger.error(f"Scraper execution failed: {e}. Attempting to recover using cached data.")
    if not output_file.exists():
      raise HTTPException(
        status_code=500, 
        detail=f"Playwright scraper failed and no cached data exists. Error: {str(e)}"
      )

  # 2. Read the Scraped JSON Output
  try:
    with open(output_file, "r", encoding="utf-8") as f:
      scraped_data = json.load(f)
    posts = scraped_data.get("posts", [])
  except Exception as e:
    logger.error(f"Failed to parse scraper output.json: {e}")
    raise HTTPException(status_code=500, detail="Failed to parse collected scraper discussions data.")

  # 3. Process RAG Pipeline Analysis (FAISS Embeddings + LLM Summary)
  if not rag_pipeline:
    raise HTTPException(status_code=500, detail="RAG system is not initialized.")
    
  try:
    logger.info("Triggering RAG analysis and vector index generation...")
    analysis_result = rag_pipeline.generate_analysis(query, posts, session_id)
    return analysis_result
  except ValueError as ve:
    logger.warning(f"Analysis failed due to missing data: {ve}")
    raise HTTPException(status_code=404, detail=str(ve))
  except Exception as e:
    logger.error(f"RAG compilation analysis failed: {e}", exc_info=True)
    raise HTTPException(status_code=500, detail=f"RAG processing failed: {str(e)}")

@app.post("/api/chat")
async def chat_followup(request: ChatRequest):
  session_id = request.session_id.strip()
  question = request.question.strip()
  
  if not session_id or not question:
    raise HTTPException(status_code=400, detail="session_id and question parameters are required.")

  logger.info(f"Chat follow-up request received for session {session_id}: '{question}'")

  if not rag_pipeline:
    raise HTTPException(status_code=500, detail="RAG system is not initialized.")

  try:
    answer = rag_pipeline.chat_with_docs(session_id, question)
    return {"answer": answer}
  except Exception as e:
    logger.error(f"RAG chat follow-up failed: {e}", exc_info=True)
    raise HTTPException(status_code=500, detail=f"RAG Chat processing failed: {str(e)}")

@app.get("/api/health")
def health_check():
  return {
    "status": "healthy",
    "rag_pipeline_initialized": rag_pipeline is not None,
    "huggingface_token_configured": os.getenv("HUGGINGFACEHUB_API_TOKEN") is not None
  }
