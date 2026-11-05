// Trò Ếch nhảy lá sen: lá sen mang đáp án trôi ngang sông, chạm lá đúng khi nó trôi vào vòng sáng.
// Chơi không giới hạn tới khi hết mạng. Mỗi câu có giới hạn thời gian: lá dưới chân ếch chìm dần,
// hết giờ thì ếch rơi "tõm" xuống nước. Trả lời đúng thì lá trôi nhanh hơn, thời gian ngắn lại.
import { h, topBar, confetti, wait, onLeave } from '../ui/widgets.js';
import { pick, poolFor, answer } from '../leitner.js';
import { distractors, shuffle } from '../facts.js';
import { play } from '../sound.js';
import { backFor, saveBest, gameResult, level, giftBag } from './common.js';

const COMBO = 5;

// Lá sen nhìn từ trên xuống: có khe chữ V, gân lá toả từ tâm.
const PAD_SVG = `<svg class="pad-art" viewBox="0 0 100 100" aria-hidden="true">
  <path d="M50 50 L57 3 A47 47 0 1 1 43 3 Z" fill="#3f8f2e"/>
  <path d="M50 50 L56 8 A42 42 0 1 1 44 8 Z" fill="#7ccf4f"/>
  <g stroke="#4f9a33" stroke-width="2" stroke-linecap="round" opacity=".55">
    <path d="M50 50 L80 20"/><path d="M50 50 L92 50"/><path d="M50 50 L80 80"/><path d="M50 50 L50 92"/>
    <path d="M50 50 L20 80"/><path d="M50 50 L8 50"/><path d="M50 50 L20 20"/>
  </g>
  <ellipse cx="34" cy="30" rx="10" ry="5" fill="#fff" opacity=".25" transform="rotate(-30 34 30)"/>
</svg>`;

// Ếch tròn dễ thương nhìn chính diện: mắt to có điểm sáng, má hồng. Dáng ngồi và dáng nhảy (duỗi chân sau).
const FROG_SVG = `<svg viewBox="-70 -60 140 135" aria-hidden="true">
  <g class="legs-sit" fill="#4caf50">
    <ellipse cx="-38" cy="48" rx="26" ry="14"/><ellipse cx="38" cy="48" rx="26" ry="14"/>
  </g>
  <g class="legs-leap" fill="#4caf50">
    <ellipse cx="-30" cy="56" rx="11" ry="24" transform="rotate(22 -30 56)"/>
    <ellipse cx="30" cy="56" rx="11" ry="24" transform="rotate(-22 30 56)"/>
    <ellipse cx="-42" cy="74" rx="13" ry="6"/><ellipse cx="42" cy="74" rx="13" ry="6"/>
  </g>
  <ellipse cx="0" cy="12" rx="62" ry="52" fill="#6cd36a"/>
  <ellipse cx="0" cy="26" rx="34" ry="28" fill="#a6e89a" opacity=".6"/>
  <circle cx="-30" cy="-34" r="22" fill="#6cd36a"/><circle cx="30" cy="-34" r="22" fill="#6cd36a"/>
  <circle cx="-30" cy="-34" r="15" fill="#fff"/><circle cx="30" cy="-34" r="15" fill="#fff"/>
  <circle cx="-27" cy="-32" r="9" fill="#2b2b3a"/><circle cx="33" cy="-32" r="9" fill="#2b2b3a"/>
  <circle cx="-24" cy="-36" r="3" fill="#fff"/><circle cx="36" cy="-36" r="3" fill="#fff"/>
  <ellipse cx="-38" cy="10" rx="10" ry="6" fill="#ff9eb5"/><ellipse cx="38" cy="10" rx="10" ry="6" fill="#ff9eb5"/>
  <path d="M-16 8 Q0 24 16 8" stroke="#2b2b3a" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g class="legs-sit" fill="#4caf50"><ellipse cx="-20" cy="58" rx="14" ry="8"/><ellipse cx="20" cy="58" rx="14" ry="8"/></g>
</svg>`;

// Lá sen bấm được (hình + số ở giữa).
function padEl(value, w) {
  const el = h('button', { class: 'pad', style: `width:${w}px;height:${w}px;margin-top:${-w / 2}px` }, h('span', { class: 'pad-num' }, value));
  el.insertAdjacentHTML('afterbegin', PAD_SVG);
  el.firstChild.style.rotate = `${Math.floor(Math.random() * 360)}deg`;
  if (Math.random() < 0.3) el.append(h('span', { class: 'lotus' }, '🌸'));
  return el;
}

