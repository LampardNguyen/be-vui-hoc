// Chương nhóm "Số và phép tính" và "Tìm thành phần".
// Chương: { id, title, emoji, tips, make() → câu luyện (xem js/ui/kinds.js), game() → câu trò chơi (đáp án số) }.
import { rnd, pickOne, shuffle, gq, mix, FRIENDS, THINGS } from './util.js';
import { balance, svg, label, shareSvg } from './draw.js';
import { colSteps } from '../ui/kinds.js';

const TF = ['Đúng', 'Sai'];
const tf = (text, ok, explain) => ({ text, choices: TF, tf: true, answer: ok ? 'Đúng' : 'Sai', explain });
const sign = (a, b) => (a > b ? '>' : a < b ? '<' : '=');
const tilt = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
const cmp = (lt, lv, rt, rv, explain) => ({
  text: 'Cân nghiêng về bên nào? Chọn dấu đúng nhé ⚖️', svg: balance(lt, rt), choices: ['<', '=', '>'],
  answer: sign(lv, rv), tilt: tilt(lv, rv), show: `${lt} ${sign(lv, rv)} ${rt}`, explain,
});

// Kết quả sai "thường gặp" khi quên nhớ / quên mượn.
function slip(op, a, b) {
  const right = op === '+' ? a + b : op === '-' ? a - b : a * b;
  const st = colSteps(op, a, b);
  const k = st.findIndex((s) => s.mark);
  if (k < 0) return right + pickOne([10, -10, 1]);
  return op === '-' ? right + 10 ** (k + 1) : right - 10 ** (k + 1) * (op === '×' ? +st[k].mark : 1);
}

// ---------- So sánh số dưới 1000 ----------
const soSanh = {
  id: 'so-sanh-1000', title: 'So sánh số dưới 1000', emoji: '⚖️',
  tips: [
    'So sánh từ trái sang phải: hàng trăm trước, rồi hàng chục, rồi hàng đơn vị.',
    'Có phép tính thì tính ra kết quả trước, rồi mới so sánh.',
    'Dấu > và < luôn "há miệng" về phía số lớn hơn 🐊.',
  ],
  make: mix([
    [() => {
      const a = rnd(100, 700), b = rnd(10, 250), s = a + b, op = Math.random() < 0.5;
      const lv = op ? s : a, lt = op ? `${a} + ${b}` : `${s} − ${b}`;
      const rv = lv + pickOne([0, rnd(1, 9), -rnd(1, 9), rnd(10, 40), -rnd(10, 40)]);
      return cmp(lt, lv, String(rv), rv, `${lt} = ${lv}, mà ${lv} ${sign(lv, rv)} ${rv}.`);
    }, 3],
    [() => {
      const a = rnd(50, 400), b = rnd(50, 400), c = rnd(50, 400), d = a + b - c + pickOne([0, 0, rnd(1, 20), -rnd(1, 20)]);
      if (d < 0) return soSanh.make();
      return cmp(`${a} + ${b}`, a + b, `${c} + ${d}`, c + d, `Bên trái ${a + b}, bên phải ${c + d}.`);
    }, 2],
    [() => {
      // Các số gần nhau, có số đảo chữ số cho bé phải so kĩ từng hàng.
      const h1 = rnd(1, 8), t1 = rnd(0, 9), u1 = rnd(0, 9), set = new Set([h1 * 100 + t1 * 10 + u1]);
      if (t1 && t1 !== u1) set.add(h1 * 100 + u1 * 10 + t1);
      if (t1 && t1 !== h1) set.add(t1 * 100 + h1 * 10 + u1);
      while (set.size < rnd(4, 5)) set.add(Math.min(999, Math.max(100, h1 * 100 + rnd(-60, 99))));
      const asc = Math.random() < 0.5;
      return { kind: 'order', text: `Xếp các số theo thứ tự từ ${asc ? 'bé đến lớn 🐜→🐘' : 'lớn đến bé 🐘→🐜'}`, order: { items: shuffle([...set]), asc }, show: '', explain: 'So hàng trăm, rồi hàng chục, rồi hàng đơn vị.' };
    }, 2],
    [() => {
      const [f1, f2] = shuffle(FRIENDS).slice(0, 2), [e, name] = pickOne(THINGS);
      const a = rnd(120, 900), b = a + pickOne([rnd(1, 9), -rnd(1, 9), rnd(10, 90) * pickOne([1, -1])]);
      return { text: `${f1} có ${a} ${name} ${e}, ${f2} có ${b} ${name}. Bạn nào có nhiều hơn?`, choices: [f1, f2], answer: a > b ? f1 : f2, explain: `${a} ${sign(a, b)} ${b}.` };
    }, 1],
    [() => {
      const n = rnd(101, 998), after = Math.random() < 0.5;
      return { text: `Số liền ${after ? 'sau' : 'trước'} của ${n} là số nào?`, max: 3, answer: String(after ? n + 1 : n - 1), explain: `Số liền ${after ? 'sau thì thêm' : 'trước thì bớt'} 1.` };
    }, 1],
  ]),
  game() {
    const base = rnd(1, 8) * 100 + rnd(0, 99);
    const nums = shuffle([...new Set([base, base + rnd(1, 9), base + rnd(10, 90), base - rnd(1, 60)])]).slice(0, 3);
    const max = Math.max(...nums);
    const others = nums.filter((n) => n !== max);
    return { text: `Lớn nhất: ${nums.join(', ')}`, ask: `Số nào lớn nhất: ${nums.join(', ')}?`, answer: max, wrong: [...others, max + rnd(1, 5)], reveal: `Số lớn nhất là ${max}` };
  },
};

