// Chương nhóm "Số và phép tính" và "Tìm thành phần".
// Chương: { id, title, emoji, tips, make() → câu luyện (xem js/ui/kinds.js), game() → câu trò chơi (đáp án số) }.
import { rnd, pickOne, shuffle, gq, mix, FRIENDS, THINGS } from './util.js';
import { balance, svg, label, shareSvg, INK } from './draw.js';
import { colSteps } from '../ui/kinds.js';

const TF = ['Đúng', 'Sai'];
const tf = (text, ok, explain) => ({ text, choices: TF, tf: true, answer: ok ? 'Đúng' : 'Sai', explain });
const sign = (a, b) => (a > b ? '>' : a < b ? '<' : '=');
const tilt = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
const cmp = (lt, lv, rt, rv, explain) => ({
  text: 'Cân nghiêng về bên nào? Chọn dấu đúng nhé ⚖️', svg: balance(lt, rt), choices: ['<', '=', '>'],
  answer: sign(lv, rv), tilt: tilt(lv, rv), calcText: `${lt}; ${rt}`, show: `${lt} ${sign(lv, rv)} ${rt}`, explain,
});

// Kết quả sai "thường gặp" khi quên nhớ / quên mượn.
function slip(op, a, b) {
  const right = op === '+' ? a + b : op === '-' ? a - b : a * b;
  const st = colSteps(op, a, b);
  const k = st.findIndex((s) => s.mark);
  if (k < 0) return right + pickOne([10, -10, 1]);
  return op === '-' ? right + 10 ** (k + 1) : right - 10 ** (k + 1) * (op === '×' ? +st[k].mark : 1);
}

