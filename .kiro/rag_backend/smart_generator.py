from typing import List, Tuple, Dict
from utils import logger
import re

FALLBACK_MESSAGE = "I could not find this in the provided documents. Can you share the relevant document?"

class SmartAnswerGenerator:
    def __init__(self):
        pass
        
    def generate(self, query: str, retrieved_docs: List[Tuple[Dict, float]]) -> Dict:
        """Generate intelligent, interactive answer from retrieved documents"""
        
        if not retrieved_docs or len(retrieved_docs) == 0:
            logger.info("No documents retrieved - returning fallback")
            return {
                "answer": FALLBACK_MESSAGE,
                "sources": [],
                "confidence": "low",
                "answer_type": "fallback"
            }
        
        avg_score = sum(score for _, score in retrieved_docs) / len(retrieved_docs)
        best_score = retrieved_docs[0][1] if retrieved_docs else 0
        
        if best_score < 0.3:
            logger.info(f"Best score {best_score:.3f} below threshold - returning fallback")
            return {
                "answer": FALLBACK_MESSAGE,
                "sources": [],
                "confidence": "low",
                "answer_type": "fallback"
            }
        
        # Detect query type and generate appropriate answer
        answer_data = self._generate_smart_answer(query, retrieved_docs)
        sources = self._extract_sources(retrieved_docs)
        confidence = self._calculate_confidence(best_score, avg_score)

        logger.info(f"Generated {answer_data['answer_type']} answer with confidence={confidence}")

        # Only return keys that QueryResponse expects
        return {
            "answer": answer_data["answer"],
            "sources": sources,
            "confidence": confidence,
        }
    
    def _generate_smart_answer(self, query: str, retrieved_docs: List[Tuple[Dict, float]]) -> Dict:
        """Generate contextual, intelligent answer based on query type"""
        query_lower = query.lower()
        
        # Extract all text from retrieved documents
        all_text = " ".join([doc["text"] for doc, _ in retrieved_docs[:5]])
        
        # Detect query intent
        if any(word in query_lower for word in ["which parties", "who are", "list parties", "parties involved", "parties have"]):
            return self._extract_parties(all_text, query)
        
        elif any(word in query_lower for word in ["governing law", "jurisdiction", "which law"]):
            return self._extract_governing_laws(all_text, query)
        
        elif any(word in query_lower for word in ["agreement date", "when was", "date of", "signed on"]):
            return self._extract_dates(all_text, query)
        
        elif any(word in query_lower for word in ["termination", "cancel", "end agreement"]):
            return self._extract_termination_terms(all_text, query)
        
        elif any(word in query_lower for word in ["revenue", "profit", "payment", "fee"]):
            return self._extract_financial_terms(all_text, query)
        
        else:
            # Default: Generate conversational summary
            return self._generate_conversational_answer(all_text, query)
    
    def _extract_parties(self, text: str, query: str) -> Dict:
        """Extract and format party information"""
        parties = []
        
        # Look for party patterns in CSV format
        party_patterns = [
            r"Parties:\s*\[?'([^']+)'",
            r'"([^"]+)"',
            r"'([^']+)'",
        ]
        
        for pattern in party_patterns:
            matches = re.findall(pattern, text)
            parties.extend([m.strip() for m in matches if len(m.strip()) > 2])
        
        # Clean and deduplicate
        parties = list(set(parties))
        
        # Filter by query keywords
        query_words = query.split()
        filtered_parties = []
        
        for word in query_words:
            if len(word) > 3:
                matching = [p for p in parties if word.lower() in p.lower()]
                filtered_parties.extend(matching)
        
        if filtered_parties:
            parties = list(set(filtered_parties))
        
        if parties:
            answer = self._format_parties_answer(parties, query)
            return {
                "answer": answer,
                "answer_type": "parties_list",
                "structured_data": {"parties": parties}
            }
        
        return self._generate_conversational_answer(text, query)
    
    def _format_parties_answer(self, parties: List[str], query: str) -> str:
        """Format parties in a conversational way"""
        if len(parties) == 0:
            return "I couldn't find specific party information matching your query."
        
        if len(parties) == 1:
            return f"I found 1 party matching your query:\n\n• **{parties[0]}**"
        
        answer = f"I found **{len(parties)} parties** matching your query:\n\n"
        for i, party in enumerate(parties[:15], 1):
            answer += f"{i}. **{party}**\n"
        
        if len(parties) > 15:
            answer += f"\n_...and {len(parties) - 15} more parties._"
        
        return answer
    
    def _extract_governing_laws(self, text: str, query: str) -> Dict:
        """Extract governing law information"""
        laws = []
        
        patterns = [
            r'Governing Law:\s*([^|]+)',
            r'governed by[:\s]+([^|\.]+)',
            r'laws of[:\s]+([^|\.]+)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            laws.extend([m.strip() for m in matches if m.strip()])
        
        laws = list(set(laws))[:10]
        
        if laws:
            answer = f"I found **{len(laws)} governing law{'s' if len(laws) > 1 else ''}**:\n\n"
            for i, law in enumerate(laws, 1):
                answer += f"{i}. **{law}**\n"
            return {
                "answer": answer,
                "answer_type": "governing_laws",
                "structured_data": {"laws": laws}
            }
        
        return self._generate_conversational_answer(text, query)
    
    def _extract_dates(self, text: str, query: str) -> Dict:
        """Extract date information"""
        dates = re.findall(r'\d{1,2}/\d{1,2}/\d{2,4}', text)
        dates = list(set(dates))[:10]
        
        if dates:
            answer = f"I found **{len(dates)} date{'s' if len(dates) > 1 else ''}**:\n\n"
            for i, date in enumerate(dates, 1):
                answer += f"{i}. **{date}**\n"
            return {
                "answer": answer,
                "answer_type": "dates",
                "structured_data": {"dates": dates}
            }
        
        return self._generate_conversational_answer(text, query)
    
    def _extract_termination_terms(self, text: str, query: str) -> Dict:
        """Extract termination information"""
        termination_info = []
        
        patterns = [
            r'(\d+\s*days?)',
            r'(\d+\s*months?)',
            r'(\d+\s*years?)',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            termination_info.extend(matches)
        
        if termination_info:
            answer = "**Termination Terms Found:**\n\n"
            for term in set(termination_info)[:5]:
                answer += f"• Notice period: **{term}**\n"
            return {
                "answer": answer,
                "answer_type": "termination",
                "structured_data": {"terms": list(set(termination_info))}
            }
        
        return self._generate_conversational_answer(text, query)
    
    def _extract_financial_terms(self, text: str, query: str) -> Dict:
        """Extract financial information"""
        financial = []
        
        patterns = [
            r'(\d+\.?\d*%)',
            r'\$[\d,]+',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text)
            financial.extend(matches)
        
        if financial:
            answer = "**Financial Terms Found:**\n\n"
            for term in set(financial)[:10]:
                answer += f"• **{term}**\n"
            return {
                "answer": answer,
                "answer_type": "financial",
                "structured_data": {"terms": list(set(financial))}
            }
        
        return self._generate_conversational_answer(text, query)
    
    def _generate_conversational_answer(self, text: str, query: str) -> Dict:
        """Generate a conversational summary"""
        sentences = text.split(". ")[:3]
        answer = ". ".join(sentences)
        
        if not answer.endswith("."):
            answer += "."
        
        # Make it more conversational
        if len(answer) > 50:
            answer = f"Based on the contracts, {answer[0].lower()}{answer[1:]}"
        
        return {
            "answer": answer,
            "answer_type": "summary"
        }
    
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
