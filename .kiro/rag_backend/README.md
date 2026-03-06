# RAG Document Q&A Backend

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Add documents to the `docs/` folder:
   - Supported formats: .txt, .md, .pdf
   - Datasets: Wikipedia_2020, Wikipedia_2023, CUAD_Contract

3. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /query
Query the document store

Request:
```json
{
  "question": "What is artificial intelligence?"
}
```

Response:
```json
{
  "answer": "Short paragraph answer from documents.",
  "sources": [
    {
      "document": "AI.txt",
      "snippet": "Exact supporting text...",
      "score": 0.89
    }
  ],
  "confidence": "high"
}
```

### GET /health
Health check endpoint

## Features

- Strict grounded answering (no hallucinations)
- Citation enforcement with similarity scores
- Confidence scoring (high/medium/low)
- Automatic fallback for unanswerable questions
- Support for Wikipedia and CUAD datasets
- Persistent vector store with FAISS
