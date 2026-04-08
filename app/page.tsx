"use client";

import { useState } from 'react';
import KeywordCard from '@/components/KeywordCard';

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to simulate the SEMRush keyword scan
  const analyzeKeywords = () => {
    setLoading(true);
    // Mimicking the industry keyword data logic
    setTimeout(() => {
      setResults([
        { keyword: "Atlassian AI Best Practices", vol: "18,200", difficulty: 22 },
        { keyword: "JSM Workflow Efficiency", vol: "5,400", difficulty: 12 },
        { keyword: "Jira Cloud Migration Risks", vol: "42,000", difficulty: 85 },
        { keyword: "Digital Transformation in ITSM", vol: "12,400", difficulty: 45 }
      ]);
      setLoading(false);
    }, 800);
  };

 const generateArticle = async (topic: string) => {
    setLoading(true);
    setArticle(""); // Clear the screen so you know it's working
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      // Check if the server actually responded correctly
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.content) {
        setArticle(data.content); // This should be the real Gemini text
      } else {
        setArticle("ERROR: Gemini returned an empty response. Check Vercel API logs.");
      }
    } catch (error) {
      console.error("Gemini call failed:", error);
      setArticle("CONNECTION ERROR: Failed to reach Gemini. Ensure your API key is in Vercel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto bg-idalko-navy">
      <header className="mb-16">
        <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none text-white">
          CONTENT <span className="text-outline">ENGINE</span>
        </h1>
        <p className="text-idalko-orange font-bold tracking-[0.3em] mt-2 uppercase">
          Idalko Strategy Unit
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-white">
        {/* Left Column: Search Input */}
        <div className="col-span-1">
          <div className="bg-idalko-orange p-1 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
            <input 
              className="w-full p-4 bg-idalko-navy text-white outline-none font-bold placeholder:text-gray-600"
              placeholder="ENTER INDUSTRY TOPIC..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              onClick={analyzeKeywords}
              disabled={loading}
              className="w-full bg-idalko-navy text-idalko-orange p-4 mt-1 font-black uppercase hover:bg-white hover:text-idalko-navy transition-colors disabled:opacity-50"
            >
              {loading ? "SCANNING..." : "Analyze Keywords ↓"}
            </button>
          </div>
        </div>

        {/* Right Column: Keyword Results or Article Viewer */}
        <div className="col-span-2">
          {!article ? (
            <div className="space-y-6">
              {results.length > 0 ? (
                results.map((item, i) => (
                  <KeywordCard 
                    key={i} 
                    data={item} 
                    onSelect={generateArticle} 
                  />
                ))
              ) : (
                <div className="border-2 border-dashed border-gray-700 p-20 text-center">
                  <p className="text-gray-500 font-bold uppercase tracking-widest">
                    No Data Analyzed. Enter a topic to begin.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-idalko-paper p-10 text-idalko-navy shadow-[12px_12px_0px_0px_#FF5C35] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button 
                onClick={() => setArticle("")} 
                className="text-xs font-black uppercase mb-6 text-idalko-orange hover:underline"
              >
                ← Back to Keyword Results
              </button>
              
              <div className="prose prose-slate max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-xl leading-relaxed text-idalko-navy">
                  {article}
                </pre>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4">
                <button className="bg-idalko-navy text-white px-8 py-4 font-black uppercase text-sm shadow-[6px_6px_0px_0px_#FF5C35] active:translate-x-1 active:translate-y-1 transition-all">
                  Export PDF
                </button>
                <button className="border-2 border-idalko-navy px-8 py-4 font-black uppercase text-sm hover:bg-idalko-navy hover:text-white transition-all">
                  Copy to Word
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Universal Loading Overlay */}
      {loading && !results.length && (
        <div className="fixed inset-0 bg-idalko-navy/80 backdrop-blur-sm flex items-center justify-center z-50">
          <p className="text-idalko-orange font-black text-4xl animate-pulse uppercase italic">
            Processing Intelligence...
          </p>
        </div>
      )}
    </main>
  );
}
