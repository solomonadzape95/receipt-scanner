import easyocr
import io
import numpy as np
from PIL import Image

reader = easyocr.Reader(['en'])

async def extract_text(file):
    # Convert uploaded file into image
    image = Image.open(io.BytesIO(await file.read()))
    
    # Convert PIL Image to numpy array for EasyOCR
    image_array = np.array(image)
    
    # OCR extraction
    raw_results = reader.readtext(image_array)

    # Clean results (only text part)
    extracted_text = [res[1] for res in raw_results]

    # Return as array for now
    return {"raw_text": extracted_text}