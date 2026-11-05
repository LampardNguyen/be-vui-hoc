// Phần dùng chung cho các trò chơi: đường quay về, lưu kỷ lục, màn hình kết quả.
import { h, leave } from '../ui/widgets.js';
import { randomGameHash } from './index.js';
import { state, save } from '../storage.js';
import { play } from '../sound.js';

// Độ khó trò chơi do bố mẹ chọn: 'easy' | 'normal' | 'hard'.
export function level() {
  return state.settings.level || 'normal';
}

export function backFor(key) {
  return `#/games/${key}`;
}

// Lưu lượt chơi, trả về kỷ lục cũ và có phá kỷ lục không.
export function saveBest(gameId, key, score) {
  const k = `${gameId}-${key}`;
  const best = state.best[k] || 0;
  if (score > best) state.best[k] = score;
  state.played[k] = (state.played[k] || 0) + 1;
  save();
  return { best, record: score > best };
}

// root: màn hình hiện tại; replay: hàm dựng lại màn hình trò chơi.
export function gameResult({ icon, title, lines = [], root, replay, gameId, key }) {
  return h('div', { class: 'result' },
    h('div', { class: 'result-stars' }, icon),
    h('h2', {}, title),
    lines.map(([label, value]) => h('p', {}, `${label}: `, h('b', {}, value))),
    h('div', { class: 'result-actions' },
      h('button', { class: 'btn-primary', onclick: () => { leave(); root.replaceWith(replay()); } }, '🔁 Chơi lại'),
      h('a', { class: 'btn-secondary', href: randomGameHash(key, gameId) }, '🎲 Trò khác'),
      h('a', { class: 'btn-secondary', href: backFor(key) }, '⬅️ Quay về'),
    ),
  );
}

// Hộp quà bất ngờ: cứ 5–7 câu có 1 hộp quà gắn trên đáp án đúng, trả lời đúng mới nhận được.
const GIFTS = [
  { id: 'slow', emoji: '🐢', name: 'Chậm lại', desc: '5 câu tới chạy chậm như lúc mới chơi!' },
  { id: 'shield', emoji: '🛡️', name: 'Khiên bảo vệ', desc: 'Lần sai tới không mất tim!' },
  { id: 'heart', emoji: '❤️', name: 'Thêm tim', desc: 'Con được thêm 1 trái tim!' },
  { id: 'double', emoji: '⭐', name: 'Nhân đôi điểm', desc: '5 câu tới được gấp đôi điểm!' },
];

// Bảng thông báo nhỏ giữa khung chơi, tự biến mất.
export function giftPop(box, emoji, title, desc, ms = 1500) {
  const el = h('div', { class: 'gift-pop' }, h('div', { class: 'gift-emoji' }, '✨ ', emoji, ' ✨'), h('b', {}, title), desc ? h('p', {}, desc) : null);
  box.append(el);
  setTimeout(() => el.remove(), ms);
}

export function giftBag() {
  const bag = { slow: 0, shield: false, double: 0, gap: 0 };
  const reset = () => { bag.gap = 5 + Math.floor(Math.random() * 3); };
  reset();
  // Gọi khi bắt đầu câu mới: câu này có quà không, có đang được chạy chậm không.
  bag.start = () => {
    const gift = --bag.gap <= 0;
    if (gift) reset();
    const slow = bag.slow > 0;
    if (slow) bag.slow--;
    return { gift, slow };
  };
  // Điểm của câu đúng (gấp đôi khi đang có quà ⭐).
  bag.points = (p) => {
    if (bag.double <= 0) return p;
    bag.double--;
    return p * 2;
  };
  // Khi trả lời sai: true nếu khiên đỡ được (không mất tim).
  bag.hit = () => {
    if (!bag.shield) return false;
    bag.shield = false;
    return true;
  };
  // Mở quà: chọn ngẫu nhiên (chỉ tặng tim khi đang thiếu tim), trả về id quà để trò chơi xử lý tim.
  bag.open = (box, lives, maxLives) => {
    const list = GIFTS.filter((g) => g.id !== 'heart' || lives < maxLives);
    const g = list[Math.floor(Math.random() * list.length)];
    if (g.id === 'slow') bag.slow = 5;
    if (g.id === 'shield') bag.shield = true;
    if (g.id === 'double') bag.double = 5;
    play('win');
    giftPop(box, g.emoji, `Con nhận được: ${g.name}`, g.desc);
    return g.id;
  };
  bag.chips = () => [bag.slow && `🐢 ${bag.slow}`, bag.double && `⭐x2 ${bag.double}`, bag.shield && '🛡️'].filter(Boolean).join(' ');
  return bag;
}
