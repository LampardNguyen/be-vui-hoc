// Trò Lật thẻ: lật 2 thẻ, ghép phép tính với đúng kết quả của nó.
import { h, topBar, confetti, wait, onLeave } from '../ui/widgets.js';
import { pick, poolFor } from '../leitner.js';
import { shuffle } from '../facts.js';
import { markStudied } from '../storage.js';
import { sayFact } from '../speech.js';
import { play } from '../sound.js';
import { backFor, saveBest, gameResult } from './common.js';

const PAIRS = 6;

export function memoryScreen(key = 'mix') {
  // Chọn các phép có kết quả khác nhau để mỗi thẻ kết quả chỉ ghép được với 1 phép.
  const facts = [];
  const used = new Set();
  for (const f of pick(poolFor(key), 40)) {
    if (!used.has(f.answer)) { used.add(f.answer); facts.push(f); }
    if (facts.length === PAIRS) break;
  }

  let open = [], matched = 0, moves = 0, busy = false, lastMatch = performance.now();
  const startAt = performance.now();

  const movesEl = h('span', { class: 'chip' });
  const pairsEl = h('span', { class: 'chip' });
  const board = h('div', { class: 'cards' });
  const root = h('div', { class: 'screen game' },
    topBar('🃏 Lật thẻ', backFor(key)),
    h('div', { class: 'hud' }, pairsEl, movesEl),
    h('p', { class: 'hint' }, 'Lật 2 thẻ: một phép tính và kết quả đúng của nó.'),
    board,
  );

  const hud = () => {
    pairsEl.textContent = `🧩 ${matched}/${facts.length}`;
    movesEl.textContent = `👆 ${moves} lượt`;
  };

  const cards = shuffle(facts.flatMap((f) => [
    { f, face: f.text, kind: 'q' },
    { f, face: String(f.answer), kind: 'a' },
  ]));

  cards.forEach((c, i) => {
    c.el = h('button', { class: `card-flip ${c.kind}`, style: `animation-delay:${i * 40}ms`, onclick: () => flip(c) },
      h('span', { class: 'back' }, '❓'),
      h('span', { class: 'front' }, c.face));
    board.append(c.el);
  });

  async function flip(c) {
    if (busy || c.done || open.includes(c)) return;
    play('tap');
    c.el.classList.add('open');
    open.push(c);
    if (open.length < 2) return;

    moves++;
    const [a, b] = open;
    open = [];
    if (a.f === b.f && a.kind !== b.kind) {
      a.done = b.done = true;
      matched++;
      const now = performance.now();
      markStudied(Math.min(now - lastMatch, 15000));
      lastMatch = now;
      play('good');
      sayFact(a.f);
      await wait(250);
      a.el.classList.add('matched');
      b.el.classList.add('matched');
      hud();
      if (matched === facts.length) finish();
    } else {
      busy = true;
      play('bad');
      a.el.classList.add('nope'); b.el.classList.add('nope');
      await wait(900);
      a.el.classList.remove('open', 'nope'); b.el.classList.remove('open', 'nope');
      busy = false;
    }
    hud();
  }

  async function finish() {
    const secs = Math.round((performance.now() - startAt) / 1000);
    // Điểm: càng ít lượt và càng nhanh càng cao.
    const score = Math.max(10, 200 - (moves - facts.length) * 10 - secs);
    const { best, record } = saveBest('memory', key, score);
    await wait(700);
    play('win');
    confetti();
    board.replaceChildren(gameResult({
      icon: moves <= facts.length + 3 ? '🧠✨' : '🃏',
      title: record ? `Kỷ lục mới: ${score} điểm! 🏆` : `Hoàn thành! ${score} điểm`,
      lines: [['Số lượt lật', moves], ['Thời gian', `${secs} giây`], ['Kỷ lục của con', Math.max(best, score)]],
      root, replay: () => memoryScreen(key), gameId: 'memory', key,
    }));
    board.classList.add('done');
  }

  onLeave(() => { busy = true; });
  hud();
  return root;
}
