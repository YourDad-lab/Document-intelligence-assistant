from typing import List, Tuple, Dict
from utils import logger

FALLBACK_MESSAGE = "I could not find this in the provided documents. Can you share the relevant document?"

class AnswerGenerator:
    def __init__(self):
        pass
        
    def generate(self, query: str, retrieved_docs: List[Tuple[Dict, float]]) -> Dict:
        """Generate answer from retrieved documents"""
        
        if not retrieved_docs or len(retrieved_docs) == 0:
            logger.info("No documents retrieved - returning fallback")
            return {
                "answer": FALLBACK_MESSAGE,
                "sources": [],
                "confidence": "low"
            }
        
        avg_score = sum(score for _, score in retrieved_docs) / len(retrieved_docs)
        best_score = retrieved_docs[0][1] if retrieved_docs else 0
        
        if best_score < 0.3:
            logger.info(f"Best score {best_score:.3f} below threshold - returning fallback")
            return {
                "answer": FALLBACK_MESSAGE,
                "sources": [],
                "confidence": "low"
            }
        
        answer_text = self._construct_answer(query, retrieved_docs)
        sources = self._extract_sources(retrieved_docs)
        confidence = self._calculate_confidence(best_score, avg_score)
        
        logger.info(f"Generated answer with confidence={confidence}")
        
        return {
            "answer": answer_text,
            "sources": sources,
            "confidence": confidence
        }
    
    def _construct_answer(self, query: str, retrieved_docs: List[Tuple[Dict, float]]) -> str:
        """Construct answer from top retrieved chunks"""
        top_chunks = [doc["text"] for doc, _ in retrieved_docs[:3]]
        
        combined_text = " ".join(top_chunks)
        
        sentences = combined_text.split(". ")
        answer_sentences = sentences[:4]
        answer = ". ".join(answer_sentences)
        
        if not answer.endswith("."):
            answer += "."
        
        return answer
    
    def _extract_sources(self, retrieved_docs: List[Tuple[Dict, float]]) -> List[Dict]:
        """Extract source citations"""
        sources = []
        
        for doc, score in retrieved_docs[:3]:
            snippet = doc["text"][:200] + "..." if len(doc["text"]) > 200 else doc["text"]
            
            sources.append({
                "document": doc["metadata"]["document"],
                "snippet": snippet,
                "score": round(score, 2)
            })
        
        return sources
    
    def _calculate_confidence(self, best_score: float, avg_score: float) -> str:
        """Calculate confidence level"""
        if best_score >= 0.7 and avg_score >= 0.6:
            return "high"
        elif best_score >= 0.5 and avg_score >= 0.4:
            return "medium"
        else:
            return "low"
