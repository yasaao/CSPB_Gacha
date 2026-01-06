
import React from 'react';

interface CrateProps {
  id: number;
  isSelected: boolean;
  isOpening: boolean;
  onSelect: (id: number) => void;
}

// Added missing CrateGridProps interface
interface CrateGridProps {
  selectedId: number | null;
  openingIds: number[];
  onSelect: (id: number) => void;
}

const Crate: React.FC<CrateProps> = ({ id, isSelected, isOpening, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(id)}
      className={`relative cursor-pointer transition-all duration-200 group ${isSelected ? 'z-20' : 'z-10'}`}
    >
      <div className={`relative aspect-square flex items-center justify-center rounded-sm border-2 transition-all duration-300
        ${isSelected 
          ? 'border-cyan-400 bg-slate-900 shadow-[0_0_30px_rgba(34,211,238,0.4)] scale-110' 
          : 'border-slate-800 bg-black/40 hover:border-slate-600'
        }
        ${isOpening ? 'shaking-intense' : ''}
      `}>
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-500/20"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-500/20"></div>

        {/* Tactical Case Visual */}
        <div className="w-3/4 h-3/4 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            {/* Box Body */}
            <rect x="10" y="25" width="80" height="60" fill="#1e293b" />
            <rect x="10" y="25" width="80" height="15" fill="#334155" />
            {/* Metal Straps */}
            <rect x="25" y="20" width="10" height="70" fill="#0f172a" />
            <rect x="65" y="20" width="10" height="70" fill="#0f172a" />
            {/* Locks */}
            <rect x="23" y="45" width="14" height="8" fill={isSelected ? "#22d3ee" : "#475569"} />
            <rect x="63" y="45" width="14" height="8" fill={isSelected ? "#22d3ee" : "#475569"} />
            {/* Emblem */}
            <path d="M45 50 L50 45 L55 50 L50 55 Z" fill={isSelected ? "#22d3ee" : "#64748b"} />
          </svg>
          
          {isOpening && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[10px] font-bold text-cyan-400 animate-pulse bg-black/80 px-2 py-1 border border-cyan-400">
                DECRYPTING...
              </div>
            </div>
          )}
        </div>

        {/* HUD Overlay */}
        <div className="absolute top-2 left-2 text-[8px] text-cyan-500/50 font-mono">
          SUPPLY_UNIT_{id.toString().padStart(2, '0')}
        </div>
      </div>
      
      <div className={`mt-3 flex items-center justify-between px-1 transition-all
        ${isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}
      `}>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Slot {id + 1}</span>
        <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-slate-700'}`}></div>
      </div>
    </div>
  );
};

const CrateGrid: React.FC<CrateGridProps> = ({ selectedId, openingIds, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-14 max-w-3xl mx-auto p-4 relative">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-3 pointer-events-none opacity-5">
        <div className="border-r border-white h-full"></div>
        <div className="border-r border-white h-full"></div>
      </div>
      
      {[...Array(6)].map((_, i) => (
        <Crate 
          key={i} 
          id={i} 
          isSelected={selectedId === i} 
          isOpening={openingIds.includes(i)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default CrateGrid;
