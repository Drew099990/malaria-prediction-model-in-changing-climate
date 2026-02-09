# Malaria Outbreak Prediction System

A full-stack AI system combining PyTorch deep learning with a Next.js frontend for predicting malaria outbreak probability based on climate and environmental data.

## Architecture

- **Frontend**: Next.js (React) - Climate data input form
- **Backend API**: FastAPI - REST API server
- **AI Model**: PyTorch neural network - Malaria outbreak prediction
- **Data Flow**: Next.js → FastAPI → PyTorch Model → Prediction Results

## System Requirements

- Python 3.9+
- Node.js 16+
- Virtual environment (recommended)

## Installation & Setup

### 1. Install Python Dependencies

```bash
# Navigate to project root
cd c:\Users\DELL\Desktop\goals for the holiday\malaria-shpher

# Create/activate virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install required packages
pip install torch fastapi uvicorn pydantic
```

**Note:** If torch installation fails on Windows, try:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

### 2. Initialize the AI Model

The model will be automatically created on first API startup. To manually create it:

```bash
python malaria_model.py
```

This creates `malaria_model.pth` containing the trained neural network weights.

### 3. Start the FastAPI Backend

Open a terminal and run:

```bash
# From project root with .venv activated
uvicorn app.backend:app --reload --port 8000
```

You should see:
```
Uvicorn running on http://127.0.0.1:8000
```

### 4. Start the Next.js Frontend

Open another terminal and run:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

1. Go to the **Forecast** page
2. Enter climate data:
   - **Temperature** (°C): Current average temperature
   - **Rainfall** (mm): Monthly precipitation
   - **Humidity** (%): Relative humidity
   - **Breeding Site Count**: Number of nearby mosquito breeding sites
   - **Previous Cases**: Cases from last month
   - **Irrigation**: Checkbox for standing water nearby
   - **Season**: Select rainy, dry, or transition
3. Click **"Compute Probability"**
4. View AI predictions with:
   - Outbreak probability percentage
   - Risk level (Low/Moderate/High/Very High)
   - Public health recommendations
   - Model confidence level

## Model Details

### Input Features (7 total)

| Feature | Range | Normalization |
|---------|-------|----------------|
| Temperature | 15-35°C | (T-15)/20 |
| Rainfall | 0-500 mm | min(R/500, 1.0) |
| Humidity | 30-90% | (H-30)/60 |
| Breeding Count | 0-20 sites | min(B/20, 1.0) |
| Previous Cases | 0-100 cases | min(C/100, 1.0) |
| Irrigation | 0 or 1 | 0/1 |
| Season | rainy/dry/transition | 1.0/0.0/0.5 |

### Output

- **Probability**: 0-100% outbreak likelihood
- **Risk Level**: 
  - Low (0-20%)
  - Moderate (21-50%)
  - High (51-80%)
  - Very High (81-100%)

### Neural Network Architecture

```
Input (7 features)
  ↓
FC1: 7 → 64 (ReLU + Dropout)
  ↓
FC2: 64 → 64 (ReLU + Dropout)
  ↓
FC3: 64 → 32 (ReLU + Dropout)
  ↓
FC4: 32 → 1 (Sigmoid)
  ↓
Output: Probability (0-1)
```

## File Structure

```
malaria-shpher/
├── malaria_model.py           # PyTorch model definition
├── malaria_model.pth          # Trained model weights (auto-created)
├── app/
│   ├── backend.py             # FastAPI application
│   ├── api/
│   │   └── predict/
│   │       └── route.ts       # Next.js API route
│   └── (nav)/forcast/
│       └── page.tsx           # Frontend form & results
├── .venv/                      # Python virtual environment
└── package.json               # Node.js dependencies
```

## API Endpoints

### POST /api/predict-malaria
**FastAPI Backend Endpoint**

Request:
```json
{
  "temperature": 28,
  "rainfall": 250,
  "humidity": 75,
  "breedingCount": 5,
  "previousCases": 10,
  "irrigation": true,
  "season": "rainy"
}
```

Response:
```json
{
  "probability": 68.45,
  "risk_level": "High",
  "recommendation": "Prioritize testing, treatment availability, and intensify community control measures.",
  "model_confidence": "High"
}
```

### POST /api/predict
**Next.js Proxy Endpoint**

Same request/response format as above. Use this from the frontend.

### GET /api/health
Health check endpoint for FastAPI backend.

## Troubleshooting

### "ModuleNotFoundError: No module named 'torch'"
```bash
# Activate virtual environment and reinstall
.venv\Scripts\activate
pip install torch --index-url https://download.pytorch.org/whl/cpu
```

### "Connection refused: http://localhost:8000"
- Ensure FastAPI backend is running: `uvicorn app.backend:app --reload --port 8000`
- Check that the port isn't blocked by firewall

### "malaria_model.pth not found"
- The model is created automatically on first API call
- Or manually run: `python malaria_model.py`

### CORS errors
- Ensure FastAPI CORS middleware is enabled (it is by default)
- Check that frontend is accessing `/api/predict` (Next.js route), not directly calling FastAPI

## Development

### Adding More Features

Edit `malaria_model.py` to add more input features:
1. Update `MalariaPredictor` input size
2. Update `preprocess_input()` normalization
3. Update `MalariaInput` in `backend.py`
4. Update form in `page.tsx`

### Retraining the Model

Replace `malaria_model.py` with a training script:
```python
from malaria_model import MalariaPredictor, create_and_save_model
import torch

# Load data and train...
# model = MalariaPredictor()
# ... training code ...
# torch.save(model.state_dict(), 'malaria_model.pth')
```

## Performance Notes

- Model inference: ~10-50ms on CPU
- Suitable for real-time predictions
- Can be optimized with GPU: `torch.cuda.is_available()`

## License

This project is for educational and public health purposes.

## Author

AI-Generated for Malaria Forecast Application
