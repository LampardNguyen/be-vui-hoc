// Hiệu ứng âm thanh tạo trực tiếp bằng Web Audio, không cần file.
import { state } from './storage.js';

let ctx;

function tone(freq, at, dur, type = 'sine', vol = 0.2) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, at);
  g.gain.exponentialRampToValueAtTime(0.001, at + dur);
  o.connect(g).connect(ctx.destination);
  o.start(at);
  o.stop(at + dur + 0.02);
}

export function play(name) {
  if (!state.settings.sound) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch { return; }
  const t = ctx.currentTime;
  switch (name) {
    case 'good': tone(660, t, 0.12); tone(990, t + 0.1, 0.2); break;
    case 'fast': tone(660, t, 0.1); tone(880, t + 0.08, 0.1); tone(1320, t + 0.16, 0.22); break;
    case 'bad': tone(240, t, 0.25, 'triangle', 0.15); tone(190, t + 0.15, 0.3, 'triangle', 0.15); break;
    case 'pop': tone(1100, t, 0.07, 'square', 0.06); break;
    case 'tap': tone(520, t, 0.04, 'sine', 0.06); break;
    case 'win': [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, t + i * 0.11, 0.25)); break;
  }
}