// ---------- Cộng trừ dưới 1000 ----------
const story = (op, a, b) => {
  const f = pickOne(FRIENDS), [e, name] = pickOne(THINGS);
  return op === '+' ? `${f} có ${a} ${name} ${e}, được tặng thêm ${b} ${name}. Hỏi ${f} có tất cả bao nhiêu ${name}?`
    : `${f} có ${a} ${name} ${e}, đã cho bạn ${b} ${name}. Hỏi ${f} còn lại bao nhiêu ${name}?`;
};
const congTru = {
  id: 'cong-tru-1000', title: 'Cộng trừ dưới 1000', emoji: '➕',
  tips: [
    'Đặt tính thẳng cột: đơn vị dưới đơn vị, chục dưới chục, trăm dưới trăm.',
    'Tính từ phải sang trái. Cộng được 10 trở lên thì viết hàng đơn vị, "nhớ 1" sang hàng bên trái.',
    'Trừ mà không đủ thì "mượn 1" ở hàng bên trái, nhớ bớt 1 ở hàng đó nhé.',
  ],
  make: mix([
    [() => { const a = rnd(100, 800), b = rnd(10, 999 - a); return { kind: 'column', text: 'Đặt tính rồi tính ✍️', col: { op: '+', a, b }, show: a + b }; }, 3],
    [() => { const a = rnd(200, 999), b = rnd(10, a - 10); return { kind: 'column', text: 'Đặt tính rồi tính ✍️', col: { op: '-', a, b }, show: a - b }; }, 3],
    [() => {
      const add = Math.random() < 0.5, a = rnd(150, 700), b = add ? rnd(20, 999 - a) : rnd(20, a - 20);
      return { kind: 'column', text: story(add ? '+' : '-', a, b), col: { op: add ? '+' : '-', a, b }, show: add ? a + b : a - b };
    }, 2],
    [() => {
      const add = Math.random() < 0.5, a = rnd(150, 800), b = add ? rnd(20, 999 - a) : rnd(20, a - 20);
      const right = add ? a + b : a - b, wrongV = slip(add ? '+' : '-', a, b), shown = Math.random() < 0.5 ? right : wrongV;
      return tf(`${pickOne(FRIENDS)} tính: ${a} ${add ? '+' : '−'} ${b} = ${shown}. Bạn ấy tính đúng hay sai? 🤔`, shown === right, `${a} ${add ? '+' : '−'} ${b} = ${right}.`);
    }, 2],
    [() => {
      const a = rnd(1, 8) * 100, b = rnd(1, 9 - a / 100) * 100, add = Math.random() < 0.5;
      return add ? { text: `Tính nhẩm: ${a} + ${b} = ?`, max: 3, answer: String(a + b), explain: `${a / 100} trăm + ${b / 100} trăm = ${(a + b) / 100} trăm.` }
        : { text: `Tính nhẩm: ${a + b} − ${b} = ?`, max: 3, answer: String(a), explain: `${(a + b) / 100} trăm − ${b / 100} trăm = ${a / 100} trăm.` };
    }, 1],
  ]),
  game() {
    if (Math.random() < 0.5) { const a = rnd(20, 500), b = rnd(10, 400); return gq(`${a} + ${b}`, a + b, [1, 10, 100]); }
    const a = rnd(100, 900), b = rnd(10, a); return gq(`${a} − ${b}`, a - b, [1, 10, 100]);
  },
};

