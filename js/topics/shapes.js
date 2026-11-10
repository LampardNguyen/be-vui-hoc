// Chương Đo lường, Phân số và Hình học — hình vẽ ngẫu nhiên (js/topics/draw.js).
import { rnd, pickOne, shuffle, fmt, gq, mix, FRIENDS } from './util.js';
import {
  INK, SOFT, HI, COLORS, rad, svg, label, dot, tapLine, tapDot, balance, ruler, thermometer, weights,
  shape, shapeField, polygonPick, place, cubeStack, box, fracShape, itemGrid,
} from './draw.js';

const TF = ['Đúng', 'Sai'];
const tf = (text, ok, explain, pic) => ({ text, choices: TF, tf: true, answer: ok ? 'Đúng' : 'Sai', explain, svg: pic });
const sign = (a, b) => (a > b ? '>' : a < b ? '<' : '=');

// ---------- Đổi đơn vị đo ----------
const LENGTH = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
const MASS = ['kg', 'hg', 'dag', 'g'];
const SIZES = [
  ['Chiếc bút chì dài khoảng', [14, 18], 'cm'], ['Cái bàn học cao khoảng', [6, 8], 'dm'], ['Cột cờ cao khoảng', [8, 15], 'm'],
  ['Quãng đường từ nhà bà tới thành phố dài khoảng', [20, 90], 'km'], ['Con kiến dài khoảng', [3, 6], 'mm'],
  ['Quả trứng gà nặng khoảng', [50, 60], 'g'], ['Bao gạo nặng khoảng', [10, 25], 'kg'], ['Quyển vở nặng khoảng', [100, 200], 'g'],
  ['Con mèo nặng khoảng', [3, 5], 'kg'],
];
const TEMPS = [['Nước đang sôi', 100], ['Nước đá đang tan', 0], ['Cơ thể người khỏe mạnh', 37], ['Một ngày hè nóng bức', 35]];
const donVi = {
  id: 'don-vi', title: 'Đổi đơn vị đo', emoji: '🌡️',
  tips: [
    'Độ dài từ lớn đến bé: km → hm → dam → m → dm → cm → mm. Mỗi đơn vị gấp 10 lần đơn vị liền sau.',
    'Khối lượng: kg → hg → dag → g. 1 kg = 1000 g.',
    'Nhiệt độ đo bằng nhiệt kế, đơn vị độ C (°C): nước đá 0°C, cơ thể người 37°C, nước sôi 100°C.',
  ],
  make: mix([
    [() => {
      const from = rnd(0, 4), len = rnd(2, 9), e = pickOne(['✏️', '🖍️', '🐛', '🔑', '🥖']);
      return { text: 'Vật này dài mấy xăng-ti-mét? 📏', svg: ruler(14, from, from + len, e), max: 2, unit: 'cm', answer: String(len), explain: from ? `Đầu vật ở vạch ${from}, cuối ở vạch ${from + len}: ${from + len} − ${from} = ${len} cm.` : `Đầu vật ở vạch 0, cuối ở vạch ${len} → ${len} cm.` };
    }, 2],
    [() => {
      const v = rnd(0, 20) * 5;
      return { text: 'Nhiệt kế chỉ bao nhiêu độ C? 🌡️', svg: thermometer(v), max: 3, unit: '°C', answer: String(v), explain: `Mỗi vạch dài là 10°C, vạch ngắn ở giữa là 5°C. Cột đỏ tới ${v}°C.` };
    }, 2],
    [() => {
      const list = shuffle([pickOne([0, 1000]), pickOne([0, 500]), pickOne([200, 100, 0]), pickOne([100, 200]), pickOne([0, 50])]).filter(Boolean);
      const total = list.reduce((s, w) => s + w, 0), e = pickOne(['🍉', '🎃', '🍍', '🥥', '🧸']);
      return { text: 'Cân thăng bằng. Vật bên trái nặng bao nhiêu gam?', svg: weights(e, list), max: 4, unit: 'g', answer: String(total), explain: `Cộng các quả cân: ${list.map((w) => `${w} g`).join(' + ')} = ${fmt(total)} g.` };
    }, 2],
    [() => {
      const [t, [lo, hi], u] = pickOne(SIZES), n = rnd(lo, hi), all = u === 'g' || u === 'kg' ? ['g', 'kg'] : ['mm', 'cm', 'dm', 'm', 'km'];
      return { text: `${t} ${n} … (chọn đơn vị hợp lý) 🤔`, choices: shuffle([u, ...shuffle(all.filter((x) => x !== u)).slice(0, 2)]), answer: u, explain: `${t} ${n} ${u}.` };
    }, 2],
    [() => {
      const units = Math.random() < 0.35 ? MASS : LENGTH;
      const i = rnd(0, units.length - 2), j = Math.min(units.length - 1, i + rnd(1, 3)), f = 10 ** (j - i), n = rnd(1, 9);
      if (j - i === 1 && Math.random() < 0.5) {
        const m = rnd(1, 9);
        return { text: `${n} ${units[i]} ${m} ${units[j]} = ? ${units[j]}`, max: 3, unit: units[j], answer: String(n * f + m), explain: `${n} ${units[i]} = ${n * f} ${units[j]}, thêm ${m} ${units[j]} là ${n * f + m} ${units[j]}.` };
      }
      return { text: `${n} ${units[i]} = ? ${units[j]}`, max: 4, unit: units[j], answer: String(n * f), explain: `1 ${units[i]} = ${fmt(f)} ${units[j]}, nên ${n} ${units[i]} = ${fmt(n * f)} ${units[j]}.` };
    }, 2],
    [() => {
      const i = rnd(2, 4), n = rnd(2, 9), u = LENGTH[i + 1], lv = n * 10, rv = lv + pickOne([0, 1, -1, 5, -5]);
      const lt = `${n} ${LENGTH[i]}`, rt = `${rv} ${u}`;
      return { text: 'So sánh hai độ dài ⚖️', svg: balance(lt, rt), choices: ['<', '=', '>'], answer: sign(lv, rv), tilt: lv > rv ? -1 : lv < rv ? 1 : 0, show: `${lt} ${sign(lv, rv)} ${rt}`, explain: `${lt} = ${lv} ${u}, so với ${rv} ${u}.` };
    }, 1],
    [() => {
      const [t, v] = pickOne(TEMPS);
      return { text: `🌡️ ${t} có nhiệt độ khoảng bao nhiêu?`, choices: shuffle(['0°C', '37°C', '35°C', '100°C']), answer: `${v}°C`, explain: `${t}: khoảng ${v}°C.` };
    }, 1],
  ]),
  game() {
    const k = rnd(0, 3), n = rnd(1, 9);
    if (k === 0) return gq(`${n} m = ? dm`, n * 10, [1, 10], `${n} m = ? dm`, `${n} m = ${n * 10} dm`);
    if (k === 1) return gq(`${n} dm = ? cm`, n * 10, [1, 10], `${n} dm = ? cm`, `${n} dm = ${n * 10} cm`);
    if (k === 2) return gq(`${n} m = ? cm`, n * 100, [10, 100], `${n} m = ? cm`, `${n} m = ${n * 100} cm`);
    return gq(`${n} cm = ? mm`, n * 10, [1, 10], `${n} cm = ? mm`, `${n} cm = ${n * 10} mm`);
  },
};

