import torch
import torch.nn as nn
import numpy as np
from pathlib import Path
import pickle

class MalariaPredictor(nn.Module):
    """
    PyTorch neural network for predicting malaria cases and risk percentage
    based on climate features and recent case history.

    Input features (4):
    - temperature (°C)
    - humidity (%)
    - rainy_days (count)
    - previous_cases (number of cases last month)
    """
    def __init__(self, input_size=4, hidden_size=64):
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
        return self.sigmoid(x)


def create_and_save_model(model_path="malaria_model.pth"):
    model = MalariaPredictor()
    torch.manual_seed(42)
    model.eval()
    torch.save(model.state_dict(), model_path)
    print(f"Model saved to {model_path}")
    return model


def load_model(model_path="malaria_model.pth"):
    ckpt_path = Path(model_path)
    if ckpt_path.exists():
        ckpt = torch.load(str(ckpt_path))
        if 'fc1.weight' in ckpt:
            hidden_size = ckpt['fc1.weight'].shape[0]
            input_size = ckpt['fc1.weight'].shape[1]
        else:
            input_size = 3
            hidden_size = 64
        model = MalariaPredictor(input_size=int(input_size), hidden_size=int(hidden_size))
        model.load_state_dict(ckpt)
    else:
        model = MalariaPredictor()
    model.eval()
    return model


def preprocess_input(temperature, humidity, rainy_days, previous_cases=0.0):
    """Prepare input tensor using the stored scaler if available.

    This mirrors the preprocessing performed during training. If the
    scaler file is missing the function falls back to a simple manual
    normalization similar to the original implementation (with a very
    rough scaling for previous_cases).
    """
    meta_path = Path(__file__).parent / 'scaler.pkl'
    arr = np.array([temperature, humidity, rainy_days, previous_cases], dtype=np.float32)
    arr = arr.reshape(1, -1)
    if meta_path.exists():
        try:
            with open(meta_path, 'rb') as f:
                meta = pickle.load(f)
            scaler = meta.get('scaler')
            if scaler is not None:
                arr = scaler.transform(arr)
        except Exception:
            pass
    else:
        # fallback normalization if scaler not present
        temp_norm = (temperature - 15) / 20
        humidity_norm = (humidity - 30) / 60
        rainy_norm = min(rainy_days / 30, 1.0)
        prev_norm = min(previous_cases / 100.0, 1.0)
        arr = np.array([temp_norm, humidity_norm, rainy_norm, prev_norm], dtype=np.float32).reshape(1, -1)
    return torch.tensor(arr, dtype=torch.float32)


def predict_malaria_risk(temperature, humidity, rainy_days, previous_cases=0.0):
    """Return both percentage risk and estimated case count.

    previous_cases - number of malaria cases reported in the previous month.
    """
    model = load_model()
    input_tensor = preprocess_input(temperature, humidity, rainy_days, previous_cases)
    with torch.no_grad():
        output = model(input_tensor)
        prob = float(output.item()) * 100

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
        predicted_cases = int(round((prob / 100.0) * float(max_cases)))

    if prob < 20:
        risk_level = "Low"
        recommendation = "Maintain standard prevention measures and surveillance."
    elif prob < 50:
        risk_level = "Moderate"
        recommendation = "Increase surveillance and vector control."
    elif prob < 80:
        risk_level = "High"
        recommendation = "Prioritize testing, treatment and community measures."
    else:
        risk_level = "Very High"
        recommendation = "Urgent public health response needed."

    return {
        "probability": round(prob, 2),
        "risk_level": risk_level,
        "recommendation": recommendation,
        "model_confidence": "High" if (prob < 20 or prob > 80) else "Moderate",
        "predicted_cases": predicted_cases,
        "max_cases_reference": max_cases,
    }


if __name__ == "__main__":
    create_and_save_model()
    # simple sanity check with zero previous cases
    result = predict_malaria_risk(temperature=28, humidity=75, rainy_days=5, previous_cases=0)
    print("Test prediction:", result)