// ---------- Nhân, chia số 2–3 chữ số với 1 chữ số ----------
const nhanChiaLon = {
  id: 'nhan-chia-lon', title: 'Nhân, chia số 2–3 chữ số với 1 chữ số', emoji: '🧮',
  tips: [
    'Nhân: lấy số 1 chữ số nhân lần lượt hàng đơn vị, chục, trăm (từ phải sang trái), nhớ sang hàng tiếp theo.',
    'Chia: chia từ trái sang phải, mỗi lượt: chia → nhân → trừ → hạ chữ số tiếp theo.',
    'Thử lại phép chia: thương × số chia = số bị chia.',
  ],
  make: mix([
    [() => { const b = rnd(2, 9), a = Math.random() < 0.5 ? rnd(12, 99) : rnd(101, Math.floor(999 / b)); return { kind: 'column', text: 'Đặt tính rồi tính ✍️', col: { op: '×', a, b }, show: a * b }; }, 3],
    [() => { const b = rnd(2, 9), q = rnd(12, Math.floor(999 / b)); return { kind: 'divide', text: 'Đặt tính rồi tính ➗', div: { a: q * b, b }, show: `${q}`, explain: `${q * b} : ${b} = ${q}` }; }, 3],
    [() => {
      const b = rnd(3, 8), a = rnd(105, Math.floor(999 / b)), [e, name] = pickOne(THINGS);
      return { kind: 'column', text: `Mỗi thùng có ${a} ${name} ${e}. Hỏi ${b} thùng như thế có bao nhiêu ${name}?`, col: { op: '×', a, b }, show: a * b };
    }, 2],
    [() => {
      const b = rnd(2, 6), q = rnd(21, Math.floor(600 / b)), [e, name] = pickOne(THINGS);
      return { kind: 'divide', text: `Có ${q * b} ${name} ${e} chia đều vào ${b} hộp. Mỗi hộp có bao nhiêu ${name}?`, div: { a: q * b, b }, show: `${q}`, explain: `${q * b} : ${b} = ${q}` };
    }, 1],
    [() => {
      const b = rnd(2, 9), a = rnd(12, Math.floor(999 / b)), right = a * b, shown = Math.random() < 0.5 ? right : slip('×', a, b);
      return tf(`${pickOne(FRIENDS)} tính: ${a} × ${b} = ${shown}. Đúng hay sai? 🤔`, shown === right, `${a} × ${b} = ${right}.`);
    }, 1],
  ]),
  game() {
    const b = rnd(2, 9);
    if (Math.random() < 0.5) { const a = rnd(11, Math.floor(999 / b)); return gq(`${a} × ${b}`, a * b, [1, 10, b]); }
    const q = rnd(11, Math.floor(999 / b)); return gq(`${q * b} : ${b}`, q, [1, 10, 2]);
  },
};

