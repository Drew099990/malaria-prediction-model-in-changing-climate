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
    temperature: float = None  # °C
    rainfall: float = None  # mm
    humidity: float = None  # %
    breedingCount: int = None
    previousCases: int = None
    irrigation: bool = False
    season: str = ""


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
        # Handle None values with defaults
        temperature = input_data.temperature or 25
        rainfall = input_data.rainfall or 0
        humidity = input_data.humidity or 50
        breeding_count = input_data.breedingCount or 0
        previous_cases = input_data.previousCases or 0
        irrigation = input_data.irrigation or False
        season = input_data.season or ""
        
        # Get prediction from model
        result = predict_malaria_risk(
            temperature=temperature,
            rainfall=rainfall,
            humidity=humidity,
            breeding_count=breeding_count,
            previous_cases=previous_cases,
            irrigation=irrigation,
            season=season
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "Malaria prediction API is running"}
    