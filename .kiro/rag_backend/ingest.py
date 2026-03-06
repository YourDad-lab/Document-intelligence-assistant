from pathlib import Path
from typing import List, Dict
import PyPDF2
import csv
from utils import logger, get_docs_path

class DocumentIngester:
    def __init__(self, chunk_size: int = 800, overlap: int = 150):
        self.chunk_size = chunk_size
        self.overlap = overlap
        
    def load_documents(self, docs_path: Path) -> List[Dict]:
        """Load all documents from the docs folder"""
        documents = []
        
        if not docs_path.exists():
            logger.warning(f"Documents path does not exist: {docs_path}")
            return documents
            
        for file_path in docs_path.rglob("*"):
            if file_path.is_file():
                if file_path.suffix == ".txt":
                    docs = self._load_txt(file_path)
                elif file_path.suffix == ".md":
                    docs = self._load_md(file_path)
                elif file_path.suffix == ".pdf":
                    docs = self._load_pdf(file_path)
                elif file_path.suffix == ".csv":
                    docs = self._load_csv(file_path)
                else:
                    continue
                    
                documents.extend(docs)
                logger.info(f"Loaded {len(docs)} chunks from {file_path.name}")
        
        return documents
    
    def _load_txt(self, file_path: Path) -> List[Dict]:
        """Load and chunk a text file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return self._chunk_text(content, file_path)
        except Exception as e:
            logger.error(f"Error loading {file_path}: {e}")
            return []
    
    def _load_md(self, file_path: Path) -> List[Dict]:
        """Load and chunk a markdown file"""
        return self._load_txt(file_path)
    
    def _load_pdf(self, file_path: Path) -> List[Dict]:
        """Load and chunk a PDF file"""
        try:
            with open(file_path, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                content = ""
                for page in pdf_reader.pages:
                    content += page.extract_text()
            return self._chunk_text(content, file_path)
        except Exception as e:
            logger.error(f"Error loading PDF {file_path}: {e}")
            return []
    
    def _load_csv(self, file_path: Path) -> List[Dict]:
        """Load and chunk a CSV file"""
        try:
            content_parts = []
            
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                csv_reader = csv.DictReader(f)
                for row_num, row in enumerate(csv_reader):
                    if row_num >= 100:  # Limit to first 100 rows for performance
                        break
                    row_text = " | ".join([f"{k}: {v}" for k, v in row.items() if v and v.strip()])
                    if row_text:
                        content_parts.append(row_text)
            
            content = "\n\n".join(content_parts)
            return self._chunk_text(content, file_path)
        except Exception as e:
            logger.error(f"Error loading CSV {file_path}: {e}")
            return []
    
    def _chunk_text(self, text: str, file_path: Path) -> List[Dict]:
        """Split text into overlapping chunks"""
        chunks = []
        words = text.split()
        
        chunk_id = 0
        start = 0
        
        while start < len(words):
            end = start + self.chunk_size
            chunk_words = words[start:end]
            chunk_text = " ".join(chunk_words)
            
            dataset = self._detect_dataset(file_path)
            
            chunks.append({
                "text": chunk_text,
                "metadata": {
                    "dataset": dataset,
                    "document": file_path.name,
                    "chunk_id": chunk_id
                }
            })
            
            chunk_id += 1
            start = end - self.overlap
            
            if end >= len(words):
                break
        
        return chunks
    
    def _detect_dataset(self, file_path: Path) -> str:
        """Detect dataset name from file path"""
        name_lower = str(file_path).lower()
        
        if "wikipedia" in name_lower and "2020" in name_lower:
            return "Wikipedia_2020"
        elif "wikipedia" in name_lower and "2023" in name_lower:
            return "Wikipedia_2023"
        elif "cuad" in name_lower or "master_clauses" in name_lower:
            return "CUAD_Contract"
        else:
            return file_path.parent.name if file_path.parent.name != "docs" else "General"