// ---------- Phép chia hết và có dư ----------
const chiaDu = {
  id: 'chia-du', title: 'Phép chia hết và có dư', emoji: '🍬',
  tips: [
    'Chia hết: không còn thừa, số dư bằng 0. Ví dụ 12 : 3 = 4.',
    'Chia có dư: 14 : 4 = 3 (dư 2), vì 4 × 3 = 12, 14 − 12 = 2.',
    '⭐ Số dư luôn bé hơn số chia!',
  ],
  make: mix([
    [() => { const b = rnd(2, 9), q = rnd(3, Math.floor(99 / b)), r = rnd(0, b - 1); return { kind: 'divide', text: 'Đặt tính rồi tính, nhớ tìm số dư nhé ➗', div: { a: b * q + r, b }, show: `${q} dư ${r}`, explain: `${b * q + r} : ${b} = ${q} (dư ${r})` }; }, 3],
    [() => {
      const b = rnd(2, 5), q = rnd(1, 5), r = rnd(0, b - 1), n = b * q + r, [e, name] = pickOne([['🍬', 'cái kẹo'], ['🍪', 'cái bánh'], ['🍓', 'quả dâu']]);
      return {
        kind: 'steps', text: `Chia đều ${n} ${name} ${e} cho ${b} bạn.`, svg: shareSvg(b, n, e),
        steps: [
          { text: 'Mỗi bạn được mấy cái?', max: 1, answer: String(q), explain: `${n} : ${b} = ${q}${r ? ` (dư ${r})` : ''}` },
          { text: 'Còn thừa mấy cái?', max: 1, answer: String(r), explain: `${n} − ${b * q} = ${r}` },
        ],
        explain: `${n} : ${b} = ${q}${r ? ` (dư ${r})` : ''}.`,
      };
    }, 2],
    [() => {
      const b = rnd(3, 9), q = rnd(2, 8), r = Math.random() < 0.5 ? rnd(0, b - 1) : rnd(b, b + 2), n = b * q + r;
      return tf(`${pickOne(FRIENDS)} nói: "${n} : ${b} = ${q} dư ${r}". Đúng hay sai?`, r < b,
        r < b ? `${b} × ${q} = ${b * q}, ${n} − ${b * q} = ${r}, và ${r} bé hơn ${b}.` : `Số dư ${r} không bé hơn số chia ${b} nên chưa đúng. Đúng là ${n} : ${b} = ${q + 1}${r - b ? ` (dư ${r - b})` : ''}.`);
    }, 2],
    [() => {
      const exact = () => { const b = rnd(2, 9), q = rnd(2, 9); return `${b * q} : ${b}`; };
      const rem = () => { const b = rnd(3, 9), q = rnd(2, 9); return `${b * q + rnd(1, b - 1)} : ${b}`; };
      const want = Math.random() < 0.5;
      const good = want ? exact() : rem();
      const bad = [want ? rem() : exact(), want ? rem() : exact(), want ? rem() : exact()];
      return { text: `Phép chia nào là phép chia ${want ? 'HẾT' : 'CÓ DƯ'}?`, choices: shuffle([...new Set([good, ...bad])]), answer: good, explain: `${good} là phép chia ${want ? 'hết (dư 0)' : 'có dư'}.` };
    }, 1],
  ]),
  game() {
    const b = rnd(2, 9), q = rnd(2, 9), r = rnd(1, b - 1), a = b * q + r;
    return { text: `${a} : ${b} dư?`, ask: `${a} : ${b} = ${q}, dư mấy?`, answer: r, wrong: shuffle([...new Set([r + 1, Math.max(0, r - 1), b, r + 2])].filter((v) => v !== r)).slice(0, 3), reveal: `${a} : ${b} = ${q} (dư ${r})` };
  },
};

