// Web Audio API Morse Code Synthesizer

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.gainNode = null;
    this.currentOscillator = null;
    this.activeOscillators = new Set();
    this.frequency = 650; // standard Morse sidetone frequency (600 - 750 Hz)
    this.wpm = 18; // Words per minute standard
    this.volume = 0.25;
    this.muted = false;
  }

  init() {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // PARIS standard: 50 units per word. Unit duration in ms = 1200 / WPM
  getUnitDurationMs() {
    return 1200 / (this.wpm || 18);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  setFrequency(freq) {
    this.frequency = Math.max(300, Math.min(1200, freq));
  }

  setWpm(wpm) {
    this.wpm = Math.max(5, Math.min(40, wpm));
  }

  setMuted(muted) {
    this.muted = !!muted;
    if (this.muted) {
      this.stopContinuousTone();
    }
  }

  // Play a single dot
  playDot() {
    if (this.muted) return;
    const duration = this.getUnitDurationMs() / 1000;
    this.playTone(this.frequency, duration);
  }

  // Play a single dash (3x duration of dot)
  playDash() {
    if (this.muted) return;
    const duration = (this.getUnitDurationMs() * 3) / 1000;
    this.playTone(this.frequency, duration);
  }

  // Low level tone player with envelope to prevent audio popping
  playTone(freq, durationSec, type = 'sine') {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      // Smooth attack and release envelope (5ms attack, 5ms release)
      const attack = 0.005;
      const release = 0.005;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.volume, now + attack);
      gain.gain.setValueAtTime(this.volume, Math.max(now + attack, now + durationSec - release));
      gain.gain.linearRampToValueAtTime(0, now + durationSec);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + durationSec + 0.01);
    } catch {
      // AudioContext could fail on background tabs
    }
  }

  // Success chime
  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      [
        { f: 587.33, t: 0, d: 0.08 },    // D5
        { f: 880.00, t: 0.08, d: 0.15 }  // A5
      ].forEach(note => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + note.t);
        gain.gain.setValueAtTime(0, now + note.t);
        gain.gain.linearRampToValueAtTime(this.volume * 0.7, now + note.t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + note.t);
        osc.stop(now + note.t + note.d);
      });
    } catch {}
  }

  // Error buzz
  playError() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.15);
      gain.gain.setValueAtTime(this.volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // Play an entire Morse sequence (e.g. "... --- ...")
  async playSequence(morseStr, onStep) {
    if (this.muted || !morseStr) return;
    this.init();
    const unitMs = this.getUnitDurationMs();

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < morseStr.length; i++) {
      const symbol = morseStr[i];
      if (onStep) onStep(i, symbol);

      if (symbol === '.') {
        this.playDot();
        await sleep(unitMs); // duration of dot
      } else if (symbol === '-') {
        this.playDash();
        await sleep(unitMs * 3); // duration of dash
      } else if (symbol === ' ') {
        await sleep(unitMs * 3); // space between letters
        continue;
      } else if (symbol === '/') {
        await sleep(unitMs * 7); // space between words
        continue;
      }
      // Space between elements of same letter is 1 unit
      await sleep(unitMs);
    }

    if (onStep) onStep(-1, null);
  }

  stopContinuousTone() {
    if (this.currentOscillator) {
      try {
        this.currentOscillator.stop();
        this.currentOscillator.disconnect();
      } catch {}
      this.currentOscillator = null;
    }
  }
}

export const soundEngine = typeof window !== 'undefined' ? new SoundEngine() : null;
export default soundEngine;
