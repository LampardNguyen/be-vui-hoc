import { h, topBar, dotArray } from '../ui/widgets.js';
import { TABLES, ISLANDS, TIPS, DIV_TIP, mul, div, NS, family } from '../facts.js';
import { sayFact, speakFacts } from '../speech.js';
import { play } from '../sound.js';

export function learnScreen(param) {
  const t = TABLES.includes(+param) ? +param : 2;
  let type = 'm';
  let covered = false;
  let revealed = new Set();

  const list = h('div', { class: 'learn-list' });
  const detail = h('div', { class: 'learn-detail' });
  const tip = h('p', { class: 'tip' });
  const tabM = h('button', { class: 'tab', onclick: () => setType('m') }, `Nhân ${t} ×`);
  const tabD = h('button', { class: 'tab', onclick: () => setType('d') }, `Chia : ${t}`);
  const coverBtn = h('button', { class: 'pill', onclick: () => { covered = !covered; revealed = new Set(); renderList(); } });
  const readBtn = h('button', { class: 'pill', onclick: readAll }, '🔊 Đọc cả bảng');

  const facts = () => NS.map((n) => (type === 'm' ? mul(t, n) : div(t, n)));

  function setType(v) {
    type = v;
    revealed = new Set();
    renderList();
    show(facts()[0], false);
  }

  function renderList() {
    tabM.classList.toggle('on', type === 'm');
    tabD.classList.toggle('on', type === 'd');
    coverBtn.textContent = covered ? '👀 Hiện kết quả' : '🙈 Che kết quả';
    tip.textContent = '💡 ' + (type === 'm' ? TIPS[t] : DIV_TIP);
    list.replaceChildren(...facts().map((f) => {
      const hidden = covered && !revealed.has(f.id);
      return h('button', {
        class: 'fact-row' + (hidden ? ' hidden' : ''),
        'data-id': f.id,
        onclick: () => {
          if (hidden) { revealed.add(f.id); play('pop'); renderList(); }
          show(f, true);
        },
      }, h('span', {}, `${f.text} =`), h('b', {}, hidden ? '?' : f.answer));
    }));
  }

  function show(f, speakIt) {
    list.querySelectorAll('.fact-row').forEach((el) => el.classList.toggle('active', el.dataset.id === f.id));
    if (speakIt) sayFact(f);
    detail.replaceChildren(
      h('div', { class: 'detail-eq' }, `${f.text} = `, h('b', {}, f.answer)),
      dotArray(f),
      h('div', { class: 'family' }, h('small', {}, 'Gia đình phép tính:'), family(f).map((line) => h('span', {}, line))),
    );
  }

  function readAll() {
    const fs = facts();
    speakFacts(fs, (i) => show(fs[i], false));
  }

  renderList();
  show(facts()[0], false);

  return h('div', { class: 'screen', style: `--c:${ISLANDS[t].color}` },
    topBar(`Học bảng ${t} ${ISLANDS[t].emoji}`, `#/table/${t}`),
    h('div', { class: 'tabs' }, tabM, tabD),
    h('div', { class: 'tools' }, coverBtn, readBtn),
    tip,
    h('div', { class: 'learn-grid' }, list, detail),
  );
}
