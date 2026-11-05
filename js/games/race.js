// Trò Đua xe ba làn: xe tự chạy, chạm vào làn có đáp án đúng để lái xe qua cổng đó. Chạy tới khi hết mạng, càng lúc càng nhanh.
import { h, topBar, confetti, wait, onLeave } from '../ui/widgets.js';
import { pick, poolFor, answer } from '../leitner.js';
import { distractors, shuffle } from '../facts.js';
import { play } from '../sound.js';
import { backFor, saveBest, gameResult, level, giftBag, giftPop } from './common.js';

// Xe đua nhìn từ trên xuống, đầu xe hướng lên.
// Bánh xe tô bằng pattern vạch gai lốp; dời toạ độ y của pattern theo quãng đường để bánh trông như đang lăn.
const CAR_SVG = `<svg viewBox="0 0 60 100" aria-hidden="true">
  <defs><pattern id="tread" width="10" height="6" patternUnits="userSpaceOnUse">
    <rect width="10" height="6" fill="#22305a"/><rect width="10" height="2" fill="#8a93b0"/>
  </pattern></defs>
  <rect x="2" y="16" width="10" height="20" rx="4" fill="url(#tread)"/><rect x="48" y="16" width="10" height="20" rx="4" fill="url(#tread)"/>
  <rect x="2" y="64" width="10" height="22" rx="4" fill="url(#tread)"/><rect x="48" y="64" width="10" height="22" rx="4" fill="url(#tread)"/>
  <path d="M30 4 C44 4 50 14 50 28 L50 84 C50 92 44 96 30 96 C16 96 10 92 10 84 L10 28 C10 14 16 4 30 4Z" fill="#ef476f"/>
  <rect x="26" y="4" width="8" height="92" fill="#fff" opacity=".85"/>
  <path d="M16 30 Q30 22 44 30 L42 44 Q30 40 18 44Z" fill="#bde0fe"/>
  <path d="M18 70 Q30 74 42 70 L43 80 Q30 84 17 80Z" fill="#bde0fe" opacity=".8"/>
  <rect x="13" y="90" width="9" height="5" rx="2" fill="#ffd166"/><rect x="38" y="90" width="9" height="5" rx="2" fill="#ffd166"/>
</svg>`;

