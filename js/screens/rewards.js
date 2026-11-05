// Bộ sưu tập: sticker nhận được khi đạt mốc và thú cưng lớn dần theo số phép đã thuộc.
import { h, topBar, confetti } from '../ui/widgets.js';
import { TABLES, ISLANDS, factsOf } from '../facts.js';
import { tableProgress, isMastered } from '../leitner.js';
import { state, save } from '../storage.js';
import { play } from '../sound.js';

const bestOf = (prefix) => Math.max(0, ...Object.entries(state.best)
  .filter(([k]) => k.startsWith(prefix)).map(([, v]) => v));
const masteredCount = () => factsOf(TABLES).filter(isMastered).length;
const answeredCount = () => Object.values(state.days).reduce((s, d) => s + d.answers, 0);
// Lượt luyện tập lưu với khóa không có dấu '-' (trò chơi thì có, ví dụ 'sprint-mix').
const practiceCount = () => Object.entries(state.played)
  .filter(([k]) => !k.includes('-')).reduce((s, [, v]) => s + v, 0);
const bestStreak = () => Math.max(state.streak.best || 0, state.streak.count || 0);

// Mỗi sticker: điều kiện đạt được tính từ dữ liệu sẵn có.
export const STICKERS = [
  { id: 'start', emoji: '🌱', name: 'Bước đầu tiên', how: 'Trả lời câu đầu tiên', ok: () => answeredCount() >= 1 },
  { id: 'answers100', emoji: '💪', name: 'Chăm chỉ', how: 'Trả lời 100 câu', ok: () => answeredCount() >= 100 },
  { id: 'answers500', emoji: '🦾', name: 'Siêu chăm chỉ', how: 'Trả lời 500 câu', ok: () => answeredCount() >= 500 },
  { id: 'streak3', emoji: '🔥', name: 'Lửa nhỏ', how: 'Học 3 ngày liên tiếp', ok: () => bestStreak() >= 3 },
  { id: 'streak7', emoji: '☄️', name: 'Lửa lớn', how: 'Học 7 ngày liên tiếp', ok: () => bestStreak() >= 7 },
  { id: 'practice', emoji: '🎯', name: 'Xạ thủ', how: 'Hoàn thành 5 lượt luyện tập', ok: () => practiceCount() >= 5 },
  { id: 'balloon', emoji: '🎈', name: 'Vua bóng bay', how: 'Bắn bóng bay đạt 150 điểm', ok: () => bestOf('balloon') >= 150 },
  { id: 'sprint', emoji: '⚡', name: 'Tia chớp', how: 'Đua 60 giây đúng 20 câu', ok: () => bestOf('sprint') >= 20 },
  { id: 'memory', emoji: '🧠', name: 'Trí nhớ siêu phàm', how: 'Lật thẻ đạt 150 điểm', ok: () => bestOf('memory') >= 150 },
  { id: 'boss', emoji: '🗡️', name: 'Dũng sĩ', how: 'Hạ một con quái vật', ok: () => bestOf('boss') >= 100 },
  { id: 'race', emoji: '🏁', name: 'Tay lái lụa', how: 'Đua xe ba làn đạt 200 điểm', ok: () => bestOf('race') >= 200 },
  { id: 'frog', emoji: '🪷', name: 'Ếch vô địch', how: 'Ếch nhảy lá sen đạt 200 điểm', ok: () => bestOf('frog') >= 200 },
  ...TABLES.map((t) => ({
    id: `table${t}`, emoji: ISLANDS[t].emoji, name: `Chủ ${ISLANDS[t].name}`, how: `Đạt 3 sao bảng ${t}`,
    ok: () => tableProgress(t).stars === 3,
  })),
  { id: 'master80', emoji: '🎓', name: 'Học giả', how: 'Thuộc 80 phép', ok: () => masteredCount() >= 80 },
  { id: 'master160', emoji: '👑', name: 'Vua Cửu Chương', how: 'Thuộc cả 160 phép', ok: () => masteredCount() >= 160 },
];

const PET_LEVELS = [
  { at: 0, emoji: '🥚', name: 'Quả trứng bí ẩn' },
  { at: 5, emoji: '🐣', name: 'Gà con mới nở' },
  { at: 20, emoji: '🐥', name: 'Gà con lon ton' },
  { at: 50, emoji: '🦜', name: 'Vẹt thông minh' },
  { at: 90, emoji: '🦚', name: 'Công rực rỡ' },
  { at: 130, emoji: '🦄', name: 'Kỳ lân phép thuật' },
  { at: 160, emoji: '🐉', name: 'Rồng thần Cửu Chương' },
];

export function pet() {
  const n = masteredCount();
  let i = 0;
  while (i + 1 < PET_LEVELS.length && n >= PET_LEVELS[i + 1].at) i++;
  const cur = PET_LEVELS[i], nxt = PET_LEVELS[i + 1];
  return { ...cur, level: i + 1, n, next: nxt, ratio: nxt ? (n - cur.at) / (nxt.at - cur.at) : 1 };
}

export function earnedStickers() { return STICKERS.filter((s) => s.ok()); }

// Sticker vừa đạt mà bé chưa xem; gọi xong sẽ đánh dấu là đã xem.
export function takeNewStickers() {
  const seen = new Set(state.seenStickers || []);
  const fresh = earnedStickers().filter((s) => !seen.has(s.id));
  if (fresh.length) {
    state.seenStickers = [...seen, ...fresh.map((s) => s.id)];
    save();
  }
  return fresh;
}

export function newStickerPopup(list) {
  play('win');
  confetti();
  const close = () => overlay.remove();
  const overlay = h('div', { class: 'overlay', onclick: close },
    h('div', { class: 'popup' },
      h('h2', {}, list.length > 1 ? `Con nhận được ${list.length} sticker mới!` : 'Con nhận được sticker mới!'),
      h('div', { class: 'popup-stickers' }, list.map((s) => h('div', { class: 'sticker got' },
        h('span', {}, s.emoji), h('b', {}, s.name)))),
      h('button', { class: 'btn-primary' }, 'Tuyệt quá! 🎉'),
    ));
  document.body.append(overlay);
}

export function rewardsScreen() {
  const p = pet();
  const got = new Set(earnedStickers().map((s) => s.id));
  return h('div', { class: 'screen' },
    topBar('🎁 Bộ sưu tập'),
    h('div', { class: 'pet-card' },
      h('span', { class: 'pet-emoji', onclick: (e) => { play('pop'); e.currentTarget.classList.remove('jump'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('jump'); } }, p.emoji),
      h('div', {},
        h('h2', {}, p.name),
        h('p', {}, `Cấp ${p.level} · đã thuộc ${p.n} phép`),
        p.next
          ? [h('span', { class: 'bar' }, h('i', { style: `width:${Math.round(p.ratio * 100)}%` })),
            h('small', {}, `Thuộc thêm ${p.next.at - p.n} phép để tiến hóa thành ${p.next.emoji}`)]
          : h('small', {}, 'Thú cưng đã tiến hóa tối đa! 🎉'),
      ),
    ),
    h('h2', { class: 'section-title' }, `Sticker (${got.size}/${STICKERS.length})`),
    h('div', { class: 'sticker-grid' }, STICKERS.map((s) => h('div', { class: 'sticker' + (got.has(s.id) ? ' got' : '') },
      h('span', {}, got.has(s.id) ? s.emoji : '🔒'),
      h('b', {}, s.name),
      h('small', {}, s.how)))),
  );
}
