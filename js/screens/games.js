// Màn hình chọn trò chơi: chọn một trò hoặc để máy chọn ngẫu nhiên.
import { h, topBar, go } from '../ui/widgets.js';
import { GAMES, randomGame } from '../games/index.js';
import { ISLANDS } from '../facts.js';
import { state } from '../storage.js';
import { play } from '../sound.js';

export function gamesScreen(key = 'mix') {
  const t = parseInt(key, 10);
  const isTable = key !== 'mix' && ISLANDS[t];
  const back = isTable ? `#/table/${t}` : '#/';
  const title = isTable ? `🎮 Trò chơi bảng ${t}` : '🎮 Trò chơi';

  const dice = h('button', {
    class: 'dice-btn',
    onclick: () => {
      play('pop');
      dice.classList.add('rolling');
      setTimeout(() => go(`#/${randomGame().id}/${key}`), 600);
    },
  }, h('span', { class: 'dice' }, '🎲'), h('b', {}, 'Chọn ngẫu nhiên'), h('small', {}, 'Để máy chọn giúp con!'));

  return h('div', { class: 'screen' },
    topBar(title, back),
    dice,
    h('div', { class: 'game-grid' }, GAMES.map((g, i) => {
      const best = state.best[`${g.id}-${key}`];
      return h('a', {
        class: 'game-card',
        href: `#/${g.id}/${key}`,
        style: `--c:${g.color};animation-delay:${i * 70}ms`,
      },
        h('span', { class: 'game-emoji' }, g.emoji),
        h('b', {}, g.name),
        h('small', {}, g.desc),
        best ? h('span', { class: 'chip best' }, `🏆 ${best}`) : null,
      );
    })),
  );
}
