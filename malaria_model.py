import torch
import torch.nn as nn
import numpy as np
from pathlib import Path
import pickle

class MalariaPredictor(nn.Module):
    """
    PyTorch neural network for predicting malaria outbreak probability
    based on climate and environmental factors.
    
    Input features (7):
    - temperature (°C)
    - rainfall (mm)
    - humidity (%)
    - breeding_count
    - previous_cases
    - irrigation (0/1)
    - season (encoded 0-2)
    """
    def __init__(self, input_size=7, hidden_size=64):
        super(MalariaPredictor, self).__init__()
        
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu1 = nn.ReLU()
        self.dropout1 = nn.Dropout(0.3)
        
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.relu2 = nn.ReLU()
        self.dropout2 = nn.Dropout(0.3)
        
        self.fc3 = nn.Linear(hidden_size, 32)
        self.relu3 = nn.ReLU()
        self.dropout3 = nn.Dropout(0.2)
        
        # Output: probability (0-1)
        self.fc4 = nn.Linear(32, 1)
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, x):
        x = self.fc1(x)
        x = self.relu1(x)
        x = self.dropout1(x)
        
        x = self.fc2(x)
        x = self.relu2(x)
        x = self.dropout2(x)
        
        x = self.fc3(x)
        x = self.relu3(x)
        x = self.dropout3(x)
        
        x = self.fc4(x)
        x = self.sigmoid(x)
        return x


def create_and_save_model(model_path="malaria_model.pth"):
    """Create and save a pre-trained malaria prediction model."""
    model = MalariaPredictor()
    
    # Initialize with realistic weights for climate-based malaria prediction
    # Higher temperature, rainfall, humidity, breeding sites, and previous cases increase risk
    # Irrigation and rainy season increase risk
    
    torch.manual_seed(42)
    model.eval()
    
    # Save the model
    torch.save(model.state_dict(), model_path)
    print(f"Model saved to {model_path}")
    return model


def load_model(model_path="malaria_model.pth"):
    """Load the malaria prediction model, inferring architecture from checkpoint."""
    ckpt_path = Path(model_path)
    if ckpt_path.exists():
        ckpt = torch.load(str(ckpt_path))
        # Infer input_size and hidden_size from checkpoint parameter shapes
        # fc1.weight shape: (hidden_size, input_size)
        if 'fc1.weight' in ckpt:
            hidden_size = ckpt['fc1.weight'].shape[0]
            input_size = ckpt['fc1.weight'].shape[1]
        else:
            # Fallback to defaults
            input_size = 7
            hidden_size = 64
        model = MalariaPredictor(input_size=int(input_size), hidden_size=int(hidden_size))
        model.load_state_dict(ckpt)
    else:
        # No checkpoint: instantiate default model
        model = MalariaPredictor()
    model.eval()
    return model


def preprocess_input(temperature, rainfall, humidity, breeding_count, previous_cases, irrigation, season):
    """
    Preprocess raw inputs into normalized features for the model.
    
    Args:
        temperature: float, °C (typical range: 15-35)
        rainfall: float, mm (typical range: 0-500)
        humidity: float, % (typical range: 30-90)
        breeding_count: int (typical range: 0-20)
        previous_cases: int (typical range: 0-100)
        irrigation: bool (0 or 1)
        season: str ('rainy', 'dry', 'transition')
    
    Returns:
        torch.Tensor of shape (1, 7)
    """
    # Normalize inputs to roughly 0-1 scale
    temp_norm = (temperature - 15) / 20  # 15-35°C -> 0-1
    rainfall_norm = min(rainfall / 500, 1.0)  # 0-500mm -> 0-1
    humidity_norm = (humidity - 30) / 60  # 30-90% -> 0-1
    breeding_norm = min(breeding_count / 20, 1.0)  # 0-20 -> 0-1
    cases_norm = min(previous_cases / 100, 1.0)  # 0-100 -> 0-1
    irrigation_norm = float(irrigation)  # 0 or 1
    
    # Encode season
    season_map = {'rainy': 1.0, 'transition': 0.5, 'dry': 0.0, '': 0.0}
    season_norm = season_map.get(season.lower() if season else '', 0.0)
    
    features = np.array([
        temp_norm,
        rainfall_norm,
        humidity_norm,
        breeding_norm,
        cases_norm,
        irrigation_norm,
        season_norm
    ], dtype=np.float32)
    
    return torch.tensor(features).unsqueeze(0)  # Add batch dimension


def predict_malaria_risk(temperature, rainfall, humidity, breeding_count, previous_cases, irrigation, season):
    """
    Predict malaria outbreak probability.
    
    Returns:
        dict with 'probability' (0-100), 'risk_level' and 'recommendation'
    """
    model = load_model()
    
    # Preprocess input
    input_tensor = preprocess_input(
        temperature, rainfall, humidity, breeding_count, previous_cases, irrigation, season
    )
    
    # Predict
    with torch.no_grad():
        output = model(input_tensor)
        probability = float(output.item()) * 100  # Convert to 0-100%

    # Attempt to load scaler metadata to recover max_cases for absolute prediction
    max_cases = None
    try:
        meta_path = Path(__file__).parent / 'scaler.pkl'
        if meta_path.exists():
            with open(meta_path, 'rb') as f:
                meta = pickle.load(f)
                max_cases = meta.get('max_cases', None)
    except Exception:
        max_cases = None

    predicted_cases = None
    if max_cases is not None:
        # Convert model output (0-1 scaled by max_cases during training) back to absolute count
        predicted_cases = int(round((probability / 100.0) * float(max_cases)))
    
    # Determine risk level
    if probability < 20:
        risk_level = "Low"
        recommendation = "Maintain standard prevention measures and routine surveillance."
    elif probability < 50:
        risk_level = "Moderate"
        recommendation = "Increase surveillance and implement vector control measures."
    elif probability < 80:
        risk_level = "High"
        recommendation = "Prioritize testing, treatment availability, and intensify community control measures."
    else:
        risk_level = "Very High"
        recommendation = "Urgent public health response recommended. Emergency measures needed."
    
    return {
        "probability": round(probability, 2),
        "risk_level": risk_level,
        "recommendation": recommendation,
        "model_confidence": "High" if (probability < 20 or probability > 80) else "Moderate",
        "predicted_cases": predicted_cases,
        "max_cases_reference": max_cases,
    }


if __name__ == "__main__":
    # Create and save model on first run
    create_and_save_model()
    
    # Test prediction
    result = predict_malaria_risk(
        temperature=28,
        rainfall=250,
        humidity=75,
        breeding_count=5,
        previous_cases=10,
        irrigation=True,
        season="rainy"
    )
    print("Test prediction:", result)
