
import React, { useState, useMemo, useEffect } from 'react';
import { GachaItem, Rarity } from '../types';
import { sounds } from '../services/SoundEngine';
import ItemInspectModal from './ItemInspectModal';

interface InventoryModalProps {
  inventory: GachaItem[];
  onClose: () => void;
  onReclaim: (index: number) => void;
}

type SortOption = 'NEWEST' | 'OLDEST' | 'RARITY' | 'NAME';

const InventoryModal: React.FC<InventoryModalProps> = ({ inventory, onClose, onReclaim }) => {
  const [sortBy, setSortBy] = useState<SortOption>('NEWEST');
  const [inspectItem, setInspectItem] = useState<GachaItem | null>(null);
  const [justClaimed, setJustClaimed] = useState<Set<number>>(new Set());
  const [confirmingIndex, setConfirmingIndex] = useState<number | null>(null);

  const getRarityRank = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.LEGENDARY: return 4;
      case Rarity.EPIC: return 3;
      case Rarity.RARE: return 2;
      case Rarity.COMMON: return 1;
      default: return 0;
    }
  };

  const sortedInventory = useMemo(() => {
    const indexedInventory = inventory.map((item, index) => ({ item, originalIndex: index }));

    switch (sortBy) {
      case 'OLDEST':
        return indexedInventory;
      case 'NEWEST':
        return [...indexedInventory].reverse();
      case 'NAME':
        return [...indexedInventory].sort((a, b) => a.item.name.localeCompare(b.item.name));
      case 'RARITY':
        return [...indexedInventory].sort((a, b) => getRarityRank(b.item.rarity) - getRarityRank(a.item.rarity));
      default:
        return indexedInventory;
    }
  }, [inventory, sortBy]);

  const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.LEGENDARY: 
        return 'text-yellow-400 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] bg-yellow-500/[0.02]';
      case Rarity.EPIC: 
        return 'text-purple-400 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.1)] bg-purple-500/[0.02]';
      case Rarity.RARE: 
        return 'text-blue-400 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)] bg-blue-500/[0.02]';
      default: 
        return 'text-slate-400 border-white/10 bg-white/[0.01]';
    }
  };

  const handleClaim = (index: number) => {
    sounds.playClick();
    setJustClaimed(prev => new Set(prev).add(index));
    onReclaim(index);
    setConfirmingIndex(null);
    
    setTimeout(() => {
      setJustClaimed(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 1500);
  };

  // Reset confirmation if user clicks elsewhere or waits too long
  useEffect(() => {
    if (confirmingIndex !== null) {
      const timer = setTimeout(() => setConfirmingIndex(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [confirmingIndex]);

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500">
        <div className="max-w-7xl w-full h-[85vh] bg-[#05010a] border border-white/10 flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)] relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          
          <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02]">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 flex items-center justify-center border border-cyan-500/30 rounded-full bg-cyan-500/5">
                <i className="fas fa-crosshairs text-cyan-400 animate-pulse"></i>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-military font-black italic text-white tracking-[0.15em] flex items-center gap-3 uppercase">
                  ARSENAL <span className="text-cyan-500">MANAGEMENT</span>
                </h2>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operator Assets Archive // {inventory.length} UNITS</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex bg-slate-900/50 border border-white/10 p-1 rounded-sm overflow-hidden flex-1 md:flex-none">
                {(['NEWEST', 'RARITY', 'NAME'] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => { sounds.playClick(); setSortBy(option); }}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${
                      sortBy === option 
                      ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => { sounds.playClick(); onClose(); }}
                className="w-10 h-10 flex items-center justify-center rounded-sm bg-white/5 hover:bg-red-500 transition-colors text-slate-400 hover:text-white flex-shrink-0"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            {inventory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <i className="fas fa-shield-alt text-9xl mb-6"></i>
                <p className="text-2xl font-military font-bold tracking-[0.3em] italic">NO ASSETS REGISTERED</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">
                {sortedInventory.map(({ item, originalIndex }) => {
                  const isSuccess = justClaimed.has(originalIndex);
                  const isConfirming = confirmingIndex === originalIndex;
                  const rarityClasses = getRarityColor(item.rarity);
                  const rarityColorOnlyClass = rarityClasses.split(' ')[0];
                  
                  return (
                    <div 
                      key={`${item.id}-${originalIndex}`} 
                      className={`relative group bg-black/60 border rounded-sm transition-all hover:scale-[1.05] hover:z-30 ${rarityClasses}`}
                    >
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max max-w-[140px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 group-hover:-top-14">
                        <div className="bg-[#0a0a0f] border border-cyan-500/50 p-2 shadow-[0_0_20px_rgba(0,0,0,0.9)] backdrop-blur-md">
                          <div className="text-[9px] font-black text-white uppercase leading-tight truncate">{item.name}</div>
                          <div className={`text-[7px] font-bold uppercase tracking-[0.2em] mt-1 ${rarityColorOnlyClass}`}>
                            {item.rarity} CLASS
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-[#0a0a0f] border-r border-b border-cyan-500/50 absolute left-1/2 -translate-x-1/2 -bottom-1 rotate-45"></div>
                      </div>

                      <div className="aspect-[4/5] relative flex flex-col h-full">
                        <div className={`flex-1 flex items-center justify-center relative min-h-0 overflow-hidden rounded-t-sm border-b transition-all duration-500 p-4 ${rarityClasses}`}>
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className={`max-w-full max-h-full w-auto h-auto object-contain drop-shadow-2xl transition-all duration-300 group-hover:scale-110 ${item.isClaimed ? 'opacity-40 grayscale' : ''}`} 
                          />
                          {item.isClaimed && (
                            <div className="absolute inset-0 flex items-center justify-center rotate-[-15deg] pointer-events-none animate-in zoom-in fade-in duration-500">
                              <span className="border-4 border-slate-500/50 text-slate-500/50 font-black px-4 py-1 text-[10px] tracking-widest uppercase bg-black/60 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]">COLLECTED</span>
                            </div>
                          )}
                          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/10"></div>
                          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/10"></div>
                        </div>
                        
                        <div className="p-4 pt-3 flex-shrink-0 bg-black/20">
                          <h4 className="text-[10px] font-black text-white truncate uppercase mb-1">{item.name}</h4>
                          <div className="flex justify-between items-center text-[7px] font-bold tracking-[0.2em] opacity-50">
                            <span>{item.type}</span>
                            <span>{item.duration || 'PERMANENT'}</span>
                          </div>
                        </div>

                        <div className={`absolute inset-0 bg-cyan-900/95 transition-all duration-200 flex flex-col items-center justify-center p-4 gap-3 z-20 ${isConfirming ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          {!item.isClaimed && item.reclaimValue ? (
                            <div className="w-full flex flex-col gap-2">
                              {isConfirming ? (
                                <>
                                  <div className="text-center mb-1">
                                    <span className="text-[9px] font-black text-white uppercase tracking-tighter animate-pulse">ARE YOU SURE?</span>
                                  </div>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleClaim(originalIndex); }}
                                    className="w-full py-2 bg-red-500 text-white font-black text-[10px] tracking-widest uppercase shadow-lg hover:bg-red-400"
                                  >
                                    CONFIRM
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); sounds.playClick(); setConfirmingIndex(null); }}
                                    className="w-full py-2 border border-white/20 text-white font-black text-[10px] tracking-widest uppercase hover:bg-white/10"
                                  >
                                    CANCEL
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); sounds.playClick(); setConfirmingIndex(originalIndex); }}
                                  className={`w-full py-2 font-black text-[10px] tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
                                    isSuccess 
                                    ? 'bg-green-500 text-white scale-105' 
                                    : 'bg-white text-black hover:bg-cyan-400'
                                  }`}
                                >
                                  {isSuccess ? (
                                    <><i className="fas fa-check"></i> SUCCESS</>
                                  ) : (
                                    `CLAIM ${item.reclaimValue.amount} ${item.reclaimValue.currency.toUpperCase()}`
                                  )}
                                </button>
                              )}
                            </div>
                          ) : (
                            <button 
                              className={`w-full py-2 bg-slate-800 text-white/50 cursor-not-allowed font-black text-[10px] tracking-widest uppercase transition-all ${isSuccess ? 'bg-green-600/50' : ''}`}
                              disabled
                            >
                              {item.isClaimed ? 'REWARD CLAIMED' : 'NO REWARD'}
                            </button>
                          )}
                          
                          {!isConfirming && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); sounds.playClick(); setInspectItem(item); }}
                              className="w-full py-2 border border-white/20 text-white font-black text-[10px] tracking-widest uppercase hover:bg-white/10 transition-colors"
                            >
                              INSPECT ASSET
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 px-8 border-t border-white/5 bg-black/40 flex justify-between items-center text-[9px] font-bold text-slate-500">
            <div className="flex gap-10">
              <span className="flex items-center gap-2 text-cyan-500"><i className="fas fa-check-circle"></i> SYSTEM ENCRYPTED</span>
              <span className="flex items-center gap-2"><i className="fas fa-server"></i> ASSET CLOUD SYNCED</span>
            </div>
            <div className="italic uppercase opacity-40">Displaying: {sortBy}</div>
          </div>
        </div>
      </div>
      
      {inspectItem && (
        <ItemInspectModal 
          item={inspectItem} 
          onClose={() => setInspectItem(null)} 
        />
      )}
    </>
  );
};

export default InventoryModal;
