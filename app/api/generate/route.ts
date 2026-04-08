import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("Vercel Config Error: GEMINI_API_KEY is missing");
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    // Standard Gemini 1.5 Flash URL
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Write a technical consulting article for Idalko about ${topic}. Use direct human language, H2 headers, and strictly NO m-dashes.` }]
        }]
      }),
    });

    const data = await response.json();

    // Log the full response to Vercel logs so we can debug if it fails again
    console.log("Gemini Raw Response:", JSON.stringify(data));

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    // Safe extraction using optional chaining to prevent the "reading parts" error
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json({ error: "Gemini returned an unexpected format. Check logs." }, { status: 500 });
    }

    return NextResponse.json({ content: generatedText });

  } catch (err: any) {
    console.error("Internal API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
