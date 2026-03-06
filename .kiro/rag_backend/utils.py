import logging
import os
from pathlib import Path

def setup_logger():
    """Configure logging for the application"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('rag_system.log'),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)

logger = setup_logger()

def get_docs_path():
    """Get the documents directory path"""
    return Path(__file__).parent / "docs"

def get_vectorstore_path():
    """Get the vector store directory path"""
    return Path(__file__).parent / "vectorstore"
