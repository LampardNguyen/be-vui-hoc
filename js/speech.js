// Đọc phép tính bằng giọng tiếng Việt có sẵn của máy.
import { state } from './storage.js';

const ONES = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

export function numberToWords(n) {
  if (n < 10) return ONES[n];
  if (n === 10) return 'mười';
  if (n === 100) return 'một trăm';
  if (n < 20) return 'mười ' + (n % 10 === 5 ? 'lăm' : ONES[n % 10]);
  const u = n % 10;
  const units = { 0: '', 1: ' mốt', 4: ' tư', 5: ' lăm' };
  return `${ONES[Math.floor(n / 10)]} mươi${u in units ? units[u] : ' ' + ONES[u]}`;
}

export function factWords(f, withAnswer = true) {
  const op = f.type === 'm' ? 'nhân' : 'chia';
  return `${numberToWords(f.a)} ${op} ${numberToWords(f.b)}${withAnswer ? ' bằng ' + numberToWords(f.answer) : ''}`;
}

const supported = 'speechSynthesis' in window;
let voice = null;

function pickVoice() {
  const voices = speechSynthesis.getVoices();
  voice = voices.find((v) => /^vi/i.test(v.lang)) || null;
}

if (supported) {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

function utter(text, onstart) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'vi-VN';
  if (voice) u.voice = voice;
  u.rate = 0.9;
  if (onstart) u.onstart = onstart;
  return u;
}

export function speak(text) {
  if (!supported || !state.settings.voice) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter(text));
}

export function sayFact(f, withAnswer = true) { speak(factWords(f, withAnswer)); }

// Đọc lần lượt nhiều câu; onEach(i) được gọi khi bắt đầu đọc câu thứ i.
export function speakList(texts, onEach) {
  if (!supported || !state.settings.voice) return;
  speechSynthesis.cancel();
  texts.forEach((t, i) => speechSynthesis.speak(utter(t, () => onEach?.(i))));
}

export function stopSpeaking() { if (supported) speechSynthesis.cancel(); }
