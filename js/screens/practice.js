import { h, topBar, dotArray, confetti, starsText, wait, leave } from '../ui/widgets.js';
import { shuffle, pickOne } from '../topics/util.js';
import { pick, poolFor, answer, FAST_MS } from '../leitner.js';
import { state, save } from '../storage.js';
import { sayFact } from '../speech.js';
import { play } from '../sound.js';
import { randomGameHash } from '../games/index.js';

const PRAISE = ['Giỏi quá!', 'Tuyệt vời!', 'Chính xác!', 'Siêu đỉnh!', 'Hay lắm!'];
const QUESTIONS = 15;

function titleFor(key) {
  if (key === 'mix') return '🎯 Luyện hôm nay';
  const t = parseInt(key, 10);
  return key.endsWith('m') ? `✖️ Luyện nhân ${t}` : key.endsWith('d') ? `➗ Luyện chia ${t}` : `Luyện bảng ${t}`;
}

// 3 đáp án nhiễu dễ nhầm: lệch một hàng trong bảng (nhân) hoặc thương lân cận (chia), không âm, không trùng.
function distractors(q) {
  const near = q.type === 'm' ? [q.answer - q.a, q.answer + q.a, q.answer - 1, q.answer + 1] : [q.answer - 1, q.answer + 1, q.answer + 2, q.answer - 2];
  const set = new Set(shuffle(near).filter((v) => v > 0 && v !== q.answer));
  while (set.size < 3) set.add(q.answer + pickOne([1, 2, 3, 4, 5]) * set.size + set.size);
  return [...set].slice(0, 3);
}

export function practiceScreen(key = 'mix') {
  const back = key === 'mix' ? '#/topic/cuu-chuong' : `#/table/${parseInt(key, 10)}`;
  const queue = pick(poolFor(key), QUESTIONS);
  const total = queue.length;
  const wrongOnce = new Set();
  const retries = {};
  let i = 0, done = 0, firstTry = 0, fast = 0, start = 0, q;

  const bar = h('i');
  const counter = h('span', { class: 'counter' });
  const question = h('div', { class: 'question' });
  const answerBox = h('span', { class: 'answer-box' });
  const feedback = h('div', { class: 'feedback' });
  const pad = h('div', { class: 'choices practice-choices' });

  const stage = h('div', { class: 'stage' }, question, feedback, pad);
  const root = h('div', { class: 'screen practice' },
    topBar(titleFor(key), back),
    h('div', { class: 'progress' }, h('span', { class: 'bar' }, bar), counter),
    stage,
  );

  function next() {
    if (i >= queue.length) return finish();
    q = queue[i];
    counter.textContent = `${Math.min(done + 1, total)}/${total}`;
    bar.style.width = `${(done / total) * 100}%`;
    answerBox.className = 'answer-box';
    answerBox.textContent = '?';
    question.replaceChildren(h('span', {}, `${q.text} = `), answerBox);
    question.classList.remove('pop-in'); void question.offsetWidth; question.classList.add('pop-in');
    feedback.replaceChildren();
    pad.replaceChildren(...shuffle([q.answer, ...distractors(q)]).map((v) =>
      h('button', { class: 'choice', onclick: (e) => submit(v, e.currentTarget) }, v)));
    start = performance.now();
  }

  async function submit(v, btn) {
    const ms = performance.now() - start;
    const correct = v === q.answer;
    pad.querySelectorAll('.choice').forEach((b) => {
      b.disabled = true;
      if (+b.textContent === q.answer) b.classList.add('right');
    });
    if (!correct) btn.classList.add('wrong');
    answerBox.textContent = q.answer;
    answer(q, correct, ms);

    if (correct) {
      const isFast = ms < FAST_MS;
      if (!wrongOnce.has(q.id)) { firstTry++; done++; }
      if (isFast) fast++;
      play(isFast ? 'fast' : 'good');
      answerBox.classList.add('right');
      feedback.replaceChildren(h('p', { class: 'ok' },
        PRAISE[Math.floor(Math.random() * PRAISE.length)], isFast ? ' ⚡ Siêu nhanh!' : ' 👍'));
      i++;
      await wait(isFast ? 650 : 900);
      next();
      return;
    }

    // Sai: cho bé xem lại bằng hình rồi hỏi lại phép này sau vài câu.
    play('bad');
    if (!wrongOnce.has(q.id)) { wrongOnce.add(q.id); done++; }
    retries[q.id] = (retries[q.id] || 0) + 1;
    if (retries[q.id] <= 2) queue.splice(Math.min(i + 3, queue.length), 0, q);
    answerBox.classList.add('wrong');
    pad.replaceChildren();   // Ẩn nút lựa chọn để bé tập trung xem lại hình.
    sayFact(q);
    feedback.replaceChildren(h('div', { class: 'oops' },
      h('p', {}, 'Chưa đúng rồi, mình cùng xem lại nhé!'),
      h('p', { class: 'oops-eq' }, `${q.text} = `, h('b', {}, q.answer)),
      dotArray(q),
      h('button', { class: 'btn-primary', onclick: () => { i++; next(); } }, 'Hiểu rồi 👍'),
    ));
  }

  function finish() {
    const ratio = total ? firstTry / total : 0;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
    state.played[key] = (state.played[key] || 0) + 1;
    save();
    play('win');
    if (stars >= 2) confetti();
    bar.style.width = '100%';
    stage.replaceChildren(h('div', { class: 'result' },
      h('div', { class: 'result-stars' }, starsText(stars)),
      h('h2', {}, stars === 3 ? 'Xuất sắc! 🏆' : stars === 2 ? 'Làm tốt lắm! 🎉' : 'Cố lên, lần sau sẽ giỏi hơn! 💪'),
      h('p', {}, `Đúng ngay lần đầu: `, h('b', {}, `${firstTry}/${total}`)),
      h('p', {}, `Trả lời siêu nhanh ⚡: `, h('b', {}, fast)),
      h('div', { class: 'result-actions' },
        h('a', { class: 'btn-primary', href: randomGameHash(key) }, '🎁 Chơi trò thưởng'),
        h('button', { class: 'btn-secondary', onclick: () => { leave(); root.replaceWith(practiceScreen(key)); } }, '🔁 Luyện tiếp'),
        h('a', { class: 'btn-secondary', href: back }, '🗺️ Quay về'),
      ),
    ));
  }

  next();
  return root;
}
