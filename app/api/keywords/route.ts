import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const API_KEY = process.env.RAPIDAPI_KEY;

    if (!API_KEY) {
      console.error("Vercel Error: RAPIDAPI_KEY is missing");
      return NextResponse.json([{ keyword: "CONFIG ERROR: API KEY MISSING", vol: "0", difficulty: 0 }]);
    }

    // UPDATED URL based on your curl command
    const url = `https://seo-keyword-research-api.p.rapidapi.com/keyword-research?keyword=${encodeURIComponent(query)}&country=us`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'seo-keyword-research-api.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    // Log response to Vercel logs to see the final data structure
    console.log("RAPIDAPI SUCCESS:", JSON.stringify(data));

    // Handle API-level errors (like subscription issues)
    if (data.message && !data.results && !data.keywords) {
      return NextResponse.json([{ 
        keyword: `API ERROR: ${data.message}`, 
        vol: "0", 
        difficulty: 0 
      }]);
    }

    // Most SEO APIs return data in .results or .keywords
    const rawList = data.results || data.keywords || data.data || [];

    if (rawList.length === 0) {
      return NextResponse.json([{ 
        keyword: `NO DATA FOUND FOR: ${query}`, 
        vol: "N/A", 
        difficulty: 0 
      }]);
    }

    const formatted = rawList.map((item: any) => ({
      keyword: item.keyword || item.text || "Technical Insight",
      // SEO APIs vary: volume, search_volume, or avg_monthly_searches
      vol: (item.volume || item.search_volume || item.avg_monthly_searches || 0).toLocaleString(),
      // SEO APIs vary: difficulty, kd, or competition_level
      difficulty: item.difficulty || item.kd || item.keyword_difficulty || 25
    })).slice(0, 5);

    return NextResponse.json(formatted);

  } catch (err: any) {
    console.error("API Route Crash:", err.message);
    return NextResponse.json([{ keyword: "SERVER ERROR", vol: err.message, difficulty: 0 }]);
  }
}
