// Web Audio API Synthesizer for Fun Cleaning Sound Effects
// Works without external audio files, instant response, cross-browser supported.

class CleaningAudioEngine {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Helper: Create a noise buffer (white noise)
  private createNoiseBuffer(duration: number): AudioBuffer {
    const ctx = this.getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Helper: Create a pink/brownish noise buffer for heavy water or air rush
  private createHeavyNoiseBuffer(duration: number): AudioBuffer {
    const ctx = this.getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // boost
    }
    return buffer;
  }

  /**
   * 1. 고온 스팀기 소리 ("치이이익~ 쏴아아!")
   * 고압 증기가 시원하게 뿜어져 나오는 치익- 소리
   */
  public playSteamSound(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const duration = 1.3;

      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(duration);

      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(2400, now);
      bpf.frequency.exponentialRampToValueAtTime(3600, now + 0.2);
      bpf.frequency.exponentialRampToValueAtTime(2000, now + duration);
      bpf.Q.setValueAtTime(2.5, now);

      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.setValueAtTime(1400, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.08);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(bpf);
      bpf.connect(hpf);
      hpf.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * 2. 강력 청소기 소리 ("위이이잉~ 흡입 중!")
   * 모터가 회전하면서 흡입하는 특유의 진공청소기 사운드
   */
  public playVacuumSound(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const duration = 1.6;

      // Motor Oscillator 1
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(90, now);
      osc1.frequency.exponentialRampToValueAtTime(210, now + 0.3);
      osc1.frequency.setValueAtTime(210, now + 1.2);
      osc1.frequency.exponentialRampToValueAtTime(60, now + duration);

      // Motor Oscillator 2 (Detuned for rich motor hum)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(93, now);
      osc2.frequency.exponentialRampToValueAtTime(215, now + 0.3);
      osc2.frequency.setValueAtTime(215, now + 1.2);
      osc2.frequency.exponentialRampToValueAtTime(62, now + duration);

      const motorFilter = ctx.createBiquadFilter();
      motorFilter.type = 'lowpass';
      motorFilter.frequency.setValueAtTime(450, now);
      motorFilter.Q.setValueAtTime(3.0, now);

      const motorGain = ctx.createGain();
      motorGain.gain.setValueAtTime(0.01, now);
      motorGain.gain.linearRampToValueAtTime(0.2, now + 0.2);
      motorGain.gain.setValueAtTime(0.2, now + 1.1);
      motorGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(motorFilter);
      osc2.connect(motorFilter);
      motorFilter.connect(motorGain);
      motorGain.connect(ctx.destination);

      // Suction Air Noise
      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(duration);

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(700, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
      noiseFilter.frequency.setValueAtTime(1200, now + 1.1);
      noiseFilter.frequency.exponentialRampToValueAtTime(400, now + duration);
      noiseFilter.Q.setValueAtTime(1.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.25, now + 0.25);
      noiseGain.gain.setValueAtTime(0.22, now + 1.1);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      noise.start(now);

      osc1.stop(now + duration);
      osc2.stop(now + duration);
      noise.stop(now + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * 3. 바닥 닦는 소리 ("쓱싹쓱싹~ 뽀드득!")
   * 고무 스퀴지와 극세사 걸레로 바닥을 문지를 때 나는 경쾌한 마찰음과 뽀드득 소리
   */
  public playFloorWipeSound(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // 1st stroke "쓱" (Friction noise + quick chirp)
      this.triggerSqueakStroke(ctx, now, 1100, 1600, 0.18, 0.22);
      // 2nd stroke "싹" (Return rub)
      this.triggerSqueakStroke(ctx, now + 0.28, 1400, 1000, 0.18, 0.22);
      // 3rd squeak "뽀드득!" (High pitch polished clean squeak)
      this.triggerHighCleanSqueak(ctx, now + 0.58);
      this.triggerHighCleanSqueak(ctx, now + 0.78);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  private triggerSqueakStroke(
    ctx: AudioContext,
    startTime: number,
    startFreq: number,
    endFreq: number,
    duration: number,
    vol: number
  ): void {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private triggerHighCleanSqueak(ctx: AudioContext, startTime: number): void {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, startTime);
    osc.frequency.exponentialRampToValueAtTime(2600, startTime + 0.06);
    osc.frequency.exponentialRampToValueAtTime(2100, startTime + 0.14);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.28, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.16);
  }

  /**
   * 4. 화장실 물내리는 소리 ("철컥! 콸콸콸~ 샤아아아!")
   * 레버를 딸깍 내린 후 소용돌이치며 시원하게 내려가는 물소리
   */
  public playToiletFlushSound(): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const duration = 1.9;

      // Lever "Click" sound
      const clickOsc = ctx.createOscillator();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(320, now);
      clickOsc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.3, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.06);

      // Deep rushing water swirl (Heavy noise buffer)
      const waterNoise = ctx.createBufferSource();
      waterNoise.buffer = this.createHeavyNoiseBuffer(duration);

      const waterFilter = ctx.createBiquadFilter();
      waterFilter.type = 'lowpass';
      waterFilter.frequency.setValueAtTime(250, now + 0.05);
      waterFilter.frequency.exponentialRampToValueAtTime(900, now + 0.4);
      waterFilter.frequency.exponentialRampToValueAtTime(350, now + 1.2);
      waterFilter.frequency.exponentialRampToValueAtTime(150, now + duration);
      waterFilter.Q.setValueAtTime(4.0, now);

      const waterGain = ctx.createGain();
      waterGain.gain.setValueAtTime(0.01, now);
      waterGain.gain.linearRampToValueAtTime(0.4, now + 0.25);
      waterGain.gain.setValueAtTime(0.35, now + 1.0);
      waterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      waterNoise.connect(waterFilter);
      waterFilter.connect(waterGain);
      waterGain.connect(ctx.destination);

      // High splashing / swirl resonance
      const splashNoise = ctx.createBufferSource();
      splashNoise.buffer = this.createNoiseBuffer(duration);

      const splashFilter = ctx.createBiquadFilter();
      splashFilter.type = 'bandpass';
      splashFilter.frequency.setValueAtTime(1200, now + 0.1);
      splashFilter.frequency.exponentialRampToValueAtTime(1800, now + 0.6);
      splashFilter.frequency.exponentialRampToValueAtTime(800, now + duration);
      splashFilter.Q.setValueAtTime(2.0, now);

      const splashGain = ctx.createGain();
      splashGain.gain.setValueAtTime(0.001, now);
      splashGain.gain.linearRampToValueAtTime(0.18, now + 0.3);
      splashGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      splashNoise.connect(splashFilter);
      splashFilter.connect(splashGain);
      splashGain.connect(ctx.destination);

      waterNoise.start(now + 0.04);
      waterNoise.stop(now + duration);
      splashNoise.start(now + 0.04);
      splashNoise.stop(now + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

export const cleaningAudio = new CleaningAudioEngine();
