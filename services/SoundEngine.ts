
import { Rarity } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playClick() {
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx!.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, this.ctx!.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.1);
  }

  playSpinTick() {
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx!.currentTime);
    gain.gain.setValueAtTime(0.02, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.05);
  }

  playSuccess(rarity: Rarity) {
    this.init();
    const now = this.ctx!.currentTime;
    
    let notes: number[] = [];
    let type: OscillatorType = 'sine';
    let sustain = 0.3;
    let volume = 0.1;

    switch (rarity) {
      case Rarity.LEGENDARY:
        notes = [440, 554, 659, 880, 1108]; // Major arpeggio
        type = 'sawtooth';
        sustain = 0.8;
        volume = 0.15;
        break;
      case Rarity.EPIC:
        notes = [330, 440, 554, 660]; // Energy surge
        type = 'square';
        sustain = 0.5;
        volume = 0.1;
        break;
      case Rarity.RARE:
        notes = [440, 660]; // Pleasant chime
        type = 'sine';
        sustain = 0.4;
        volume = 0.08;
        break;
      case Rarity.COMMON:
      default:
        notes = [220]; // Neutral blip
        type = 'sine';
        sustain = 0.2;
        volume = 0.05;
        break;
    }
    
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(volume, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + sustain);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + sustain + 0.1);
    });
  }

  playPowerUp() {
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, this.ctx!.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx!.currentTime + 1);
    gain.gain.setValueAtTime(0, this.ctx!.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx!.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 1);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(this.ctx!.currentTime + 1);
  }
}

export const sounds = new SoundEngine();
