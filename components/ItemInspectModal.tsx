
import React, { useState } from 'react';
import { GachaItem, Rarity } from '../types';
import { sounds } from '../services/SoundEngine';

interface ItemInspectModalProps {
  item: GachaItem;
  onClose: () => void;
}

// Predefined tactical color scheme for rarities
const RARITY_SCHEME = {
  [Rarity.LEGENDARY]: {
    border: 'border-yellow-500',
    text: 'text-yellow-400',
    glow: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]',
    bg: 'bg-yellow-500/5',
    accent: 'bg-yellow-500'
  },
  [Rarity.EPIC]: {
    border: 'border-purple-500',
    text: 'text-purple-400',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
    bg: 'bg-purple-500/5',
    accent: 'bg-purple-500'
  },
  [Rarity.RARE]: {
    border: 'border-blue-500',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
    bg: 'bg-blue-500/5',
    accent: 'bg-blue-500'
  },
  [Rarity.COMMON]: {
    border: 'border-white/20',
    text: 'text-slate-400',
    glow: 'shadow-none',
    bg: 'bg-white/5',
    accent: 'bg-slate-500'
  },
};

const ItemInspectModal: React.FC<ItemInspectModalProps> = ({ item, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const scheme = RARITY_SCHEME[item.rarity] || RARITY_SCHEME[Rarity.COMMON];

  const handleClose = () => {
    sounds.playClick();
    setIsExiting(true);
    // Increased timeout to match the 400ms CSS animation duration
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-[400ms] ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div 
        className={`max-w-2xl w-full bg-[#0a0a0f] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden rounded-sm ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
      >
        {/* Dynamic Scanline Decor based on rarity */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent ${scheme.text}`}></div>
        
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${scheme.accent}`}></div>
            <span className="text-[10px] font-black text-cyan-500 tracking-[0.3em] uppercase">Tactical_Analysis // {item.id}</span>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all rounded-sm"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 md:p-10 flex flex-col md:flex-row gap-10">
          {/* Image Side with dynamic rarity border and glow */}
          <div className={`flex-shrink-0 w-full md:w-72 aspect-square border p-8 flex items-center justify-center relative transition-all duration-500 ${scheme.border} ${scheme.glow} ${scheme.bg}`}>
            <div className="absolute top-3 left-3 text-[7px] font-black opacity-40 tracking-widest text-white uppercase">Visual_Reference_Unit</div>
            <div className="absolute bottom-3 right-3 text-[7px] font-black opacity-40 tracking-widest text-white uppercase">ID: {item.id}</div>
            
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-110 transition-transform duration-700" 
            />
          </div>

          {/* Details Side */}
          <div className="flex-1 flex flex-col">
            <div className="mb-8">
              <div className={`text-[11px] font-black uppercase tracking-[0.4em] mb-2 flex items-center gap-2 ${scheme.text}`}>
                <span className={`w-4 h-1 ${scheme.accent}`}></span>
                {item.rarity} CLASS ASSET
              </div>
              <h3 className={`text-4xl font-military font-black italic tracking-wider uppercase mb-3 leading-tight ${scheme.text}`}>
                {item.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5">Type: {item.type}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5">Tier: {item.rarity === Rarity.LEGENDARY ? 'S' : item.rarity === Rarity.EPIC ? 'A' : 'B'}</span>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="relative group">
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] block mb-3 opacity-60 ${scheme.text}`}>Technical Specifications</span>
                <div className="bg-white/[0.02] border-l-2 border-white/10 p-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-1 opacity-5">
                      <i className="fas fa-info-circle text-4xl"></i>
                   </div>
                   <p className="text-slate-300 text-sm leading-relaxed font-medium italic">
                    "{item.description}"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Deployment Term</span>
                  <span className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <i className="far fa-clock text-[10px] text-cyan-500"></i>
                    {item.duration || 'PERMANENT'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Operational Status</span>
                  <span className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${item.isClaimed ? 'text-green-500' : 'text-cyan-400 animate-pulse'}`}>
                    <i className={`fas ${item.isClaimed ? 'fa-check-double' : 'fa-satellite-dish'} text-[10px]`}></i>
                    {item.isClaimed ? 'COLLECTED' : 'READY'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button 
                onClick={handleClose}
                className="w-full py-4 bg-white hover:bg-cyan-500 text-black font-black text-sm tracking-[0.4em] uppercase transition-all btn-para group"
              >
                <span className="group-hover:translate-x-1 transition-transform inline-block">TERMINATE INSPECTION</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Decor */}
        <div className="h-8 bg-black/60 flex items-center px-6 justify-between border-t border-white/5 backdrop-blur-sm">
          <div className="flex gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${scheme.accent} opacity-40 animate-pulse`}></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
          </div>
          <span className="text-[8px] font-black text-slate-600 tracking-[0.6em] uppercase">ZPT_TACTICAL_FRAMEWORK_STABLE</span>
        </div>
      </div>
    </div>
  );
};

export default ItemInspectModal;