export function raceScreen(key = 'mix') {
  // Độ khó: số mạng và số giây để cổng chạy từ trên xuống tới xe ở câu đầu.
  const { LIVES, SLOW } = { easy: { LIVES: 5, SLOW: 8 }, normal: { LIVES: 3, SLOW: 5.5 }, hard: { LIVES: 3, SLOW: 3.5 } }[level()];
  const pool = poolFor(key);
  let queue = [], round = 0, right = 0, lives = LIVES, score = 0, lane = 1, q, options, gateY, speed;
  let start, lastMove, raf, last, roadY = 0, boost = 0, over = false, hasGift = false;
  const bag = giftBag();

  const scoreEl = h('span', { class: 'chip' });
  const livesEl = h('span', { class: 'chip' });
  const powerEl = h('span', { class: 'chip power' });
  const question = h('div', { class: 'sky-question' });
  const gate = h('div', { class: 'race-gates' });
  const car = h('div', { class: 'race-car' });
  car.innerHTML = CAR_SVG;
  const tread = car.querySelector('#tread');
  const road = h('div', { class: 'road', onpointerdown: (e) => { e.preventDefault(); steer(e); } }, gate, car);
  const root = h('div', { class: 'screen game' },
    topBar('🏎️ Đua xe ba làn', backFor(key)),
    h('div', { class: 'hud' }, scoreEl, powerEl, livesEl),
    question,
    road,
    h('p', { class: 'race-tip' }, '👆 Chạm vào làn có đáp án đúng để lái xe'),
  );

  const hud = () => {
    scoreEl.textContent = `⭐ ${score}`;
    livesEl.textContent = '❤️'.repeat(lives) + '🤍'.repeat(LIVES - lives);
    powerEl.textContent = bag.chips();
    powerEl.hidden = !powerEl.textContent;
    car.classList.toggle('shielded', bag.shield);
  };
  const placeCar = () => { car.style.left = `${(lane + 0.5) * 100 / 3}%`; };

  function moveTo(n) {
    if (over || n === lane || n < 0 || n > 2) return;
    // Xe nghiêng nhẹ về phía làn mới.
    car.style.rotate = n < lane ? '-12deg' : '12deg';
    setTimeout(() => { car.style.rotate = ''; }, 180);
    lane = n;
    lastMove = performance.now();
    placeCar();
    play('tap');
  }

  function steer(e) {
    const r = road.getBoundingClientRect();
    moveTo(Math.floor((e.clientX - r.left) / (r.width / 3)));
  }

  function onKey(e) {
    if (e.key === 'ArrowLeft') moveTo(lane - 1);
    if (e.key === 'ArrowRight') moveTo(lane + 1);
  }

  function startRound() {
    if (lives <= 0) return finish();
    if (!queue.length) queue = pick(pool, 20);
    q = queue.shift();
    question.textContent = `${q.text} = ?`;
    question.classList.remove('pop-in'); void question.offsetWidth; question.classList.add('pop-in');
    options = shuffle([q.answer, ...distractors(q, 2)]);
    gate.replaceChildren(...options.map((v) => h('span', { class: 'race-gate' }, v)));
    gate.classList.remove('passed');
    gateY = -90;
    const { gift, slow } = bag.start();
    hasGift = gift;
    if (gift) gate.children[options.indexOf(q.answer)].append(h('span', { class: 'gift-badge' }, '🎁'));
    hud();
    // Mỗi cổng nhanh hơn 0,15 giây, nhanh nhất 2 giây (quà 🐢 cho chạy chậm như lúc đầu).
    speed = (road.clientHeight - 60) / (slow ? SLOW : Math.max(2, SLOW - round * 0.15));
    start = lastMove = performance.now();
    last = start;
    raf = requestAnimationFrame(tick);
  }

  function tick(now) {
    const dt = (now - last) / 1000;
    last = now;
    gateY += speed * dt;
    gate.style.transform = `translateY(${gateY}px)`;
    // Vạch kẻ đường chạy lùi để tạo cảm giác xe đang lao tới (nhanh hơn khi tăng tốc).
    boost = Math.max(0, boost - dt);
    roadY += speed * dt * (boost > 0 ? 2 : 1);
    road.style.backgroundPositionY = `${roadY}px`;
    tread.setAttribute('y', (roadY * 0.5) % 6);
    if (gateY + gate.offsetHeight >= car.offsetTop + 20) return arrive();
    raf = requestAnimationFrame(tick);
  }

  async function arrive() {
    const cells = [...gate.children];
    const ok = options[lane] === q.answer;
    const ms = (ok && lastMove > start ? lastMove : performance.now()) - start;
    answer(q, ok, ms);
    round++;
    gate.classList.add('passed');
    cells[options.indexOf(q.answer)].classList.add('ok');
    question.textContent = `${q.text} = ${q.answer}`;
    if (ok) {
      right++;
      score += bag.points(10 + Math.max(0, Math.round((SLOW * 1000 - ms) / 400)));
      if (hasGift && bag.open(road, lives, LIVES) === 'heart') lives++;
      boost = 1;
      car.classList.remove('boost'); void car.offsetWidth; car.classList.add('boost');
      play('good');
    } else {
      // Đi nhầm cổng: mất 1 mạng, xe chậm lại một chút, cổng đúng sáng lên để con nhớ.
      if (bag.hit()) giftPop(road, '🛡️', 'Khiên đã bảo vệ con!', '', 1200);
      else lives--;
      cells[lane].classList.add('wrong');
      car.classList.remove('slow'); void car.offsetWidth; car.classList.add('slow');
      play('bad');
    }
    hud();
    // Cho cổng chạy tiếp qua xe một đoạn ngắn.
    const delay = ok ? (hasGift ? 1600 : 450) : 1400;
    const until = performance.now() + delay;
    const pass = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      gateY += speed * dt * (ok ? 1 : 0.25);
      gate.style.transform = `translateY(${gateY}px)`;
      roadY += speed * dt * (ok ? 2 : 0.3);
      road.style.backgroundPositionY = `${roadY}px`;
      tread.setAttribute('y', (roadY * 0.5) % 6);
      if (now < until) raf = requestAnimationFrame(pass);
    };
    raf = requestAnimationFrame(pass);
    await wait(delay);
    if (over) return;
    cancelAnimationFrame(raf);
    startRound();
  }

  function finish() {
    cancelAnimationFrame(raf);
    if (over) return;
    over = true;
    const { best, record } = saveBest('race', key, score);
    play('win');
    if (record) confetti();
    road.replaceChildren(gameResult({
      icon: '🏎️🏁',
      title: record ? `Kỷ lục mới: ${score} điểm! 🏆` : `Được ${score} điểm!`,
      lines: [['Qua đúng cổng', `${right}/${round}`], ['Kỷ lục của con', Math.max(best, score)]],
      root, replay: () => raceScreen(key), gameId: 'race', key,
    }));
    question.textContent = 'Con lái giỏi lắm! 🎉';
  }

  addEventListener('keydown', onKey);
  onLeave(() => { over = true; cancelAnimationFrame(raf); removeEventListener('keydown', onKey); });
  hud();
  placeCar();
  // Chờ màn hình gắn vào trang để đo chiều cao đường đua.
  requestAnimationFrame(startRound);
  return root;
}
