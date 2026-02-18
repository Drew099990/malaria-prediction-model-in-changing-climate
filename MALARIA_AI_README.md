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

Additional Python packages required for spreadsheet support:
`pandas` and an Excel engine such as `openpyxl` (for `.xlsx` files).
You can install them with `pip install pandas openpyxl`.

## Installation & Setup

### 1. Install Python Dependencies

```bash
# Navigate to project root
cd c:\Users\DELL\Desktop\goals for the holiday\malaria-shpher

# Create/activate virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install required packages
pip install torch fastapi uvicorn pydantic pandas openpyxl
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

1. Go to the **Forecast** page in the frontend.
2. Provide the following inputs:
  - **Min Temperature** (°C)
  - **Temperature (average)** (°C)
  - **Max Temperature** (°C)
  - **Humidity** (%)
  - **Rainy Days** (count for the current month)
  - **Previous Cases** (number of malaria cases reported last month)
3. Click **"Compute Probability"**.
4. The page will display:
   - Estimated outbreak probability (%)
   - Estimated case count (derived from the model and scaler)
   - Risk level (Low/Moderate/High/Very High)
   - Public health recommendation and model confidence

## Model Details


The neural network is trained on six input features:

| Feature | Description |
|---------|-------------|
| Min Temperature | Local minimum temperature (°C) |
| Temperature | Average local temperature (°C) |
| Max Temperature | Local maximum temperature (°C) |
| Humidity | Relative humidity (%) |
| Rainy Days | Number of rainy days in the current month |
| Previous Cases | Reported malaria cases in the previous month |

The target is normalized outbreak probability; a `StandardScaler` is saved along
with the model so inputs are scaled consistently during inference.

### Output

The model returns a probability (0–100%) which is then mapped to:
- An estimated case count (using `max_cases` from training data)
- A risk level: Low, Moderate, High or Very High
- A public‑health recommendation and confidence tag

### Neural Network Architecture

```
Input (6 features)
  ↓
FC1: 6 → 64 (ReLU + Dropout)
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



## API Endpoints

### POST /api/predict-malaria
**FastAPI Backend Endpoint**

Accepts a JSON payload with the four input features:
```json
{
  "temperature": 28,
  "humidity": 75,
  "rainy_days": 20,
  "previous_cases": 10
}
```

The response mirrors the data shown on the forecast page and includes the
probability, predicted case count, risk level, recommendation, and confidence.

### POST /api/predict
**Next.js Proxy Endpoint**

Used by the frontend; forwards the same JSON format to the backend.

### GET /api/health
Simple health check returning `{ "status": "ok" }`.

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
