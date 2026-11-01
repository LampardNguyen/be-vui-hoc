// Phần dùng chung cho các trò chơi: đường quay về, lưu kỷ lục, màn hình kết quả.
import { h, leave } from '../ui/widgets.js';
import { randomGameHash } from './index.js';
import { state, save } from '../storage.js';

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
