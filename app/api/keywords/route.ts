import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const API_KEY = process.env.RAPIDAPI_KEY;

    const response = await fetch(`https://seo-keyword-research-api.p.rapidapi.com/keyword?keyword=${encodeURIComponent(query)}&country=us`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY || '',
        'x-rapidapi-host': 'seo-keyword-research-api.p.rapidapi.com'
      }
    });

    const data = await response.json();
    
    // Log the data to Vercel so you can see it in the dashboard logs
    console.log("RAPIDAPI_RESPONSE:", JSON.stringify(data));

    // If the API returns an error message (common with expired keys or no subscription)
    if (data.message) {
      return NextResponse.json([{ 
        keyword: `API MESSAGE: ${data.message}`, 
        vol: "0", 
        difficulty: 0 
      }]);
    }

    // Try to find the list in common RapidAPI locations
    const list = data.results || data.keywords || data.data || (Array.isArray(data) ? data : null);

    if (!list || list.length === 0) {
      return NextResponse.json([{ 
        keyword: "DEBUG: API returned 200 but empty list. Check logs.", 
        vol: "N/A", 
        difficulty: 0 
      }]);
    }

    const formatted = list.map((item: any) => ({
      keyword: item.keyword || item.text || item.phrase || "Unknown",
      vol: (item.volume || item.search_volume || 0).toLocaleString(),
      difficulty: item.difficulty || item.keyword_difficulty || 10
    })).slice(0, 5);

    return NextResponse.json(formatted);

  } catch (err: any) {
    return NextResponse.json([{ keyword: "API CRASH", vol: err.message, difficulty: 0 }]);
  }
}
