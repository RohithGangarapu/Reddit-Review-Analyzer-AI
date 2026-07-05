import os
import traceback
from dotenv import load_dotenv
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Load environment variables from .env
load_dotenv()

token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
print(f"Hugging Face Token present: {token is not None}")

# Model of choice (3B parameters, ungated, highly capable)
model_id = "meta-llama/Meta-Llama-3-8B-Instruct"

try:
    print(f"\n1. Initializing native HuggingFaceEndpoint for {model_id}...")
    llm = HuggingFaceEndpoint(
        repo_id=model_id,
        max_new_tokens=100,
        temperature=0.2,
        huggingfacehub_api_token=token
    )
    print("HuggingFaceEndpoint successfully created.")
    
    print("\n2. Wrapping inside native ChatHuggingFace model...")
    chat = ChatHuggingFace(llm=llm)
    print("ChatHuggingFace successfully created.")
    
    print("\n3. Invoking chat prompt chain...")
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant."),
        ("human", "Answer this: Name three primary colors.")
    ])
    
    chain = prompt | chat | StrOutputParser()
    response = chain.invoke({})
    print(f"\n🎉 Success! Response:\n{response.strip()}")
except Exception as e:
    print("\n❌ Failed to run native HuggingFace RAG pipeline:")
    traceback.print_exc()
