type Tone = { freq: number; start: number; duration: number; type?: OscillatorType; gain?: number };

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function playTones(tones: Tone[]) {
  const audio = getContext();
  if (!audio) return;
  const now = audio.currentTime;
  for (const t of tones) {
    const osc = audio.createOscillator();
    const env = audio.createGain();
    osc.type = t.type ?? 'sine';
    osc.frequency.setValueAtTime(t.freq, now + t.start);
    env.gain.setValueAtTime(0, now + t.start);
    env.gain.linearRampToValueAtTime(t.gain ?? 0.2, now + t.start + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, now + t.start + t.duration);
    osc.connect(env).connect(audio.destination);
    osc.start(now + t.start);
    osc.stop(now + t.start + t.duration + 0.05);
  }
}

export function playTap() {
  playTones([{ freq: 660, start: 0, duration: 0.12, type: 'triangle', gain: 0.18 }]);
}

export function playCorrect() {
  playTones([
    { freq: 523.25, start: 0, duration: 0.18, type: 'triangle' },
    { freq: 659.25, start: 0.1, duration: 0.18, type: 'triangle' },
    { freq: 783.99, start: 0.2, duration: 0.3, type: 'triangle' },
  ]);
}

export function playWrong() {
  playTones([
    { freq: 220, start: 0, duration: 0.2, type: 'sawtooth', gain: 0.08 },
    { freq: 180, start: 0.15, duration: 0.25, type: 'sawtooth', gain: 0.08 },
  ]);
}

export function playCelebrate() {
  playTones([
    { freq: 523.25, start: 0, duration: 0.15, type: 'triangle' },
    { freq: 659.25, start: 0.12, duration: 0.15, type: 'triangle' },
    { freq: 783.99, start: 0.24, duration: 0.15, type: 'triangle' },
    { freq: 1046.5, start: 0.36, duration: 0.4, type: 'triangle' },
  ]);
}
