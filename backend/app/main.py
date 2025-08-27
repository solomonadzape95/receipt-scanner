from fastapi import FastAPI
from app.api import routes
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Receipt Scanner")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://receipt-scanner.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Receipt Scanner API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)