import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to FastAPI backend
    const response = await fetch('http://localhost:8000/api/predict-malaria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Prediction error:', error);
    return Response.json(
      { error: 'Failed to get prediction from AI model' },
      { status: 500 }
    );
  }
}
