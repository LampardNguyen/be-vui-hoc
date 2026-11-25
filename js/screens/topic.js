// Màn một chương: Con cần nhớ + Luyện tập + Trò chơi. Luyện 10 câu nhiều dạng bài (js/ui/kinds.js).
import { h, topBar, confetti, starsText, wait, leave } from '../ui/widgets.js';
import { numpad } from '../ui/numpad.js';
import { renderKind, picture } from '../ui/kinds.js';
import { state, save } from '../storage.js';
import { play } from '../sound.js';
import { TOPICS } from '../topics/index.js';
import { randomGameHash } from '../games/index.js';
import { isDev } from './dev.js';

const PRAISE = ['Giỏi quá!', 'Tuyệt vời!', 'Chính xác!', 'Siêu đỉnh!', 'Hay lắm!', 'Con thông minh quá!'];
const RUNNERS = ['🐰', '🐢', '🦊', '🐼', '🐥', '🦄'];
const QUESTIONS = 10;
const BACK = '#/subject/toan3';

export function topicStars(id) { return state.topics?.[id]?.best || 0; }

// Chương có nhiều phần (parts): mỗi phần một nút luyện riêng, sao lưu theo `<id>.<phần>`.

export function topicScreen(id) {
  const t = TOPICS[id];
  const act = (href, emoji, title, sub) =>
    h('a', { class: 'act-btn', href }, h('span', { class: 'act-emoji' }, emoji), h('b', {}, title), h('small', {}, sub));
  const ex = t.example?.();
  return h('div', { class: 'screen', style: '--c:#ff8c42' },
    topBar(`${t.emoji} ${t.title}`, BACK),
    h('div', { class: 'island-hero' },
      h('span', { class: 'hero-emoji' }, t.emoji),
      h('div', {},
        h('h2', {}, t.title),
        h('div', { class: 'stars big' }, starsText(topicStars(id))),
      ),
    ),
    h('div', { class: 'acts' },
      act(`#/quiz/${id}`, '🎯', t.parts ? 'Luyện trộn' : 'Luyện tập', t.parts ? '10 câu, trộn mọi phần' : '10 câu, nhiều kiểu bài'),
      act(`#/games/t-${id}`, '🎮', 'Trò chơi', 'Bóng bay, đua xe, ếch…'),
      isDev() ? act(`#/dev/${id}`, '🛠', 'Xem các dạng', 'Chế độ dev') : null,
    ),
    t.parts ? h('h2', { class: 'section-title' }, '🎯 Luyện từng phần') : null,
    t.parts ? h('div', { class: 'acts parts' }, t.parts.map((p) => act(`#/quiz/${id}.${p.id}`, p.emoji, p.title, starsText(topicStars(`${id}.${p.id}`))))) : null,
    h('h2', { class: 'section-title' }, '💡 Con cần nhớ'),
    h('ul', { class: 'tips' }, t.tips.map((s) => h('li', {}, s))),
    ex ? h('div', { class: 'tips example' }, h('b', {}, '👀 Ví dụ: '), ex.text, ex.svg ? picture(ex.svg) : null) : null,
  );
}

// Khung "Con cần nhớ" ở cuối màn luyện: bé thu gọn/mở, app nhớ lựa chọn; chưa chọn thì điện thoại thu gọn sẵn.
function tipsBox(tips) {
  if (!tips?.length) return null;
  const open = state.settings.tipsOpen ?? !matchMedia('(max-width: 640px)').matches;
  return h('details', { class: 'quiz-tips', open, ontoggle: (e) => { state.settings.tipsOpen = e.target.open; save(); } },
    h('summary', {}, '💡 Con cần nhớ'),
    h('ul', { class: 'tips' }, tips.map((s) => h('li', {}, s))),
  );
}