// ---------- Một phần mấy ----------
const motPhan = {
  id: 'mot-phan', title: 'Một phần mấy', emoji: '🍰',
  tips: [
    'Chia hình thành n phần BẰNG NHAU, tô 1 phần → đã tô 1/n hình.',
    'Phải chia đều! Chia không đều thì phần tô không phải 1/n.',
    'Tìm 1/n của một số: lấy số đó chia cho n. 1/3 của 12 quả táo là 12 : 3 = 4 quả.',
  ],
  make: mix([
    [() => {
      const n = pickOne([2, 3, 4, 5, 6, 8]);
      return { kind: 'paint', text: `Con hãy tô màu 1/${n} hình nhé 🖍️ (chạm vào phần muốn tô)`, svg: fracShape(n, { tap: true }), paint: { need: 1 }, show: 'tô đúng 1 phần', explain: `Hình chia ${n} phần bằng nhau, tô 1 phần là 1/${n}.` };
    }, 2],
    [() => {
      const n = pickOne([2, 3, 4, 5]), k = rnd(2, 3), e = pickOne(['🍎', '🍊', '🐟', '⭐', '🍓', '🎈']);
      return { kind: 'paint', text: `Khoanh vào 1/${n} số ${e} (chạm để chọn)`, svg: itemGrid(n * k, e), paint: { need: k }, show: `${k} ${e}`, explain: `Có ${n * k} ${e}, 1/${n} là ${n * k} : ${n} = ${k}.` };
    }, 2],
    [() => {
      const n = pickOne([3, 4, 5, 6]);
      const opts = shuffle([
        { value: 'ok', svg: fracShape(n, { shade: [rnd(0, n - 1)] }) },
        { value: 'bad1', svg: fracShape(n, { shade: [0], equal: false, kind: pickOne(['bar', 'pie']) }) },
        { value: 'bad2', svg: fracShape(n, { shade: [0, 1] }) },
        { value: 'bad3', svg: fracShape(n === 3 ? 4 : n - 1, { shade: [0] }) },
      ]);
      return { text: `Hình nào đã tô màu 1/${n}? 🔍`, choices: opts, answer: 'ok', show: 'hình viền xanh', explain: `Cần chia ${n} phần BẰNG NHAU và tô đúng 1 phần.` };
    }, 2],
    [() => {
      const n = rnd(2, 9);
      const opts = shuffle([...new Set([n, n === 2 ? 3 : n - 1, n === 9 ? 8 : n + 1, rnd(2, 9)])]).slice(0, 4);
      if (!opts.includes(n)) opts[0] = n;
      return { text: 'Phần tô màu là một phần mấy của hình?', svg: fracShape(n, { shade: [rnd(0, n - 1)] }), choices: shuffle(opts).map((k) => `1/${k}`), answer: `1/${n}`, explain: `Hình chia thành ${n} phần bằng nhau, tô 1 phần → 1/${n}.` };
    }, 1],
    [() => {
      const n = rnd(2, 9), k = rnd(2, 9), f = pickOne(FRIENDS);
      return { text: `${f} có ${n * k} viên bi, cho em 1/${n} số bi. ${f} đã cho em mấy viên?`, max: 2, answer: String(k), explain: `1/${n} của ${n * k} là ${n * k} : ${n} = ${k}.` };
    }, 1],
  ]),
  game() { const n = rnd(2, 9), k = rnd(2, 9); return gq(`1/${n} của ${n * k}`, k, [1, 2], `1/${n} của ${n * k} là?`, `1/${n} của ${n * k} là ${k}`); },
};