// ---------- Biểu thức số ----------
function expr() {
  const k = rnd(0, 4);
  if (k === 0) { const a = rnd(20, 90), b = rnd(10, 60), c = rnd(5, a + b - 5); return { e: `${a} + ${b} − ${c}`, first: `${a} + ${b}`, mid: a + b, v: a + b - c, rule: 'Chỉ có cộng, trừ: tính từ trái sang phải.', opts: [`${a} + ${b}`, `${b} − ${c}`] }; }
  if (k === 1) { const a = rnd(10, 90), b = rnd(2, 9), c = rnd(2, 9); return { e: `${a} + ${b} × ${c}`, first: `${b} × ${c}`, mid: b * c, v: a + b * c, rule: 'Nhân, chia trước; cộng, trừ sau.', opts: [`${a} + ${b}`, `${b} × ${c}`] }; }
  if (k === 2) { const a = rnd(2, 20), b = rnd(2, 20), c = rnd(2, 9); return { e: `(${a} + ${b}) × ${c}`, first: `${a} + ${b}`, mid: a + b, v: (a + b) * c, rule: 'Có ngoặc thì tính trong ngoặc trước.', opts: [`${a} + ${b}`, `${b} × ${c}`] }; }
  if (k === 3) { const b = rnd(2, 9), q = rnd(2, 9), a = rnd(q + 5, 90); return { e: `${a} − ${b * q} : ${b}`, first: `${b * q} : ${b}`, mid: q, v: a - q, rule: 'Nhân, chia trước; cộng, trừ sau.', opts: [`${a} − ${b * q}`, `${b * q} : ${b}`] }; }
  const a = rnd(2, 9), b = rnd(2, 9), d = pickOne([2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== a));
  return { e: `${a} × ${b} × ${d}`, first: `${a} × ${b}`, mid: a * b, v: a * b * d, rule: 'Chỉ có nhân, chia: tính từ trái sang phải.', opts: [`${a} × ${b}`, `${b} × ${d}`] };
}
const bieuThuc = {
  id: 'bieu-thuc', title: 'Biểu thức số', emoji: '🧾',
  tips: [
    'Chỉ có cộng, trừ (hoặc chỉ có nhân, chia): tính từ trái sang phải.',
    'Có cả cộng/trừ và nhân/chia: tính nhân, chia trước, cộng, trừ sau.',
    'Có dấu ngoặc ( ): tính trong ngoặc trước.',
  ],
  make: mix([
    [() => {
      const x = expr();
      return {
        kind: 'steps', text: `Tính giá trị biểu thức: ${x.e} 🧩`,
        steps: [
          { text: 'Con tính phép nào trước?', choices: shuffle(x.opts), answer: x.first, explain: x.rule },
          { text: `${x.first} = ?`, max: 3, answer: String(x.mid) },
          { text: `Vậy ${x.e} = ?`, max: 3, answer: String(x.v) },
        ],
        explain: x.rule,
      };
    }, 3],
    [() => {
      const x = expr(), others = [expr(), expr(), expr()].filter((y) => y.v !== x.v).map((y) => y.e);
      return { text: `Biểu thức nào có giá trị bằng ${x.v}? 🔎`, choices: shuffle([...new Set([x.e, ...others])].slice(0, 4)), answer: x.e, explain: `${x.e} = ${x.v}. ${x.rule}` };
    }, 2],
    [() => {
      const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 6), l = (a + b) * c, r = a + b * c;
      const swap = Math.random() < 0.5;
      return swap ? cmp(`${a} + ${b} × ${c}`, r, `(${a} + ${b}) × ${c}`, l, `Không ngoặc: ${r}. Có ngoặc: ${l}. Dấu ngoặc làm thay đổi kết quả!`)
        : cmp(`(${a} + ${b}) × ${c}`, l, `${a} + ${b} × ${c}`, r, `Có ngoặc: ${l}. Không ngoặc: ${r}. Dấu ngoặc làm thay đổi kết quả!`);
    }, 1],
    [() => { const x = expr(); return { text: `${x.e} = ?`, max: 3, answer: String(x.v), explain: `${x.rule} ${x.first} = ${x.mid}, rồi ra ${x.v}.` }; }, 1],
  ]),
  game() { const x = expr(); return gq(x.e, x.v, [1, 2, 10]); },
};

