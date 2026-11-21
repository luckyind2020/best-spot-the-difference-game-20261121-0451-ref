// Tiny procedural sound kit for Milo's Garden. No audio files: every effect
// is a short WebAudio oscillator phrase, so the game stays fully offline.
export class SoundKit {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, startAt, dur, kind, vol) {
    if (this.muted || !this.ctx) return;
    const t0 = this.ctx.currentTime + startAt;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = kind;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  found() {
    this.tone(660, 0, 0.12, 'sine', 0.18);
    this.tone(880, 0.09, 0.18, 'sine', 0.18);
  }

  wrong() {
    this.tone(160, 0, 0.22, 'sawtooth', 0.1);
  }

  hint() {
    this.tone(520, 0, 0.1, 'triangle', 0.12);
    this.tone(780, 0.08, 0.14, 'triangle', 0.12);
  }

  clear() {
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.11, 0.22, 'sine', 0.16));
  }

  victory() {
    [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, i * 0.13, 0.3, 'triangle', 0.15));
  }

  tick() {
    this.tone(980, 0, 0.05, 'square', 0.05);
  }
}
