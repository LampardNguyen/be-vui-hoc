import { h, topBar, starsText } from '../ui/widgets.js';
import { TABLES, ISLANDS, factsOf } from '../facts.js';
import { tableProgress, isMastered } from '../leitner.js';
import { currentStreak } from '../storage.js';

export function homeScreen() {
  const progress = TABLES.map((t) => ({ t, ...tableProgress(t) }));
  const totalStars = progress.reduce((s, p) => s + p.stars, 0);
  const mastered = factsOf(TABLES).filter(isMastered).length;
  const streak = currentStreak();

  return h('div', { class: 'screen home' },
    h('header', { class: 'home-head' },
      h('h1', { class: 'logo' }, 'Bảng Cửu Chương ', h('span', {}, 'Vui')),
      h('div', { class: 'chips' },
        h('span', { class: 'chip' }, `🔥 ${streak} ngày`),
        h('span', { class: 'chip' }, `⭐ ${totalStars}/24`),
        h('span', { class: 'chip' }, `🧠 ${mastered}/160 phép`),
      ),
    ),
    h('div', { class: 'big-actions' },
      h('a', { class: 'big-btn btn-practice', href: '#/practice/mix' },
        h('span', { class: 'big-emoji' }, '🎯'), h('b', {}, 'Luyện hôm nay'), h('small', {}, '15 câu, khoảng 5 phút')),
      h('a', { class: 'big-btn btn-game', href: '#/balloon/mix' },
        h('span', { class: 'big-emoji' }, '🎈'), h('b', {}, 'Bắn bóng bay'), h('small', {}, 'Thử phản xạ siêu nhanh')),
    ),
    h('h2', { class: 'section-title' }, '🗺️ Chọn hòn đảo'),
    h('div', { class: 'islands' },
      progress.map(({ t, ratio, stars }, i) => h('a', {
        class: 'island',
        href: `#/table/${t}`,
        style: `--c:${ISLANDS[t].color};animation-delay:${i * 60}ms`,
      },
        h('span', { class: 'island-emoji' }, ISLANDS[t].emoji),
        h('b', {}, `Bảng ${t}`),
        h('span', { class: 'stars' }, starsText(stars)),
        h('span', { class: 'bar' }, h('i', { style: `width:${Math.round(ratio * 100)}%` })),
      )),
    ),
    h('footer', { class: 'home-foot' }, h('a', { href: '#/parent' }, '👨‍👩‍👧 Dành cho bố mẹ')),
  );
}

export function tableScreen(param) {
  const t = TABLES.includes(+param) ? +param : 2;
  const island = ISLANDS[t];
  const { ratio, stars } = tableProgress(t);

  const act = (href, emoji, title, sub) =>
    h('a', { class: 'act-btn', href }, h('span', { class: 'act-emoji' }, emoji), h('b', {}, title), h('small', {}, sub));

  return h('div', { class: 'screen', style: `--c:${island.color}` },
    topBar(island.name),
    h('div', { class: 'island-hero' },
      h('span', { class: 'hero-emoji' }, island.emoji),
      h('div', {},
        h('h2', {}, `Bảng ${t}`),
        h('div', { class: 'stars big' }, starsText(stars)),
        h('p', {}, `Đã thuộc ${Math.round(ratio * 100)}% — cần trả lời đúng & nhanh (dưới 3 giây) nhiều lần để thuộc làu.`),
      ),
    ),
    h('div', { class: 'acts' },
      act(`#/learn/${t}`, '📖', `Học bảng ${t}`, 'Xem, nghe và mẹo nhớ'),
      act(`#/practice/${t}m`, '✖️', 'Luyện nhân', `${t} × ? = ?`),
      act(`#/practice/${t}d`, '➗', 'Luyện chia', `? : ${t} = ?`),
      act(`#/balloon/${t}`, '🎈', 'Bắn bóng bay', `Nhân & chia bảng ${t}`),
    ),
  );
}