// ---------- Gấp mấy lần ----------
function rowsSvg(e1, n1, e2, n2) {
  const row = (e, n, y) => [...Array(n).keys()].map((i) => label(18 + (i % 12) * 24, y + Math.floor(i / 12) * 26, e, 20)).join('');
  const r1 = Math.ceil(n1 / 12);
  return svg(`${row(e1, n1, 20)}<line x1="5" y1="${r1 * 26 + 8}" x2="295" y2="${r1 * 26 + 8}" stroke="#c9cfdb" stroke-width="2" stroke-dasharray="4 4"/>${row(e2, n2, r1 * 26 + 30)}`, `0 0 300 ${r1 * 26 + Math.ceil(n2 / 12) * 26 + 22}`);
}
function tapeSvg(b, k) {
  const u = Math.min(36, 260 / k);
  let big = '';
  for (let i = 0; i < k; i++) big += `<rect x="${20 + i * u}" y="70" width="${u}" height="26" fill="#4cc9f0" stroke="#3a3f58" stroke-width="2"/>`;
  return svg(`<rect x="20" y="20" width="${u}" height="26" fill="#ffd166" stroke="#3a3f58" stroke-width="2"/>${label(20 + u + 30, 33, `${b} cm`, 14)}${big}${label(20 + (k * u) / 2, 112, `? cm`, 14)}`, '0 0 300 125');
}
const gapMayLan = {
  id: 'gap-may-lan', title: 'Số lớn gấp mấy lần số bé', emoji: '📊',
  tips: [
    'Muốn biết số lớn gấp mấy lần số bé: lấy số lớn chia cho số bé.',
    'Ví dụ 12 gấp 3 mấy lần? 12 : 3 = 4 → gấp 4 lần.',
    '"Gấp lên 3 lần" là nhân 3, khác với "thêm 3" là cộng 3 nhé!',
  ],
  make: mix([
    [() => {
      const b = rnd(2, 4), k = rnd(2, 5), [e1, e2] = shuffle(['🐥', '🐟', '🍎', '⭐', '🌼', '🐞']).slice(0, 2);
      return { text: `Hàng trên có ${b * k} ${e1}, hàng dưới có ${b} ${e2}. Số ${e1} gấp mấy lần số ${e2}?`, svg: rowsSvg(e1, b * k, e2, b), max: 1, answer: String(k), explain: `${b * k} : ${b} = ${k}, vậy gấp ${k} lần.` };
    }, 2],
    [() => {
      const b = rnd(2, 9), k = rnd(2, 7);
      return { text: `Đoạn xanh gấp ${k} lần đoạn vàng. Đoạn xanh dài bao nhiêu cm?`, svg: tapeSvg(b, k), max: 2, unit: 'cm', answer: String(b * k), explain: `${b} × ${k} = ${b * k} cm.` };
    }, 2],
    [() => {
      const [f1, f2] = shuffle(FRIENDS).slice(0, 2), [e, name] = pickOne(THINGS), b = rnd(2, 9), k = rnd(2, 9);
      return Math.random() < 0.5
        ? { text: `${f1} có ${b} ${name} ${e}. ${f2} có số ${name} gấp ${k} lần ${f1}. Hỏi ${f2} có bao nhiêu ${name}?`, max: 2, answer: String(b * k), explain: `Gấp lên ${k} lần: ${b} × ${k} = ${b * k}.` }
        : { text: `${f1} có ${b * k} ${name} ${e}, ${f2} có ${b} ${name}. Số ${name} của ${f1} gấp mấy lần của ${f2}?`, max: 1, answer: String(k), explain: `${b * k} : ${b} = ${k}.` };
    }, 2],
    [() => {
      const a = rnd(2, 9), k = rnd(2, 6), plus = Math.random() < 0.5, shown = plus ? a + k : a * k;
      return tf(`${a} gấp lên ${k} lần được ${shown}. Đúng hay sai?`, !plus || a + k === a * k, `Gấp lên ${k} lần là nhân: ${a} × ${k} = ${a * k} (không phải cộng).`);
    }, 1],
  ]),
  game() {
    const b = rnd(2, 9), k = rnd(2, 9);
    return Math.random() < 0.5 ? gq(`${b * k} gấp ${b}`, k, [1, 2], `${b * k} gấp ${b} mấy lần?`, `${b * k} gấp ${b} là ${k} lần`)
      : gq(`${b} gấp ${k} lần`, b * k, [1, b, 10], `Gấp ${b} lên ${k} lần?`, `${b} × ${k} = ${b * k}`);
  },
};

