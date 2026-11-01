// Trò Đánh quái vật: mỗi câu đúng là một đòn đánh, trả lời nhanh là đòn chí mạng.
// Hết giờ hoặc chọn sai thì quái vật đánh lại.
import { h, topBar, confetti, wait, onLeave } from '../ui/widgets.js';
import { pick, poolFor, answer, FAST_MS } from '../leitner.js';
import { distractors, shuffle } from '../facts.js';
import { play } from '../sound.js';
import { backFor, saveBest, gameResult } from './common.js';

const BOSS_HP = 10;
const LIVES = 3;
const TURN_MS = 8000;
const MONSTERS = [
  { emoji: '👾', name: 'Quái Vật Không Gian' },
  { emoji: '👹', name: 'Yêu Tinh Đỏ' },
  { emoji: '🦖', name: 'Khủng Long Bạo Chúa' },
  { emoji: '🐲', name: 'Rồng Lửa' },
  { emoji: '🤖', name: 'Rô-bốt Sắt' },
  { emoji: '👻', name: 'Ma Bóng Đêm' },
];

export function bossScreen(key = 'mix') {
  const pool = poolFor(key);
  const monster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
  let hp = BOSS_HP, lives = LIVES, q, start, queue = [], turnTimer, over = false, hits = 0, crits = 0;

  const hpBar = h('i');
  const hpText = h('span', { class: 'hp-text' });
  const livesEl = h('span', { class: 'chip' });
  const monsterEl = h('div', { class: 'monster' }, monster.emoji);
  const fx = h('div', { class: 'fx' });
  const turnBar = h('i');
  const question = h('div', { class: 'boss-question' });
  const choices = h('div', { class: 'choices' });
  const arena = h('div', { class: 'arena' },
    h('div', { class: 'boss-name' }, monster.name),
    h('div', { class: 'hp' }, h('span', { class: 'bar hp-bar' }, hpBar), hpText),
    h('div', { class: 'monster-wrap' }, monsterEl, fx),
  );
  const panel = h('div', { class: 'boss-panel' }, h('span', { class: 'bar turn' }, turnBar), question, choices);
  const root = h('div', { class: 'screen game boss' },
    topBar('👾 Đánh quái vật', backFor(key)),
    h('div', { class: 'hud' }, h('span', { class: 'chip' }, '🦸 Con'), livesEl),
    arena,
    panel,
  );

  const hud = () => {
    hpBar.style.width = `${(hp / BOSS_HP) * 100}%`;
    hpText.textContent = `${hp}/${BOSS_HP}`;
    livesEl.textContent = '❤️'.repeat(lives) + '🤍'.repeat(LIVES - lives);
  };

  function showFx(text, cls) {
    const el = h('span', { class: `fx-text ${cls}` }, text);
    fx.append(el);
    setTimeout(() => el.remove(), 900);
  }

  function next() {
    if (over) return;
    if (!queue.length) queue = pick(pool, 20);
    q = queue.shift();
    question.textContent = `${q.text} = ?`;
    question.classList.remove('pop-in'); void question.offsetWidth; question.classList.add('pop-in');
    choices.replaceChildren(...shuffle([q.answer, ...distractors(q, 3)]).map((v) =>
      h('button', { class: 'choice', onpointerdown: (e) => { e.preventDefault(); choose(v, e.currentTarget); } }, v)));
    // Thanh thời gian chạy bằng CSS, hết giờ thì quái vật đánh.
    turnBar.style.transition = 'none';
    turnBar.style.width = '100%';
    void turnBar.offsetWidth;
    turnBar.style.transition = `width ${TURN_MS}ms linear`;
    turnBar.style.width = '0%';
    clearTimeout(turnTimer);
    turnTimer = setTimeout(() => bossAttack(null), TURN_MS);
    start = performance.now();
  }

  function lock() { choices.querySelectorAll('button').forEach((b) => { b.disabled = true; }); }

  async function choose(v, btn) {
    if (over || btn.disabled) return;
    clearTimeout(turnTimer);
    lock();
    const ms = performance.now() - start;
    if (v !== q.answer) {
      btn.classList.add('wrong');
      answer(q, false, ms);
      return bossAttack(btn);
    }
    answer(q, true, ms);
    btn.classList.add('right');
    const crit = ms < FAST_MS;
    const dmg = crit ? 2 : 1;
    hp = Math.max(0, hp - dmg);
    hits++; if (crit) crits++;
    play(crit ? 'fast' : 'good');
    monsterEl.classList.remove('hit'); void monsterEl.offsetWidth; monsterEl.classList.add('hit');
    showFx(crit ? `💥 -${dmg} Chí mạng!` : `⚔️ -${dmg}`, 'dmg');
    hud();
    await wait(700);
    if (hp === 0) return finish(true);
    next();
  }

  async function bossAttack(wrongBtn) {
    if (over) return;
    if (!wrongBtn) answer(q, false, TURN_MS);   // hết giờ
    lock();
    choices.querySelectorAll('button').forEach((b) => { if (+b.textContent === q.answer) b.classList.add('right'); });
    play('bad');
    lives = Math.max(0, lives - 1);
    monsterEl.classList.remove('attack'); void monsterEl.offsetWidth; monsterEl.classList.add('attack');
    root.classList.remove('shake-screen'); void root.offsetWidth; root.classList.add('shake-screen');
    showFx(wrongBtn ? '😵 Ối!' : '⏰ Hết giờ!', 'ouch');
    queue.splice(2, 0, q);
    hud();
    await wait(1300);
    if (lives === 0) return finish(false);
    next();
  }

  function finish(win) {
    if (over) return;
    over = true;
    clearTimeout(turnTimer);
    const score = win ? 100 + lives * 30 + crits * 5 : hits * 5;
    const { best, record } = saveBest('boss', key, score);
    if (win) { play('win'); confetti(); monsterEl.classList.add('defeated'); }
    panel.replaceChildren(gameResult({
      icon: win ? '🏆' : '💪',
      title: win ? `Con đã hạ ${monster.name}!` : 'Quái vật mạnh quá, thử lại nhé!',
      lines: [['Đòn chí mạng ⚡', crits], ['Điểm', score], ['Kỷ lục của con', Math.max(best, score)]],
      root, replay: () => bossScreen(key), gameId: 'boss', key,
    }));
    if (record && !win) confetti(20);
  }

  onLeave(() => { over = true; clearTimeout(turnTimer); });
  hud();
  setTimeout(next, 400);
  return root;
}