// ---------- Trung điểm ----------
function lineRot(len) {
  const a = rad(rnd(-35, 35)), cx = 150, cy = 105;
  return (t) => [cx + (t - 0.5) * len * Math.cos(a), cy + (t - 0.5) * len * Math.sin(a)];
}
const trungDiem = {
  id: 'trung-diem', title: 'Điểm ở giữa, trung điểm', emoji: '📍',
  tips: [
    'M là điểm ở giữa A và B khi A, M, B thẳng hàng và M nằm giữa hai điểm đó.',
    'M là trung điểm của AB khi M ở giữa A, B VÀ MA = MB.',
    'Trung điểm chia đoạn thẳng thành 2 phần bằng nhau: AM = AB : 2.',
  ],
  make: mix([
    [() => {
      const N = 14, half = rnd(2, 6), s = rnd(0, N - 2 * half), W = 260 / N, x = (i) => 20 + i * W;
      let body = `<line x1="${x(0)}" y1="100" x2="${x(N)}" y2="100" stroke="#c9cfdb" stroke-width="3"/><line x1="${x(s)}" y1="100" x2="${x(s + 2 * half)}" y2="100" stroke="${INK}" stroke-width="5"/>`;
      for (let i = 0; i <= N; i++) {
        if (i === s || i === s + 2 * half) continue;
        body += `<g data-k="${i}"><rect x="${x(i) - W / 2}" y="70" width="${W}" height="70" fill="transparent"/><line x1="${x(i)}" y1="90" x2="${x(i)}" y2="110" stroke="${INK}" stroke-width="2" class="vis"/>${label(x(i), 128, i, 11)}</g>`;
      }
      body += dot(x(s), 100, 'A') + dot(x(s + 2 * half), 100, 'B') + label(x(s), 128, s, 11) + label(x(s + 2 * half), 128, s + 2 * half, 11);
      return { kind: 'pick', text: 'Chạm vào vạch là TRUNG ĐIỂM của đoạn AB 📍', svg: svg(body, '0 60 300 85'), pick: { correct: [s + half] }, show: `vạch ${s + half}`, explain: `AB dài ${2 * half} ô, trung điểm cách A ${half} ô → vạch ${s + half}.` };
    }, 3],
    [() => {
      const P = lineRot(rnd(200, 250)), [ax, ay] = P(0), [bx, by] = P(1);
      const [mx, my] = P(0.5), [sx, sy] = P(pickOne([0.28, 0.72]));
      const L = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / L, ny = (bx - ax) / L;
      const names = shuffle(['C', 'D', 'E']);
      const pts = shuffle([[mx, my, 'mid'], [sx, sy, 'side'], [mx + nx * 42, my + ny * 42, 'off']]);
      const body = `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${INK}" stroke-width="4"/>${dot(ax, ay, 'A', 0, -18)}${dot(bx, by, 'B', 0, -18)}`
        + pts.map(([x, y, k], i) => `<g data-k="${k}"><circle cx="${x}" cy="${y}" r="22" fill="transparent"/><circle cx="${x}" cy="${y}" r="7" fill="${HI}" class="vis"/>${label(x, y + 22, names[i])}</g>`).join('');
      const midName = names[pts.findIndex((p) => p[2] === 'mid')];
      return { kind: 'pick', text: 'Chạm vào điểm là trung điểm của đoạn AB', svg: svg(body, '0 0 300 210'), pick: { correct: ['mid'] }, show: `điểm ${midName}`, explain: `Điểm ${midName} nằm trên AB và cách đều A, B.` };
    }, 2],
    [() => {
      const kind = rnd(0, 2), P = lineRot(rnd(200, 250)), [ax, ay] = P(0), [bx, by] = P(1);
      let [mx, my] = P(kind === 0 ? 0.5 : pickOne([0.25, 0.32, 0.68, 0.75]));
      if (kind === 2) my -= 45;
      const pic = svg(`<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${INK}" stroke-width="4"/>${dot(ax, ay, 'A')}${dot(bx, by, 'B')}${dot(mx, my, 'M', 0, 22)}`, '0 20 300 180');
      const answer = ['Trung điểm', 'Điểm ở giữa', 'Không ở giữa'][kind];
      return { text: 'Điểm M là gì của đoạn AB?', svg: pic, choices: ['Trung điểm', 'Điểm ở giữa', 'Không ở giữa'], answer, explain: ['M nằm giữa A, B và MA = MB → trung điểm.', 'M nằm giữa A và B nhưng MA khác MB → chỉ là điểm ở giữa.', 'M không nằm trên đoạn AB → không ở giữa A và B.'][kind] };
    }, 2],
    [() => {
      const ab = rnd(2, 12) * 2;
      return Math.random() < 0.5
        ? { text: `Đoạn AB dài ${ab} cm, M là trung điểm của AB. Đoạn AM dài mấy cm?`, max: 2, unit: 'cm', answer: String(ab / 2), explain: `AM = AB : 2 = ${ab} : 2 = ${ab / 2} cm.` }
        : { text: `M là trung điểm của AB, AM dài ${ab / 2} cm. Đoạn AB dài mấy cm?`, max: 2, unit: 'cm', answer: String(ab), explain: `AB = AM × 2 = ${ab / 2} × 2 = ${ab} cm.` };
    }, 1],
  ]),
  game() {
    const ab = rnd(2, 15) * 2;
    return Math.random() < 0.5 ? gq(`AB=${ab} → AM`, ab / 2, [1, 2], `AB = ${ab} cm, M là trung điểm. AM = ?`, `AM = ${ab} : 2 = ${ab / 2} cm`)
      : gq(`AM=${ab / 2} → AB`, ab, [1, 2, 10], `M là trung điểm, AM = ${ab / 2} cm. AB = ?`, `AB = ${ab / 2} × 2 = ${ab} cm`);
  },
};

