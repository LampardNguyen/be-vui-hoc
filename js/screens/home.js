import { h, topBar, starsText } from '../ui/widgets.js';
import { TABLES, ISLANDS, factsOf } from '../facts.js';
import { tableProgress, isMastered } from '../leitner.js';
import { currentStreak } from '../storage.js';
import { GRADES, findSubject } from '../curriculum.js';
import { topicStars } from './topic.js';
import { pet, earnedStickers, STICKERS, takeNewStickers, newStickerPopup } from './rewards.js';

// Chạm chữ "Bé Vui Học" 3 lần liền → xoá bản offline và tải lại bản mới nhất.
let taps = [];

async function refreshApp() {
  if (!confirm('Tải lại bản mới nhất của app?')) return;
  try {
    const regs = await navigator.serviceWorker?.getRegistrations() || [];
    await Promise.all(regs.map((r) => r.unregister()));
    const keys = await caches?.keys() || [];
    await Promise.all(keys.map((k) => caches.delete(k)));
  } catch {}
  location.reload();
}

function logoTap() {
  const now = Date.now();
  taps = [...taps.filter((t) => now - t < 1500), now];
  if (taps.length >= 3) { taps = []; refreshApp(); }
}

// Tỉ lệ thuộc bảng cửu chương (0–1), dùng làm tiến độ môn Toán khi mới có 1 chương.
function cuuChuongRatio() {
  return factsOf(TABLES).filter(isMastered).length / factsOf(TABLES).length;
}

function soonToast() {
  const t = h('div', { class: 'toast' }, '🌱 Sắp có rồi, con chờ nhé!');
  document.body.append(t);
  setTimeout(() => t.remove(), 1800);
}

// Trang chủ: chọn lớp → môn học.
export function homeScreen() {
  const grade = GRADES[0];
  const totalStars = TABLES.reduce((s, t) => s + tableProgress(t).stars, 0);
  const myPet = pet();
  const fresh = takeNewStickers();
  if (fresh.length) setTimeout(() => newStickerPopup(fresh), 500);

  return h('div', { class: 'screen home' },
    h('header', { class: 'home-head' },
      h('h1', { class: 'logo', onclick: logoTap }, 'Bé ', h('span', {}, 'Vui'), ' Học'),
      h('div', { class: 'chips' },
        h('span', { class: 'chip' }, `🔥 ${currentStreak()} ngày`),
        h('span', { class: 'chip' }, `⭐ ${totalStars}`),
      ),
    ),
    h('a', { class: 'pet-strip', href: '#/rewards' },
      h('span', { class: 'pet-emoji small' }, myPet.emoji),
      h('span', { class: 'pet-info' }, h('b', {}, myPet.name),
        h('span', { class: 'bar' }, h('i', { style: `width:${Math.round(myPet.ratio * 100)}%` }))),
      h('span', { class: 'chip' }, `🎁 ${earnedStickers().length}/${STICKERS.length}`),
    ),
    h('div', { class: 'grade-tabs' },
      GRADES.map((g) => h('span', { class: `grade-tab${g === grade ? ' on' : ''}` }, `🎒 ${g.name}`)),
    ),
    h('h2', { class: 'section-title' }, '📚 Chọn môn học'),
    h('div', { class: 'subject-grid' },
      grade.subjects.map((s, i) => {
        const ready = s.groups.some((g) => g.topics.some((t) => t.href));
        return h('a', {
          class: `subject-card${ready ? '' : ' locked'}`,
          href: ready ? `#/subject/${s.id}` : undefined,
          onclick: ready ? undefined : soonToast,
          style: `--c:${s.color};animation-delay:${i * 80}ms`,
        },
          h('span', { class: 'subject-emoji' }, s.emoji),
          h('b', {}, s.name),
          ready
            ? h('span', { class: 'bar' }, h('i', { style: `width:${Math.round(cuuChuongRatio() * 100)}%` }))
            : h('small', {}, '🔒 Sắp có'),
        );
      }),
    ),
    h('footer', { class: 'home-foot' }, h('a', { href: '#/parent' }, '👨‍👩‍👧 Dành cho bố mẹ')),
  );
}

// Màn môn học: các chương chia theo nhóm.
export function subjectScreen(param) {
  const found = findSubject(param);
  if (!found || !found.subject.groups.length) { location.hash = '#/'; return h('div'); }
  const { grade, subject } = found;
  const progressOf = (t) => (t.id === 'cuu-chuong'
    ? h('span', { class: 'bar' }, h('i', { style: `width:${Math.round(cuuChuongRatio() * 100)}%` }))
    : h('span', { class: 'stars' }, starsText(topicStars(t.id))));

  return h('div', { class: 'screen', style: `--c:${subject.color}` },
    topBar(`${subject.emoji} ${subject.name} ${grade.name.toLowerCase()}`),
    subject.groups.flatMap((g) => [
      h('h2', { class: 'section-title' }, g.name),
      h('div', { class: 'topic-grid' },
        g.topics.map((t) => h('a', {
          class: `topic-card${t.href ? '' : ' locked'}`,
          href: t.href,
          onclick: t.href ? undefined : soonToast,
        },
          h('span', { class: 'topic-emoji' }, t.emoji),
          h('span', { class: 'topic-info' },
            h('b', {}, t.name),
            t.href ? progressOf(t) : h('small', {}, '🔒 Sắp có'),
          ),
        )),
      ),
    ]),
  );
}

export function cuuChuongScreen() {
  const progress = TABLES.map((t) => ({ t, ...tableProgress(t) }));
  const totalStars = progress.reduce((s, p) => s + p.stars, 0);
  const mastered = factsOf(TABLES).filter(isMastered).length;
  const streak = currentStreak();

  return h('div', { class: 'screen home' },
    topBar('✖️ Bảng cửu chương', '#/subject/toan3'),
    h('header', { class: 'home-head' },
      h('div', { class: 'chips' },
        h('span', { class: 'chip' }, `🔥 ${streak} ngày`),
        h('span', { class: 'chip' }, `⭐ ${totalStars}/24`),
        h('span', { class: 'chip' }, `🧠 ${mastered}/160 phép`),
      ),
    ),
    h('div', { class: 'big-actions' },
      h('a', { class: 'big-btn btn-practice', href: '#/practice/mix' },
        h('span', { class: 'big-emoji' }, '🎯'), h('b', {}, 'Luyện hôm nay'), h('small', {}, '15 câu, khoảng 5 phút')),
      h('a', { class: 'big-btn btn-game', href: '#/games/mix' },
        h('span', { class: 'big-emoji' }, '🎮'), h('b', {}, 'Trò chơi'), h('small', {}, '4 trò rèn phản xạ')),
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
  );
}

export function tableScreen(param) {
  const t = TABLES.includes(+param) ? +param : 2;
  const island = ISLANDS[t];
  const { ratio, stars } = tableProgress(t);

  const act = (href, emoji, title, sub) =>
    h('a', { class: 'act-btn', href }, h('span', { class: 'act-emoji' }, emoji), h('b', {}, title), h('small', {}, sub));

  return h('div', { class: 'screen', style: `--c:${island.color}` },
    topBar(island.name, '#/topic/cuu-chuong'),
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
      act(`#/games/${t}`, '🎮', 'Trò chơi', `Chọn trò hoặc 🎲 ngẫu nhiên`),
    ),
  );
}
