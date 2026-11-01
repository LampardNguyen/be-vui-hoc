// Trò Đua 60 giây: trả lời đúng càng nhiều càng tốt trong 1 phút, có chuỗi combo.
import { h, topBar, confetti, wait, onLeave } from '../ui/widgets.js';
import { numpad } from '../ui/numpad.js';
import { pick, poolFor, answer } from '../leitner.js';
import { play } from '../sound.js';
import { backFor, saveBest, gameResult } from './common.js';

const SECONDS = 60;

export function sprintScreen(key = 'mix') {
  const pool = poolFor(key);
  let queue = [], q, start, score = 0, combo = 0, maxCombo = 0, wrong = 0, endAt = 0, timer, running = false;

  const scoreEl = h('span', { class: 'chip' });
  const comboEl = h('span', { class: 'chip combo' });
  const timeBar = h('i');
  const timeText = h('span', { class: 'counter' });
  const answerBox = h('span', { class: 'answer-box' });
  const question = h('div', { class: 'question' });
  const pad = numpad({ onChange: (v) => { answerBox.textContent = v || '?'; }, onSubmit: submit });
  const stage = h('div', { class: 'stage' });
  const root = h('div', { class: 'screen practice' },
    topBar('⏱️ Đua 60 giây', backFor(key)),
    h('div', { class: 'hud' }, scoreEl, comboEl),
    h('div', { class: 'progress' }, h('span', { class: 'bar time' }, timeBar), timeText),
    stage,
  );

  const hud = () => {
    scoreEl.textContent = `✅ ${score}`;
    comboEl.textContent = combo >= 3 ? `🔥 x${combo}` : '';
  };

  function intro() {
    pad.setEnabled(false);
    const n = h('div', { class: 'countdown' }, 'Sẵn sàng?');
    stage.replaceChildren(n);
    hud();
    timeText.textContent = `${SECONDS}s`;
    timeBar.style.width = '100%';
    (async () => {
      for (const s of ['3', '2', '1', 'Bắt đầu!']) {
        await wait(s === '3' ? 600 : 750);
        n.textContent = s;
        n.classList.remove('pop-in'); void n.offsetWidth; n.classList.add('pop-in');
        play(s.length > 1 ? 'fast' : 'tap');
      }
      await wait(500);
      begin();
    })();
  }

  function begin() {
    stage.replaceChildren(question, pad.el);
    running = true;
    endAt = performance.now() + SECONDS * 1000;
    timer = setInterval(tickTime, 100);
    next();
  }

  function tickTime() {
    const left = Math.max(0, endAt - performance.now());
    timeBar.style.width = `${(left / (SECONDS * 1000)) * 100}%`;
    timeText.textContent = `${Math.ceil(left / 1000)}s`;
    timeBar.parentElement.classList.toggle('hurry', left < 10000);
    if (left <= 0) finish();
  }

  function next() {
    if (!queue.length) queue = pick(pool, 30);
    q = queue.shift();
    answerBox.className = 'answer-box';
    answerBox.textContent = '?';
    question.replaceChildren(h('span', {}, `${q.text} = `), answerBox);
    pad.clear();
    pad.setEnabled(true);
    start = performance.now();
  }

  async function submit(v) {
    if (!running) return;
    const ms = performance.now() - start;
    const correct = +v === q.answer;
    answer(q, correct, ms);
    pad.setEnabled(false);
    if (correct) {
      score++; combo++; maxCombo = Math.max(maxCombo, combo);
      play(combo >= 3 ? 'fast' : 'good');
      answerBox.classList.add('right');
      hud();
      await wait(180);
    } else {
      wrong++; combo = 0;
      play('bad');
      answerBox.classList.add('wrong');
      answerBox.textContent = q.answer;   // cho bé thấy ngay đáp án đúng
      answerBox.style.textDecoration = 'none';
      hud();
      queue.splice(2, 0, q);
      await wait(1100);
    }
    if (running) next();
  }

  function finish() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    pad.setEnabled(false);
    const { best, record } = saveBest('sprint', key, score);
    play('win');
    if (record || score >= 15) confetti();
    stage.replaceChildren(gameResult({
      icon: score >= 25 ? '🚀' : score >= 15 ? '🏃' : '🐢',
      title: record ? `Kỷ lục mới: ${score} câu! 🏆` : `Con trả lời đúng ${score} câu!`,
      lines: [['Chuỗi đúng dài nhất', `🔥 ${maxCombo}`], ['Câu sai', wrong], ['Kỷ lục của con', Math.max(best, score)]],
      root, replay: () => sprintScreen(key), gameId: 'sprint', key,
    }));
  }

  onLeave(() => { running = false; clearInterval(timer); });
  intro();
  return root;
}
