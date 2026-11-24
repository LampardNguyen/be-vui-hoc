// Các dạng bài tương tác của chương học. renderKind(q, done, makePad) → phần tử.
// done(ok, { corrected }) — corrected: bé đã tự sửa đúng ngay trong bài (đặt tính, sắp xếp, nhiều bước).
import { h, wait } from './widgets.js';
import { play } from '../sound.js';
import { numChoice } from '../topics/util.js';

// Hình SVG do app tự tạo (không chứa dữ liệu người dùng) nên gán innerHTML an toàn.
export function picture(svgText, cls = 'topic-pic') {
  const el = h('div', { class: cls });
  el.innerHTML = svgText;
  return el;
}

const shake = (el) => { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); };

// ---------- Chọn đáp án (chữ hoặc hình) ----------
function choice(q, done) {
  const btns = q.choices.map((c) => {
    const v = typeof c === 'object' ? c.value : c;
    const b = h('button', { class: `quiz-choice${typeof c === 'object' && c.svg ? ' pic' : ''}`, onclick: () => pickIt(b, v) },
      typeof c === 'object' && c.svg ? picture(c.svg, 'choice-pic') : null,
      typeof c === 'object' ? c.label ?? '' : c);
    b.dataset.v = v;
    return b;
  });
  const wrap = h('div', { class: `quiz-choices n${btns.length}${q.tf ? ' tf' : ''}` }, btns);
  let used = false;
  function pickIt(b, v) {
    if (used) return;
    used = true;
    const ok = String(v) === String(q.answer);
    b.classList.add(ok ? 'right' : 'wrong');
    if (!ok) btns.find((x) => x.dataset.v === String(q.answer))?.classList.add('right');
    done(ok);
  }
  return wrap;
}

// ---------- Nhập số ----------
// remount(): tạo lại bàn phím (sau khi bé dùng nháp đặt tính xong).
function num(q, done, makePad) {
  const box = h('span', { class: 'answer-box' }, '?');
  const holder = h('div');
  const mount = () => {
    box.textContent = '?';
    const pad = makePad({ max: q.max || 4, onChange: (v) => { box.textContent = v || '?'; }, onSubmit: (v) => {
      pad.setEnabled(false);
      const ok = +v === +q.answer;
      box.classList.add(ok ? 'right' : 'wrong');
      done(ok);
    } });
    holder.replaceChildren(pad.el);
  };
  mount();
  const el = h('div', {}, h('div', { class: 'quiz-answer' }, q.unit ? ['', box, ` ${q.unit}`] : ['Đáp án: ', box]), holder);
  el.remount = mount;
  return el;
}

// ---------- Đặt tính dọc: cộng, trừ, nhân (số thứ hai 1 chữ số khi nhân) ----------
export function colSteps(op, a, b) {
  const A = String(a).split('').reverse().map(Number), B = String(b).split('').reverse().map(Number);
  const out = [];
  if (op === '+') {
    let c = 0;
    for (let i = 0; i < Math.max(A.length, B.length); i++) {
      const x = A[i] || 0, y = B[i] || 0, s = x + y + c;
      out.push({ d: s % 10, mark: s >= 10 ? '1' : '', hint: `${x} + ${y}${c ? ' + 1 (nhớ)' : ''} = ${s}, viết ${s % 10}${s >= 10 ? ', nhớ 1' : ''}` });
      c = s >= 10 ? 1 : 0;
    }
    if (c) out.push({ d: 1, hint: 'Hạ số nhớ 1 xuống' });
  } else if (op === '-') {
    let br = 0;
    for (let i = 0; i < A.length; i++) {
      const x = A[i] - br, y = B[i] || 0;
      const was = br ? `${A[i]} bớt 1 (đã mượn) còn ${x}` : `${x}`;
      if (x < y) { out.push({ d: x + 10 - y, mark: '-1', hint: `${was} không trừ được ${y}, mượn 1 chục: ${x + 10} − ${y} = ${x + 10 - y}` }); br = 1; }
      else { out.push({ d: x - y, mark: '', hint: `${was} − ${y} = ${x - y}` }); br = 0; }
    }
    const len = String(a - b).length;
    out.length = len;
  } else {
    let c = 0;
    for (let i = 0; i < A.length; i++) {
      const s = A[i] * b + c, n = Math.floor(s / 10);
      out.push({ d: s % 10, mark: n ? String(n) : '', hint: `${b} × ${A[i]}${c ? ` + ${c} (nhớ)` : ''} = ${s}, viết ${s % 10}${n ? `, nhớ ${n}` : ''}` });
      c = n;
    }
    if (c) out.push({ d: c, hint: `Viết số nhớ ${c}` });
  }
  return out;
}

