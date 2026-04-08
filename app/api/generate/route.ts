import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing in Vercel settings" }, { status: 500 });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Write a punchy technical Idalko blog post about ${topic}. Use H2 headers, no m-dashes, and human language.` }]
        }]
      }),
    });

    const data = await response.json();

    // Check if Google returned an error (like an invalid key)
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    // Safety check: Ensure the response path exists
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ error: "Gemini returned an empty response or safety block" }, { status: 500 });
    }

    return NextResponse.json({ content: text });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
