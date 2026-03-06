from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import QueryRequest, QueryResponse
from retriever import VectorRetriever
from smart_generator import SmartAnswerGenerator
from ingest import DocumentIngester
from utils import logger, get_docs_path
from analytics_middleware import track_query
from pathlib import Path
import time

retriever = VectorRetriever()
generator = SmartAnswerGenerator()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize the system on startup"""
    logger.info("Starting RAG system...")

    if not retriever.load_index():
        logger.info("No existing index found. Building new index...")
        ingester = DocumentIngester()
        docs_path = get_docs_path()
        documents = ingester.load_documents(docs_path)

        if documents:
            retriever.build_index(documents)
            retriever.save_index()
            logger.info(f"Index built with {len(documents)} chunks")
        else:
            logger.warning("No documents found in docs folder")

    yield  # App runs here

app = FastAPI(title="RAG Document Q&A API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """Query the document store"""
    start_time = time.time()
    
    try:
        logger.info(f"API request received: {request.question[:50]}...")

        retrieved_docs = retriever.retrieve(request.question, top_k=5)

        result = generator.generate(request.question, retrieved_docs)
        
        # Track in analytics (non-blocking)
        track_query(
            question=request.question,
            answer=result.get("answer", ""),
            confidence=result.get("confidence", "low"),
            sources=result.get("sources", []),
            start_time=start_time
        )

        return QueryResponse(**result)

    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Internal error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "documents": len(retriever.documents)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