// ---------- Hình tròn ----------
function gridCircle(rr) {
  let g = '';
  for (let i = 0; i <= 10; i++) g += `<line x1="${i * 20}" y1="0" x2="${i * 20}" y2="200" stroke="#dde3f0"/><line x1="0" y1="${i * 20}" x2="200" y2="${i * 20}" stroke="#dde3f0"/>`;
  return svg(`${g}<circle cx="100" cy="100" r="${rr * 20}" fill="none" stroke="${INK}" stroke-width="4"/>${dot(100, 100, '')}<line x1="100" y1="100" x2="${100 + rr * 20}" y2="100" stroke="${HI}" stroke-width="3"/>`, '0 0 200 200');
}
const hinhTron = {
  id: 'hinh-tron', title: 'Hình tròn: tâm, bán kính, đường kính', emoji: '⭕',
  tips: [
    'Tâm O là điểm chính giữa hình tròn.',
    'Bán kính: đoạn thẳng nối tâm O với một điểm trên đường tròn. Các bán kính dài bằng nhau.',
    'Đường kính: đoạn thẳng đi qua tâm, nối 2 điểm trên đường tròn. Đường kính = 2 × bán kính.',
  ],
  make: mix([
    [() => {
      const R = 80, O = [150, 105], pt = (d) => [O[0] + R * Math.cos(rad(d)), O[1] + R * Math.sin(rad(d))];
      const want = pickOne(['radius', 'diameter']), base = rnd(0, 359);
      const all = shuffle([
        ['radius', ...O, ...pt(base)],
        ['radius', ...O, ...pt(base + rnd(100, 160))],
        ['diameter', ...pt(base + 200), ...pt(base + 20)],
        ['chord', ...pt(base + 60), ...pt(base + 60 + rnd(70, 110))],
      ]);
      const segs = all.slice(0, rnd(3, 4));
      if (!segs.some((s) => s[0] === want)) segs[0] = all.find((s) => s[0] === want);
      const body = `<circle cx="${O[0]}" cy="${O[1]}" r="${R}" fill="${SOFT}" stroke="${INK}" stroke-width="3"/>`
        + segs.map(([k, x1, y1, x2, y2], i) => tapLine(`${i}:${k}`, x1, y1, x2, y2, COLORS[(i + 2) % COLORS.length], 6)).join('') + dot(O[0], O[1], 'O', 16, 16);
      const correct = segs.map((s, i) => `${i}:${s[0]}`).filter((k) => k.endsWith(want));
      return { kind: 'pick', text: `Chạm vào TẤT CẢ các ${want === 'radius' ? 'bán kính' : 'đường kính'} rồi bấm Xong`, svg: svg(body, '0 10 300 195'), pick: { multi: true, correct }, show: `${correct.length} đoạn viền xanh`, explain: want === 'radius' ? 'Bán kính nối tâm O với đường tròn.' : 'Đường kính đi qua tâm O, nối 2 điểm trên đường tròn.' };
    }, 3],
    [() => {
      const R = 80, O = [150 + rnd(-10, 10), 105 + rnd(-8, 8)];
      const fakes = [...Array(3)].map(() => { const a = rad(rnd(0, 359)), d = rnd(30, 60); return [O[0] + d * Math.cos(a), O[1] + d * Math.sin(a)]; });
      const pts = shuffle([[...O, 'c'], ...fakes.map((p, i) => [...p, `f${i}`])]);
      return { kind: 'pick', text: 'Chạm vào TÂM của hình tròn 🎯', svg: svg(`<circle cx="${O[0]}" cy="${O[1]}" r="${R}" fill="${SOFT}" stroke="${INK}" stroke-width="3"/>${pts.map(([x, y, k]) => tapDot(k, x, y)).join('')}`, '0 10 300 195'), pick: { correct: ['c'] }, show: 'điểm chính giữa', explain: 'Tâm cách đều mọi điểm trên đường tròn.' };
    }, 2],
    [() => {
      const r = rnd(2, 4), opts = shuffle([r, r === 2 ? 4 : r - 1, 5]).map((v) => ({ value: v, svg: gridCircle(v) }));
      return { text: `Hình tròn nào có bán kính dài ${r} ô? (đếm ô từ tâm ra) 🔍`, choices: opts, answer: r, show: `hình có bán kính ${r} ô`, explain: `Đếm từ tâm tới đường tròn được ${r} ô.` };
    }, 2],
    [() => {
      const r = rnd(2, 12);
      return Math.random() < 0.5
        ? { text: `Hình tròn có bán kính ${r} cm. Đường kính dài mấy cm?`, max: 2, unit: 'cm', answer: String(r * 2), explain: `Đường kính = 2 × bán kính = 2 × ${r} = ${r * 2} cm.` }
        : { text: `Hình tròn có đường kính ${r * 2} cm. Bán kính dài mấy cm?`, max: 2, unit: 'cm', answer: String(r), explain: `Bán kính = đường kính : 2 = ${r * 2} : 2 = ${r} cm.` };
    }, 1],
    [() => {
      const r = rnd(2, 9), d = Math.random() < 0.5 ? r * 2 : pickOne([r + 2, r * 3, r]);
      return tf(`Hình tròn tâm O có bán kính ${r} cm thì đường kính dài ${d} cm.`, d === r * 2, `Đường kính = 2 × ${r} = ${r * 2} cm.`);
    }, 1],
  ]),
  game() {
    const r = rnd(2, 20);
    return Math.random() < 0.5 ? gq(`Bán kính ${r} → đ.kính`, r * 2, [1, 2], `Bán kính ${r} cm. Đường kính = ?`, `Đường kính = 2 × ${r} = ${r * 2} cm`)
      : gq(`Đ.kính ${r * 2} → bán kính`, r, [1, 2], `Đường kính ${r * 2} cm. Bán kính = ?`, `Bán kính = ${r * 2} : 2 = ${r} cm`);
  },
};

