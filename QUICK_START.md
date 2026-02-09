# Quick Start Guide - Malaria AI Prediction System

## What's Been Set Up

✅ **PyTorch AI Model** - Predicts malaria outbreak probability  
✅ **FastAPI Backend** - REST API for running the model  
✅ **Next.js Frontend** - Form to collect climate data  
✅ **Integration Complete** - Form data flows to AI and displays predictions  

## To Run the System

### Terminal 1: FastAPI Backend
```bash
cd c:\Users\DELL\Desktop\goals for the holiday\malaria-shpher
.venv\Scripts\activate
uvicorn app.backend:app --port 8000
```

Expected output:
```
Uvicorn running on http://127.0.0.1:8000
```

### Terminal 2: Next.js Frontend
```bash
cd c:\Users\DELL\Desktop\goals for the holiday\malaria-shpher
npm run dev
```

Expected output:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

### Open Your Browser
Navigate to: **http://localhost:3000**

Go to the **Forecast** page and try it out!

---

## How It Works

1. **Input Form** (`page.tsx`):
   - Collects temperature, rainfall, humidity, breeding sites, cases, irrigation, season

2. **Next.js API Route** (`api/predict/route.ts`):
   - Receives form data from frontend
   - Forwards to FastAPI backend
   - Returns prediction to frontend

3. **FastAPI Backend** (`backend.py`):
   - Receives input data
   - Preprocesses it (normalization)
   - Runs through PyTorch model
   - Returns probability + risk level + recommendation

4. **Display Results** (`page.tsx`):
   - Shows percentage probability (0-100%)
   - Color-coded risk level
   - Public health recommendation
   - Model confidence

---

## Test with Example Data

In the forecast form, try:
- **Temperature**: 28°C
- **Rainfall**: 250mm
- **Humidity**: 75%
- **Breeding Count**: 5
- **Previous Cases**: 10
- **Irrigation**: ✓ (checked)
- **Season**: Rainy

Expected Result: **~47-68% probability** (Moderate to High risk)

---

## Files Created

| File | Purpose |
|------|---------|
| `malaria_model.py` | PyTorch model definition & training |
| `malaria_model.pth` | Saved model weights (~1MB) |
| `app/backend.py` | FastAPI server with prediction endpoint |
| `app/api/predict/route.ts` | Next.js proxy API route |
| `app/(nav)/forcast/page.tsx` | Updated forecast page with AI integration |
| `MALARIA_AI_README.md` | Detailed technical documentation |
| `start_backend.bat` | One-click backend startup script |

---

## Troubleshooting

### "Connection refused: http://localhost:8000"
- Make sure FastAPI is running in Terminal 1
- Check port 8000 is not blocked by firewall

### "Failed to get prediction from AI model"
- Verify both servers are running
- Check browser console (F12) for error details
- Try refreshing the page

### Model not found errors
- Run: `.venv\Scripts\python.exe malaria_model.py`
- This creates `malaria_model.pth`

---

## Next Steps

### To Improve Predictions:
1. Train the model with real malaria data
2. Add more features (wind speed, vegetation index, etc.)
3. Deploy on cloud (AWS, Google Cloud, etc.)

### To Customize:
- Edit `malaria_model.py` to change the neural network
- Edit `page.tsx` to add more form fields
- Edit `backend.py` to add new features

---

## Architecture Diagram

```
┌─────────────────────┐
│   Next.js Frontend  │ (http://localhost:3000)
│   Climate Data Form │
└──────────┬──────────┘
           │
           │ JSON payload
           │ /api/predict
           ▼
┌─────────────────────┐
│ Next.js API Route   │ (Proxy)
│ /api/predict/       │
└──────────┬──────────┘
           │
           │ Forward to backend
           ▼
┌─────────────────────┐
│  FastAPI Backend    │ (http://localhost:8000)
│ /api/predict-malaria│
└──────────┬──────────┘
           │
           │ Preprocess data
           ▼
┌─────────────────────┐
│  PyTorch Model      │
│ (Neural Network)    │
│ 7 inputs → 1 output │
└──────────┬──────────┘
           │
           │ Probability + Risk
           ▼
┌─────────────────────┐
│   Display Results   │
│ - Probability (%)   │
│ - Risk Level        │
│ - Recommendation    │
└─────────────────────┘
```

---

## API Examples

### Make a direct prediction request to backend:

```bash
curl -X POST http://localhost:8000/api/predict-malaria \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 28,
    "rainfall": 250,
    "humidity": 75,
    "breedingCount": 5,
    "previousCases": 10,
    "irrigation": true,
    "season": "rainy"
  }'
```

Response:
```json
{
  "probability": 47.01,
  "risk_level": "Moderate",
  "recommendation": "Increase surveillance and implement vector control measures.",
  "model_confidence": "Moderate"
}
```

---

Enjoy your AI-powered malaria prediction system! 🤖
