/**
 * Web Audio Ambient Sound Generator
 * Generates natural calming soundscapes directly in the browser with zero external network audio files.
 */

type SoundscapeType = 'rain' | 'forest_wind' | 'singing_bowl' | 'binaural' | 'none';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentType: SoundscapeType = 'none';
  private gainNode: GainNode | null = null;
  private volume: number = 0.5;
  private isMuted: boolean = false;
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private isRunning: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      const target = this.isMuted ? 0 : this.volume * 0.4;
      this.gainNode.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getCurrentType(): SoundscapeType {
    return this.currentType;
  }

  public isPlaying(): boolean {
    return this.isRunning && this.currentType !== 'none';
  }

  public stop() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore disconnect errors
      }
    });
    this.activeNodes = [];
    this.currentType = 'none';
    this.isRunning = false;
  }

  public play(type: SoundscapeType) {
    this.initContext();
    if (!this.ctx) return;

    if (this.currentType === type && this.isRunning) {
      return;
    }

    this.stop();

    if (type === 'none') {
      return;
    }

    this.currentType = type;
    this.isRunning = true;

    // Master soundscape gain
    this.gainNode = this.ctx.createGain();
    const effectiveVol = this.isMuted ? 0 : this.volume * 0.4;
    this.gainNode.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    switch (type) {
      case 'rain':
        this.startRainSound();
        break;
      case 'forest_wind':
        this.startWindSound();
        break;
      case 'singing_bowl':
        this.startSingingBowlSound();
        break;
      case 'binaural':
        this.startBinauralSound();
        break;
    }
  }

  private startRainSound() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink noise generation
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to simulate soft raindrops
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(180, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(highpass);
    highpass.connect(this.gainNode);

    noise.start();
    this.activeNodes.push(noise, filter, highpass);
  }

  private startWindSound() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    // LFO for breathing wind movement
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.gainNode);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter, lfo, lfoGain);
  }

  private startSingingBowlSound() {
    if (!this.ctx || !this.gainNode) return;

    // Harmonic frequencies of a warm brass singing bowl
    const freqs = [216, 432, 648, 864];
    const gains = [0.4, 0.25, 0.12, 0.06];

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (idx === 1 ? 0.8 : 0), this.ctx.currentTime); // gentle beating

      oscGain.gain.setValueAtTime(gains[idx] * 0.7, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.gainNode);

      osc.start();
      this.activeNodes.push(osc, oscGain);
    });
  }

  private startBinauralSound() {
    if (!this.ctx || !this.gainNode) return;

    // Theta frequency (approx 4.5Hz difference for deep focus / meditation)
    const baseFreq = 174; // Solfeggio soothing frequency
    const beatFreq = 4.5;

    const oscL = this.ctx.createOscillator();
    const oscR = this.ctx.createOscillator();
    const merger = this.ctx.createChannelMerger(2);

    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(baseFreq + beatFreq, this.ctx.currentTime);

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(baseFreq / 2, this.ctx.currentTime);
    subGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    subOsc.connect(subGain);
    subGain.connect(this.gainNode);

    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    merger.connect(this.gainNode);

    oscL.start();
    oscR.start();
    subOsc.start();
    this.activeNodes.push(oscL, oscR, subOsc, subGain, merger);
  }

  /**
   * Play a clean bell/chime tone when a routine task is checked off or routine completes
   */
  public playChime(freq = 528) {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.3 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch {
      // ignore
    }
  }

  public playCompleteCelebration() {
    [528, 660, 792, 1056].forEach((f, i) => {
      setTimeout(() => {
        this.playChime(f);
      }, i * 160);
    });
  }
}

export const audioEngine = new SoundEngine();