// ---------- Góc vuông ----------
// Đa giác mẫu (toạ độ quanh 0), kích thước ngẫu nhiên; góc vuông được tính tự động.
const POLYS = [
  () => { const w = rnd(80, 140), hh = rnd(50, 90); return [[0, 0], [w, 0], [w, hh], [0, hh]]; },
  () => { const w = rnd(80, 130), hh = rnd(60, 100); return [[0, 0], [w, hh], [0, hh]]; },
  () => { const w = rnd(110, 150), t = rnd(40, 80), hh = rnd(60, 90); return [[0, 0], [t, 0], [w, hh], [0, hh]]; },
  () => { const w = rnd(100, 140), hh = rnd(70, 100), c = rnd(25, 45); return [[0, 0], [w, 0], [w, hh - c], [w - c, hh], [0, hh]]; },
  () => { const w = rnd(90, 130), hh = rnd(50, 70), r = rnd(30, 50); return [[0, 0], [w, 0], [w, hh], [w / 2, hh + r], [0, hh]]; },
  () => { const w = rnd(90, 140); return [[0, 0], [w, rnd(-25, 25)], [w + rnd(-30, 30), rnd(60, 90)], [rnd(-25, 25), rnd(60, 90)]]; },
];
function angleSvg(deg, base) {
  const L = 80, end = (d) => [100 + L * Math.cos(rad(d)), 100 - L * Math.sin(rad(d))];
  const [x1, y1] = end(base), [x2, y2] = end(base + deg);
  return svg(`<line x1="100" y1="100" x2="${x1}" y2="${y1}" stroke="${INK}" stroke-width="5"/><line x1="100" y1="100" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="5"/><circle cx="100" cy="100" r="6" fill="${HI}"/>`, '10 10 180 180');
}
const goc = {
  id: 'goc', title: 'Góc vuông, góc không vuông', emoji: '📐',
  tips: [
    'Góc gồm 1 đỉnh và 2 cạnh xuất phát từ đỉnh đó.',
    'Góc vuông giống góc của quyển vở, góc bảng, góc cửa sổ.',
    'Dùng ê ke để kiểm tra: góc khít với góc vuông của ê ke là góc vuông.',
  ],
  make: mix([
    [() => {
      let p;
      do p = polygonPick(place(pickOne(POLYS)())); while (!p.right.length);
      return { kind: 'pick', text: 'Chạm vào TẤT CẢ các đỉnh có góc vuông rồi bấm Xong 📐', svg: p.svg, pick: { multi: true, correct: p.right }, show: `góc ${p.right.join(', ')}`, explain: `Góc vuông ở đỉnh ${p.right.join(', ')} (${p.right.length} góc).` };
    }, 3],
    [() => {
      const p = polygonPick(place(pickOne(POLYS)()));
      return { text: 'Hình này có mấy góc vuông? (dùng ê ke tưởng tượng nhé)', svg: p.svg, max: 1, answer: String(p.right.length), explain: p.right.length ? `Góc vuông ở đỉnh ${p.right.join(', ')}.` : 'Không có góc nào vuông.' };
    }, 2],
    [() => {
      const base = rnd(0, 359), degs = [90, ...shuffle([rnd(30, 65), rnd(115, 150), rnd(70, 78)]).slice(0, 2)];
      return { text: 'Góc nào là góc vuông? ✅', choices: shuffle(degs.map((d) => ({ value: d === 90 ? 'v' : `n${d}`, svg: angleSvg(d, base + rnd(-40, 40)) }))), answer: 'v', show: 'góc viền xanh', explain: 'Hai cạnh của góc vuông vuông góc với nhau, giống góc tờ giấy.' };
    }, 2],
    [() => {
      const right = Math.random() < 0.5, ang = right ? 90 : pickOne([rnd(35, 70), rnd(110, 150)]);
      return { text: 'Đây là góc gì?', svg: angleSvg(ang, rnd(0, 359)), choices: ['Góc vuông', 'Góc không vuông'], answer: right ? 'Góc vuông' : 'Góc không vuông', explain: right ? 'Hai cạnh vuông góc, khít ê ke → góc vuông.' : `Góc này ${ang < 90 ? 'hẹp hơn' : 'rộng hơn'} góc vuông.` };
    }, 1],
  ]),
  game() {
    const k = rnd(2, 6), [e, n] = pickOne([['⬜', 4], ['▭', 4], ['◺', 1]]);
    return gq(`${k} ${e} → góc vuông`, k * n, [1, 2, 4], `${k} hình ${e} có tất cả mấy góc vuông?`, `${k} × ${n} = ${k * n} góc vuông`);
  },
};

