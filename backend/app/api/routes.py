from fastapi import APIRouter, UploadFile, File
from app.services.ocr import extract_text
from app.services.gemini_parser import parse_receipt
from app.models.receipt import ParsedReceiptResponse

router = APIRouter()

@router.post("/extract", response_model=ParsedReceiptResponse)
async def extract_text_endpoint(file: UploadFile = File(...)):
    result = await extract_text(file)
    parsed_data = parse_receipt(result["raw_text"])
    return parsed_data