function column(q, done, makePad) {
  const { op, a, b } = q.col;
  const steps = colSteps(op, a, b);
  const W = Math.max(String(a).length, String(b).length, steps.length) + 1;
  const row = (str, cls = '') => {
    const s = String(str).padStart(W, ' ');
    return h('div', { class: `col-row ${cls}` }, [...s].map((c) => h('span', { class: 'col-cell' }, c.trim())));
  };
  const marks = row('', 'col-marks');
  const res = h('div', { class: 'col-row col-res' }, [...Array(W).keys()].map((i) => h('span', { class: `col-cell${i === 0 ? '' : ' slot'}` })));
  const slots = [...res.children].slice(1).reverse();   // slots[0] = hàng đơn vị
  slots.slice(steps.length).forEach((s) => s.classList.remove('slot'));
  const hint = h('p', { class: 'col-hint' }, 'Tính từ phải sang trái nhé 👉 bắt đầu ở hàng đơn vị.');
  const sign = { '+': '+', '-': '−', '×': '×' }[op];
  const second = row(b);
  second.firstChild.textContent = sign;
  const grid = h('div', { class: 'col-grid' }, marks, row(a), second, h('div', { class: 'col-line' }), res);
  let i = 0, mistakes = 0;
  const focus = () => slots.forEach((s, k) => s.classList.toggle('active', k === i));
  focus();
  const pad = makePad({ max: 1, onChange: (v) => {
    if (!v) return;
    pad.clear();
    const st = steps[i];
    if (+v === st.d) {
      play('tap');
      slots[i].textContent = v;
      slots[i].classList.add('filled');
      if (st.mark && i + 1 < W - 1) marks.children[W - 2 - i].textContent = st.mark;
      hint.textContent = `✔️ ${st.hint}`;
      i++;
      if (i >= steps.length) { pad.setEnabled(false); slots.forEach((s) => s.classList.remove('active')); done(mistakes === 0, { corrected: mistakes > 0 }); return; }
      focus();
    } else {
      play('bad');
      mistakes++;
      shake(slots[i]);
      hint.textContent = `💡 ${st.hint}`;
      hint.classList.add('warn');
      setTimeout(() => hint.classList.remove('warn'), 600);
    }
  }, onSubmit: () => {} });
  return h('div', {}, grid, hint, pad.el);
}

// ---------- Đặt tính chia (số bị chia 2–3 chữ số, số chia 1 chữ số) ----------
export function divSteps(a, b) {
  const D = String(a).split('').map(Number);
  const out = [];
  let cur = 0, started = false;
  D.forEach((d, i) => {
    cur = cur * 10 + d;
    if (!started && cur < b && i < D.length - 1) return;
    started = true;
    const qd = Math.floor(cur / b), r = cur - qd * b;
    const next = D[i + 1];
    // line: dòng viết dưới số bị chia (số dư rồi hạ chữ số tiếp), end: cột chữ số cuối của dòng để thẳng hàng.
    const line = next !== undefined ? `${r}${next}` : String(r), end = next !== undefined ? i + 1 : i;
    out.push({ d: qd, line, end, hint: `${cur} : ${b} được ${qd}, viết ${qd}. ${qd} × ${b} = ${qd * b}, ${cur} − ${qd * b} = ${r}${next !== undefined ? `. Hạ ${next} được ${r * 10 + next}` : ''}` });
    cur = r;
  });
  return { steps: out, rest: cur };
}

function divide(q, done, makePad) {
  const { a, b } = q.div;
  const { steps, rest } = divSteps(a, b);
  const quo = h('div', { class: 'div-quo' }, steps.map(() => h('span', { class: 'col-cell slot' })));
  const restBox = h('span', { class: 'col-cell slot' });
  const work = h('div', { class: 'div-work' });
  const hint = h('p', { class: 'col-hint' }, 'Chia từ trái sang phải nhé 👉');
  const restRow = h('div', { class: 'div-rest', hidden: true }, 'Số dư: ', restBox);
  const layout = h('div', { class: 'div-grid' },
    h('div', { class: 'div-left' }, h('div', { class: 'div-num' }, a), work),
    h('div', { class: 'div-right' }, h('div', { class: 'div-num' }, b), quo),
  );
  const slots = [...quo.children];
  let i = 0, mistakes = 0;
  const focus = () => { slots.forEach((s, k) => s.classList.toggle('active', k === i)); restBox.classList.toggle('active', i === steps.length); };
  focus();
  const pad = makePad({ max: 1, onChange: (v) => {
    if (!v) return;
    pad.clear();
    const want = i < steps.length ? steps[i].d : rest;
    const target = i < steps.length ? slots[i] : restBox;
    if (+v === want) {
      play('tap');
      target.textContent = v;
      target.classList.add('filled');
      const row = (st) => work.append(h('div', {}, '\u2007'.repeat(st.end + 1 - st.line.length) + st.line));
      if (i === steps.length) row(steps[i - 1]);   // Dòng số dư cuối hiện sau khi bé điền số dư.
      else if (i < steps.length - 1) row(steps[i]);
      if (i < steps.length) { hint.textContent = `✔️ ${steps[i].hint}`; }
      i++;
      if (i === steps.length) { restRow.hidden = false; hint.textContent = `👉 Còn lại ${rest}. Số dư là mấy?`; }
      if (i > steps.length) { pad.setEnabled(false); hint.textContent = `✔️ ${a} : ${b} = ${Math.floor(a / b)}${rest ? ` (dư ${rest})` : ''}`; done(mistakes === 0, { corrected: mistakes > 0 }); return; }
      focus();
    } else {
      play('bad');
      mistakes++;
      shake(target);
      hint.textContent = i < steps.length ? `💡 ${steps[i].hint}` : `💡 Số dư là phần còn lại cuối cùng: ${rest}. (Số dư luôn bé hơn ${b})`;
    }
  }, onSubmit: () => {} });
  return h('div', {}, layout, restRow, hint, pad.el);
}