// ---------- Tam giác, tứ giác, vuông, chữ nhật ----------
const SH = { tri: 'hình tam giác', square: 'hình vuông', rect: 'hình chữ nhật', quad: 'hình tứ giác', circle: 'hình tròn' };
const cap = (s) => s[0].toUpperCase() + s.slice(1);
function field(target, n = rnd(7, 8)) {
  const others = Object.keys(SH).filter((t) => t !== target);
  const types = shuffle([...Array(rnd(2, 3)).fill(target), ...[...Array(n)].map(() => pickOne(others))]).slice(0, n);
  if (!types.includes(target)) types[0] = target;
  return types;
}
const hinhPhang = {
  id: 'hinh-phang', title: 'Tam giác, tứ giác, vuông, chữ nhật', emoji: '🔺',
  tips: [
    'Hình tam giác: 3 cạnh, 3 đỉnh, 3 góc.',
    'Hình tứ giác: 4 cạnh, 4 đỉnh, 4 góc.',
    'Hình chữ nhật: 4 góc vuông, 2 cạnh dài bằng nhau, 2 cạnh ngắn bằng nhau. Hình vuông: 4 góc vuông và 4 cạnh bằng nhau.',
  ],
  make: mix([
    [() => {
      const target = pickOne(['tri', 'square', 'rect', 'quad']), types = field(target);
      // Hình vuông, hình chữ nhật cũng là hình tứ giác (4 cạnh).
      const fits = (t) => t === target || (target === 'quad' && (t === 'square' || t === 'rect'));
      const correct = types.map((t, i) => `${i}:${t}`).filter((k, i) => fits(types[i]));
      return { kind: 'pick', text: `Chạm vào TẤT CẢ các ${SH[target]} rồi bấm Xong 👆`, svg: shapeField(types), pick: { multi: true, correct }, show: `${correct.length} hình viền xanh`, explain: target === 'quad' ? 'Hình có 4 cạnh là hình tứ giác — hình vuông, hình chữ nhật cũng là hình tứ giác đấy!' : `Có ${correct.length} ${SH[target]} (được viền xanh).` };
    }, 3],
    [() => {
      const target = pickOne(['tri', 'square', 'rect', 'circle']), types = field(target);
      const cnt = types.filter((t) => t === target).length;
      return { text: `Có bao nhiêu ${SH[target]}? 🔢`, svg: shapeField(types), max: 1, answer: String(cnt), explain: `Đếm kĩ: có ${cnt} ${SH[target]}.` };
    }, 2],
    [() => {
      const t = pickOne(['tri', 'square', 'rect', 'quad']);
      return { text: 'Đây là hình gì? (chọn tên đúng nhất)', svg: svg(shape(t, 150, 100, rnd(150, 180), pickOne(COLORS)), '0 0 300 200'), choices: ['Hình tam giác', 'Hình vuông', 'Hình chữ nhật', 'Hình tứ giác'], answer: cap(SH[t]), explain: `Đây là ${SH[t]}.${t === 'square' || t === 'rect' ? ' (Nó cũng là một hình tứ giác đặc biệt đấy!)' : ''}` };
    }, 2],
    [() => {
      const facts = [
        ['Hình tam giác có 3 cạnh.', true], ['Hình tam giác có 4 đỉnh.', false], ['Hình vuông có 4 cạnh bằng nhau.', true],
        ['Hình chữ nhật có 4 góc vuông.', true], ['Hình chữ nhật có 4 cạnh dài bằng nhau.', false], ['Hình vuông cũng là hình tứ giác.', true],
        ['Hình tứ giác có 5 góc.', false], ['Hình tam giác có 3 góc.', true],
      ];
      const [s, ok] = pickOne(facts);
      return tf(s, ok, ok ? 'Câu này đúng rồi!' : 'Câu này sai. Tam giác: 3 cạnh, 3 đỉnh. Tứ giác: 4 cạnh, 4 góc. Chữ nhật: 2 cạnh dài, 2 cạnh ngắn.');
    }, 1],
  ]),
  game() {
    const k = rnd(2, 6), [e, part, n] = pickOne([['🔺', 'cạnh', 3], ['🔺', 'đỉnh', 3], ['⬜', 'cạnh', 4], ['⬜', 'góc', 4]]);
    return gq(`${k} ${e} → ${part}`, k * n, [1, 3, 4], `${k} hình ${e} có tất cả mấy ${part}?`, `${k} × ${n} = ${k * n} ${part}`);
  },
};

