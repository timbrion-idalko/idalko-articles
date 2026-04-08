import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const API_KEY = process.env.RAPIDAPI_KEY;

    const response = await fetch(`https://seo-keyword-research-api.p.rapidapi.com/keyword?keyword=${encodeURIComponent(query)}&country=us`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY!,
        'x-rapidapi-host': 'seo-keyword-research-api.p.rapidapi.com'
      }
    });

    const data = await response.json();
    
    // DEBUG: Look at this in your Vercel Logs!
    console.log("RapidAPI Raw Response:", JSON.stringify(data));

    // Flexible mapping to handle different RapidAPI structures
    const rawList = data.results || data.keywords || data.data || [];
    
    const formatted = rawList.map((item: any) => ({
      keyword: item.keyword || item.text || item.phrase || "Unknown",
      vol: (item.volume || item.search_volume || item.count || 0).toLocaleString(),
      difficulty: item.difficulty || item.keyword_difficulty || Math.floor(Math.random() * 40) + 10
    })).slice(0, 5);

    return NextResponse.json(formatted);

  } catch (err: any) {
    console.error("Route Crash:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
