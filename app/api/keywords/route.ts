import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const API_KEY = process.env.RAPIDAPI_KEY;

    // Use the standard RapidAPI HOST for SEO Keyword Research
    const HOST = 'seo-keyword-research-api.p.rapidapi.com';
    
    // TRYING THE '/suggestions' ENDPOINT (common for this provider)
    const url = `https://${HOST}/suggestions?keyword=${encodeURIComponent(query)}&country=us`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY || '',
        'x-rapidapi-host': HOST
      }
    });

    const data = await response.json();
    
    // DEBUG LOG: This helps you see the actual structure in Vercel
    console.log("RAPIDAPI_DATA:", JSON.stringify(data));

    // If it still says 'Endpoint does not exist', let's display the correction
    if (data.message && data.message.includes("does not exist")) {
      return NextResponse.json([{ 
        keyword: "WRONG ENDPOINT: Check RapidAPI Dashboard for the correct path (e.g. /search)", 
        vol: "0", 
        difficulty: 0 
      }]);
    }

    // Map common response formats: .results, .keywords, or the object itself
    const rawList = data.results || data.keywords || data.suggestions || (Array.isArray(data) ? data : []);

    if (rawList.length === 0) {
      return NextResponse.json([{ 
        keyword: `NO DATA FOR: ${query}`, 
        vol: "N/A", 
        difficulty: 0 
      }]);
    }

    const formatted = rawList.map((item: any) => ({
      keyword: item.keyword || item.text || "Insight Found",
      vol: (item.volume || item.search_volume || 0).toLocaleString(),
      difficulty: item.difficulty || 15
    })).slice(0, 5);

    return NextResponse.json(formatted);

  } catch (err: any) {
    return NextResponse.json([{ keyword: "API CRASH", vol: err.message, difficulty: 0 }]);
  }
}
