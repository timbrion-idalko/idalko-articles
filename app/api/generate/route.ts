import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { topic } = await req.json();
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const systemInstruction = `
    You are a technical consultant for Idalko.com. 
    Write a blog post about: ${topic}.
    RULES:
    1. STRICT: NO M-DASHES (—). Use commas or full stops.
    2. NO corporate fluff (e.g., "In today's digital landscape").
    3. Use human, direct, and authoritative language.
    4. Focus on problem-solution-outcome.
    5. Use H2 and H3 headers and short paragraphs.
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: systemInstruction }]
        }]
      }),
    });

    const data = await response.json();
    
    // Gemini returns data in candidates[0].content.parts[0].text
    const generatedContent = data.candidates[0].content.parts[0].text;
    
    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
