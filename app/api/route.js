import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Generate_script_prompt } from './prompt';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
});

// Handle GET requests: return hello when the URL is visited
export async function GET() {
  
  return NextResponse.json({ message: "hello" });
}

export async function POST(req) {
  try {
    const { topic } = await req.json();
    const PROMPT = Generate_script_prompt.replace("{topic}", topic);
    const completion = await openai.chat.completions.create({
      model: "google/gemma-3-4b-it:free",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: PROMPT,
            },
           
          ],
        },
      ],
    });

    console.log(completion.choices[0].message);
    return NextResponse.json(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error in POST /api/createscripts:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}