from typing import Dict

def calculate_confidence(sources: list, avg_score: float) -> str:
    """Calculate confidence level based on retrieval scores"""
    
    if not sources or len(sources) == 0:
        return "low"
    
    best_score = sources[0]["score"] if sources else 0
    
    if best_score >= 0.7 and avg_score >= 0.6:
        return "high"
    elif best_score >= 0.5 and avg_score >= 0.4:
        return "medium"
    else:
        return "low"
