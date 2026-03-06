from pathlib import Path
from typing import List, Dict
import PyPDF2
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

    
    def _load_csv(self, file_path: Path) -> List[Dict]:
        """Load and chunk a CSV file"""
        try:
            import csv
            content_parts = []
            
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                csv_reader = csv.DictReader(f)
                for row_num, row in enumerate(csv_reader):
                    if row_num >= 100:  # Limit to first 100 rows
                        break
                    row_text = " | ".join([f"{k}: {v}" for k, v in row.items() if v and v.strip()])
                    if row_text:
                        content_parts.append(row_text)
            
            content = "\n\n".join(content_parts)
            return self._chunk_text(content, file_path)
        except Exception as e:
            logger.error(f"Error loading CSV {file_path}: {e}")
            return []
