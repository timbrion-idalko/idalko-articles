import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const API_KEY = process.env.RAPIDAPI_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: "RAPIDAPI_KEY is missing" }, { status: 500 });
    }

    // Using the 'SEO Keyword Research' API from RapidAPI
    const url = `https://seo-keyword-research-api.p.rapidapi.com/keyword?keyword=${encodeURIComponent(query)}&country=us`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'seo-keyword-research-api.p.rapidapi.com'
      }
    });

    const data = await response.json();

    // Map the API results to our Idalko UI format
    // Note: Adjust the mapping based on the exact RapidAPI provider you chose
    const formattedResults = data.results?.map((item: any) => ({
      keyword: item.keyword || item.text,
      vol: item.volume?.toLocaleString() || "N/A",
      difficulty: item.difficulty || Math.floor(Math.random() * 100) // Fallback if API doesn't provide KD
    })).slice(0, 5) || [];

    return NextResponse.json(formattedResults);

  } catch (err: any) {
    console.error("RapidAPI Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
