// Đọc phép tính bằng giọng tiếng Việt có sẵn của máy.
import { state } from './storage.js';

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

// Máy không có giọng tiếng Việt (vd iPad iPadOS 15) → đọc bằng tiếng Anh.
const EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function numberToEnglish(n) {
  if (n < 20) return EN[n];
  if (n === 100) return 'one hundred';
  return EN_TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + EN[n % 10] : '');
}

export function factWords(f, withAnswer = true) {
  if (!voice) pickVoice();
  if (lang === 'en') {
    const op = f.type === 'm' ? 'times' : 'divided by';
    return `${numberToEnglish(f.a)} ${op} ${numberToEnglish(f.b)}${withAnswer ? ' equals ' + numberToEnglish(f.answer) : ''}`;
  }
  const op = f.type === 'm' ? 'nhân' : 'chia';
  return `${numberToWords(f.a)} ${op} ${numberToWords(f.b)}${withAnswer ? ' bằng ' + numberToWords(f.answer) : ''}`;
}

let voice = null;
let lang = 'vi';

function pickVoice() {
  if (!supported) return;
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return; // chưa tải xong danh sách giọng → giữ tiếng Việt
  voice = voices.find((v) => /^vi/i.test(v.lang)) || null;
  lang = voice ? 'vi' : 'en';
  if (!voice) voice = voices.find((v) => /^en[-_]US/i.test(v.lang)) || voices.find((v) => /^en/i.test(v.lang)) || null;
}

if (supported) {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

function utter(text, onstart) {
  // iPad thường trả danh sách giọng rỗng lúc tải trang → chọn lại khi đọc.
  if (!voice) pickVoice();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'en' ? 'en-US' : 'vi-VN';
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
