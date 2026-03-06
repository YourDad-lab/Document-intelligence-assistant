import requests
import time
from utils import logger

ANALYTICS_SERVER = "http://localhost:5000"

def track_query(question: str, answer: str, confidence: str, sources: list, start_time: float):
    """Send query data to analytics server"""
    try:
        latency = {
            "retrieval": 0,  # You can track this separately
            "generation": 0,  # You can track this separately
            "total": int((time.time() - start_time) * 1000)  # Convert to ms
        }
        
        payload = {
            "question": question,
            "answer": answer,
            "confidence": confidence,
            "sources": sources,
            "latency": latency,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")
        }
        
        logger.info(f"Sending to analytics - Confidence: {confidence}, Question: {question[:50]}...")
        
        # Send to analytics server (non-blocking)
        response = requests.post(
            f"{ANALYTICS_SERVER}/api/track",
            json=payload,
            timeout=1  # Quick timeout to not block main request
        )
        
        if response.status_code == 200:
            logger.info(f"✓ Query tracked successfully in analytics")
        else:
            logger.warning(f"Analytics server returned status {response.status_code}")
        
    except requests.exceptions.ConnectionError:
        logger.warning(f"⚠ Analytics server not reachable at {ANALYTICS_SERVER}")
    except Exception as e:
        # Don't fail the main request if analytics fails
        logger.warning(f"Failed to track query in analytics: {e}")
