
import React from 'react';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  onInventoryClick: () => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ stats, onInventoryClick, onReset }) => {
  return (
    <header className="bg-black/80 backdrop-blur-md border-b-2 border-cyan-500/30 px-6 py-2 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="bg-cyan-600 px-4 py-1 skew-x-[-20deg] border-r-4 border-white">
            <span className="font-military font-black italic tracking-tighter text-white text-xl block skew-x-[20deg]">ZEPETTO.OS</span>
          </div>
          <div className="absolute -bottom-1 -right-1 text-[8px] text-cyan-400 font-bold">VER 3.14.0</div>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 border-l border-white/10 pl-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Points Account</span>
            </div>
            <span className="text-lg font-military font-bold text-yellow-500 tabular-nums">P {stats.points.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Available Cash</span>
            </div>
            <span className="text-lg font-military font-bold text-cyan-400 tabular-nums">C {stats.cash.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block mr-4">
          <div className="text-[9px] text-slate-500 uppercase">System Status</div>
          <div className="text-[10px] text-green-500 font-bold uppercase">SECURE CONNECTION</div>
        </div>
        <button 
          onClick={onInventoryClick}
          className="relative group overflow-hidden bg-slate-900 border border-cyan-500/50 px-6 py-2 transition-all hover:bg-cyan-500/20"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>
          <span className="font-military text-xs font-bold tracking-widest flex items-center gap-2">
            <i className="fas fa-microchip text-cyan-400"></i>
            STORAGE
          </span>
        </button>
        <button 
          onClick={onReset}
          className="p-2 text-slate-500 hover:text-red-500 transition-colors"
          title="Terminal Reset"
        >
          <i className="fas fa-power-off"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