export function quizScreen(id) {
  const [base, partId] = id.split('.');
  const topic = TOPICS[base], part = topic?.parts?.find((p) => p.id === partId);
  if (!topic || (partId && !part)) { location.hash = BACK; return h('div'); }
  const t = part || topic;
  t.make.key = id;   // lưu túi dạng bài theo chương/phần
  const queue = Array.from({ length: QUESTIONS }, () => t.make());
  const retry = new Set();
  let i = 0, done = 0, firstTry = 0, streak = 0, best = 0, q, pad;
  const runner = RUNNERS[Math.floor(Math.random() * RUNNERS.length)];

  const bar = h('i');
  const runnerEl = h('span', { class: 'runner' }, runner);
  const counter = h('span', { class: 'counter' });
  const streakEl = h('span', { class: 'chip combo' });
  const prompt = h('div', { class: 'quiz-q' });
  const area = h('div', { class: 'quiz-area' });
  const feedback = h('div', { class: 'feedback' });
  const stage = h('div', { class: 'stage wide' }, prompt, area, feedback);
  const root = h('div', { class: 'screen practice', style: '--c:#ff8c42' },
    topBar(`${t.emoji} ${t.title}`, `#/topic/${base}`),
    h('div', { class: 'progress' }, h('span', { class: 'bar track' }, bar, runnerEl, h('span', { class: 'goal' }, '🏁')), counter),
    h('div', { class: 'hud' }, streakEl),
    stage,
    tipsBox(part?.tips || topic.tips),
  );

  // Mỗi câu chỉ có 1 bàn phím hoạt động (bàn phím cũ bị tắt để phím máy tính không gõ nhầm).
  const makePad = (opts) => { pad?.setEnabled(false); pad = numpad(opts); return pad; };

  const hud = () => {
    const r = done / QUESTIONS;
    bar.style.width = `${r * 100}%`;
    runnerEl.style.left = `calc(${r * 100}% - 14px)`;
    counter.textContent = `${Math.min(done + 1, QUESTIONS)}/${QUESTIONS}`;
    streakEl.textContent = streak >= 2 ? `🔥 ${streak} câu đúng liền!` : '';
  };

  function next() {
    pad?.setEnabled(false);
    if (i >= queue.length) return finish();
    q = queue[i];
    hud();
    feedback.replaceChildren();
    prompt.replaceChildren(h('p', {}, q.text), q.svg && q.kind !== 'pick' && q.kind !== 'paint' ? picture(q.svg) : '');
    prompt.classList.remove('pop-in'); void prompt.offsetWidth; prompt.classList.add('pop-in');
    area.replaceChildren(renderKind(q, check, makePad));
  }

  async function check(ok, info = {}) {
    const first = !retry.has(i);
    if (first) done++;
    area.querySelectorAll('.numpad, .center .btn-primary').forEach((el) => el.remove());
    if (q.tilt != null) prompt.querySelector('.beam')?.style.setProperty('transform', `rotate(${q.tilt * 8}deg)`);
    if (ok) {
      if (first) firstTry++;
      streak++;
      best = Math.max(best, streak);
      play(streak >= 3 ? 'fast' : 'good');
      if (streak % 5 === 0) confetti(20);
      feedback.replaceChildren(h('p', { class: 'ok' }, PRAISE[Math.floor(Math.random() * PRAISE.length)], streak >= 3 ? ' 🔥' : ' 👍'));
      i++;
      hud();
      await wait(1100);
      next();
      return;
    }
    // Sai: động viên, chỉ cách làm, thêm 1 câu cùng dạng ở cuối lượt (chỉ thêm 1 lần cho mỗi câu gốc).
    play('bad');
    streak = 0;
    if (first) { queue.push(t.make()); retry.add(queue.length - 1); }
    hud();
    feedback.replaceChildren(h('div', { class: 'oops' },
      h('p', {}, info.corrected ? 'Con đã tự sửa đúng rồi, giỏi lắm! 💪' : 'Chưa đúng rồi, mình cùng xem lại nhé!'),
      info.corrected ? null : h('p', { class: 'oops-eq' }, 'Đáp án đúng: ', h('b', {}, q.show ?? q.answer)),
      q.explain ? h('p', {}, '💡 ', q.explain) : null,
      h('button', { class: 'btn-primary', onclick: () => { i++; next(); } }, 'Tiếp tục 👉'),
    ));
    feedback.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }

  function finish() {
    const ratio = firstTry / QUESTIONS;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
    state.topics ||= {};
    const rec = state.topics[id] || { best: 0, played: 0 };
    state.topics[id] = { best: Math.max(rec.best, stars), played: rec.played + 1 };
    if (part) { const top = state.topics[base] || { best: 0, played: 0 }; state.topics[base] = { best: Math.max(top.best, stars), played: top.played + 1 }; }
    save();
    play('win');
    if (stars >= 2) confetti();
    bar.style.width = '100%';
    runnerEl.style.left = 'calc(100% - 14px)';
    counter.textContent = `${QUESTIONS}/${QUESTIONS}`;
    streakEl.textContent = '';
    stage.replaceChildren(h('div', { class: 'result' },
      h('div', { class: 'result-stars' }, starsText(stars)),
      h('h2', {}, `${runner} `, stars === 3 ? 'Xuất sắc! 🏆' : stars === 2 ? 'Làm tốt lắm! 🎉' : 'Con đã cố gắng rồi, luyện thêm sẽ giỏi hơn! 💪'),
      h('p', {}, 'Đúng ngay lần đầu: ', h('b', {}, `${firstTry}/${QUESTIONS}`)),
      h('p', {}, 'Chuỗi đúng dài nhất: ', h('b', {}, `🔥 ${best}`)),
      h('div', { class: 'result-actions' },
        h('a', { class: 'btn-primary', href: randomGameHash(`t-${base}`) }, '🎁 Chơi trò thưởng'),
        h('button', { class: 'btn-secondary', onclick: () => { leave(); root.replaceWith(quizScreen(id)); } }, '🔁 Luyện tiếp'),
        h('a', { class: 'btn-secondary', href: `#/topic/${base}` }, '⬅️ Quay về'),
      ),
    ));
  }

  next();
  return root;
}
