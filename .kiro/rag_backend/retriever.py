from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle
from pathlib import Path
from typing import List, Dict, Tuple
from utils import logger, get_vectorstore_path

class VectorRetriever:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        self.index = None
        self.documents = []
        self.vectorstore_path = get_vectorstore_path()
        
    def build_index(self, documents: List[Dict]):
        """Build FAISS index from documents"""
        logger.info(f"Building index for {len(documents)} documents")
        
        texts = [doc["text"] for doc in documents]
        self.documents = documents
        
        embeddings = self.model.encode(texts, show_progress_bar=True)
        embeddings = np.array(embeddings).astype("float32")
        
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dimension)
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings)
        
        logger.info("Index built successfully")
        
    def save_index(self):
        """Persist index and documents to disk"""
        self.vectorstore_path.mkdir(exist_ok=True)
        
        index_path = self.vectorstore_path / "faiss.index"
        docs_path = self.vectorstore_path / "documents.pkl"
        
        faiss.write_index(self.index, str(index_path))
        
        with open(docs_path, "wb") as f:
            pickle.dump(self.documents, f)
        
        logger.info("Index saved to disk")
        
    def load_index(self):
        """Load index and documents from disk"""
        index_path = self.vectorstore_path / "faiss.index"
        docs_path = self.vectorstore_path / "documents.pkl"
        
        if not index_path.exists() or not docs_path.exists():
            logger.warning("Index files not found")
            return False
            
        self.index = faiss.read_index(str(index_path))
        
        with open(docs_path, "rb") as f:
            self.documents = pickle.load(f)
        
        logger.info(f"Index loaded with {len(self.documents)} documents")
        return True
        
    def retrieve(self, query: str, top_k: int = 5) -> List[Tuple[Dict, float]]:
        """Retrieve top-k most similar documents"""
        if self.index is None:
            logger.error("Index not initialized")
            return []
        
        query_embedding = self.model.encode([query])
        query_embedding = np.array(query_embedding).astype("float32")
        faiss.normalize_L2(query_embedding)
        
        scores, indices = self.index.search(query_embedding, top_k)
        
        results = []
        for idx, score in zip(indices[0], scores[0]):
            if idx < len(self.documents):
                results.append((self.documents[idx], float(score)))
                logger.info(f"Retrieved chunk_id={self.documents[idx]['metadata']['chunk_id']} score={score:.3f}")
        
        return results
