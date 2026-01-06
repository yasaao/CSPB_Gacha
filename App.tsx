
import React, { useState, useCallback, useEffect } from 'react';
import { UserStats, GachaItem, Rarity } from './types';
import { ITEMS, DROP_RATES } from './constants';
import ResultModal from './components/ResultModal';
import InventoryModal from './components/InventoryModal';
import Header from './components/Header';
import { sounds } from './services/SoundEngine';

const PITY_THRESHOLD = 60;

const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('pb_stats');
    return saved ? JSON.parse(saved) : { points: 1500, cash: 500, totalOpened: 0, pityCount: 0 };
  });

  const [inventory, setInventory] = useState<GachaItem[]>(() => {
    const saved = localStorage.getItem('pb_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [activeSpinIndex, setActiveSpinIndex] = useState<number | null>(null);
  const [trailIndices, setTrailIndices] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const [shouldFlash, setShouldFlash] = useState(false);
  const [results, setResults] = useState<GachaItem[] | null>(null);
  const [currentSpinCount, setCurrentSpinCount] = useState(0);
  const [totalSpinTarget, setTotalSpinTarget] = useState(0);
  
  const [wheelTilt, setWheelTilt] = useState({ x: 0, y: 0 });
  const [vortexSpeedFactor, setVortexSpeedFactor] = useState(1);
  const [logs, setLogs] = useState<string[]>(["SYSTEM READY...", "WAITING FOR DEPLOYMENT..."]);

  const mainPrize = ITEMS.find(i => i.rarity === Rarity.LEGENDARY) || ITEMS[0];
  const surroundingRewards = ITEMS.filter(i => i.id !== mainPrize.id).slice(0, 8);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  useEffect(() => {
    localStorage.setItem('pb_stats', JSON.stringify(stats));
    localStorage.setItem('pb_inventory', JSON.stringify(inventory));
  }, [stats, inventory]);

  const getRandomItem = (forceLegendary: boolean = false) => {
    if (forceLegendary) {
      const pool = ITEMS.filter(item => item.rarity === Rarity.LEGENDARY);
      return pool[Math.floor(Math.random() * pool.length)];
    }

    const rand = Math.random();
    let cumulative = 0;
    let rarity = Rarity.COMMON;
    for (const dr of DROP_RATES) {
      cumulative += dr.chance;
      if (rand <= cumulative) { rarity = dr.rarity; break; }
    }
    const pool = ITEMS.filter(item => item.rarity === rarity);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const triggerFeedback = (rarity: Rarity) => {
    const isMajor = rarity === Rarity.LEGENDARY || rarity === Rarity.EPIC;
    
    if (isMajor) {
      setShouldFlash(true);
      setTimeout(() => setShouldFlash(false), 200);
      setTimeout(() => setShouldFlash(true), 300);
      setTimeout(() => setShouldFlash(false), 500);
    }
    
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), isMajor ? 500 : 150);
    
    sounds.playSuccess(rarity);
  };

  const runSingleSpinAnimation = (spinIteration: number, forcedItem?: GachaItem): Promise<GachaItem> => {
    return new Promise((resolve) => {
      let currentIdx = 0;
      const targetItem = forcedItem || getRandomItem();
      const targetIdxOnWheel = surroundingRewards.findIndex(i => i.id === targetItem.id);
      
      const minRotations = 3 + Math.floor(Math.random() * 2); 
      const totalSteps = (minRotations * 8) + (targetIdxOnWheel !== -1 ? targetIdxOnWheel : Math.floor(Math.random() * 8));
      let step = 0;

      const animateStep = () => {
        const progress = step / totalSteps;
        
        // Refined Easing: Ease-Out Quart for a more mechanical, heavy-stop feel
        const delay = 20 + (Math.pow(progress, 4) * 1100);
        
        const intensity = 1 - progress;

        // More aggressive tilting based on speed
        setWheelTilt({
          x: (Math.sin(step * 0.5) * intensity * 20),
          y: (Math.cos(step * 0.5) * intensity * 20)
        });

        // Linearized Vortex Speed Factor Decay
        setVortexSpeedFactor(1 + (intensity * 12));

        setActiveSpinIndex(currentIdx % 8);
        sounds.playSpinTick();
        
        const trail = [];
        if (intensity > 0.15) trail.push((currentIdx - 1 + 8) % 8);
        if (intensity > 0.4) trail.push((currentIdx - 2 + 8) % 8);
        if (intensity > 0.7) trail.push((currentIdx - 3 + 8) % 8);
        setTrailIndices(trail);
        
        currentIdx++;
        step++;

        if (step <= totalSteps) {
          setTimeout(animateStep, delay);
        } else {
          // Final landing feedback
          triggerFeedback(targetItem.rarity);
          setWheelTilt({ x: 0, y: 0 });
          setVortexSpeedFactor(1);
          setTrailIndices([]);
          addLog(`DECODED: ${targetItem.name}`);
          
          // Flash on land
          setShouldFlash(true);
          setTimeout(() => setShouldFlash(false), 100);
          
          setTimeout(() => resolve(targetItem), 1200); 
        }
      };

      animateStep();
    });
  };

  const handleSpin = async (count: number) => {
    if (isSpinning) return;
    const cost = count === 1 ? 9 : 45;
    if (stats.cash < cost) {
      addLog("ERROR: INSUFFICIENT FUNDS");
      return alert("INSUFFICIENT FUNDS");
    }

    sounds.playPowerUp();
    setIsSpinning(true);
    setTotalSpinTarget(count);
    addLog(`INITIATING ${count}X DEPLOYMENT...`);
    
    // Quick screen flash on start
    setShouldFlash(true);
    setTimeout(() => setShouldFlash(false), 150);

    const allGeneratedResults: GachaItem[] = [];
    let updatedStats = { ...stats, cash: stats.cash - cost };

    for (let i = 1; i <= count; i++) {
      setCurrentSpinCount(i);
      
      const isPityReached = updatedStats.pityCount >= PITY_THRESHOLD - 1;
      const res = await runSingleSpinAnimation(i, isPityReached ? getRandomItem(true) : undefined);
      
      allGeneratedResults.push(res);
      updatedStats.totalOpened += 1;
      
      if (res.rarity === Rarity.LEGENDARY) {
        addLog("CRITICAL HIT: LEGENDARY ASSET ACQUIRED!");
        updatedStats.pityCount = 0; 
      } else {
        updatedStats.pityCount += 1;
      }
      
      // Update intermediate stats for visual smooth progression between multi-spins
      setStats({...updatedStats});
    }

    // Grand final reveal flash
    setShouldFlash(true);
    setTimeout(() => setShouldFlash(false), 400);

    setResults(allGeneratedResults);
    setInventory(prev => [...prev, ...allGeneratedResults]);
    setStats(updatedStats);
    setIsSpinning(false);
    setActiveSpinIndex(null);
    setTrailIndices([]);
    setCurrentSpinCount(0);
    setTotalSpinTarget(0);
    addLog("DEPLOYMENT COMPLETED.");
  };

  const reclaimItem = (index: number) => {
    const newInventory = [...inventory];
    const item = newInventory[index];
    
    if (item.reclaimValue && !item.isClaimed) {
      setStats(prev => ({
        ...prev,
        [item.reclaimValue!.currency]: prev[item.reclaimValue!.currency as keyof UserStats] + item.reclaimValue!.amount
      }));
      item.isClaimed = true;
      setInventory(newInventory);
      addLog(`REWARD CLAIMED: ${item.reclaimValue.amount} ${item.reclaimValue.currency.toUpperCase()}`);
    }
  };

  const resetStats = () => {
    if (confirm("Initiate terminal reset? All data will be purged.")) {
      setStats({ points: 1500, cash: 500, totalOpened: 0, pityCount: 0 });
      setInventory([]);
      localStorage.clear();
      window.location.reload();
    }
  };

  // Pity calculations for dynamic styles
  const pityProgress = (stats.pityCount / PITY_THRESHOLD) * 100;
  const isPityClose = pityProgress >= 80;
  const pityColor = pityProgress < 50 
    ? 'from-yellow-600 to-yellow-400' 
    : pityProgress < 85 
      ? 'from-orange-600 to-orange-400' 
      : 'from-red-600 to-orange-400';
  
  const pityGlowIntensity = pityProgress < 50 ? 'rgba(234, 179, 8, 0.3)' : pityProgress < 85 ? 'rgba(249, 115, 22, 0.5)' : 'rgba(239, 68, 68, 0.8)';

  return (
    <div className={`h-screen w-screen relative overflow-hidden flex flex-col bg-[#05010a] ${shouldShake ? 'screen-shake' : ''}`}>
      {shouldFlash && <div className="fixed inset-0 bg-white z-[200] pointer-events-none opacity-40 animate-out fade-out duration-300" />}
      
      <div className="vortex-container" style={{ '--vortex-speed': `${60 / vortexSpeedFactor}s` } as React.CSSProperties}>
        <div className="singularity-core"></div>
        <div className="vortex-layer vortex-1"></div>
        <div className="vortex-layer vortex-2"></div>
      </div>

      <Header 
        stats={stats} 
        onInventoryClick={() => { sounds.playClick(); setIsInventoryOpen(true); }} 
        onReset={resetStats} 
      />

      <main className="flex-1 flex flex-col md:flex-row px-4 md:px-10 relative overflow-hidden">
        {/* Left Stats/Logs Panel */}
        <div className="hidden xl:flex w-64 flex-col py-10 z-10 gap-6 animate-in slide-in-from-left duration-700">
           <div className="bg-black/40 border border-white/5 p-4 rounded-sm backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20"></div>
              <span className="text-[9px] font-black text-cyan-400 tracking-[0.2em] uppercase">Tactical_Log</span>
              <div className="mt-4 space-y-2">
                {logs.map((log, i) => (
                  <div key={i} className={`text-[8px] font-bold font-mono flex items-center gap-2 transition-all duration-300 ${i === 0 ? 'text-white translate-x-1' : 'text-white/40'}`}>
                    <span className="text-cyan-500/50">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
           </div>

           {/* Enhanced Pity Progress */}
           <div className="bg-black/40 border border-white/5 p-4 rounded-sm backdrop-blur-sm relative overflow-hidden group">
              <div className={`absolute top-0 right-0 p-1 transition-opacity duration-500 ${isPityClose ? 'opacity-20 animate-pulse text-red-500' : 'opacity-5'}`}>
                <i className="fas fa-radiation text-4xl"></i>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className={`text-[9px] font-black tracking-[0.2em] uppercase transition-colors duration-500 ${isPityClose ? 'text-red-500' : 'text-yellow-500'}`}>
                  {isPityClose ? 'CRITICAL_REACHED' : 'Guarantee_System'}
                </span>
                <span className={`text-[9px] font-bold tabular-nums transition-colors duration-500 ${isPityClose ? 'text-white' : 'text-white/40'}`}>
                  {stats.pityCount}/{PITY_THRESHOLD}
                </span>
              </div>

              <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5 p-[1px] relative">
                {/* Background pulse for high pity */}
                {isPityClose && (
                  <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                )}
                
                <div 
                  className={`h-full bg-gradient-to-r ${pityColor} transition-all duration-1000 ease-out rounded-full relative overflow-hidden`}
                  style={{ 
                    width: `${pityProgress}%`,
                    boxShadow: `0 0 15px ${pityGlowIntensity}`
                  }}
                >
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                  
                  {/* High Intensity Pulse when close to pity */}
                  {isPityClose && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  )}
                </div>
              </div>
              
              <p className="mt-3 text-[8px] font-bold uppercase leading-relaxed tracking-tighter flex flex-col gap-1">
                <span className="text-white/30">{PITY_THRESHOLD - stats.pityCount} DEPLOYMENTS UNTIL</span>
                <span className={`text-[10px] font-black italic tracking-[0.1em] transition-all duration-500 ${isPityClose ? 'text-red-500 animate-pulse scale-105 origin-left' : 'text-yellow-500'}`}>
                   S-CLASS ASSET GUARANTEED
                </span>
              </p>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center min-h-0">
          <div className="mb-4 md:mb-12 text-center z-10 animate-in fade-in zoom-in duration-1000">
            <h2 className={`text-2xl md:text-5xl font-military font-black text-white italic tracking-[0.2em] transition-all duration-300 ${isSpinning ? 'animate-pulse text-cyan-400' : 'drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}>
              {isSpinning ? 'DECRYPTING CARGO' : 'BLONDE WAVE BOX'}
            </h2>
            <div className="h-[2px] w-32 md:w-80 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-3"></div>
            {isSpinning && (
              <div className="mt-4 text-[10px] font-black text-cyan-500 tracking-[0.5em] animate-pulse">
                PROGRESS: {currentSpinCount} / {totalSpinTarget}
              </div>
            )}
          </div>

          <div 
            className="relative w-full max-w-[550px] aspect-square flex items-center justify-center transform transition-all duration-500 ease-out"
            style={{ 
              transform: `scale(${window.innerWidth < 768 ? 0.75 : 1}) rotateX(${wheelTilt.y}deg) rotateY(${wheelTilt.x}deg)` 
            }}
          >
            <div className={`absolute inset-0 bg-cyan-500/10 rounded-full blur-[140px] transition-opacity duration-1000 ${isSpinning ? 'opacity-100' : 'opacity-0'}`}></div>
            
            <div className="z-20 group relative transition-transform duration-500 hover:scale-110">
               <div className={`absolute inset-0 blur-3xl rounded-full scale-150 transition-all duration-500 ${isSpinning ? 'bg-cyan-400/20' : 'bg-yellow-400/10 animate-pulse'}`}></div>
               <div className={`relative w-48 h-32 md:w-64 md:h-40 flex items-center justify-center transition-all duration-500 ${isSpinning ? 'scale-90 opacity-50' : ''}`}>
                  <div className="w-full h-full bg-[#0a0a0f] border-2 border-yellow-500/60 clip-path-[polygon(20%_0,80%_0,100%_50%,80%_100%,20%_100%,0_50%)] flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.25)] relative overflow-hidden group">
                    <div className="scanline-effect opacity-30"></div>
                    <img src={mainPrize.imageUrl} className="w-[85%] object-contain drop-shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-transform duration-700 group-hover:scale-125" />
                    <div className="absolute top-2 font-military font-black text-[7px] text-yellow-500/50 tracking-widest">S-RANK ASSET</div>
                  </div>
               </div>
            </div>

            {surroundingRewards.map((item, idx) => {
              const angle = (idx * 45) - 90;
              const radius = window.innerWidth < 768 ? 200 : 250;
              const x = radius * Math.cos((angle * Math.PI) / 180);
              const y = radius * Math.sin((angle * Math.PI) / 180);
              const isActive = activeSpinIndex === idx;
              const isTrail = trailIndices.includes(idx);

              return (
                <div 
                  key={idx}
                  className={`absolute hex-wrapper ${isActive ? 'hex-active' : ''} ${isTrail ? 'hex-trail' : ''}`}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  <div className="hex-inner">
                    <img src={item.imageUrl} className={`w-[70%] object-contain transition-all duration-200 ${isActive ? 'scale-110 opacity-100 brightness-150 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'opacity-30'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="hidden lg:flex w-80 flex-col py-10 z-10 animate-in slide-in-from-right duration-700">
          <div className="flex-1 bg-black/60 border border-white/5 relative p-6 backdrop-blur-md flex flex-col overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl"></div>
            <div className="mb-6 relative">
              <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase opacity-70">Manifest</span>
              <h3 className="text-xl font-bold uppercase italic tracking-tighter">CARGO CONTENTS</h3>
              <div className="w-12 h-1 bg-cyan-500 mt-1"></div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 relative z-10">
              {ITEMS.map((item, idx) => (
                <div key={idx} className="group flex items-center gap-3 p-2 bg-white/5 border-l-2 border-transparent hover:border-cyan-500 hover:bg-white/10 transition-all cursor-crosshair">
                  <div className={`w-12 h-12 bg-black flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${item.rarity === Rarity.LEGENDARY ? 'border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'border-white/10'}`}>
                    <img src={item.imageUrl} className="w-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black truncate uppercase text-white/80 group-hover:text-cyan-400">{item.name}</p>
                    <p className={`text-[8px] font-bold ${item.rarity === Rarity.LEGENDARY ? 'text-yellow-500' : 'text-slate-500'}`}>{item.rarity} CLASS</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="h-32 md:h-44 z-20 flex items-center justify-center gap-4 md:gap-10 bg-gradient-to-t from-black via-black/95 to-transparent px-4 animate-in slide-in-from-bottom duration-700">
        <div className="flex items-center gap-4 md:gap-10 max-w-4xl w-full justify-center">
          <button 
            onClick={() => handleSpin(1)}
            disabled={isSpinning}
            className="btn-para group relative flex-1 max-w-[200px] h-14 bg-slate-900 border-r-2 border-cyan-500 flex items-center justify-center overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-cyan-400/5 group-hover:bg-cyan-400/15 transition-colors"></div>
            <div className="flex flex-col items-center relative z-10 transition-transform group-hover:scale-105">
              <span className="text-white font-black italic tracking-widest text-sm uppercase">INITIATE [1X]</span>
              <span className="text-[9px] font-bold text-cyan-500 uppercase">9 CASH</span>
            </div>
          </button>

          <button 
            onClick={() => handleSpin(5)}
            disabled={isSpinning}
            className="btn-para group relative flex-1 max-w-[260px] h-16 bg-cyan-600 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="flex flex-col items-center relative z-10 transition-all group-hover:scale-110 group-active:scale-95">
              <span className="text-white font-black italic tracking-[0.2em] text-lg uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">DEPLOYMENT [5X]</span>
              <span className="text-[9px] font-bold text-black/70 bg-white/50 px-4 py-0.5 rounded-full mt-1 uppercase">45 CASH</span>
            </div>
            {/* Pulsing light effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-pulse"></div>
          </button>
        </div>
      </footer>

      {results && <ResultModal items={results} onClose={() => { sounds.playClick(); setResults(null); }} />}
      {isInventoryOpen && (
        <InventoryModal 
          inventory={inventory} 
          onClose={() => setIsInventoryOpen(false)} 
          onReclaim={reclaimItem}
        />
      )}
    </div>
  );
};

export default App;