// ---------- Khối lập phương, khối hộp chữ nhật ----------
const OBJECTS = [['🎲', 'Con xúc xắc', 'cube'], ['🧊', 'Viên đá lạnh', 'cube'], ['🧱', 'Viên gạch', 'box'], ['📦', 'Thùng các-tông', 'box'], ['🧃', 'Hộp sữa', 'box'], ['⚽', 'Quả bóng', 'none'], ['🥫', 'Lon nước', 'none'], ['🍦', 'Que kem ốc quế', 'none']];
const khoi = {
  id: 'khoi', title: 'Khối lập phương, khối hộp chữ nhật', emoji: '🧊',
  tips: [
    'Khối lập phương (như con xúc xắc 🎲): 6 mặt đều là hình vuông bằng nhau.',
    'Khối hộp chữ nhật (như hộp sữa, viên gạch): 6 mặt là hình chữ nhật.',
    'Cả hai khối đều có 6 mặt, 8 đỉnh, 12 cạnh.',
  ],
  make: mix([
    [() => {
      const heights = [[...Array(rnd(2, 5))].map(() => rnd(1, 4))];
      const total = heights.flat().reduce((s, v) => s + v, 0);
      return { text: 'Có tất cả bao nhiêu khối lập phương nhỏ? 🧊 (đếm từng cột nhé)', svg: cubeStack(heights), max: 2, answer: String(total), explain: `Đếm từng cột rồi cộng lại: ${heights.flat().join(' + ')} = ${total}.` };
    }, 3],
    [() => {
      const types = shuffle([...Array(rnd(2, 3)).fill('cube'), ...Array(6).fill('box')]).slice(0, 6);
      if (!types.includes('cube')) types[0] = 'cube';
      const body = types.map((t, i) => {
        const cx = 55 + (i % 3) * 95, cy = 62 + Math.floor(i / 3) * 100, s = rnd(42, 50);
        const inner = t === 'cube' ? box(s, s, s, cx, cy, COLORS[i]) : box(s + rnd(20, 30), s - rnd(14, 20), rnd(20, 34), cx, cy, COLORS[i]);
        return `<g data-k="${i}:${t}">${inner}<rect x="${cx - 47}" y="${cy - 50}" width="94" height="100" fill="transparent"/></g>`;
      }).join('');
      const correct = types.map((t, i) => `${i}:${t}`).filter((k) => k.endsWith(':cube'));
      return { kind: 'pick', text: 'Chạm vào TẤT CẢ các khối lập phương rồi bấm Xong', svg: svg(body, '0 0 300 215'), pick: { multi: true, correct }, show: `${correct.length} khối lập phương`, explain: 'Khối lập phương có các cạnh dài bằng nhau, nhìn "vuông vức" mọi phía.' };
    }, 2],
    [() => {
      const want = pickOne(['cube', 'box']), good = pickOne(OBJECTS.filter((o) => o[2] === want));
      const others = shuffle(OBJECTS.filter((o) => o[2] !== want)).slice(0, 2);
      return { text: `Đồ vật nào có dạng khối ${want === 'cube' ? 'lập phương' : 'hộp chữ nhật'}?`, choices: shuffle([good, ...others]).map((o) => `${o[0]} ${o[1]}`), answer: `${good[0]} ${good[1]}`, explain: `${good[1]} có dạng khối ${want === 'cube' ? 'lập phương' : 'hộp chữ nhật'}.` };
    }, 2],
    [() => {
      const cube = Math.random() < 0.5, s = rnd(70, 90);
      return { text: 'Đây là khối gì?', svg: svg(cube ? box(s, s, s) : box(rnd(120, 150), rnd(50, 70), rnd(50, 70)), '0 0 300 200'), choices: ['Khối lập phương', 'Khối hộp chữ nhật'], answer: cube ? 'Khối lập phương' : 'Khối hộp chữ nhật', explain: cube ? 'Các cạnh dài bằng nhau → khối lập phương.' : 'Các cạnh dài ngắn khác nhau → khối hộp chữ nhật.' };
    }, 1],
    [() => {
      const k = rnd(1, 4), [part, n] = pickOne([['mặt', 6], ['đỉnh', 8], ['cạnh', 12]]);
      return { text: `${k} khối lập phương có tất cả bao nhiêu ${part}?`, max: 2, answer: String(k * n), explain: `Mỗi khối có ${n} ${part}: ${k} × ${n} = ${k * n}.` };
    }, 1],
  ]),
  game() {
    const k = rnd(1, 5), [part, n] = pickOne([['mặt', 6], ['đỉnh', 8], ['cạnh', 12]]);
    return gq(`${k} 🧊 → ${part}`, k * n, [1, 2, n], `${k} khối lập phương có mấy ${part}?`, `${k} × ${n} = ${k * n} ${part}`);
  },
};

export const SHAPE_TOPICS = [donVi, motPhan, trungDiem, hinhTron, goc, hinhPhang, khoi];
