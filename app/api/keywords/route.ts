import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const API_KEY = process.env.RAPIDAPI_KEY;

    if (!API_KEY) {
      return NextResponse.json([{ keyword: "CONFIG ERROR: API KEY MISSING", vol: "0", difficulty: 0 }]);
    }

    // UPDATED URL for Google Keyword Insight API
    const url = `https://google-keyword-insight1.p.rapidapi.com/topkeys/?keyword=${encodeURIComponent(query)}&location=US&lang=en`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'google-keyword-insight1.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    // Debug: This helps see the final structure in your Vercel logs
    console.log("GOOGLE INSIGHT SUCCESS:", JSON.stringify(data));

    // Handle standard RapidAPI error messages
    if (data.message && !Array.isArray(data)) {
      return NextResponse.json([{ keyword: `API ERROR: ${data.message}`, vol: "0", difficulty: 0 }]);
    }

    // Google Keyword Insight usually returns an array of objects directly 
    // or nests them under a property like 'data' or 'keywords'
    const rawList = Array.isArray(data) ? data : (data.keywords || data.data || []);

    if (rawList.length === 0) {
      // Fallback if no results, so the UI still functions
      return NextResponse.json([{ 
        keyword: `${query} Strategy`, 
        vol: "N/A", 
        difficulty: 20 
      }]);
    }

    const formatted = rawList.map((item: any) => ({
      keyword: item.keyword || item.text || "Technical Insight",
      // Mapping based on common Google Insight field names
      vol: (item.volume || item.search_volume || item.monthly_searches || 0).toLocaleString(),
      difficulty: item.difficulty || item.competition_index || 30
    })).slice(0, 5);

    return NextResponse.json(formatted);

  } catch (err: any) {
    console.error("API Route Crash:", err.message);
    return NextResponse.json([{ keyword: "SERVER ERROR", vol: err.message, difficulty: 0 }]);
  }
}