// Đọc số 100–999 bằng chữ: 271 → "hai trăm bảy mươi mốt".
const WORD = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
function readNum(n) {
  const h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, u = n % 10;
  let s = `${WORD[h]} trăm`;
  if (!t && !u) return s;
  if (!t) return `${s} linh ${WORD[u]}`;
  s += t === 1 ? ' mười' : ` ${WORD[t]} mươi`;
  if (u) s += ` ${u === 5 ? 'lăm' : u === 1 && t > 1 ? 'mốt' : u === 4 && t > 1 ? 'tư' : WORD[u]}`;
  return s;
}
const digits = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];

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
    [() => {
      // Tổng các trăm, chục, đơn vị so với một số.
      const n = rnd(101, 989), [h, t, u] = digits(n), lt = [h * 100, t * 10, u].filter((v) => v).join(' + ');
      const rv = pickOne([n, n, h * 100 + u * 10 + t, n + pickOne([1, -1, 10, -10])]);
      return Math.random() < 0.5 ? cmp(lt, n, String(rv), rv, `${lt} = ${n}, mà ${n} ${sign(n, rv)} ${rv}.`)
        : cmp(String(rv), rv, lt, n, `${lt} = ${n}, mà ${rv} ${sign(rv, n)} ${n}.`);
    }, 2],
    [() => {
      // Dãy số đếm thêm / bớt 1, điền các ô trống.
      const up = Math.random() < 0.5, len = 7, start = up ? rnd(100, 990) : rnd(108, 1000);
      const seq = [...Array(len)].map((_, i) => (up ? start + i : start - i));
      const holes = shuffle([1, 2, 3, 4, 5]).slice(0, 2).sort((a, b) => a - b);
      const row = seq.map((v, i) => (holes.includes(i) ? '❓' : v)).join(' → ');
      return {
        kind: 'steps', text: `Điền số còn thiếu (đếm ${up ? 'thêm' : 'bớt'} 1): ${row}`,
        steps: holes.map((i, k) => ({ text: `Ô ❓ thứ ${k + 1} là số nào?`, max: 4, answer: String(seq[i]) })),
        explain: seq.join(', '),
      };
    }, 2],
    [() => {
      const n = rnd(100, 999), [h, t, u] = digits(n);
      if (Math.random() < 0.5) return { text: `Số gồm ${h} trăm, ${t} chục và ${u} đơn vị là số nào?`, max: 3, answer: String(n), explain: `${h * 100} + ${t * 10} + ${u} = ${n}.` };
      return {
        kind: 'steps', text: `Số ${n} gồm mấy trăm, mấy chục, mấy đơn vị? 🧱`,
        steps: [['trăm', h], ['chục', t], ['đơn vị', u]].map(([w, v]) => ({ text: `Số ${w}?`, max: 1, answer: String(v) })),
        explain: `${n} = ${h * 100} + ${t * 10} + ${u}.`,
      };
    }, 2],
    [() => {
      // Đọc số: chọn cách đọc đúng (số dễ nhầm: 0 ở giữa, 1, 4, 5 ở hàng đơn vị).
      const n = rnd(1, 9) * 100 + pickOne([0, rnd(1, 9), rnd(1, 9) * 10, rnd(2, 9) * 10 + pickOne([1, 4, 5]), 10 + rnd(1, 9)]);
      const [h, t, u] = digits(n), opts = new Set([readNum(n)]);
      for (const m of [h * 100 + u * 10 + t, h * 100 + t * 10 + (u + 1) % 10, ((h % 9) + 1) * 100 + t * 10 + u, h * 100 + ((t + 1) % 10) * 10 + u]) {
        if (opts.size < 4 && m >= 100 && m !== n) opts.add(readNum(m));
      }
      if (Math.random() < 0.6) return { text: `Số ${n} đọc là gì? 🗣️`, choices: shuffle([...opts]), answer: readNum(n), explain: `${n}: ${readNum(n)}.` };
      return { text: `Viết số: "${readNum(n)}" ✏️`, max: 3, answer: String(n), explain: `${readNum(n)}: ${n}.` };
    }, 2],
    [() => {
      const n = rnd(101, 999), [h, t, u] = digits(n);
      if (!t || !u) return { text: `Viết ${n} thành tổng các trăm, chục, đơn vị. Số trăm là bao nhiêu?`, max: 3, answer: String(h * 100), explain: `${n} = ${[h * 100, t * 10, u].filter((v) => v).join(' + ')}.` };
      const k = rnd(0, 2), parts = [h * 100, t * 10, u], shown = parts.map((v, i) => (i === k ? '❓' : v)).join(' + ');
      return { text: `${n} = ${shown}. Số ❓ là bao nhiêu?`, max: 3, answer: String(parts[k]), explain: `${n} = ${parts.join(' + ')}.` };
    }, 1],
    [() => {
      // Ba số liên tiếp, có thể đếm xuôi hoặc ngược.
      const m = rnd(101, 998), up = Math.random() < 0.5, k = rnd(0, 2);
      const seq = up ? [m - 1, m, m + 1] : [m + 1, m, m - 1];
      return { text: `Tìm số ở ô ❓ để được ba số liên tiếp: ${seq.map((v, i) => (i === k ? '❓' : v)).join(', ')}`, max: 3, answer: String(seq[k]), explain: `${seq.join(', ')} là ba số liên tiếp.` };
    }, 1],
    [() => {
      // Ba con vật, tìm con nặng nhất / nhẹ nhất.
      const [e1, e2, e3] = shuffle(['🐷', '🐶', '🐑', '🐐', '🐼']);
      const base = rnd(90, 800), w = shuffle([base, base + rnd(2, 19), base + rnd(20, 60)]);
      const s = [...w].sort((a, b) => a - b), choices = w.map(String);
      return {
        kind: 'steps', text: `Ba bạn ${e1}${e2}${e3} nặng ${w.join(' kg, ')} kg.`,
        steps: [
          { text: 'Bạn nặng nhất nặng bao nhiêu kg?', choices, answer: String(s[2]) },
          { text: 'Bạn nhẹ nhất nặng bao nhiêu kg?', choices, answer: String(s[0]) },
          { text: 'Bạn còn lại nặng bao nhiêu kg?', choices, answer: String(s[1]) },
        ],
        explain: `${s[0]} < ${s[1]} < ${s[2]}.`,
      };
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
    [() => {
      // Tính nhẩm tròn chục / tròn trăm, có cả 100 và 1000.
      const big = Math.random() < 0.5, u = big ? 100 : 10, x = rnd(1, 9) * u, tot = 10 * u;
      return pickOne([
        { text: `Tính nhẩm: ${x} + ${tot - x} = ?`, max: 4, answer: String(tot), explain: `${x / u} ${big ? 'trăm' : 'chục'} + ${10 - x / u} ${big ? 'trăm' : 'chục'} = 10 ${big ? 'trăm = 1000' : 'chục = 100'}.` },
        { text: `Tính nhẩm: ${tot} − ${x} = ?`, max: 3, answer: String(tot - x), explain: `${tot} − ${x} = ${tot - x}.` },
      ]);
    }, 1],
    [() => {
      // Gọi đúng tên thành phần: số hạng, tổng, số bị trừ, số trừ, hiệu.
      if (Math.random() < 0.5) { const a = rnd(20, 600), b = rnd(10, 999 - a); return { kind: 'column', text: `Số hạng là ${a} và ${b}. Tìm tổng ✍️`, col: { op: '+', a, b }, show: a + b }; }
      const a = rnd(100, 1000), b = rnd(10, a - 10);
      return { kind: 'column', text: `Số bị trừ là ${a}, số trừ là ${b}. Tìm hiệu ✍️`, col: { op: '-', a, b }, show: a - b };
    }, 2],
    [() => {
      // Chuỗi phép tính: □ → +x → ○ → −y → △
      const s = rnd(100, 500), x = rnd(10, 999 - s), m = s + x, y = rnd(10, m - 10), e = m - y;
      const body = `<rect x="6" y="40" width="64" height="44" rx="6" fill="#90be6d" stroke="${INK}" stroke-width="3"/>${label(38, 62, s)}
        <line x1="72" y1="62" x2="114" y2="62" stroke="${INK}" stroke-width="3"/><path d="M114 56 L124 62 L114 68 Z" fill="${INK}"/>${label(98, 36, `+ ${x}`, 15)}
        <circle cx="152" cy="62" r="26" fill="#fff" stroke="${INK}" stroke-width="3"/>${label(152, 62, '?')}
        <line x1="180" y1="62" x2="222" y2="62" stroke="${INK}" stroke-width="3"/><path d="M222 56 L232 62 L222 68 Z" fill="${INK}"/>${label(206, 36, `− ${y}`, 15)}
        <polygon points="266,30 296,90 236,90" fill="#fff" stroke="${INK}" stroke-width="3"/>${label(266, 70, '?')}`;
      return {
        kind: 'steps', text: 'Số? Đi theo mũi tên nhé ➡️', svg: svg(body, '0 20 300 80'),
        steps: [
          { text: `Hình tròn: ${s} + ${x} = ?`, max: 4, answer: String(m) },
          { text: `Hình tam giác: ${m} − ${y} = ?`, max: 3, answer: String(e) },
        ],
        explain: `${s} + ${x} = ${m}; ${m} − ${y} = ${e}.`,
      };
    }, 2],
    [() => {
      // Những chum có kết quả lớn hơn một số: chạm chọn nhiều.
      const lim = rnd(10, 60) * 10, jars = [], keys = 'ABCD';
      while (jars.length < 4) {
        const add = Math.random() < 0.5, v = lim + pickOne([rnd(5, 120), -rnd(5, 120), rnd(1, 9), 0]);
        if (v < 20 || v > 989) continue;
        const b = rnd(10, add ? v - 10 : 999 - v), a = add ? v - b : v + b;
        jars.push([add ? `${a} + ${b}` : `${a} − ${b}`, v]);
      }
      if (!jars.some(([, v]) => v > lim)) jars[0] = [`${lim} + ${rnd(5, 9)}`, lim + 9];
      const body = jars.map(([t], i) => {
        const x = 75 + (i % 2) * 150, y = 60 + Math.floor(i / 2) * 105;
        return `<g data-k="${keys[i]}"><ellipse cx="${x}" cy="${y}" rx="68" ry="46" fill="#b5651d" stroke="${INK}" stroke-width="3" class="vis"/><rect x="${x - 22}" y="${y - 54}" width="44" height="12" rx="4" fill="#7a3e0c"/>${label(x, y, t, 17, '#fff')}${label(x, y + 30, keys[i], 14, '#ffe8c2')}</g>`;
      }).join('');
      const correct = jars.map(([, v], i) => (v > lim ? keys[i] : '')).filter(Boolean);
      return { kind: 'pick', text: `Chạm vào TẤT CẢ các chum có kết quả LỚN HƠN ${lim} rồi bấm Xong 🏺`, svg: svg(body, '0 0 300 215'), calcText: jars.map(([t]) => t).join('; '), pick: { multi: true, correct }, show: `chum ${correct.join(', ')}`, explain: jars.map(([t, v], i) => `${keys[i]}: ${t} = ${v}`).join('; ') + '.' };
    }, 2],
    [() => {
      // Toán 2 bước: ít hơn / nhiều hơn rồi tính tổng; hoặc tổng và hiệu.
      if (Math.random() < 0.5) {
        const a = rnd(100, 450), d = rnd(10, 90), less = Math.random() < 0.5, b = less ? a - d : a + d;
        return {
          kind: 'steps', text: `Khối lớp Ba có ${a} học sinh, khối lớp Bốn có ${less ? 'ít' : 'nhiều'} hơn khối lớp Ba ${d} học sinh 🏫`,
          steps: [
            { text: 'Khối lớp Bốn có bao nhiêu học sinh?', calcText: `${a} ${less ? '−' : '+'} ${d}`, max: 3, answer: String(b), explain: `${a} ${less ? '−' : '+'} ${d} = ${b}` },
            { text: 'Cả hai khối có bao nhiêu học sinh?', calcText: `${a} + ${b}`, max: 3, answer: String(a + b), explain: `${a} + ${b} = ${a + b}` },
          ],
          explain: `Lớp Bốn: ${a} ${less ? '−' : '+'} ${d} = ${b}; cả hai: ${a} + ${b} = ${a + b}.`,
        };
      }
      const a = rnd(30, 70) * 10, b = rnd(5, a / 10 - 5) * 10;
      return {
        kind: 'steps', text: `Con trâu 🐃 nặng ${a} kg, con nghé 🐄 nặng ${b} kg.`,
        steps: [
          { text: 'Cả hai con nặng tất cả bao nhiêu ki-lô-gam?', calcText: `${a} + ${b}`, max: 4, answer: String(a + b) },
          { text: 'Con trâu nặng hơn con nghé bao nhiêu ki-lô-gam?', calcText: `${a} − ${b}`, max: 3, answer: String(a - b) },
        ],
        explain: `${a} + ${b} = ${a + b} (kg); ${a} − ${b} = ${a - b} (kg).`,
      };
    }, 2],
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
    // ----- Chia số có 2 chữ số cho số có 1 chữ số (như sách) -----
    [() => {
      const b = rnd(2, 9), q = rnd(1, Math.floor(9 / b)) * 10;
      return { text: `Tính nhẩm: ${q * b} : ${b} = ?`, max: 2, answer: String(q), explain: `${q * b / 10} chục : ${b} = ${q / 10} chục = ${q}.` };
    }, 1],
    [() => {
      const b = rnd(2, 5), q = rnd(11, Math.floor(99 / b)), left = Math.random() < 0.5;
      return { text: left ? `${b} × ? = ${q * b}` : `? × ${b} = ${q * b}`, max: 2, answer: String(q), explain: `Lấy tích chia cho thừa số kia: ${q * b} : ${b} = ${q}.` };
    }, 1],
    [() => {
      const b = rnd(2, 4), q = rnd(11, Math.floor(99 / b));
      const opts = shuffle([...new Set([q, q + 10, q - 1, Math.floor(q / 10) + (q % 10) * 10].filter((v) => v > 0))]).slice(0, 4);
      if (!opts.includes(q)) opts[0] = q;
      return { text: `Nối phép tính với kết quả: ${q * b} : ${b} = ?`, choices: shuffle(opts), answer: q, explain: `${q * b} : ${b} = ${q}.` };
    }, 1],
    [() => {
      const b = rnd(2, 5), q = rnd(11, Math.floor(99 / b)), [txt, unit] = pickOne([
        [`Lớp 3A có ${q * b} học sinh. Cô giáo chia đều thành ${b} tổ. Hỏi mỗi tổ có bao nhiêu học sinh?`, 'học sinh'],
        [`Bác Hoa mang ${q * b} quả trứng gà ra chợ, chia đều vào ${b} rổ. Hỏi mỗi rổ có bao nhiêu quả trứng?`, 'quả trứng'],
      ]);
      return { kind: 'divide', text: txt, div: { a: q * b, b }, show: `${q}`, explain: `${q * b} : ${b} = ${q} (${unit}).` };
    }, 2],
    // Như sách: Đúng/Sai một phép chia đã làm sẵn (lỗi hay gặp: số dư không bé hơn số chia).
    [() => {
      const b = rnd(3, 6), q = rnd(11, Math.floor(95 / b)), r = rnd(0, b - 1), a = q * b + r, wrong = Math.random() < 0.5 && q > 11;
      const sq = wrong ? q - 1 : q, sr = wrong ? r + b : r;
      return tf(`${pickOne(FRIENDS)} làm: ${a} : ${b} = ${sq}${sr ? ` (dư ${sr})` : ''}.`, !wrong, wrong ? `Số dư ${sr} không bé hơn số chia ${b} nên sai. Đúng là ${a} : ${b} = ${q}${r ? ` (dư ${r})` : ''}.` : `${b} × ${q} = ${q * b}${r ? `, ${a} − ${q * b} = ${r}` : ''}.`);
    }, 1],
    // Như sách: phép chia nào có số dư bằng k.
    [() => {
      for (;;) {
        const k = rnd(1, 3), mk = (rr) => { const b = rnd(rr + 1, 9), q = rnd(5, Math.floor(90 / b)); return [`${q * b + rr} : ${b}`, rr]; };
        const good = mk(k), bad = [0, 1, 2, 4].filter((x) => x !== k).slice(0, 3).map((x) => mk(x));
        const all = [good, ...bad].map((x) => x[0]);
        if (new Set(all).size < 4) continue;
        return { text: `Phép chia nào có số dư là ${k}?`, choices: shuffle(all), answer: good[0], explain: `${good[0]} có số dư ${k}.` };
      }
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
  id: 'gap-may-lan', title: 'Gấp mấy lần, giảm một số lần', emoji: '📊',
  tips: [
    'Muốn biết số lớn gấp mấy lần số bé: lấy số lớn chia cho số bé.',
    'Ví dụ 12 gấp 3 mấy lần? 12 : 3 = 4 → gấp 4 lần.',
    '"Gấp lên 3 lần" là nhân 3, khác với "thêm 3" là cộng 3 nhé!',
    'Giảm một số đi 3 lần: lấy số đó chia 3. Ví dụ 27 giảm 3 lần còn 9.',
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
    // ----- Gấp một số lên một số lần (như sách) -----
    [() => {
      const a = rnd(3, 15), k = rnd(2, 8), mul = Math.random() < 0.5;
      return mul ? { text: `${a} → gấp ${k} lần → ?`, max: 3, answer: String(a * k), explain: `Gấp ${k} lần là nhân: ${a} × ${k} = ${a * k}.` }
        : { text: `${a} → thêm ${k} đơn vị → ?`, max: 2, answer: String(a + k), explain: `Thêm ${k} đơn vị là cộng: ${a} + ${k} = ${a + k}.` };
    }, 2],
    [() => {
      const a = rnd(2, 10), m = rnd(2, 5), k = rnd(2, 7);
      return { text: `${a} → thêm ${m} đơn vị → ? → gấp ${k} lần → ? Số cuối cùng là mấy?`, max: 3, answer: String((a + m) * k), explain: `${a} + ${m} = ${a + m}, rồi ${a + m} × ${k} = ${(a + m) * k}.` };
    }, 1],
    // Như bài chú kiến: từ a qua đường hầm ra b, đường nào đúng?
    [() => {
      const a = rnd(3, 12), k = rnd(2, 9), mul = Math.random() < 0.5;
      const b = mul ? a * k : a + k, other = mul ? `thêm ${k} đơn vị` : `gấp ${k} lần`, right = mul ? `gấp ${k} lần` : `thêm ${k} đơn vị`;
      return { text: `🐜 Chú kiến mang số ${a} qua đường hầm, ra thành số ${b}. Đường hầm là:`, choices: shuffle([right, other]), answer: right, explain: mul ? `${a} × ${k} = ${b}.` : `${a} + ${k} = ${b}.` };
    }, 2],
    [() => {
      const k = rnd(2, 9), [txt, ans, ex] = pickOne([
        (() => { const c = rnd(5, 10), kk = rnd(3, 5); return [`Năm nay con ${c} tuổi, tuổi bố gấp ${kk} lần tuổi con. Hỏi năm nay bố bao nhiêu tuổi?`, c * kk, `${c} × ${kk} = ${c * kk} (tuổi).`]; })(),
        [`Trong phòng có ${k} cái bàn. Mỗi bàn xếp 2 cái ghế. Hỏi cần bao nhiêu cái ghế?`, k * 2, `${k} × 2 = ${k * 2} (cái ghế).`],
      ]);
      return { text: txt, max: 2, answer: String(ans), explain: ex };
    }, 2],
    [() => {
      const a = rnd(11, 49), k = rnd(2, Math.min(9, Math.floor(99 / a)));
      return { text: `${a} gấp ${k} lần là bao nhiêu?`, max: 2, answer: String(a * k), explain: `${a} × ${k} = ${a * k}.` };
    }, 1],
    // ----- Giảm một số đi một số lần (như sách) -----
    [() => {
      const k = rnd(2, 9), r = rnd(2, 9), n = r * k;
      return { text: `${n} → giảm ${k} lần → ?`, max: 2, answer: String(r), explain: `Giảm ${k} lần là chia ${k}: ${n} : ${k} = ${r}.` };
    }, 2],
    [() => {
      const up = Math.random() < 0.5, k1 = rnd(2, 7), k2 = rnd(2, 5);
      let a = rnd(2, 14), mid, end;
      if (up) { while ((a * k1) % k2) a = rnd(2, 14); mid = a * k1; end = mid / k2; }
      else { mid = rnd(2, 13); a = mid * k1; end = mid * k2; }
      const t = up ? `${a} → gấp ${k1} lần → ? → giảm ${k2} lần → ?` : `${a} → giảm ${k1} lần → ? → gấp ${k2} lần → ?`;
      return { text: `${t} Số cuối cùng là mấy?`, max: 3, answer: String(end), explain: up ? `${a} × ${k1} = ${mid}, rồi ${mid} : ${k2} = ${end}.` : `${a} : ${k1} = ${mid}, rồi ${mid} × ${k2} = ${end}.` };
    }, 2],
    [() => {
      const f = pickOne(FRIENDS), k = rnd(2, 6), r = rnd(3, 16), n = r * k;
      const [what, before] = pickOne([['nhãn vở', 'Sau khi cho các bạn một số nhãn vở'], ['cây bút màu', 'Sau khoá học vẽ'], ['viên bi', 'Sau khi chơi'], ['quả cam', 'Sau khi đem biếu ông bà']]);
      return { text: `${f} có ${n} ${what}. ${before}, số ${what} còn lại so với lúc đầu giảm đi ${k} lần. Hỏi ${f} còn lại bao nhiêu ${what}?`, max: 2, answer: String(r), explain: `Giảm đi ${k} lần: ${n} : ${k} = ${r} (${what}).` };
    }, 2],
    [() => {
      const k = rnd(2, 6), r = rnd(2, 9), n = r * k, minus = Math.random() < 0.5;
      return tf(`${n} giảm đi ${k} lần được ${minus ? n - k : r}.`, !minus || n - k === r, `Giảm ${k} lần là chia: ${n} : ${k} = ${r} (khác với "bớt đi ${k}" là trừ).`);
    }, 1],
    // Rô-bốt chọn đường: mỗi đường gồm 2 phép gấp/giảm.
    [() => {
      for (;;) {
        const s = pickOne([12, 18, 24, 30, 36, 40, 48]), ops = shuffle([['gấp', 2], ['gấp', 3], ['gấp', 4], ['giảm', 2], ['giảm', 3], ['giảm', 4], ['giảm', 5], ['giảm', 6]]);
        const ap = (x, [o, k]) => (o === 'gấp' ? x * k : x / k);
        const paths = [[ops[0], ops[1]], [ops[2], ops[3]], [ops[4], ops[5]]].map((p) => ({ p, v: ap(ap(s, p[0]), p[1]) }));
        if (!paths.every((x) => Number.isInteger(x.v) && Number.isInteger(ap(s, x.p[0])))) continue;
        if (new Set(paths.map((x) => x.v)).size < 3) continue;
        const name = (p) => `${p[0][0]} ${p[0][1]} lần rồi ${p[1][0]} ${p[1][1]} lần`;
        return { text: `Rô-bốt có ${s} đồng vàng 🤖. Đi đường nào để có ${paths[0].v} đồng vàng?`, choices: shuffle(paths.map((x) => name(x.p))), answer: name(paths[0].p),
          explain: `${s} ${paths[0].p[0][0] === 'gấp' ? '×' : ':'} ${paths[0].p[0][1]} = ${ap(s, paths[0].p[0])}, rồi ${paths[0].p[1][0] === 'gấp' ? '×' : ':'} ${paths[0].p[1][1]} = ${paths[0].v}.` };
      }
    }, 2],
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
// Sơ đồ đoạn thẳng: cả đoạn = tổng, chia 2 phần (p1, p2); null = ô "?".
function tapeSvg2(total, p1, p2, n1, n2) {
  const v1 = p1 ?? total - p2, w = Math.max(70, Math.min(190, Math.round((v1 / (total ?? p1 + p2)) * 260)));
  const box = (x, y, t) => `<rect x="${x - 26}" y="${y - 15}" width="52" height="30" rx="6" fill="${t === '?' ? '#fff3c4' : '#fff'}" stroke="${t === '?' ? '#f4a261' : INK}" stroke-width="2"/>${label(x, y, t, 16)}`;
  return svg(`<path d="M20 52 Q20 38 150 38 Q280 38 280 52" fill="none" stroke="${INK}" stroke-width="2"/>${box(150, 20, total ?? '?')}
    <rect x="20" y="58" width="${w}" height="26" rx="5" fill="#90be6d" stroke="${INK}" stroke-width="2"/>${label(20 + w / 2, 71, n1, 13, '#fff')}
    <rect x="${20 + w}" y="58" width="${260 - w}" height="26" rx="5" fill="#f78c6b" stroke="${INK}" stroke-width="2"/>${label(150 + w / 2, 71, n2, 13, '#fff')}
    ${box(20 + w / 2, 108, p1 ?? '?')}${box(150 + w / 2, 108, p2 ?? '?')}`, '0 0 300 128');
}

// Bảng 3 hàng (tên thành phần), mỗi cột có 1 ô "?".
function tableSvg(names, cols) {
  const cw = (300 - 92) / cols.length;
  let body = '';
  names.forEach((n, r) => {
    const y = 6 + r * 36;
    body += `<rect x="2" y="${y}" width="90" height="36" fill="#ffe8c2" stroke="${INK}" stroke-width="1.5"/>${label(47, y + 18, n, 13)}`;
    cols.forEach((c, i) => {
      const x = 92 + i * cw, q = c[r] === null;
      body += `<rect x="${x}" y="${y}" width="${cw}" height="36" fill="${q ? '#fff3c4' : '#fff'}" stroke="${INK}" stroke-width="1.5"/>${label(x + cw / 2, y + 18, q ? `?${i + 1}` : c[r], 15, q ? '#e76f51' : INK)}`;
    });
  });
  return svg(body, '0 0 300 116');
}

// Bài tìm thành phần có lời văn: [câu chuyện, cách tính, đáp án].
const tpStories = [
  (a, b) => [`Hai bến có tất cả ${a + b} thuyền ⛵, bến thứ nhất có ${a} thuyền. Hỏi bến thứ hai có bao nhiêu thuyền?`, `${a + b} − ${a}`, b],
  (a, b) => [`Lúc đầu có ${a + b} con vịt 🦆 ở trên bờ. Một số con xuống ao bơi, trên bờ còn lại ${a} con. Hỏi có bao nhiêu con vịt xuống ao?`, `${a + b} − ${a}`, b],
  (a, b) => [`${pickOne(FRIENDS)} có một số viên bi 🔵, đã cho bạn ${b} viên, còn lại ${a} viên. Hỏi lúc đầu có bao nhiêu viên bi?`, `${a} + ${b}`, a + b],
  (a, b) => [`Một vườn có ${a + b} cây 🌳 gồm cây cam và cây bưởi, trong đó có ${a} cây cam. Hỏi có bao nhiêu cây bưởi?`, `${a + b} − ${a}`, b],
];

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
    [() => {
      // Sơ đồ: tổng gồm 2 phần, tìm 1 phần (hoặc tìm tổng).
      const [e, name] = pickOne(THINGS), a = rnd(10, 400), b = rnd(10, 400), k = rnd(0, 2);
      const parts = [a + b, a, b].map((v, i) => (i === k ? null : v));
      const calc = k === 0 ? `${a} + ${b}` : k === 1 ? `${a + b} − ${b}` : `${a + b} − ${a}`;
      const ans = [a + b, a, b][k];
      return { text: `Nhìn sơ đồ ${e}: có tất cả ${parts[0] ?? '?'} ${name}, phần xanh ${parts[1] ?? '?'}, phần cam ${parts[2] ?? '?'}. Số ? là bao nhiêu?`, svg: tapeSvg2(parts[0], parts[1], parts[2], 'xanh', 'cam'), max: 3, answer: String(ans), calcText: calc, explain: k ? `Tìm một phần: lấy tổng trừ phần kia, ${calc} = ${ans}.` : `${calc} = ${ans}.` };
    }, 2],
    [() => {
      // Bảng Số hạng / Tổng hoặc Số bị trừ / Số trừ / Hiệu, mỗi cột 1 ô "?".
      const add = Math.random() < 0.5, names = add ? ['Số hạng', 'Số hạng', 'Tổng'] : ['Số bị trừ', 'Số trừ', 'Hiệu'];
      const cols = [...Array(3)].map(() => {
        const x = rnd(10, 300), y = rnd(10, 300), full = add ? [x, y, x + y] : [x + y, y, x], k = rnd(0, 2);
        return { full, k, show: full.map((v, i) => (i === k ? null : v)) };
      });
      const how = (c) => (add ? (c.k === 2 ? `${c.full[0]} + ${c.full[1]}` : `${c.full[2]} − ${c.full[1 - c.k]}`)
        : c.k === 0 ? `${c.full[2]} + ${c.full[1]}` : c.k === 1 ? `${c.full[0]} − ${c.full[2]}` : `${c.full[0]} − ${c.full[1]}`);
      return {
        kind: 'steps', text: 'Số? Điền các ô ? trong bảng 📋', svg: tableSvg(names, cols.map((c) => c.show)),
        steps: cols.map((c, i) => ({ text: `Ô ?${i + 1} (${names[c.k]}) là số nào?`, calcText: how(c), max: 3, answer: String(c.full[c.k]), explain: `${how(c)} = ${c.full[c.k]}` })),
        explain: cols.map((c, i) => `?${i + 1} = ${how(c)} = ${c.full[c.k]}`).join('; ') + '.',
      };
    }, 2],
    [() => {
      // Chọn câu trả lời đúng: biết 2 thành phần, tìm thành phần còn lại.
      const y = rnd(11, 90), z = rnd(11, 90), bitru = Math.random() < 0.5;
      const [given, ans, wrongOp] = bitru ? [`Biết số trừ là ${y}, hiệu là ${z}, số bị trừ là:`, y + z, Math.abs(y - z)]
        : [`Biết số bị trừ là ${y + z}, hiệu là ${z}, số trừ là:`, y, y + 2 * z];
      const opts = [...new Set([ans, wrongOp, ans + pickOne([10, -10])])].filter((v) => v > 0);
      while (opts.length < 3) opts.push(ans + 10 * opts.length + 1);
      const keys = ['A', 'B', 'C'], sh = shuffle(opts);
      return { text: `Chọn câu trả lời đúng: ${given}`, calcText: bitru ? `${z} + ${y}` : `${y + z} − ${z}`, choices: sh.map((v, i) => `${keys[i]}. ${v}`), answer: `${keys[sh.indexOf(ans)]}. ${ans}`, explain: bitru ? `Số bị trừ = hiệu + số trừ = ${z} + ${y} = ${ans}.` : `Số trừ = số bị trừ − hiệu = ${y + z} − ${z} = ${ans}.` };
    }, 2],
    [() => {
      const [text, calc, ans] = pickOne(tpStories)(rnd(15, 400), rnd(12, 300));
      return { text, calcText: calc, max: 3, answer: String(ans), explain: `${calc} = ${ans}.` };
    }, 2],
    [() => {
      // Hình viên bi: gạch các viên đã cho, tìm số lúc đầu / số đã cho.
      const give = rnd(2, 6), left = rnd(2, 6), n = give + left, findGive = Math.random() < 0.5;
      const balls = [...Array(n)].map((_, i) => `<circle cx="${22 + i * 26}" cy="30" r="11" fill="#e63946" stroke="${INK}" stroke-width="2"/>${i < give && !findGive ? `<line x1="${13 + i * 26}" y1="39" x2="${31 + i * 26}" y2="21" stroke="${INK}" stroke-width="2.5"/>` : ''}`).join('');
      return findGive
        ? { text: `Nam có ${n} viên bi, cho bạn một số viên, còn lại ${left} viên. Hỏi Nam đã cho bạn mấy viên? (Số trừ = Số bị trừ − Hiệu)`, svg: svg(balls, `0 0 ${n * 26 + 18} 60`), max: 2, answer: String(give), explain: `${n} − ${left} = ${give} (viên).` }
        : { text: `Việt đã cho bạn ${give} viên bi (bị gạch), còn lại ${left} viên. Hỏi lúc đầu Việt có bao nhiêu viên? (Số bị trừ = Hiệu + Số trừ)`, svg: svg(balls, `0 0 ${n * 26 + 18} 60`), max: 2, answer: String(n), explain: `${left} + ${give} = ${n} (viên).` };
    }, 1],
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

// Mũi tên ngược: ? →(op k)→ kết quả. Bé tìm số ban đầu.
function arrowSvg(op, k, res) {
  return svg(`<rect x="10" y="22" width="56" height="50" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/>${label(38, 47, '?', 22)}
    <line x1="68" y1="47" x2="214" y2="47" stroke="${INK}" stroke-width="3"/><path d="M214 40 L228 47 L214 54 Z" fill="${INK}"/>${label(146, 26, `${op} ${k}`, 18)}
    <circle cx="258" cy="47" r="28" fill="${pickOne(['#90be6d', '#ffd166', '#ff8fab', '#4cc9f0'])}" stroke="${INK}" stroke-width="3"/>${label(258, 47, res, 20)}`, '0 0 300 90');
}
// n ca nước giống nhau, mỗi ca "?", ngoặc dưới ghi tổng.
function jugsSvg(n, total, unit) {
  const w = Math.min(60, 270 / n);
  let body = '';
  for (let i = 0; i < n; i++) {
    const x = 15 + i * w;
    body += `<rect x="${x + 4}" y="20" width="${w - 14}" height="56" rx="6" fill="#bde0fe" stroke="${INK}" stroke-width="2"/><rect x="${x + 2}" y="14" width="${w - 10}" height="8" rx="3" fill="#ff8fab"/>${label(x + w / 2 - 3, 50, '?', 15, '#e76f51')}`;
  }
  return svg(`${body}<path d="M15 88 Q15 98 ${15 + (n * w) / 2} 98 Q${15 + n * w} 98 ${15 + n * w} 88" fill="none" stroke="${INK}" stroke-width="2"/>${label(15 + (n * w) / 2, 114, `${total} ${unit}`, 15)}`, `0 0 ${Math.max(300, 30 + n * w)} 126`);
}

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
    [() => {
      // Bảng Thừa số / Tích hoặc Số bị chia / Số chia / Thương, mỗi cột 1 ô "?".
      const mul = Math.random() < 0.5, names = mul ? ['Thừa số', 'Thừa số', 'Tích'] : ['Số bị chia', 'Số chia', 'Thương'];
      const cols = [...Array(3)].map(() => {
        const x = rnd(2, 9), y = rnd(2, 9), full = mul ? [x, y, x * y] : [x * y, y, x], k = rnd(0, 2);
        return { full, k, show: full.map((v, i) => (i === k ? null : v)) };
      });
      const how = (c) => (mul ? (c.k === 2 ? `${c.full[0]} × ${c.full[1]}` : `${c.full[2]} : ${c.full[1 - c.k]}`)
        : c.k === 0 ? `${c.full[2]} × ${c.full[1]}` : c.k === 1 ? `${c.full[0]} : ${c.full[2]}` : `${c.full[0]} : ${c.full[1]}`);
      return {
        kind: 'steps', text: 'Số? Điền các ô ? trong bảng 📋', svg: tableSvg(names, cols.map((c) => c.show)),
        steps: cols.map((c, i) => ({ text: `Ô ?${i + 1} (${names[c.k]}) là số nào?`, max: 2, answer: String(c.full[c.k]), explain: `${how(c)} = ${c.full[c.k]}` })),
        explain: cols.map((c, i) => `?${i + 1} = ${how(c)} = ${c.full[c.k]}`).join('; ') + '.',
      };
    }, 2],
    [() => {
      // Như sách: ? →×2→ 8, ? →:5→ 6.
      const k = rnd(2, 9), r = rnd(2, 9), mul = Math.random() < 0.5;
      return mul ? { text: 'Số ở ô vuông là bao nhiêu? (đi ngược mũi tên ⬅️)', svg: arrowSvg('×', k, k * r), max: 2, answer: String(r), explain: `? × ${k} = ${k * r} → ? = ${k * r} : ${k} = ${r} (tìm thừa số).` }
        : { text: 'Số ở ô vuông là bao nhiêu? (đi ngược mũi tên ⬅️)', svg: arrowSvg(':', k, r), max: 2, answer: String(k * r), explain: `? : ${k} = ${r} → ? = ${r} × ${k} = ${k * r} (tìm số bị chia).` };
    }, 2],
    [() => {
      // Toán lời văn theo sách: tìm thừa số, số bị chia, số chia.
      const n = rnd(2, 6), each = rnd(2, 9), t = n * each;
      return pickOne([
        () => ({ text: `${n} ca đựng nước như nhau có tất cả ${t} l nước. Hỏi mỗi ca đựng mấy lít nước?`, svg: jugsSvg(n, t, 'l'), max: 1, unit: 'l', answer: String(each), explain: `? × ${n} = ${t} → ${t} : ${n} = ${each} (l).` }),
        () => ({ text: `${n} ca-bin 🚡 chở tất cả ${t} người, số người ở mỗi ca-bin như nhau. Hỏi mỗi ca-bin chở bao nhiêu người?`, max: 1, answer: String(each), explain: `${t} : ${n} = ${each} (người).` }),
        () => ({ text: `Mai cắm hết số bông hoa 🌻 vào ${n} lọ, mỗi lọ ${each} bông. Hỏi Mai có bao nhiêu bông hoa? (? : ${n} = ${each})`, max: 2, answer: String(t), explain: `Tìm số bị chia: ${each} × ${n} = ${t} (bông).` }),
        () => ({ text: `Có ${t} quả cam 🍊 xếp vào các đĩa, mỗi đĩa ${each} quả. Hỏi xếp được mấy đĩa? (${t} : ? = ${each})`, max: 1, answer: String(n), explain: `Tìm số chia: ${t} : ${each} = ${n} (đĩa).` }),
      ])();
    }, 3],
    [() => {
      // Chọn câu trả lời đúng A/B/C.
      const a = rnd(2, 9), b = rnd(2, 9), kind = rnd(0, 2);
      const [given, ans, w1] = [
        [`Biết số chia là ${b}, thương là ${a}, số bị chia là:`, a * b, a + b],
        [`Biết số bị chia là ${a * b}, thương là ${a}, số chia là:`, b, a * b - a],
        [`Biết tích là ${a * b}, một thừa số là ${a}, thừa số kia là:`, b, a * b + a],
      ][kind];
      const opts = [...new Set([ans, w1, ans + pickOne([1, 2, 10])])];
      while (opts.length < 3) opts.push(ans + opts.length * 3);
      const keys = ['A', 'B', 'C'], sh = shuffle(opts);
      return { text: `Chọn câu trả lời đúng: ${given}`, choices: sh.map((v, i) => `${keys[i]}. ${v}`), answer: `${keys[sh.indexOf(ans)]}. ${ans}`, explain: [`Số bị chia = thương × số chia = ${a} × ${b} = ${a * b}.`, `Số chia = số bị chia : thương = ${a * b} : ${a} = ${b}.`, `Thừa số = tích : thừa số kia = ${a * b} : ${a} = ${b}.`][kind] };
    }, 2],
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
