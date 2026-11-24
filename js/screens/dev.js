// Chế độ dev: duyệt lần lượt mọi dạng câu hỏi của một chương, hiện sẵn đáp án, không ghi tiến độ.
// Bật bằng ?dev=1, tắt bằng ?dev=0 (nhớ trong localStorage, khóa riêng không đụng `state`).
import { h, topBar } from '../ui/widgets.js';
import { numpad } from '../ui/numpad.js';
import { renderKind, picture } from '../ui/kinds.js';
import { TOPICS } from '../topics/index.js';

const KEY = 'be-vui-hoc-dev';

export function isDev() {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}

export function initDev() {
  const v = new URLSearchParams(location.search).get('dev');
  try { if (v === '1') localStorage.setItem(KEY, '1'); else if (v === '0') localStorage.removeItem(KEY); } catch { /* bỏ qua */ }
  if (isDev()) document.body.append(h('div', { class: 'dev-badge' }, '🛠 DEV'));
}

// Danh sách dạng của chương: chương có phần thì ghi tên phần trước số thứ tự dạng.
function typesOf(t) {
  const list = (make, pre) => (make.types || [make]).map((fn, i) => ({ fn, label: `${pre}Dạng ${i + 1}` }));
  return t.parts ? t.parts.flatMap((p) => list(p.make, `${p.emoji} ${p.title} › `)) : list(t.make, '');
}

export function devScreen(id) {
  const t = TOPICS[id], types = typesOf(t);
  let i = 0, pad;
  const head = h('div', { class: 'dev-head' });
  const prompt = h('div', { class: 'quiz-q' });
  const area = h('div', { class: 'quiz-area' });
  const info = h('div', { class: 'dev-info' });
  const makePad = (opts) => { pad?.setEnabled(false); pad = numpad(opts); return pad; };
  const btn = (label, fn) => h('button', { class: 'btn-secondary', onclick: fn }, label);

  function show() {
    pad?.setEnabled(false);
    const q = types[i].fn();
    const kind = q.kind || (q.choices ? 'choice' : 'num');
    head.replaceChildren(h('b', {}, `Dạng ${i + 1} / ${types.length}`), ' · ', types[i].label);
    prompt.replaceChildren(h('p', {}, q.text), q.svg && q.kind !== 'pick' && q.kind !== 'paint' ? picture(q.svg) : '');
    info.replaceChildren();
    area.replaceChildren(renderKind(q, (ok) => info.prepend(h('p', {}, ok ? '✅ Đúng' : '❌ Sai')), makePad));
    info.append(
      h('p', {}, '🎯 Đáp án: ', h('b', {}, String(q.show ?? q.answer))),
      q.explain ? h('p', {}, '💡 ', q.explain) : '',
      h('p', { class: 'dev-kind' }, 'Kiểu: ', area.querySelector('.numpad') ? 'bàn phím số' : kind === 'choice' || kind === 'num' ? 'trắc nghiệm' : kind),
    );
  }

  const go = (d) => { i = Math.max(0, Math.min(types.length - 1, i + d)); show(); };
  const root = h('div', { class: 'screen practice', style: '--c:#ff8c42' },
    topBar(`🛠 ${t.emoji} ${t.title}`, `#/topic/${id}`),
    head,
    h('div', { class: 'stage wide' }, prompt, area, info),
    h('div', { class: 'dev-nav' }, btn('◀ Trước', () => go(-1)), btn('🔄 Số khác', show), btn('Tiếp ▶', () => go(1))),
  );
  show();
  return root;
}
