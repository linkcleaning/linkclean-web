// Web Audio API Synthesizer for Fun Cleaning Sound Effects
// Works without external audio files, instant response, cross-browser supported.

class CleaningAudioEngine {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    // 아이폰: 무음 스위치가 켜져 있어도 소리가 나도록 '재생' 모드로 지정 (Safari 16.4+)
    try {
      const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
      if (session && session.type !== 'playback') session.type = 'playback';
    } catch {
      /* 지원 안 하는 브라우저는 무시 */
    }

    // 홍보송(오디오 태그)을 재생/정지하고 나면 아이폰에서 기존 오디오 엔진이
    // 'interrupted' 또는 'closed' 상태로 멈춰 소리가 안 나는 문제가 있어 새로 만듭니다.
    const state = this.ctx?.state as string | undefined;
    if (!this.ctx || state === 'closed' || state === 'interrupted') {
      if (this.ctx && state !== 'closed') {
        try {
          this.ctx.close();
        } catch {
          /* 무시 */
        }
      }
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state !== 'running') {
      this.ctx.resume().catch(() => undefined);
    }
    return this.ctx;
  }

  /** 다른 소리(홍보송 등)가 재생/정지된 뒤 호출 — 다음 버튼 터치 때 오디오 엔진을 새로 만듭니다. */
  public reset(): void {
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        /* 무시 */
      }
      this.ctx = null;
    }
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

  // ───────── 디테일 사운드용 도우미 ─────────

  /** 흰 소음 / 갈색(낮은) 소음 버퍼 */
  private noiseBuf(ctx: AudioContext, duration: number, kind: 'white' | 'brown' = 'white'): AudioBuffer {
    const size = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const out = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < size; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === 'brown') {
        last = (last + 0.02 * w) / 1.02;
        out[i] = last * 3.5;
      } else {
        out[i] = w;
      }
    }
    return buffer;
  }

  /**
   * 포인트[시간(초), 값]로 만든 볼륨 곡선에 자연스러운 흔들림(난류)을 섞습니다.
   * 증기·물살이 일정하지 않고 "살아 있는" 느낌을 줍니다.
   */
  private jitterCurve(points: [number, number][], duration: number, jitter: number, steps = 320): Float32Array {
    const curve = new Float32Array(steps);
    let r = 0;
    for (let i = 0; i < steps; i++) {
      const t = (i / (steps - 1)) * duration;
      let v = points[points.length - 1][1];
      for (let k = 0; k < points.length - 1; k++) {
        const [t0, v0] = points[k];
        const [t1, v1] = points[k + 1];
        if (t >= t0 && t <= t1) {
          v = v0 + ((v1 - v0) * (t - t0)) / Math.max(1e-4, t1 - t0);
          break;
        }
      }
      r = r * 0.8 + (Math.random() * 2 - 1) * 0.2;
      curve[i] = Math.max(0.0001, v * (1 + jitter * r * 2.2));
    }
    curve[steps - 1] = 0.0001;
    return curve;
  }

  /** 짧은 소음 "톡/탁" (클릭, 물방울 튐, 플라스틱 소리) */
  private noiseTick(ctx: AudioContext, at: number, freq: number, q: number, len: number, vol: number, dest: AudioNode): void {
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf(ctx, len + 0.01);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(freq, at);
    bp.Q.setValueAtTime(q, at);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    src.connect(bp);
    bp.connect(g);
    g.connect(dest);
    src.start(at);
    src.stop(at + len + 0.01);
  }

  /** 물방울(기포) 소리 — 음이 짧게 올라가는 "뽀록" */
  private bubble(ctx: AudioContext, at: number, f0: number, len: number, vol: number, dest: AudioNode): void {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f0, at);
    osc.frequency.exponentialRampToValueAtTime(f0 * (1.5 + Math.random() * 0.8), at + len);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    osc.connect(g);
    g.connect(dest);
    osc.start(at);
    osc.stop(at + len + 0.01);
  }

  /** 짧은 저음 "쿵/툭" */
  private thump(ctx: AudioContext, at: number, f0: number, f1: number, len: number, vol: number, dest: AudioNode): void {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f0, at);
    osc.frequency.exponentialRampToValueAtTime(f1, at + len);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    osc.connect(g);
    g.connect(dest);
    osc.start(at);
    osc.stop(at + len + 0.01);
  }

  /** 전체 음량을 모으는 마스터(살짝 압축해서 찢어지는 소리 방지) */
  private master(ctx: AudioContext, vol: number): GainNode {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 10;
    comp.ratio.value = 4;
    comp.attack.value = 0.003;
    comp.release.value = 0.2;
    const g = ctx.createGain();
    g.gain.value = vol;
    g.connect(comp);
    comp.connect(ctx.destination);
    return g;
  }

  /**
   * 1. 고온 스팀기 소리 ("딸깍- 치이이익~ 쏴아아! 퓨슉")
   * 방아쇠 클릭 → 펌프 진동 → 고압 증기 분사(첫 터짐) → 흔들리는 증기 소리 + 물방울 튀는 소리 → 꺼지며 남는 "퓨슉"
   */
  public playSteamSound(): void {
    try {
      const ctx = this.getAudioContext();
      const t = ctx.currentTime + 0.02;
      const D = 2.3; // 분사 시간
      const out = this.master(ctx, 1.0);

      // ① 방아쇠 "딸깍"
      this.noiseTick(ctx, t, 3200, 1.2, 0.025, 0.35, out);
      this.thump(ctx, t, 260, 90, 0.05, 0.12, out);

      // ② 펌프 진동 "드르르" (스팀기 내부 펌프의 낮은 떨림)
      const pump = ctx.createOscillator();
      pump.type = 'sawtooth';
      pump.frequency.setValueAtTime(52, t + 0.04);
      const pumpAm = ctx.createOscillator(); // 펌프 맥동
      pumpAm.frequency.setValueAtTime(9, t);
      const pumpAmGain = ctx.createGain();
      pumpAmGain.gain.value = 0.02;
      const pumpLp = ctx.createBiquadFilter();
      pumpLp.type = 'lowpass';
      pumpLp.frequency.value = 220;
      const pumpGain = ctx.createGain();
      pumpGain.gain.setValueAtTime(0.0001, t);
      pumpGain.gain.linearRampToValueAtTime(0.045, t + 0.12);
      pumpGain.gain.setValueAtTime(0.04, t + D - 0.3);
      pumpGain.gain.exponentialRampToValueAtTime(0.0001, t + D + 0.1);
      pumpAm.connect(pumpAmGain);
      pumpAmGain.connect(pumpGain.gain);
      pump.connect(pumpLp);
      pumpLp.connect(pumpGain);
      pumpGain.connect(out);
      pump.start(t + 0.04);
      pumpAm.start(t);
      pump.stop(t + D + 0.15);
      pumpAm.stop(t + D + 0.15);

      // ③ 증기 분사 본체 "치이이익~" (높은 쉭 소리, 흔들림 포함)
      const hiss = ctx.createBufferSource();
      hiss.buffer = this.noiseBuf(ctx, D + 0.6);
      const hissHp = ctx.createBiquadFilter();
      hissHp.type = 'highpass';
      hissHp.frequency.value = 1800;
      const hissBp = ctx.createBiquadFilter();
      hissBp.type = 'bandpass';
      hissBp.Q.value = 0.7;
      hissBp.frequency.setValueAtTime(3000, t + 0.05);
      hissBp.frequency.exponentialRampToValueAtTime(6200, t + 0.18); // 첫 분사 압력
      hissBp.frequency.exponentialRampToValueAtTime(4600, t + 0.6);
      hissBp.frequency.linearRampToValueAtTime(5000, t + D - 0.4);
      hissBp.frequency.exponentialRampToValueAtTime(2600, t + D + 0.5);
      // 증기 흔들림 (좌우로 뿜어지는 느낌)
      const wobble = ctx.createOscillator();
      wobble.frequency.value = 5.5;
      const wobbleGain = ctx.createGain();
      wobbleGain.gain.value = 450;
      wobble.connect(wobbleGain);
      wobbleGain.connect(hissBp.frequency);
      const hissGain = ctx.createGain();
      hissGain.gain.setValueCurveAtTime(
        this.jitterCurve(
          [
            [0, 0.0001],
            [0.06, 0.05],
            [0.14, 0.42], // "칙!" 첫 터짐
            [0.35, 0.24],
            [1.2, 0.22],
            [D - 0.3, 0.2],
            [D, 0.08], // 방아쇠 놓음
            [D + 0.5, 0.0001],
          ],
          D + 0.5,
          0.18
        ),
        t + 0.04,
        D + 0.5
      );
      hiss.connect(hissHp);
      hissHp.connect(hissBp);
      hissBp.connect(hissGain);
      hissGain.connect(out);
      hiss.start(t + 0.04);
      wobble.start(t);
      hiss.stop(t + D + 0.6);
      wobble.stop(t + D + 0.6);

      // ④ 공기 밀려나는 낮은 "쏴아" (증기 바람)
      const air = ctx.createBufferSource();
      air.buffer = this.noiseBuf(ctx, D + 0.4, 'brown');
      const airLp = ctx.createBiquadFilter();
      airLp.type = 'lowpass';
      airLp.frequency.setValueAtTime(500, t);
      airLp.frequency.linearRampToValueAtTime(900, t + 0.3);
      airLp.frequency.linearRampToValueAtTime(600, t + D);
      const airGain = ctx.createGain();
      airGain.gain.setValueCurveAtTime(
        this.jitterCurve([[0, 0.0001], [0.15, 0.16], [D - 0.3, 0.12], [D + 0.3, 0.0001]], D + 0.3, 0.25),
        t + 0.06,
        D + 0.3
      );
      air.connect(airLp);
      airLp.connect(airGain);
      airGain.connect(out);
      air.start(t + 0.06);
      air.stop(t + D + 0.4);

      // ⑤ 뜨거운 물방울 튀는 "타닥" (스팀 노즐에서 튀는 물)
      const spits = 16;
      for (let i = 0; i < spits; i++) {
        const at = t + 0.2 + Math.random() * (D - 0.3);
        this.noiseTick(ctx, at, 1400 + Math.random() * 2600, 3 + Math.random() * 4, 0.008 + Math.random() * 0.018, 0.05 + Math.random() * 0.12, out);
      }

      // ⑥ 꺼질 때 남은 압력이 빠지는 "퓨슉"
      const end = t + D + 0.05;
      this.noiseTick(ctx, end, 2200, 1.5, 0.12, 0.12, out);
      this.thump(ctx, end, 140, 60, 0.08, 0.06, out);
      this.noiseTick(ctx, end + 0.18, 4200, 2, 0.05, 0.04, out);
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
      motorGain.gain.linearRampToValueAtTime(0.1, now + 0.2);
      motorGain.gain.setValueAtTime(0.1, now + 1.1);
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
      noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.25);
      noiseGain.gain.setValueAtTime(0.1, now + 1.1);
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
      this.triggerSqueakStroke(ctx, now, 1100, 1600, 0.18, 0.12);
      // 2nd stroke "싹" (Return rub)
      this.triggerSqueakStroke(ctx, now + 0.28, 1400, 1000, 0.18, 0.12);
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
    gain.gain.linearRampToValueAtTime(0.14, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.16);
  }

  /**
   * 4. 화장실 물내리는 소리 ("철컥! 쿠웅- 콸콸콸~ 꾸르륵 슈우욱… 쪼르르")
   * 레버 → 배수 밸브 열림 → 물이 쏟아지며 소용돌이 → 기포 → 사이펀 "꾸르륵" 빨려가는 소리 → 물탱크 다시 차는 소리
   */
  public playToiletFlushSound(): void {
    try {
      const ctx = this.getAudioContext();
      const t = ctx.currentTime + 0.02;
      const out = this.master(ctx, 1.0);

      // ① 레버 "철컥" (플라스틱 + 금속 체인)
      this.noiseTick(ctx, t, 2600, 2, 0.03, 0.4, out);
      this.thump(ctx, t, 220, 70, 0.07, 0.18, out);
      [1250, 1870, 2930].forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.value = f;
        const g = ctx.createGain();
        const at = t + 0.055;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.05 / (i + 1), at + 0.003);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
        o.connect(g);
        g.connect(out);
        o.start(at);
        o.stop(at + 0.08);
      });
      this.noiseTick(ctx, t + 0.06, 4000, 3, 0.02, 0.15, out);

      // ② 배수 밸브 열리는 "쿠웅"
      this.thump(ctx, t + 0.13, 95, 42, 0.22, 0.32, out);

      // ③ 물 쏟아지는 본체 "콸콸콸~" (낮은 물살 + 소용돌이)
      const D = 2.9;
      const s = t + 0.15;
      const water = ctx.createBufferSource();
      water.buffer = this.noiseBuf(ctx, D + 0.2, 'brown');
      const waterLp = ctx.createBiquadFilter();
      waterLp.type = 'lowpass';
      waterLp.Q.value = 3;
      waterLp.frequency.setValueAtTime(260, s);
      waterLp.frequency.exponentialRampToValueAtTime(1500, s + 0.35);
      waterLp.frequency.exponentialRampToValueAtTime(900, s + 1.4);
      waterLp.frequency.exponentialRampToValueAtTime(420, s + 2.3);
      waterLp.frequency.exponentialRampToValueAtTime(180, s + D);
      const swirl = ctx.createOscillator(); // 소용돌이 회전
      swirl.frequency.setValueAtTime(3, s);
      swirl.frequency.linearRampToValueAtTime(6.5, s + D);
      const swirlDepth = ctx.createGain();
      swirlDepth.gain.value = 260;
      swirl.connect(swirlDepth);
      swirlDepth.connect(waterLp.frequency);
      const waterGain = ctx.createGain();
      waterGain.gain.setValueCurveAtTime(
        this.jitterCurve(
          [
            [0, 0.0001],
            [0.12, 0.3],
            [0.4, 0.36],
            [1.5, 0.28],
            [2.3, 0.2],
            [D, 0.0001],
          ],
          D,
          0.22
        ),
        s,
        D
      );
      water.connect(waterLp);
      waterLp.connect(waterGain);
      waterGain.connect(out);
      water.start(s);
      swirl.start(s);
      water.stop(s + D + 0.1);
      swirl.stop(s + D + 0.1);

      // ④ 물 튀고 부딪히는 "샤아아" (중간 높이 물살)
      const splash = ctx.createBufferSource();
      splash.buffer = this.noiseBuf(ctx, 2.4);
      const splashBp = ctx.createBiquadFilter();
      splashBp.type = 'bandpass';
      splashBp.Q.value = 0.9;
      splashBp.frequency.setValueAtTime(1300, s);
      splashBp.frequency.linearRampToValueAtTime(2200, s + 0.5);
      splashBp.frequency.linearRampToValueAtTime(1100, s + 2.3);
      const splashLfo = ctx.createOscillator();
      splashLfo.frequency.value = 7;
      const splashLfoGain = ctx.createGain();
      splashLfoGain.gain.value = 500;
      splashLfo.connect(splashLfoGain);
      splashLfoGain.connect(splashBp.frequency);
      const splashGain = ctx.createGain();
      splashGain.gain.setValueCurveAtTime(
        this.jitterCurve([[0, 0.0001], [0.15, 0.11], [0.8, 0.08], [1.8, 0.05], [2.3, 0.0001]], 2.3, 0.35),
        s + 0.02,
        2.3
      );
      splash.connect(splashBp);
      splashBp.connect(splashGain);
      splashGain.connect(out);
      splash.start(s + 0.02);
      splashLfo.start(s);
      splash.stop(s + 2.4);
      splashLfo.stop(s + 2.4);

      // ⑤ 소용돌이 속 기포 "뽀록뽀록"
      for (let i = 0; i < 46; i++) {
        const at = s + 0.25 + Math.pow(Math.random(), 0.8) * 2.2;
        this.bubble(ctx, at, 260 + Math.random() * 620, 0.03 + Math.random() * 0.06, 0.03 + Math.random() * 0.06, out);
      }

      // ⑥ 사이펀으로 빨려 내려가는 "꾸르륵~ 슈우욱"
      const g0 = s + 2.05;
      for (let i = 0; i < 7; i++) {
        const at = g0 + i * (0.07 + Math.random() * 0.05);
        this.bubble(ctx, at, 110 + Math.random() * 140, 0.08 + Math.random() * 0.06, 0.14 + Math.random() * 0.06, out);
      }
      const suck = ctx.createBufferSource();
      suck.buffer = this.noiseBuf(ctx, 0.7);
      const suckBp = ctx.createBiquadFilter();
      suckBp.type = 'bandpass';
      suckBp.Q.value = 2.5;
      suckBp.frequency.setValueAtTime(500, g0 + 0.35);
      suckBp.frequency.exponentialRampToValueAtTime(1900, g0 + 0.85);
      const suckGain = ctx.createGain();
      suckGain.gain.setValueAtTime(0.0001, g0 + 0.35);
      suckGain.gain.exponentialRampToValueAtTime(0.13, g0 + 0.6);
      suckGain.gain.exponentialRampToValueAtTime(0.0001, g0 + 0.95);
      suck.connect(suckBp);
      suckBp.connect(suckGain);
      suckGain.connect(out);
      suck.start(g0 + 0.35);
      suck.stop(g0 + 1.0);

      // ⑦ 물탱크 다시 차는 "쪼르르… 쉬이" (작게 이어지다 사라짐)
      const r0 = s + 2.5;
      const refill = ctx.createBufferSource();
      refill.buffer = this.noiseBuf(ctx, 1.6);
      const refillHp = ctx.createBiquadFilter();
      refillHp.type = 'highpass';
      refillHp.frequency.value = 2800;
      const refillGain = ctx.createGain();
      refillGain.gain.setValueCurveAtTime(
        this.jitterCurve([[0, 0.0001], [0.3, 0.035], [1.1, 0.03], [1.5, 0.0001]], 1.5, 0.3),
        r0,
        1.5
      );
      refill.connect(refillHp);
      refillHp.connect(refillGain);
      refillGain.connect(out);
      refill.start(r0);
      refill.stop(r0 + 1.6);
      for (let i = 0; i < 12; i++) {
        this.bubble(ctx, r0 + 0.1 + Math.random() * 1.2, 900 + Math.random() * 900, 0.025 + Math.random() * 0.03, 0.015 + Math.random() * 0.02, out);
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

export const cleaningAudio = new CleaningAudioEngine();
