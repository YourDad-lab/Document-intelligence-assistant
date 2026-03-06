from pydantic import BaseModel, Field, field_validator
from typing import List, Literal

class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000)

    @field_validator('question')
    @classmethod
    def validate_question(cls, v):
        if not v or not v.strip():
            raise ValueError('Question cannot be empty')
        if not isinstance(v, str):
            raise ValueError('Question must be a string')
        return v.strip()

class Source(BaseModel):
    document: str
    snippet: str
    score: float

class QueryResponse(BaseModel):
    answer: str
    sources: List[Source]
    confidence: Literal["high", "medium", "low"]

class ChunkMetadata(BaseModel):
    dataset: str
    document: str
    chunk_id: int
    text: str
