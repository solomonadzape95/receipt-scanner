import os
import json
from typing import List
from google import genai
from dotenv import load_dotenv

from app.models.receipt import ParsedReceiptResponse

# Load environment variables from .env file at import time
load_dotenv()
#load gemini api key and start a client
api_key = os.getenv('GEMINI_API_KEY')
client = genai.Client(api_key=api_key)
# def get_gemini_client():
#     """Get Gemini client with proper error handling"""
  
#     if not api_key:
#         raise ValueError("GEMINI_API_KEY environment variable is required")
#     return 

def parse_receipt(ocr_text: List[str]) -> ParsedReceiptResponse:
    
    # prompt gemini to parse the receipt
    prompt = f"Parse the following receipt text: {', '.join(ocr_text)}. Return structured data in JSON format."
    model_config = {'response_mime_type': 'application/json'}
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=model_config
    )

    # extract structured data from the response
    try:
        json_str = response.text.strip('`').strip("'")
        structured_data = json.loads(json_str)
        return ParsedReceiptResponse(
            raw_text=ocr_text,
            structured_data=structured_data
        )
    except json.JSONDecodeError:
        raise Exception("Failed to parse receipt JSON")