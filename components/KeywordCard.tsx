"use client";

export default function KeywordCard({ data, onSelect }: any) {
  return (
    <div 
      onClick={() => onSelect(data.keyword)}
      className="bg-idalko-paper border-l-[12px] border-idalko-orange p-8 mb-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] cursor-pointer group hover:-translate-y-1 transition-all"
    >
      <div className="flex justify-between items-end">
        <div>
          <span className="text-xs font-black text-idalko-orange uppercase tracking-widest">Diagnosis Ready</span>
          <h2 className="text-4xl font-black text-idalko-navy uppercase mt-1 leading-none">{data.keyword}</h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-400 uppercase">Search Vol</p>
          <p className="text-3xl font-black text-idalko-navy">{data.vol}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-[10px] font-black uppercase text-idalko-navy mb-2">
          <span>Competitive Difficulty</span>
          <span>{data.difficulty}%</span>
        </div>
        <div className="w-full bg-gray-200 h-6">
          <div 
            className="bg-idalko-orange h-full transition-all duration-1000" 
            style={{ width: `${data.difficulty}%` }} 
          />
        </div>
      </div>
    </div>
  );
}