// Lá sen trang trí (không bấm được).
function decoEl(w) {
  const el = h('div', { class: 'deco-pad', style: `width:${w}px;height:${w}px;margin-top:${-w / 2}px` });
  el.innerHTML = PAD_SVG;
  el.firstChild.style.rotate = `${Math.floor(Math.random() * 360)}deg`;
  if (Math.random() < 0.4) el.append(h('span', { class: 'lotus' }, '🌸'));
  return el;
}

export function frogScreen(key = 'mix') {
  // Độ khó: số mạng, số giây cho câu đầu và ít nhất (mỗi câu đúng bớt 0,25 giây).
  const { LIVES, BASE, MIN } = {
    easy: { LIVES: 5, BASE: 12, MIN: 5 },
    normal: { LIVES: 3, BASE: 8, MIN: 3.5 },
    hard: { LIVES: 3, BASE: 5, MIN: 2.5 },
  }[level()];
  const pool = poolFor(key);
  let queue = [], jumps = 0, score = 0, combo = 0, lives = LIVES, q, pads = [], deco = [], dir = 1;
  let start, missed, raf, last, busy = false, over = false, L, speed, padW, T, hasGift = false;
  // Theo tỉ lệ bề ngang sông: rx = vòng sáng (ngẫu nhiên giữa/trái/phải mỗi câu), fx = chỗ ếch đang đứng.
  let rx = 0.5, fx = 0.5;
  const randomRx = () => [0.5, 0.5, 0.28, 0.72][Math.floor(Math.random() * 4)];
  const bag = giftBag();

  const scoreEl = h('span', { class: 'chip' });
  const jumpEl = h('span', { class: 'chip' });
  const livesEl = h('span', { class: 'chip' });
  const powerEl = h('span', { class: 'chip power' });
  const comboEl = h('span', { class: 'chip combo' });
  const question = h('div', { class: 'sky-question' });
  const tip = h('div', { class: 'frog-tip' });
  const reach = h('div', { class: 'reach' });
  const lane = h('div', { class: 'pad-lane' }, reach);
  const decoLane = h('div', { class: 'deco-lane' });
  const frog = h('div', { class: 'frog' }, h('span', { class: 'sweat' }, '💧'));
  frog.insertAdjacentHTML('afterbegin', FROG_SVG);
  const basePad = h('div', { class: 'base-pad' });
  basePad.innerHTML = PAD_SVG;
  // "Máy quay" đi theo ếch: cả cảnh trượt lên sau mỗi cú nhảy.
  const scene = h('div', { class: 'scene' }, decoLane, basePad, lane, frog);
  const river = h('div', { class: 'river' }, scene, tip);
  const root = h('div', { class: 'screen game' },
    topBar('🐸 Ếch nhảy lá sen', backFor(key)),
    h('div', { class: 'hud' }, scoreEl, comboEl, powerEl, jumpEl, livesEl),
    question,
    river,
  );

  const hud = () => {
    scoreEl.textContent = `⭐ ${score}`;
    jumpEl.textContent = `🌿 ${jumps}`;
    livesEl.textContent = '❤️'.repeat(lives) + '🤍'.repeat(LIVES - lives);
    powerEl.textContent = bag.chips();
    powerEl.hidden = !powerEl.textContent;
    frog.classList.toggle('shielded', bag.shield);
    comboEl.textContent = combo >= 2 ? `🔥 x${combo}` : '';
    comboEl.style.visibility = combo >= 2 ? 'visible' : 'hidden';
  };

  const say = (text) => {
    tip.textContent = text;
    tip.classList.remove('show'); void tip.offsetWidth; tip.classList.add('show');
  };

  function startRound() {
    if (!queue.length) queue = pick(pool, 20);
    q = queue.shift();
    missed = false;
    busy = false;
    question.textContent = `${q.text} = ?`;
    question.classList.remove('pop-in'); void question.offsetWidth; question.classList.add('pop-in');

    const W = lane.clientWidth;
    padW = Math.min(110, W / 4.2);
    // Vòng trôi dài hơn bề ngang sông một chút để lá trôi ra khỏi màn rồi quay lại.
    L = Math.max(W + padW, padW * 4.6);
    const { gift, slow } = bag.start();
    hasGift = gift;
    hud();
    // Thời gian chọn = thời gian lá trôi hết một vòng (lá đúng chắc chắn đi qua vòng sáng 1 lần).
    // Quà 🐢 cho chậm như lúc mới chơi.
    T = slow ? BASE : Math.max(MIN, BASE - jumps * 0.25);
    speed = L / T;
    dir = Math.random() < 0.5 ? -1 : 1;
    rx = randomRx();
    reach.style.left = `${rx * 100}%`;
    frog.style.left = `${fx * 100}%`;

    const values = shuffle([q.answer, ...distractors(q, 3)]);
    const offset = Math.random() * L;
    lane.querySelectorAll('.pad').forEach((p) => p.remove());
    pads = values.map((value, i) => {
      const el = padEl(value, padW);
      const p = { el, value, x: (offset + i * L / values.length) % L };
      el.addEventListener('pointerdown', (e) => { e.preventDefault(); tap(p); });
      if (gift && value === q.answer) el.append(h('span', { class: 'gift-badge' }, '🎁'));
      lane.append(el);
      return p;
    });
    // Hàng lá trang trí phía trên, nhỏ hơn, trôi ngược chiều.
    const dw = padW * 0.75;
    decoLane.replaceChildren();
    deco = [0, 1, 2, 3].map((i) => {
      const el = decoEl(dw);
      decoLane.append(el);
      return { el, w: dw, x: (Math.random() * L / 4 + i * L / 4) % L };
    });

    // Lá dưới chân ếch nằm đúng chỗ ếch đáp (tâm lá ở 60% chiều cao ếch).
    const sr = scene.getBoundingClientRect(), fr = frog.getBoundingClientRect();
    basePad.style.cssText = `width:${padW}px;height:${padW}px;left:${fr.left - sr.left + fr.width / 2 - padW / 2}px;top:${fr.top - sr.top + fr.height * 0.6 - padW / 2}px`;
    basePad.className = 'base-pad';
    for (const l of [lane, decoLane]) { l.classList.remove('enter'); void l.offsetWidth; l.classList.add('enter'); }
    start = performance.now();
    last = start;
    raf = requestAnimationFrame(tick);
  }

  const center = (p) => p.x - padW / 2;
  const inReach = (p) => Math.abs(center(p) - lane.clientWidth * rx) < padW * 0.7;

  function tick(now) {
    const dt = (now - last) / 1000;
    last = now;
    for (const p of pads) {
      p.x = ((p.x + dir * speed * dt) % L + L) % L;
      p.el.style.transform = `translateX(${p.x - padW}px)`;
      p.el.classList.toggle('near', inReach(p));
    }
    for (const d of deco) {
      d.x = ((d.x - dir * speed * 0.6 * dt) % L + L) % L;
      d.el.style.transform = `translateX(${d.x - d.w}px)`;
    }
    // Thời gian trôi qua: lá dưới chân chìm dần, vòng sáng đếm lùi, gần hết giờ thì ếch run.
    const t = Math.min(1, (now - start) / 1000 / T);
    basePad.style.setProperty('--p', t);
    reach.style.setProperty('--left', `${(1 - t) * 360}deg`);
    frog.classList.toggle('nervous', t > 0.7);
    if (t >= 1) return timeout();
    raf = requestAnimationFrame(tick);
  }

  // Mất 1 mạng (khiên đỡ được thì thôi). Trả về true nếu khiên đã đỡ.
  function hurt() {
    const shielded = bag.hit();
    if (!shielded) lives = Math.max(0, lives - 1);
    if (!missed) { missed = true; answer(q, false, performance.now() - start); }
    combo = 0;
    hud();
    return shielded;
  }

  async function timeout() {
    busy = true;
    cancelAnimationFrame(raf);
    play('bad');
    const shielded = hurt();
    frog.classList.remove('nervous');
    frog.classList.add('splash');
    basePad.classList.add('sunk');
    pads.find((o) => o.value === q.answer).el.classList.add('hint');
    say(`${shielded ? '🛡️ Khiên đỡ rồi! ' : 'Tõm! 💦 '}${q.text} = ${q.answer} nhé con`);
    await wait(1800);
    if (over) return;
    frog.classList.remove('splash');
    if (lives <= 0) return finish();
    startRound();
  }

  async function tap(p) {
    if (busy || over) return;
    if (p.value !== q.answer) {
      // Chạm nhầm lá: mất 1 mạng, ếch không nhảy, lá đúng nhấp nháy để gợi ý.
      play('bad');
      const shielded = hurt();
      frog.classList.remove('nope'); void frog.offsetWidth; frog.classList.add('nope');
      p.el.classList.remove('wrong'); void p.el.offsetWidth; p.el.classList.add('wrong');
      pads.find((o) => o.value === q.answer).el.classList.add('hint');
      if (lives === 0) {
        busy = true;
        cancelAnimationFrame(raf);
        say(`${q.text} = ${q.answer} nhé con 🍃`);
        wait(1500).then(() => { if (!over) finish(); });
        return;
      }
      say(shielded ? '🛡️ Khiên đã bảo vệ con! Tìm lá đang nhấp nháy nhé' : 'Ộp, không phải lá này! Tìm lá đang nhấp nháy nhé 🍃');
      return;
    }
    if (!inReach(p)) {
      say('Đúng rồi! Chờ lá trôi vào vòng sáng rồi chạm nhé ✨');
      return;
    }
    busy = true;
    cancelAnimationFrame(raf);
    const ms = performance.now() - start;
    if (!missed) answer(q, true, ms);
    combo = missed ? 0 : combo + 1;
    const bonus = combo > 0 && combo % COMBO === 0;
    score += bag.points(10 + Math.max(0, Math.round((T * 1000 - ms) / 500)) + (bonus ? 20 : 0));
    jumps++;
    frog.classList.remove('nervous');

    // Ếch bật nhảy tới đúng giữa lá sen.
    const { dx, dy } = await leapTo(p.el);
    if (over) return;
    p.el.classList.add('landed');
    pads.filter((o) => o !== p).forEach((o) => o.el.classList.add('sink'));
    play('pop'); play('good');
    if (bonus) { say(`Chuỗi ${combo} câu đúng! +20 ⭐`); confetti(15); }
    if (hasGift && bag.open(river, lives, LIVES) === 'heart') lives++;
    hud();
    if (hasGift) await wait(1300);
    if (over) return;

    // Máy quay chỉ đi lên theo ếch; ếch giữ vị trí vòng sáng vừa nhảy tới (nắn nhẹ cho lá về đúng tâm vòng).
    const W = scene.clientWidth;
    scene.style.transition = 'translate .5s ease-in-out';
    scene.style.translate = `${(rx - fx) * W - dx}px ${-dy}px`;
    await wait(520);
    if (over) return;
    scene.style.transition = 'none';
    scene.style.translate = '';
    fx = rx;
    frog.style.transition = 'none';
    frog.style.translate = '';
    void frog.offsetWidth;
    frog.style.transition = '';
    startRound();
  }

  // Ếch nhảy tới giữa phần tử đích; trả về độ dời để máy quay đi theo.
  async function leapTo(target) {
    const fr = frog.getBoundingClientRect(), tr = target.getBoundingClientRect();
    const dx = tr.left + tr.width / 2 - (fr.left + fr.width / 2);
    const dy = tr.top + tr.height / 2 - (fr.top + fr.height * 0.6);
    frog.classList.add('leap');
    frog.style.translate = `${dx}px ${dy}px`;
    await wait(480);
    frog.classList.remove('leap');
    return { dx, dy };
  }

  function finish() {
    cancelAnimationFrame(raf);
    over = true;
    const { best, record } = saveBest('frog', key, score);
    if (record) confetti();
    river.replaceChildren(gameResult({
      icon: '🐸🪷',
      title: record ? `Kỷ lục mới: ${score} điểm! 🏆` : `Được ${score} điểm!`,
      lines: [['Số lá đã nhảy', jumps], ['Kỷ lục của con', Math.max(best, score)]],
      root, replay: () => frogScreen(key), gameId: 'frog', key,
    }));
    question.textContent = 'Con giỏi lắm! 🎉';
  }

  onLeave(() => { over = true; cancelAnimationFrame(raf); });
  hud();
  // Chờ màn hình gắn vào trang để đo bề ngang sông.
  requestAnimationFrame(startRound);
  return root;
}
