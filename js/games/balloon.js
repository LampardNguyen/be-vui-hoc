// Trò Bắn bóng bay: bóng mang đáp án bay lên, chạm đúng quả có kết quả đúng trước khi nó bay mất.
import { h, topBar, confetti, wait, onLeave } from '../ui/widgets.js';
import { pick, poolFor, answer } from '../leitner.js';
import { distractors, shuffle } from '../facts.js';
import { play } from '../sound.js';
import { backFor, saveBest, gameResult, level } from './common.js';

const COLORS = ['#ef476f', '#ffd166', '#06d6a0', '#4cc9f0', '#c77dff', '#f8961e'];

export function balloonScreen(key = 'mix') {
  // Độ khó: số mạng và thời gian bóng bay hết màn hình ở vòng đầu (giây).
  const { LIVES, SLOW } = { easy: { LIVES: 5, SLOW: 12 }, normal: { LIVES: 3, SLOW: 8 }, hard: { LIVES: 3, SLOW: 4 } }[level()];
  const pool = poolFor(key);
  let queue = [], round = 0, score = 0, lives = LIVES, q, start, missedThisRound, balloons = [], raf, last, over = false;

  const scoreEl = h('span', { class: 'chip' });
  const livesEl = h('span', { class: 'chip' });
  const question = h('div', { class: 'sky-question' });
  const sky = h('div', { class: 'sky' });
  const root = h('div', { class: 'screen game' },
    topBar('🎈 Bắn bóng bay', backFor(key)),
    h('div', { class: 'hud' }, scoreEl, livesEl),
    question,
    sky,
  );

  const hud = () => {
    scoreEl.textContent = `⭐ ${score}`;
    livesEl.textContent = '❤️'.repeat(lives) + '🤍'.repeat(LIVES - lives);
  };

  function startRound() {
    if (lives <= 0) return finish();
    if (!queue.length) queue = pick(pool, 20);
    q = queue.shift();
    missedThisRound = false;
    question.textContent = `${q.text} = ?`;
    question.classList.remove('pop-in'); void question.offsetWidth; question.classList.add('pop-in');

    const H = sky.clientHeight, W = sky.clientWidth;
    const options = shuffle([q.answer, ...distractors(q, 3)]);
    const lane = W / options.length;
    // Mỗi vòng nhanh hơn 0,2 giây, nhanh nhất 2,4 giây để bay hết màn hình.
    const speed = H / Math.max(2.4, SLOW - round * 0.2);
    sky.replaceChildren();
    balloons = options.map((value, idx) => {
      const el = h('button', {
        class: 'balloon',
        style: `--b:${COLORS[(round + idx) % COLORS.length]}`,
        onpointerdown: (e) => { e.preventDefault(); tap(b); },
      }, value);
      const b = { el, value, x: lane * idx + lane / 2 + (Math.random() - 0.5) * lane * 0.3, y: H + 20 + Math.random() * 120, speed: speed * (0.9 + Math.random() * 0.2), alive: true };
      el.style.left = `${b.x}px`;
      sky.append(el);
      return b;
    });
    start = performance.now();
    last = start;
    raf = requestAnimationFrame(tick);
  }

  function tick(now) {
    const dt = (now - last) / 1000;
    last = now;
    for (const b of balloons) {
      if (!b.alive) continue;
      b.y -= b.speed * dt;
      b.el.style.transform = `translate(-50%, ${b.y}px)`;
      if (b.y < -140) {
        b.alive = false;
        if (b.value === q.answer) return escaped();
      }
    }
    raf = requestAnimationFrame(tick);
  }

  async function tap(b) {
    if (!b.alive) return;
    if (b.value === q.answer) {
      cancelAnimationFrame(raf);
      const ms = performance.now() - start;
      if (!missedThisRound) answer(q, true, ms);
      score += 10 + Math.max(0, Math.round((5000 - ms) / 500));
      b.alive = false;
      b.el.classList.add('popped');
      play('pop'); play('good');
      balloons.filter((o) => o !== b).forEach((o) => o.el.classList.add('fade'));
      hud();
      round++;
      await wait(500);
      startRound();
    } else {
      play('bad');
      b.alive = false;
      b.el.classList.add('wrong');
      if (!missedThisRound) { missedThisRound = true; answer(q, false, performance.now() - start); }
      loseLife();
    }
  }

  async function escaped() {
    cancelAnimationFrame(raf);
    play('bad');
    if (!missedThisRound) answer(q, false, performance.now() - start);
    question.textContent = `${q.text} = ${q.answer}`;
    loseLife();
    round++;
    await wait(1200);
    startRound();
  }

  function loseLife() {
    lives = Math.max(0, lives - 1);
    hud();
    if (lives === 0) { cancelAnimationFrame(raf); wait(700).then(finish); }
  }

  function finish() {
    cancelAnimationFrame(raf);
    if (over) return;
    over = true;
    const { best, record } = saveBest('balloon', key, score);
    play('win');
    if (record) confetti();
    sky.replaceChildren(gameResult({
      icon: '🎈🎈🎈',
      title: record ? `Kỷ lục mới: ${score} điểm! 🏆` : `Được ${score} điểm!`,
      lines: [['Số câu đã chơi', round], ['Kỷ lục của con', Math.max(best, score)]],
      root, replay: () => balloonScreen(key), gameId: 'balloon', key,
    }));
    question.textContent = 'Con giỏi lắm! 🎉';
  }

  onLeave(() => cancelAnimationFrame(raf));
  hud();
  // Chờ màn hình gắn vào trang để đo kích thước bầu trời.
  requestAnimationFrame(startRound);
  return root;
}
