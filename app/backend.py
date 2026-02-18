from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import sys
from pathlib import Path

# Add parent directory to path to import malaria_model
sys.path.insert(0, str(Path(__file__).parent.parent))

from malaria_model import predict_malaria_risk, create_and_save_model

app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model on startup
@app.on_event("startup")
async def startup_event():
    """Create model file if it doesn't exist."""
    model_path = Path(__file__).parent.parent / "malaria_model.pth"
    if not model_path.exists():
        create_and_save_model(str(model_path))
        print("✓ Model initialized successfully")


# Define input schema for malaria prediction
class MalariaInput(BaseModel):
    min_temp: float = None  # °C
    temperature: float = None  # °C
    max_temp: float = None  # °C
    humidity: float = None  # %
    rainy_days: int = None
    previous_cases: int = None  # cases last month


@app.post("/api/predict-malaria")
async def predict_malaria(input_data: MalariaInput):
    """
    Predict malaria outbreak probability based on climate and environmental data.
    
    Returns:
        - probability: 0-100 (outbreak likelihood)
        - risk_level: Low, Moderate, High, Very High
        - recommendation: Public health recommendation
        - model_confidence: High or Moderate
    """
    try:
        temperature = input_data.temperature or 25
        humidity = input_data.humidity or 50
        rainy = input_data.rainy_days or 0
        prev = input_data.previous_cases or 0
        min_t = input_data.min_temp if input_data.min_temp is not None else temperature
        max_t = input_data.max_temp if input_data.max_temp is not None else temperature
        result = predict_malaria_risk(
            min_temp=min_t,
            temperature=temperature,
            max_temp=max_t,
            humidity=humidity,
            rainy_days=rainy,
            previous_cases=prev,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")




@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "Malaria prediction API is running"}
    