// ---------- Tìm thành phần ----------
const BOX = '🎁';
const RULES = {
  hang: ['Lấy tổng trừ số hạng kia', 'Lấy tổng cộng số hạng kia', 'Lấy số hạng kia trừ tổng'],
  bitru: ['Lấy hiệu cộng số trừ', 'Lấy hiệu trừ số trừ', 'Lấy số trừ trừ hiệu'],
  tru: ['Lấy số bị trừ trừ hiệu', 'Lấy số bị trừ cộng hiệu', 'Lấy hiệu trừ số bị trừ'],
  thua: ['Lấy tích chia thừa số kia', 'Lấy tích nhân thừa số kia', 'Lấy tích trừ thừa số kia'],
  bichia: ['Lấy thương nhân số chia', 'Lấy thương chia số chia', 'Lấy thương cộng số chia'],
  chia: ['Lấy số bị chia chia thương', 'Lấy số bị chia nhân thương', 'Lấy thương chia số bị chia'],
};
const NAME_Q = {
  '+': ['Số hạng', 'Số hạng', 'Tổng'], '-': ['Số bị trừ', 'Số trừ', 'Hiệu'],
  '×': ['Thừa số', 'Thừa số', 'Tích'], ':': ['Số bị chia', 'Số chia', 'Thương'],
};
function findPart(eq, rule, value, calc) {
  return {
    kind: 'steps', text: `Tìm số trong hộp quà: ${eq} 🎁`,
    steps: [
      { text: 'Muốn tìm số trong hộp, con làm thế nào?', choices: shuffle([...RULES[rule]]), answer: RULES[rule][0] },
      { text: `Tính: ${calc} = ?`, max: 3, answer: String(value) },
    ],
    show: value, explain: `${RULES[rule][0]}: ${calc} = ${value}.`,
  };
}
function nameQ(op, x, y) {
  const z = { '+': x + y, '-': x - y, '×': x * y, ':': x / y }[op];
  const i = rnd(0, 2), shown = [x, y, z][i];
  const names = [...new Set(NAME_Q[op])];
  return { text: `Trong phép tính ${x} ${op === '-' ? '−' : op} ${y} = ${z}, số ${shown} gọi là gì?`, choices: names, answer: NAME_Q[op][i], explain: `${x} ${op === '-' ? '−' : op} ${y} = ${z}: ${NAME_Q[op][0].toLowerCase()} ${op} ${NAME_Q[op][1].toLowerCase()} = ${NAME_Q[op][2].toLowerCase()}.` };
}
const tpCongTru = {
  id: 'tp-cong-tru', title: 'Tìm thành phần trong phép cộng, trừ', emoji: '🔍',
  tips: [
    'Số hạng + Số hạng = Tổng. Tìm số hạng: lấy Tổng trừ số hạng kia.',
    'Số bị trừ − Số trừ = Hiệu.',
    'Tìm số bị trừ: lấy Hiệu cộng Số trừ. Tìm số trừ: lấy Số bị trừ trừ Hiệu.',
  ],
  make: mix([
    [() => {
      const x = rnd(15, 450), y = rnd(15, 450), s = x + y;
      return pickOne([
        () => findPart(`${BOX} + ${y} = ${s}`, 'hang', x, `${s} − ${y}`),
        () => findPart(`${x} + ${BOX} = ${s}`, 'hang', y, `${s} − ${x}`),
        () => findPart(`${BOX} − ${y} = ${x}`, 'bitru', s, `${x} + ${y}`),
        () => findPart(`${s} − ${BOX} = ${x}`, 'tru', y, `${s} − ${x}`),
      ])();
    }, 3],
    [() => {
      const x = rnd(15, 300), y = rnd(15, 300);
      return { text: 'Cân thăng bằng! Hộp quà 🎁 nặng bao nhiêu?', svg: balance(`${BOX} + ${y}`, String(x + y)), max: 3, answer: String(x), explain: `${BOX} = ${x + y} − ${y} = ${x}.` };
    }, 2],
    [() => {
      const f = pickOne(FRIENDS), [e, name] = pickOne(THINGS), give = rnd(12, 150), left = rnd(12, 300);
      return { kind: 'column', text: `${f} có một số ${name} ${e}. Sau khi cho bạn ${give} ${name}, ${f} còn ${left} ${name}. Hỏi lúc đầu ${f} có bao nhiêu? (Số bị trừ = Hiệu + Số trừ)`, col: { op: '+', a: left, b: give }, show: left + give };
    }, 1],
    [() => (Math.random() < 0.5 ? nameQ('+', rnd(10, 400), rnd(10, 400)) : (() => { const y = rnd(10, 300), z = rnd(10, 300); return nameQ('-', y + z, y); })()), 2],
  ]),
  game() {
    const x = rnd(10, 400), y = rnd(10, 400), s = x + y;
    return pickOne([
      () => gq(`? + ${y} = ${s}`, x, [1, 10], `? + ${y} = ${s}`, `${x} + ${y} = ${s}`),
      () => gq(`? − ${y} = ${x}`, s, [1, 10], `? − ${y} = ${x}`, `${s} − ${y} = ${x}`),
      () => gq(`${s} − ? = ${x}`, y, [1, 10], `${s} − ? = ${x}`, `${s} − ${y} = ${x}`),
    ])();
  },
};

