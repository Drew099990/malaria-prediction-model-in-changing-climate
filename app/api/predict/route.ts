import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let body: any = null;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Invalid JSON in request body:', e);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Forward request to FastAPI backend
    let backendResponse: Response;
    try {
      backendResponse = await fetch('http://localhost:8000/api/predict-malaria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.error('Error contacting backend:', e);
      return NextResponse.json({ error: 'Unable to contact prediction backend', detail: String(e) }, { status: 502 });
    }

    const text = await backendResponse.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      console.error('Failed parsing backend JSON:', e, 'backend text:', text);
      return NextResponse.json({ error: 'Invalid response from backend', backendStatus: backendResponse.status, backendBody: text }, { status: 502 });
    }

    if (!backendResponse.ok) {
      console.error('Backend returned error:', backendResponse.status, data || text);
      return NextResponse.json({ error: 'Backend error', status: backendResponse.status, body: data || text }, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ error: 'Failed to get prediction from AI model', detail: String(error) }, { status: 500 });
  }
}
