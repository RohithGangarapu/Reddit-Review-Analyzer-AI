# Reddit Review Analyzer AI

A full-stack AI application designed to scrape Reddit discussions on a given topic, analyze the collected comments using a Retrieval-Augmented Generation (RAG) pipeline, and allow users to chat with the extracted context.

---

## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Terminology](#terminology)
- [Tech Stack](#tech-stack)
- [Project Architecture & Workflow](#project-architecture--workflow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (FastAPI & Scraper)](#backend-setup-fastapi--scraper)
  - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
- [Usage](#usage)

---

## 🚀 Project Overview

**Reddit Review Analyzer AI** takes a user search query, crawls Reddit for relevant posts, and compiles the comments into a vector knowledge base. Once the analysis is complete, the application uses Large Language Models (LLMs) to synthesize a comprehensive summary of public sentiment, key opinions, and allows you to chat naturally with the compiled data to answer specific questions.

---

## ✨ Key Features

- **Automated Web Scraping:** Headless Reddit scraper utilizing Playwright to extract posts and comments dynamically.
- **RAG Pipeline:** Utilizes FAISS and LangChain for semantic chunking and embedding generation.
- **AI-Powered Analysis:** Synthesizes user reviews into concise, readable summaries.
- **Interactive Chat Interface:** Chat with the scraped context dynamically for follow-up questions.
- **Modern UI:** Built with React, Tailwind CSS, and Framer Motion for a stunning, responsive aesthetic.

---

## 📚 Terminology

- **RAG (Retrieval-Augmented Generation):** An AI framework that retrieves factual information from an external knowledge base (in this case, Reddit posts) to ground large language models (LLMs) and provide accurate, contextual answers.
- **FAISS (Facebook AI Similarity Search):** A highly efficient library for similarity search and clustering of dense vectors. Used here to store and query the embeddings of Reddit comments.
- **LangChain:** A framework used to orchestrate the RAG pipeline, manage prompts, and connect language models to the FAISS vector store.
- **Embeddings / Vector Store:** Text data converted into high-dimensional numerical vectors. When you ask a question, your query is embedded and compared against the vector store to find the most relevant context.
- **Playwright:** An end-to-end testing and automation library used here to headlessly control a browser, bypass simple bot protections, and scrape Reddit dynamically.
- **FastAPI:** A high-performance Python web framework used for the backend to handle concurrent API requests and serve the AI responses.
- **Vite:** A blazing-fast build tool and development server for modern web projects, used to serve the React frontend.

---

## 💻 Tech Stack

### Frontend
- **React 19:** UI Library
- **Vite:** Build Tool & Dev Server
- **Tailwind CSS 4:** Utility-first styling framework
- **Framer Motion:** Declarative animations
- **TypeScript:** Typed JavaScript

### Backend & AI
- **Python 3.10+:** Core runtime
- **FastAPI & Uvicorn:** Async REST API
- **LangChain:** LLM Orchestration
- **HuggingFace Hub:** Open-source Language Models
- **FAISS:** Local Vector Database
- **Playwright (Async API):** Reddit Scraping Engine

---

## ⚙️ Project Architecture & Workflow

1. **User Request:** The user submits a search query (e.g., "Best noise canceling headphones") via the React Frontend.
2. **Scraper Invocation:** The FastAPI backend receives the request and triggers the `playwright` Reddit scraper (`scraper/reddit_scraper/main.py`).
3. **Data Collection:** The scraper navigates Reddit, fetches top posts and their comments, and saves the structured data to an `output.json` file.
4. **Vector Embedding:** The backend's RAG Pipeline (`backend/rag_pipeline.py`) loads the JSON data, chunks it, converts it into embeddings using HuggingFace models, and stores it locally in a FAISS vector database.
5. **LLM Synthesis:** The pipeline uses an LLM to generate an overarching summary of the posts, which is returned to the frontend.
6. **Follow-up Chat:** Users can use the `/api/chat` endpoint to ask specific follow-up questions. The RAG pipeline retrieves relevant snippets from the FAISS database to formulate an accurate answer.

---

## 📂 Project Structure

```text
reddit-review-analyzer/
│
├── backend/                  # API and AI logic
│   ├── rag_pipeline.py       # LangChain + FAISS implementation
│   ├── server.py             # FastAPI endpoints (/api/analyze, /api/chat)
│   ├── requirements.txt      # Python dependencies
│   └── vector_store/         # Local FAISS storage (Generated dynamically)
│
├── frontend/                 # React UI
│   ├── src/                  # React components, pages, and hooks
│   ├── public/               # Static assets
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Tailwind setup
│   └── vite.config.ts        # Vite configuration
│
└── scraper/                  # Playwright web scraper
    ├── reddit_scraper/       # Scraper modules (comments, posts, search logic)
    │   ├── main.py           # Entry point for scraper
    │   └── models.py         # Pydantic schemas for scraped data
    └── output.json           # Output file from the scraper
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **Hugging Face API Token** (Free token from [HuggingFace Settings](https://huggingface.co/settings/tokens))

### Backend Setup (FastAPI & Scraper)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment and activate it:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install Playwright browsers:**
   ```bash
   playwright install
   ```

5. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your HuggingFace Token:
     ```env
     HUGGINGFACEHUB_API_TOKEN=hf_your_token_here
     ```

6. **Start the FastAPI Server:**
   ```bash
   uvicorn server:app --reload --port 8000
   ```
   *The backend will now run at `http://localhost:8000`.*

### Frontend Setup (React + Vite)

1. **Navigate to the frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install node dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The frontend will be accessible at `http://localhost:5173`.*

---

## 🎮 Usage

1. **Open the application** in your browser (`http://localhost:5173`).
2. **Enter a query** in the search bar (e.g., "MacBook Pro M3 vs M3 Max").
3. **Wait for the analysis.** The app will scrape Reddit, process the text, and display an AI-generated summary of opinions.
4. **Chat!** Use the chat interface to ask specific questions about the topic based on the scraped discussions.
