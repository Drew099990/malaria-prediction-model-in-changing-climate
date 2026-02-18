import { NextRequest, NextResponse } from 'next/server';

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

    // Attempt to parse backend body (may throw)
    let data: any = null;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Failed parsing backend JSON:', e);
      return NextResponse.json({ error: 'Invalid response from backend' }, { status: 502 });
    }

    return NextResponse.json(data, { status: response.ok ? 200 : response.status });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ error: 'Failed to get prediction from AI model' }, { status: 500 });
  }
}
