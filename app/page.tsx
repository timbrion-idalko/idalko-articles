"use client";
import { useState } from 'react';
import KeywordCard from '@/components/KeywordCard';

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [article, setArticle] = useState("");
  // ADD THIS LINE TO FIX THE ERROR:
  const [loading, setLoading] = useState(false); 

  const mockSearch = () => {
    setResults([
      { keyword: "Atlassian Intelligence", vol: "18,200", difficulty: 22 },
      { keyword: "JSM Assets Workflow", vol: "5,400", difficulty: 12 },
      { keyword: "Jira Cloud Migration", vol: "42,000", difficulty: 85 }
    ]);
  };

  const generateArticle = async (topic: string) => {
    setLoading(true); // Now TypeScript can find this!
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setArticle(data.content);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setLoading(false);
    }
  };
  
  // ... rest of your return() code

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto bg-idalko-navy">
      <header className="mb-16">
        <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none text-white">
          CONTENT <span className="text-outline">ENGINE</span>
        </h1>
        <p className="text-idalko-orange font-bold tracking-[0.3em] mt-2 uppercase">Idalko Strategy Unit</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-white">
        <div className="col-span-1">
          <div className="bg-idalko-orange p-1 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
            <input 
              className="w-full p-4 bg-idalko-navy text-white outline-none font-bold"
              placeholder="ENTER TOPIC..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              onClick={mockSearch}
              className="w-full bg-idalko-navy text-idalko-orange p-4 mt-1 font-black uppercase hover:bg-white transition-colors"
            >
              Analyze Keywords ↓
            </button>
          </div>
        </div>

        <div className="col-span-2">
          {!article ? (
            results.map((item, i) => (
              <KeywordCard key={i} data={item} onSelect={generateArticle} />
            ))
          ) : (
            <div className="bg-white p-10 text-idalko-navy shadow-[12px_12px_0px_0px_#FF5C35]">
              <button onClick={() => setArticle("")} className="text-xs font-bold uppercase mb-4 text-idalko-orange">← Back</button>
              <pre className="whitespace-pre-wrap font-sans text-xl leading-relaxed">{article}</pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