const tpNhanChia = {
  id: 'tp-nhan-chia', title: 'Tìm thành phần trong phép nhân, chia', emoji: '🔎',
  tips: [
    'Thừa số × Thừa số = Tích. Tìm thừa số: lấy Tích chia thừa số kia.',
    'Số bị chia : Số chia = Thương.',
    'Tìm số bị chia: lấy Thương nhân Số chia. Tìm số chia: lấy Số bị chia chia Thương.',
  ],
  make: mix([
    [() => {
      const a = rnd(2, 9), b = rnd(2, 9), p = a * b;
      return pickOne([
        () => findPart(`${BOX} × ${b} = ${p}`, 'thua', a, `${p} : ${b}`),
        () => findPart(`${a} × ${BOX} = ${p}`, 'thua', b, `${p} : ${a}`),
        () => findPart(`${BOX} : ${b} = ${a}`, 'bichia', p, `${a} × ${b}`),
        () => findPart(`${p} : ${BOX} = ${a}`, 'chia', b, `${p} : ${a}`),
      ])();
    }, 3],
    [() => {
      const b = rnd(2, 9), a = rnd(2, 9), [e, name] = pickOne(THINGS);
      return { text: `Mỗi túi có ${b} ${name} ${e}. Cần mấy túi để có ${a * b} ${name}? (${BOX} × ${b} = ${a * b})`, svg: rowsSvg(e, a * b, '🛍️', 0), max: 1, answer: String(a), explain: `${BOX} = ${a * b} : ${b} = ${a}.` };
    }, 2],
    [() => {
      const a = rnd(2, 9), b = rnd(2, 9);
      return { text: `Cân thăng bằng! Hộp quà 🎁 là số mấy?`, svg: balance(`${BOX} × ${b}`, String(a * b)), max: 2, answer: String(a), explain: `${BOX} = ${a * b} : ${b} = ${a}.` };
    }, 1],
    [() => { const a = rnd(2, 9), b = rnd(2, 9); return Math.random() < 0.5 ? nameQ('×', a, b) : nameQ(':', a * b, b); }, 2],
  ]),
  game() {
    const a = rnd(2, 9), b = rnd(2, 9), p = a * b;
    return pickOne([
      () => gq(`? × ${b} = ${p}`, a, [1, 2], `? × ${b} = ${p}`, `${a} × ${b} = ${p}`),
      () => gq(`? : ${b} = ${a}`, p, [1, b], `? : ${b} = ${a}`, `${p} : ${b} = ${a}`),
      () => gq(`${p} : ? = ${a}`, b, [1, 2], `${p} : ? = ${a}`, `${p} : ${b} = ${a}`),
    ])();
  },
};

export const NUMBER_TOPICS = [soSanh, congTru, nhanChiaLon, chiaDu, bieuThuc, gapMayLan, tpCongTru, tpNhanChia];
