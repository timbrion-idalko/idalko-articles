import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { topic } = await req.json();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // Cost-effective for PoC
      messages: [
        {
          role: "system",
          content: `You are a high-end technical consultant writing for the Idalko blog. 
          STRICT RULES:
          1. NO M-DASHES (—). Use a full stop or a comma instead.
          2. NO corporate fluff (e.g., "In today's fast-paced world"). Start with a specific business problem.
          3. Use human, direct, and authoritative language. 
          4. Structure the article with clear H2 and H3 headers.
          5. Use short paragraphs. Focus on technical efficiency and workflow optimization.`
        },
        { 
          role: "user", 
          content: `Write a short, punchy technical article about: ${topic}.` 
        }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return NextResponse.json({ content: data.choices[0].message.content });
}
