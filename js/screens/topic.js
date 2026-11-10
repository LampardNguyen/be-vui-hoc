// Màn một chương: Kiến thức + mẹo, rồi luyện 10 câu (chọn đáp án hoặc bàn phím số).
import { h, topBar, confetti, starsText, wait, leave } from '../ui/widgets.js';
import { numpad } from '../ui/numpad.js';
import { state, save } from '../storage.js';
import { play } from '../sound.js';
import { TOPICS } from '../topics/index.js';

const PRAISE = ['Giỏi quá!', 'Tuyệt vời!', 'Chính xác!', 'Siêu đỉnh!', 'Hay lắm!'];
const QUESTIONS = 10;
const BACK = '#/subject/toan3';

export function topicStars(id) { return state.topics?.[id]?.best || 0; }

// Hình vẽ SVG do chính app tạo (không có dữ liệu người dùng) nên gán innerHTML an toàn.
function picture(svgText) {
  const el = h('div', { class: 'topic-pic' });
  el.innerHTML = svgText;
  return el;
}

export function topicScreen(id) {
  const t = TOPICS[id];
  return h('div', { class: 'screen', style: '--c:#ff8c42' },
    topBar(`${t.emoji} ${t.title}`, BACK),
    h('div', { class: 'island-hero' },
      h('span', { class: 'hero-emoji' }, t.emoji),
      h('div', {},
        h('h2', {}, t.title),
        h('div', { class: 'stars big' }, starsText(topicStars(id))),
      ),
    ),
    h('h2', { class: 'section-title' }, '💡 Con cần nhớ'),
    h('ul', { class: 'tips' }, t.tips.map((s) => h('li', {}, s))),
    h('div', { class: 'acts' },
      h('a', { class: 'act-btn', href: `#/quiz/${id}` },
        h('span', { class: 'act-emoji' }, '🎯'), h('b', {}, 'Luyện 10 câu'), h('small', {}, 'Sai thì xem lại rồi làm tiếp')),
    ),
  );
}

export function quizScreen(id) {
  const t = TOPICS[id];
  if (!t) { location.hash = BACK; return h('div'); }
  const queue = Array.from({ length: QUESTIONS }, () => t.make());
  const retried = new Set();
  let i = 0, done = 0, firstTry = 0, q;

  const bar = h('i');
  const counter = h('span', { class: 'counter' });
  const prompt = h('div', { class: 'quiz-q' });
  const area = h('div', { class: 'quiz-area' });
  const feedback = h('div', { class: 'feedback' });
  const stage = h('div', { class: 'stage' }, prompt, area, feedback);
  const root = h('div', { class: 'screen practice', style: '--c:#ff8c42' },
    topBar(`${t.emoji} ${t.title}`, `#/topic/${id}`),
    h('div', { class: 'progress' }, h('span', { class: 'bar' }, bar), counter),
    stage,
  );

  // Bàn phím số tạo 1 lần, dùng lại cho mọi câu nhập số.
  const box = h('span', { class: 'answer-box' }, '?');
  const pad = numpad({ max: 4, onChange: (v) => { box.textContent = v || '?'; }, onSubmit: (v) => check(v) });
  pad.setEnabled(false);

  function next() {
    if (i >= queue.length) return finish();
    q = queue[i];
    counter.textContent = `${Math.min(done + 1, QUESTIONS)}/${QUESTIONS}`;
    bar.style.width = `${(done / QUESTIONS) * 100}%`;
    feedback.replaceChildren();
    prompt.replaceChildren(h('p', {}, q.text), ...(q.svg ? [picture(q.svg)] : []));
    prompt.classList.remove('pop-in'); void prompt.offsetWidth; prompt.classList.add('pop-in');
    if (q.choices) {
      area.replaceChildren(h('div', { class: `quiz-choices n${q.choices.length}` },
        q.choices.map((c) => h('button', { class: 'quiz-choice', onclick: (e) => check(c, e.currentTarget) }, c))));
    } else {
      box.className = 'answer-box';
      pad.clear();
      pad.setEnabled(true);
      area.replaceChildren(h('div', { class: 'quiz-answer' }, 'Đáp án: ', box), pad.el);
    }
  }

  async function check(v, btn) {
    if (area.classList.contains('locked')) return;
    area.classList.add('locked');
    pad.setEnabled(false);
    const correct = String(v) === q.answer;
    const mark = (cls) => (btn ? btn.classList.add(cls) : box.classList.add(cls));

    if (correct) {
      if (!retried.has(i)) firstTry++;
      done += retried.has(i) ? 0 : 1;
      play('good');
      mark('right');
      feedback.replaceChildren(h('p', { class: 'ok' }, PRAISE[Math.floor(Math.random() * PRAISE.length)], ' 👍'));
      i++;
      await wait(900);
      area.classList.remove('locked');
      next();
      return;
    }

    // Sai: động viên, chỉ đáp án đúng + cách làm, rồi hỏi 1 câu cùng dạng ở cuối lượt.
    play('bad');
    mark('wrong');
    if (!retried.has(i)) { done++; queue.push(t.make()); retried.add(queue.length - 1); }
    feedback.replaceChildren(h('div', { class: 'oops' },
      h('p', {}, 'Chưa đúng rồi, mình cùng xem lại nhé!'),
      h('p', { class: 'oops-eq' }, 'Đáp án đúng: ', h('b', {}, q.answer)),
      h('p', {}, '💡 ', q.explain),
      h('button', { class: 'btn-primary', onclick: () => { area.classList.remove('locked'); i++; next(); } }, 'Hiểu rồi 👍'),
    ));
  }

  function finish() {
    const ratio = firstTry / QUESTIONS;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
    state.topics ||= {};
    const rec = state.topics[id] || { best: 0, played: 0 };
    state.topics[id] = { best: Math.max(rec.best, stars), played: rec.played + 1 };
    save();
    play('win');
    if (stars >= 2) confetti();
    bar.style.width = '100%';
    counter.textContent = `${QUESTIONS}/${QUESTIONS}`;
    stage.replaceChildren(h('div', { class: 'result' },
      h('div', { class: 'result-stars' }, starsText(stars)),
      h('h2', {}, stars === 3 ? 'Xuất sắc! 🏆' : stars === 2 ? 'Làm tốt lắm! 🎉' : 'Con đã cố gắng rồi, luyện thêm sẽ giỏi hơn! 💪'),
      h('p', {}, 'Đúng ngay lần đầu: ', h('b', {}, `${firstTry}/${QUESTIONS}`)),
      h('div', { class: 'result-actions' },
        h('button', { class: 'btn-primary', onclick: () => { leave(); root.replaceWith(quizScreen(id)); } }, '🔁 Luyện tiếp'),
        h('a', { class: 'btn-secondary', href: BACK }, '📚 Chọn bài khác'),
      ),
    ));
  }

  next();
  return root;
}