// ---------- Chạm chọn trên hình ----------
function pick(q, done) {
  const pic = picture(q.svg, 'topic-pic pickable');
  const want = new Set(q.pick.correct.map(String));
  const sel = new Set();
  let over = false;
  const items = [...pic.querySelectorAll('[data-k]')];
  const finish = () => {
    over = true;
    items.forEach((el) => {
      const k = el.dataset.k;
      if (want.has(k)) el.classList.add('ok');
      else if (sel.has(k)) el.classList.add('bad');
    });
    done(sel.size === want.size && [...sel].every((k) => want.has(k)));
  };
  items.forEach((el) => el.addEventListener('click', () => {
    if (over) return;
    play('tap');
    const k = el.dataset.k;
    if (!q.pick.multi) { sel.add(k); return finish(); }
    if (sel.has(k)) { sel.delete(k); el.classList.remove('sel'); } else { sel.add(k); el.classList.add('sel'); }
  }));
  const okBtn = q.pick.multi ? h('button', { class: 'btn-primary', onclick: () => { if (!over) finish(); } }, 'Xong ✓') : null;
  return h('div', {}, pic, okBtn ? h('div', { class: 'center' }, okBtn) : null);
}

// ---------- Tô màu (phân số, khoanh đồ vật) ----------
function paint(q, done) {
  const pic = picture(q.svg, 'topic-pic pickable paint');
  const sel = new Set();
  let over = false;
  const counter = h('span', { class: 'chip' }, `Đã tô: 0`);
  pic.querySelectorAll('[data-k]').forEach((el) => el.addEventListener('click', () => {
    if (over) return;
    play('pop');
    const k = el.dataset.k;
    if (sel.has(k)) { sel.delete(k); el.classList.remove('on'); } else { sel.add(k); el.classList.add('on'); }
    counter.textContent = `Đã tô: ${sel.size}`;
  }));
  const okBtn = h('button', { class: 'btn-primary', onclick: () => {
    if (over) return;
    over = true;
    done(sel.size === q.paint.need);
  } }, 'Xong ✓');
  return h('div', {}, pic, h('div', { class: 'center' }, counter, ' ', okBtn));
}

// ---------- Sắp xếp thẻ số ----------
function order(q, done) {
  const sorted = [...q.order.items].sort((x, y) => (q.order.asc ? x - y : y - x));
  const slotsRow = h('div', { class: 'order-slots' }, sorted.map(() => h('span', { class: 'order-slot' })));
  const hint = h('p', { class: 'col-hint' }, q.order.asc ? 'Chạm lần lượt từ số BÉ nhất 🐜' : 'Chạm lần lượt từ số LỚN nhất 🐘');
  let i = 0, mistakes = 0;
  const cards = q.order.items.map((v) => h('button', { class: 'order-card', onclick: (e) => tapCard(e.currentTarget, v) }, v));
  function tapCard(el, v) {
    if (el.disabled) return;
    if (v === sorted[i]) {
      play('pop');
      el.disabled = true;
      el.classList.add('used');
      slotsRow.children[i].textContent = v;
      slotsRow.children[i].classList.add('filled');
      i++;
      if (i === sorted.length) done(mistakes === 0, { corrected: mistakes > 0 });
    } else {
      play('bad');
      mistakes++;
      shake(el);
      hint.textContent = `💡 So hàng trăm trước, rồi hàng chục, hàng đơn vị. Số ${q.order.asc ? 'bé' : 'lớn'} nhất còn lại là ${sorted[i]}.`;
    }
  }
  return h('div', {}, slotsRow, h('div', { class: 'order-cards' }, cards), hint);
}

