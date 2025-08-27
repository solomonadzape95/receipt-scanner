from pydantic import BaseModel
from typing import List,Dict,Any

class ReceiptResponse(BaseModel):
    raw_text: List[str]

class ParsedReceiptResponse(BaseModel):
    raw_text: List[str]
    structured_data: Dict[str, Any]
