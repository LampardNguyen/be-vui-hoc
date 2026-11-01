// Đọc phép tính bằng giọng tiếng Việt có sẵn của máy.
import { state } from './storage.js';
import { audioCtx } from './sound.js';

const ONES = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

const supported = 'speechSynthesis' in window;

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

let voice = null;

function pickVoice() {
  if (!supported) return;
  voice = speechSynthesis.getVoices().find((v) => /^vi/i.test(v.lang)) || null;
}

if (supported) {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

function utter(text, onstart) {
  // iPad thường trả danh sách giọng rỗng lúc tải trang → chọn lại khi đọc.
  if (!voice) pickVoice();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'vi-VN';
  if (voice) u.voice = voice;
  u.rate = 0.9;
  if (onstart) u.onstart = onstart;
  return u;
}

// Máy không có giọng tiếng Việt (vd iPad iPadOS 15) → ghép file ghi sẵn giọng Linh trong audio/vi/
// (tạo trên Mac bằng `say -v Linh`): mỗi số 0–100 một file, cộng "nhân", "chia", "bằng".
function useClips() {
  if (!voice) pickVoice();
  return !voice;
}

const clips = {};
let playId = 0;
let sources = [];
let timers = [];

// Cắt khoảng lặng hai đầu file để ghép từ liền mạch hơn.
function trim(buf) {
  const d = buf.getChannelData(0);
  let a = 0, b = d.length - 1;
  while (a < b && Math.abs(d[a]) < 0.01) a++;
  while (b > a && Math.abs(d[b]) < 0.01) b--;
  const pad = Math.floor(buf.sampleRate * 0.03);
  a = Math.max(0, a - pad);
  b = Math.min(d.length - 1, b + pad);
  const out = audioCtx().createBuffer(1, b - a + 1, buf.sampleRate);
  out.copyToChannel(d.subarray(a, b + 1), 0);
  return out;
}

function clip(key) {
  return clips[key] ||= fetch(`audio/vi/${key}.m4a`)
    .then((r) => r.arrayBuffer())
    .then((data) => new Promise((ok, fail) => audioCtx().decodeAudioData(data, ok, fail)))
    .then(trim);
}

function factKeys(f, withAnswer = true) {
  const keys = [f.a, f.type === 'm' ? 'nhan' : 'chia', f.b];
  return withAnswer ? [...keys, 'bang', f.answer] : keys;
}

function stopClips() {
  playId++;
  sources.forEach((s) => { try { s.stop(); } catch {} });
  timers.forEach(clearTimeout);
  sources = [];
  timers = [];
}

// Đọc lần lượt các câu (mỗi câu là danh sách khóa file); onEach(i) khi bắt đầu câu thứ i.
async function playClips(list, onEach) {
  stopClips();
  const id = playId;
  const ctx = audioCtx(); // gọi ngay trong lúc chạm để iPad cho phát tiếng
  let bufs;
  try { bufs = await Promise.all(list.map((keys) => Promise.all(keys.map(clip)))); } catch { return; }
  if (id !== playId) return;
  let t = ctx.currentTime + 0.05;
  bufs.forEach((words, i) => {
    if (onEach) timers.push(setTimeout(() => onEach(i), (t - ctx.currentTime) * 1000));
    words.forEach((buf) => {
      const s = ctx.createBufferSource();
      s.buffer = buf;
      s.connect(ctx.destination);
      s.start(t);
      sources.push(s);
      t += buf.duration + 0.04;
    });
    t += 0.6;
  });
}

export function speak(text) {
  if (!supported || !state.settings.voice) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter(text));
}

export function sayFact(f, withAnswer = true) {
  if (!state.settings.voice) return;
  if (useClips()) playClips([factKeys(f, withAnswer)]);
  else speak(factWords(f, withAnswer));
}

// Đọc lần lượt nhiều phép tính; onEach(i) được gọi khi bắt đầu đọc phép thứ i.
export function speakFacts(fs, onEach) {
  if (!state.settings.voice) return;
  if (useClips()) return playClips(fs.map((f) => factKeys(f)), onEach);
  if (!supported) return;
  speechSynthesis.cancel();
  fs.forEach((f, i) => speechSynthesis.speak(utter(factWords(f), () => onEach?.(i))));
}

export function stopSpeaking() {
  stopClips();
  if (supported) speechSynthesis.cancel();
}