// ---------- Nhiều bước: mỗi bước là một câu con (choice / num) ----------
function steps(q, done, makePad) {
  const box = h('div', { class: 'steps' });
  let k = 0, allOk = true;
  async function run() {
    const s = q.steps[k];
    const line = h('div', { class: 'step' }, h('p', { class: 'step-q' }, `Bước ${k + 1}: ${s.text}`));
    box.querySelectorAll('.step').forEach((el) => el.classList.add('past'));
    box.append(line);
    line.append(renderKind(s, async (ok) => {
      if (!ok) { allOk = false; line.append(h('p', { class: 'step-fix' }, `💡 Đúng là: `, h('b', {}, s.show || s.answer), s.explain ? ` — ${s.explain}` : '')); }
      else play('good');
      await wait(ok ? 600 : 2200);
      line.querySelectorAll('.numpad').forEach((p) => p.remove());
      k++;
      if (k < q.steps.length) run();
      else done(allOk, { corrected: !allOk });
    }, makePad));
    line.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }
  run();
  return box;
}

const KINDS = { choice, num, column, divide, pick, paint, order, steps };

// ---------- Nháp đặt tính cho câu có cộng / trừ ----------
// Lấy các phép + / − trong câu (q.calc, hoặc chữ q.calcText ?? q.text). "a + b − c" → a + b rồi lấy kết quả − c.
function findOps(q) {
  if (q.calc) return q.calc;
  const t = q.calcText ?? q.text;
  if (!t || /×| : |\(|nhẩm|gọi là gì/.test(t)) return [];
  const out = [];
  for (const m of t.match(/\d+(?:\s*[+−-]\s*\d+)+/g) || []) {
    const parts = m.split(/\s*([+−-])\s*/);
    let acc = +parts[0];
    for (let i = 1; i < parts.length; i += 2) {
      const op = parts[i] === '+' ? '+' : '-', b = +parts[i + 1], r = op === '+' ? acc + b : acc - b;
      if (r < 0) return [];
      out.push({ op, a: acc, b });
      acc = r;
    }
  }
  return out.filter((o) => Math.max(o.a, o.b) >= 10);
}

function withScratch(kind, q, done, makePad, ops) {
  let k = 0, scratchPad = null;
  const notes = h('div', { class: 'scratch-notes' });
  const panel = h('div', { class: 'scratch' });
  const btn = h('button', { class: 'scratch-btn', onclick: () => open() });
  const label = () => { btn.textContent = ops.length > 1 ? `✍️ Đặt tính ${k + 1}/${ops.length}` : '✍️ Đặt tính'; };
  const el = KINDS[kind](q, (...a) => { btn.remove(); panel.remove(); done(...a); }, makePad);
  label();
  function close() {
    scratchPad?.setEnabled(false);
    panel.replaceChildren();
    el.style.display = '';
    btn.style.display = k < ops.length ? '' : 'none';
    el.remount?.();
  }
  function open() {
    const o = ops[k], sign = o.op === '+' ? '+' : '−', r = o.op === '+' ? o.a + o.b : o.a - o.b;
    btn.style.display = 'none';
    el.style.display = 'none';
    panel.replaceChildren(
      h('p', { class: 'scratch-title' }, `📝 Nháp: ${o.a} ${sign} ${o.b}`, h('button', { class: 'scratch-x', onclick: close }, '✖')),
      column({ col: o }, async () => {
        notes.append(h('span', { class: 'scratch-note' }, `${o.a} ${sign} ${o.b} = ${r}`));
        k++;
        label();
        await wait(900);
        close();
      }, (opts) => (scratchPad = makePad(opts))),
    );
  }
  return h('div', {}, notes, h('div', { class: 'center' }, btn), panel, el);
}

// Câu nhập số không có phép đặt tính → tự đổi thành trắc nghiệm 4 lựa chọn cho bé bấm nhanh.
// Câu cần rèn viết số thì ghi keypad: true để giữ bàn phím.
function autoChoice(q) {
  const n = +q.answer, spread = n < 10 ? [1, 2] : n < 100 ? [1, 2, 10] : n < 1000 ? [1, 10, 100] : [10, 100, 1000];
  return { ...q, ...numChoice(n, spread, q.unit) };
}

export function renderKind(q, done, makePad) {
  let kind = q.kind || (q.choices ? 'choice' : 'num');
  const ops = ['choice', 'num', 'pick'].includes(kind) ? findOps(q) : [];
  if (kind === 'num' && !ops.length && !q.keypad) { q = autoChoice(q); kind = 'choice'; }
  return ops.length ? withScratch(kind, q, done, makePad, ops) : KINDS[kind](q, done, makePad);
}
