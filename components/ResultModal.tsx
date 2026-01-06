
import React from 'react';
import { GachaItem, Rarity } from '../types';

interface ResultModalProps {
  items: GachaItem[];
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ items, onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-4 bg-black/98 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      
      <div className="relative mb-12 flex-shrink-0 animate-in slide-in-from-top duration-700">
        <div className="absolute -inset-8 bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <h2 className="text-4xl md:text-7xl font-military font-black italic text-white tracking-tighter text-center drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
          DECODING <span className="text-cyan-500 animate-pulse">SUCCESSFUL</span>
        </h2>
        <div className="flex justify-center mt-2">
          <div className="px-4 py-1 bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-black tracking-[0.5em] text-cyan-400 uppercase">
            // ASSET_REGISTRY_UPDATED
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 max-w-7xl relative z-10 w-full px-4">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className={`w-40 h-60 md:w-52 md:h-72 bg-[#0a0a0f] border-2 transition-all hover:scale-110 hover:z-20 group relative overflow-hidden
              ${item.rarity === Rarity.LEGENDARY 
                ? 'border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.4)]' 
                : item.rarity === Rarity.EPIC 
                ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]' 
                : 'border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]'}
              animate-hologram`}
            style={{ animationDelay: `${idx * 200}ms` }}
          >
            {/* Rarity Background Glow */}
            <div className={`absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none
              ${item.rarity === Rarity.LEGENDARY ? 'bg-yellow-500' : item.rarity === Rarity.EPIC ? 'bg-purple-500' : 'bg-cyan-500'}`}></div>
            
            {/* Scanline Effect */}
            <div className="scanline-effect"></div>
            
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20"></div>
            
            <div className="h-full w-full flex flex-col items-center justify-between p-4 bg-gradient-to-b from-white/5 via-transparent to-black/60">
              <div className="w-full flex justify-between items-start">
                <div className="text-[8px] font-black text-cyan-500/50 font-mono">#{idx + 1}</div>
                <div className="text-[8px] font-bold text-white/30 italic uppercase tracking-widest">SECURE_ASSET</div>
              </div>

              <div className="relative group-hover:scale-110 transition-transform duration-500">
                <div className={`absolute inset-0 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity
                  ${item.rarity === Rarity.LEGENDARY ? 'bg-yellow-400' : 'bg-white'}`}></div>
                <img src={item.imageUrl} className="w-full h-28 md:h-40 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] relative" alt={item.name} />
              </div>

              <div className="text-center w-full z-10">
                <div className="text-[10px] md:text-[12px] font-black leading-tight uppercase mb-2 truncate text-white tracking-wider group-hover:text-cyan-400 transition-colors">
                  {item.name}
                </div>
                <div className={`text-[9px] font-black py-1 px-4 inline-block tracking-[0.2em] skew-x-[-20deg] border-r-4 border-white
                  ${item.rarity === Rarity.LEGENDARY ? 'bg-yellow-500 text-black' : item.rarity === Rarity.EPIC ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/80'}`}>
                  <span className="inline-block skew-x-[20deg]">{item.rarity}</span>
                </div>
              </div>
            </div>
            
            {/* Hover Glitch Decor */}
            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-cyan-500/50 group-hover:animate-pulse pointer-events-none"></div>
          </div>
        ))}
      </div>

      <div className="mt-16 mb-8 animate-in slide-in-from-bottom duration-1000 flex flex-col items-center gap-4">
        <button 
          onClick={onClose}
          className="group relative px-20 py-5 bg-white hover:bg-cyan-500 transition-all btn-para overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          <span className="relative z-10 text-black font-military font-black italic tracking-[0.4em] text-xl group-hover:text-white uppercase transition-colors">
            CONFIRM ACCESS
          </span>
        </button>
        <span className="text-[10px] font-bold text-white/20 tracking-[0.5em] uppercase animate-pulse">Awaiting operator confirmation...</span>
      </div>
    </div>
  );
};

export default ResultModal;
