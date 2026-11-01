// Lặp lại ngắt quãng kiểu hộp Leitner: hộp 1 (chưa thuộc) → hộp 5 (thuộc làu).
// Hộp 0 = chưa từng làm. Phép nào ở hộp thấp sẽ được hỏi nhiều hơn.
import { state, markStudied } from './storage.js';
import { factsOf } from './facts.js';

export const FAST_MS = 3000;     // trả lời đúng dưới 3 giây = phản xạ tốt
const WEIGHT = [6, 9, 5, 3, 1.2, 0.5];

export function rec(id) {
  return state.facts[id] || { box: 0, seen: 0, right: 0, wrong: 0, ms: 0 };
}

export function isMastered(f) { return rec(f.id).box >= 4; }

export function answer(f, correct, ms) {
  const r = state.facts[f.id] ||= { box: 0, seen: 0, right: 0, wrong: 0, ms: 0 };
  r.seen++;
  if (correct) {
    r.right++;
    r.ms = r.ms ? Math.round(r.ms * 0.6 + ms * 0.4) : Math.round(ms);
    r.box = ms < FAST_MS ? Math.min(5, Math.max(1, r.box) + 1) : Math.max(1, r.box - 1);
  } else {
    r.wrong++;
    r.box = 1;
  }
  r.last = Date.now();
  markStudied(Math.min(ms, 15000));   // không tính thời gian bé bỏ đi chơi
}

// Chọn n câu theo trọng số, không lặp.
export function pick(pool, n) {
  const items = pool.map((f) => ({ f, w: WEIGHT[rec(f.id).box] }));
  const out = [];
  while (out.length < n && items.length) {
    let x = Math.random() * items.reduce((s, it) => s + it.w, 0);
    let i = 0;
    while (i < items.length - 1 && (x -= items[i].w) > 0) i++;
    out.push(items.splice(i, 1)[0].f);
  }
  return out;
}

// Phần trăm thuộc và số sao (0–3) của một bảng, tính cả nhân lẫn chia.
export function tableProgress(t) {
  const facts = factsOf(t);
  const ratio = facts.filter(isMastered).length / facts.length;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : ratio >= 0.3 ? 1 : 0;
  return { ratio, stars };
}

// Lấy bộ câu hỏi cho một chế độ: 'mix' | '3' | '3m' | '3d'
export function poolFor(key) {
  if (!key || key === 'mix') return factsOf(state.settings.tables.length ? state.settings.tables : [2, 3, 4, 5, 6, 7, 8, 9]);
  const t = parseInt(key, 10);
  const types = key.endsWith('m') ? 'm' : key.endsWith('d') ? 'd' : 'md';
  return factsOf(t, types);
}
