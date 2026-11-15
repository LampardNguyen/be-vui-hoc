// Chương Phân số và Hình học — hình vẽ ngẫu nhiên (js/topics/draw.js).
import { rnd, pickOne, shuffle, gq, mix, FRIENDS } from './util.js';
import {
  INK, SOFT, HI, COLORS, rad, svg, label, dot, tapLine, tapDot,
  shape, shapeField, polygonPick, place, cubeStack, box, fracShape, itemGrid,
} from './draw.js';

const TF = ['Đúng', 'Sai'];
const tf = (text, ok, explain, pic) => ({ text, choices: TF, tf: true, answer: ok ? 'Đúng' : 'Sai', explain, svg: pic });

// ---------- Một phần mấy ----------
// Đọc phân số 1/n: "một phần tư", "một phần năm"…
const FRAC_READ = { 2: 'Một phần hai', 3: 'Một phần ba', 4: 'Một phần tư', 5: 'Một phần năm', 6: 'Một phần sáu', 7: 'Một phần bảy', 8: 'Một phần tám', 9: 'Một phần chín' };
// Lưới rows × cols đồ vật, khoanh 1 hàng (byRow) hoặc 1 cột.
function circledGrid(rows, cols, byRow, emoji) {
  const w = 52, hh = 50, k = rnd(0, (byRow ? rows : cols) - 1);
  let body = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) body += label(30 + c * w, 30 + r * hh, emoji, 30);
  body += byRow ? `<rect x="4" y="${6 + k * hh}" width="${cols * w}" height="48" rx="24" fill="none" stroke="${HI}" stroke-width="3"/>`
    : `<rect x="${5 + k * w}" y="4" width="50" height="${rows * hh}" rx="24" fill="none" stroke="${HI}" stroke-width="3"/>`;
  return svg(body, `0 0 ${cols * w + 8} ${rows * hh + 8}`);
}
// n đĩa, mỗi đĩa k đồ vật (chia thành n phần bằng nhau).
function platesSvg(n, k, emoji) {
  const W = 300 / Math.min(n, 3), rowsPer = Math.ceil(k / 3);
  let body = '';
  for (let g = 0; g < n; g++) {
    const cx = (g % 3) * W + W / 2, cy = Math.floor(g / 3) * (rowsPer * 28 + 30) + (rowsPer * 28 + 20) / 2 + 4;
    body += `<ellipse cx="${cx}" cy="${cy}" rx="${W / 2 - 6}" ry="${(rowsPer * 28 + 20) / 2}" fill="#e7ecf7" stroke="#c9cfdb" stroke-width="2"/>`;
    for (let i = 0; i < k; i++) body += label(cx - 26 + (i % 3) * 26, cy - ((rowsPer - 1) * 28) / 2 + Math.floor(i / 3) * 28, emoji, 22);
  }
  return svg(body, `0 0 300 ${Math.ceil(n / 3) * (rowsPer * 28 + 30) + 4}`);
}

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
    [() => {
      // Đ/S như sách: hình chia n phần, tô 1 phần, câu nói 1/m.
      const n = rnd(2, 9), m = pickOne([n, n, n + 1, n - 1 > 1 ? n - 1 : n + 2]), kind = pickOne(['bar', 'pie']);
      return tf(`Đã tô màu 1/${m} hình ${kind === 'pie' ? 'tròn' : 'chữ nhật'}. Đúng hay sai?`, m === n, `Hình chia ${n} phần bằng nhau, tô 1 phần → 1/${n}.`, fracShape(n, { kind, shade: [rnd(0, n - 1)] }));
    }, 2],
    [() => {
      // Đọc / viết một phần mấy.
      const n = rnd(2, 9), others = shuffle([2, 3, 4, 5, 6, 7, 8, 9].filter((k) => k !== n)).slice(0, 3);
      return Math.random() < 0.5
        ? { text: `Phân số 1/${n} đọc là gì? 🗣️`, svg: fracShape(n, { kind: 'pie', shade: [0] }), choices: shuffle([n, ...others]).map((k) => FRAC_READ[k]), answer: FRAC_READ[n], explain: `1/${n} đọc là "${FRAC_READ[n].toLowerCase()}".` }
        : { text: `"${FRAC_READ[n]}" viết là gì? ✏️`, choices: shuffle([n, ...others]).map((k) => `1/${k}`), answer: `1/${n}`, explain: `${FRAC_READ[n]} viết là 1/${n}.` };
    }, 2],
    [() => {
      // Như sách: đã khoanh vào 1/n số cây ở hình nào?
      const e = pickOne(['🥬', '🌰', '🍎', '🐟', '🌸']), opts = [];
      while (opts.length < 3) {
        const rows = rnd(2, 4), cols = rnd(2, 5), byRow = Math.random() < 0.5, frac = byRow ? rows : cols;
        if (rows === cols || opts.some((o) => o.frac === frac)) continue;
        opts.push({ frac, svg: circledGrid(rows, cols, byRow, e) });
      }
      const want = pickOne(opts).frac, keys = ['A', 'B', 'C'];
      return { text: `Đã khoanh vào 1/${want} số ${e} của hình nào?`, choices: opts.map((o, i) => ({ value: keys[i], svg: o.svg, label: keys[i] })), answer: keys[opts.findIndex((o) => o.frac === want)], explain: `Hình được chia thành ${want} hàng (hoặc cột) bằng nhau, khoanh 1 hàng (cột) → 1/${want}.` };
    }, 2],
    [() => {
      // Như sách: chia 12 quả cam thành 3 phần bằng nhau, 1/3 số quả cam là ? quả.
      const n = rnd(2, 5), k = rnd(2, 5), e = pickOne(['🍊', '🍎', '🍓', '🥕', '🍬']);
      return { text: `Chia ${n * k} ${e} thành ${n} phần bằng nhau. 1/${n} số ${e} là mấy ${e}?`, svg: platesSvg(n, k, e), max: 2, answer: String(k), explain: `${n * k} : ${n} = ${k}.` };
    }, 2],
    [() => {
      const n = pickOne([2, 3, 4, 5, 6]), f = pickOne(FRIENDS);
      return { text: `Chiếc bánh trung thu 🥮 chia thành ${n} phần bằng nhau cho ${n} bạn. Mỗi bạn được mấy phần chiếc bánh?`, svg: fracShape(n, { kind: 'pie', shade: [0] }), choices: shuffle([...new Set([n, n + 1, n - 1 > 1 ? n - 1 : n + 2, 2])]).map((k) => `1/${k}`), answer: `1/${n}`, explain: `Chia ${n} phần bằng nhau, ${f} lấy 1 phần → 1/${n} chiếc bánh.` };
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
    // Như sách: hình tròn có chữ, hỏi tâm / bán kính / đường kính là đoạn nào.
    [() => {
      const L = shuffle(['A', 'B', 'C', 'D', 'M', 'N', 'P', 'Q', 'E', 'K']), c = pickOne(['O', 'I']);
      const R = 75, O = [150, 105], base = rnd(0, 359);
      const pt = (d) => [O[0] + R * Math.cos(rad(d)), O[1] + R * Math.sin(rad(d))];
      const d1 = pt(base), d2 = pt(base + 180), r1 = pt(base + rnd(60, 120)), ch = [pt(base + 200), pt(base + 300)];
      const withChord = Math.random() < 0.5;
      const [a, b, p, x, y] = L, lab = (q, t) => { const k = 1.22; return label(O[0] + (q[0] - O[0]) * k, O[1] + (q[1] - O[1]) * k, t); };
      let body = `<circle cx="${O[0]}" cy="${O[1]}" r="${R}" fill="${SOFT}" stroke="${INK}" stroke-width="3"/>`
        + `<line x1="${d1[0]}" y1="${d1[1]}" x2="${d2[0]}" y2="${d2[1]}" stroke="${INK}" stroke-width="3"/>`
        + `<line x1="${O[0]}" y1="${O[1]}" x2="${r1[0]}" y2="${r1[1]}" stroke="${INK}" stroke-width="3"/>`
        + lab(d1, a) + lab(d2, b) + lab(r1, p) + dot(O[0], O[1], c, 14, 14);
      if (withChord) body += `<line x1="${ch[0][0]}" y1="${ch[0][1]}" x2="${ch[1][0]}" y2="${ch[1][1]}" stroke="${INK}" stroke-width="3"/>` + lab(ch[0], x) + lab(ch[1], y);
      const pic = svg(body, '0 0 300 210');
      const ask = pickOne(['tam', 'ban', 'duong']);
      if (ask === 'tam') return { text: 'Tâm của hình tròn là điểm nào?', choices: shuffle([c, a, p, b]), answer: c, svg: pic, explain: `Tâm là điểm chính giữa: ${c}.` };
      if (ask === 'duong') {
        const opts = shuffle([a + b, c + p, ...(withChord ? [x + y] : [c + a])]);
        return { text: 'Đường kính của hình tròn là đoạn nào?', choices: opts, answer: a + b, svg: pic, explain: `Đường kính đi qua tâm ${c}: ${a}${b}.` };
      }
      const good = shuffle([c + a, c + b, c + p]), right = good[0];
      const opts = shuffle([right, a + b, ...(withChord ? [x + y] : [a + p])]);
      return { text: 'Đoạn nào là một bán kính của hình tròn?', choices: opts, answer: right, svg: pic, explain: `Bán kính nối tâm ${c} với đường tròn: ${c}${a}, ${c}${b}, ${c}${p}.` };
    }, 3],
    // Như sách: các hình tròn bằng nhau xếp hàng, đường gấp khúc ABCD.
    [() => {
      const n = rnd(2, 3), r = rnd(3, 9), R = n === 2 ? 60 : 45, y = 120;
      const cx = (i) => 15 + R + i * 2 * R, W = 30 + 2 * R * n;
      let body = '';
      for (let i = 0; i < n; i++) body += `<circle cx="${cx(i)}" cy="${y}" r="${R}" fill="${SOFT}" stroke="${INK}" stroke-width="3"/>${dot(cx(i), y, '')}`;
      const B = cx(0), C = cx(n - 1);
      body += `<polyline points="${B},${y - R} ${B},${y} ${C},${y} ${C},${y - R}" fill="none" stroke="${HI}" stroke-width="4"/>`
        + label(B, y - R - 14, 'A') + label(B - 14, y + 16, 'B') + label(C + 14, y + 16, 'C') + label(C, y - R - 14, 'D')
        + label(B + 22, y - R / 2, `${r} cm`, 15);
      const pic = svg(body, `0 0 ${W} ${y + R + 10}`);
      const nr = 2 + (n - 1) * 2, total = nr * r;
      return Math.random() < 0.6
        ? { text: `${n} hình tròn bằng nhau, mỗi hình có bán kính ${r} cm. Bọ ngựa bò theo đường gấp khúc ABCD (A, D trên đường tròn; B, C là tâm). Bọ ngựa bò tất cả mấy cm? 🐞`, max: 3, unit: 'cm', answer: String(total), svg: pic,
          explain: `AB = ${r} cm, BC = ${n - 1} × 2 × ${r} = ${(n - 1) * 2 * r} cm, CD = ${r} cm. Tổng = ${total} cm.` }
        : { text: `Đường gấp khúc ABCD dài bằng mấy bán kính? (A, D trên đường tròn; B, C là tâm)`, max: 2, answer: String(nr), svg: pic,
          explain: `AB, CD mỗi đoạn 1 bán kính; BC gồm ${n - 1} đường kính = ${(n - 1) * 2} bán kính. Tổng ${nr} bán kính.` };
    }, 2],
    // Bán kính các hình tròn bằng nhau.
    [() => {
      const r = rnd(2, 9), v = pickOne([r, r, r * 2, r + 1]);
      return tf(`Hình tròn tâm O có bán kính OA = ${r} cm. Bán kính OB = ${v} cm.`, v === r, `Các bán kính của một hình tròn dài bằng nhau: OB = OA = ${r} cm.`);
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
    // Như sách: góc có chữ, hỏi đỉnh / cạnh / tên góc vuông.
    [() => {
      const [v, a, b] = shuffle(['A', 'B', 'C', 'M', 'N', 'P', 'G', 'H', 'K', 'E', 'X', 'Y']), base = rnd(0, 359);
      const right = Math.random() < 0.5, deg = right ? 90 : pickOne([rnd(35, 65), rnd(115, 145)]);
      const L = 70, end = (d) => [100 + L * Math.cos(rad(d)), 100 - L * Math.sin(rad(d))], pa = end(base), pb = end(base + deg);
      const lab = (p, t) => label(100 + (p[0] - 100) * 1.25, 100 + (p[1] - 100) * 1.25, t);
      const mid = end(base + deg / 2), pic = svg(`<line x1="100" y1="100" x2="${pa[0]}" y2="${pa[1]}" stroke="${INK}" stroke-width="4"/><line x1="100" y1="100" x2="${pb[0]}" y2="${pb[1]}" stroke="${INK}" stroke-width="4"/>${dot(100, 100, '')}${label(100 - (mid[0] - 100) * 0.3, 100 - (mid[1] - 100) * 0.3, v)}${lab(pa, a)}${lab(pb, b)}`, '0 0 200 200');
      const ask = rnd(0, 2), kind = right ? 'Góc vuông' : 'Góc không vuông';
      if (ask === 0) return { text: 'Đỉnh của góc là điểm nào?', svg: pic, choices: shuffle([v, a, b]), answer: v, explain: `Đỉnh là chỗ 2 cạnh gặp nhau: ${v}.` };
      if (ask === 1) return { text: `Góc đỉnh ${v} có hai cạnh là:`, svg: pic, choices: shuffle([`${v}${a} và ${v}${b}`, `${a}${b} và ${v}${a}`, `${a}${v} và ${a}${b}`]), answer: `${v}${a} và ${v}${b}`, explain: `Hai cạnh đều xuất phát từ đỉnh ${v}: ${v}${a} và ${v}${b}.` };
      return { text: `Góc đỉnh ${v}, cạnh ${v}${a}, ${v}${b} là góc gì?`, svg: pic, choices: ['Góc vuông', 'Góc không vuông'], answer: kind, explain: right ? 'Khít ê ke → góc vuông.' : `Góc ${deg < 90 ? 'hẹp' : 'rộng'} hơn góc vuông.` };
    }, 3],
    // Như sách: hình nào có nhiều góc vuông nhất.
    [() => {
      let ps, cnt, mx;
      do { ps = shuffle(POLYS).slice(0, 3).map((f) => polygonPick(place(f()))); cnt = ps.map((p) => p.right.length); mx = Math.max(...cnt); } while (cnt.filter((c) => c === mx).length > 1);
      return { text: 'Hình nào có NHIỀU góc vuông nhất? 🏆', choices: ps.map((p, i) => ({ value: `h${i}`, svg: p.svg })), answer: `h${cnt.indexOf(mx)}`, show: `hình có ${mx} góc vuông`, explain: `Hình đó có ${mx} góc vuông, các hình kia có ${cnt.filter((c) => c !== mx).join(' và ')}.` };
    }, 2],
    // Như sách: con tàu đi theo đường chỉ gồm góc vuông.
    [() => {
      const step = () => { let x = 10, y = 20, pts = [[x, y]]; for (let i = 0; i < 4; i++) { if (i % 2 === 0) y += rnd(25, 45); else x += rnd(40, 60); pts.push([x, y]); } return pts; };
      const good = step(), bad = step(); const k = rnd(1, 3); bad[k] = [bad[k][0] + 25, bad[k][1]]; // xô lệch 1 đỉnh → có góc không vuông
      const draw = (pts) => svg(`<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${HI}" stroke-width="5"/>${label(pts[0][0], pts[0][1] - 10, '🛸', 18)}${label(pts[4][0] + 8, pts[4][1] + 12, '🪐', 18)}`, '-5 0 150 130');
      return { text: 'Đường nào chỉ gồm các GÓC VUÔNG để tàu tới hành tinh? 🛸', choices: shuffle([{ value: 'g', svg: draw(good) }, { value: 'b', svg: draw(bad) }]), answer: 'g', show: 'đường gấp khúc toàn góc vuông', explain: 'Ở mỗi chỗ rẽ, đường đúng đều rẽ vuông như góc ê ke; đường kia có chỗ rẽ xiên.' };
    }, 2],
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
    // Như sách: hình có chữ, kể tên các đỉnh / các cạnh.
    [() => {
      const tri = Math.random() < 0.5, L = shuffle(['A', 'B', 'C', 'D', 'M', 'N', 'P', 'Q', 'E', 'G']).slice(0, tri ? 3 : 4);
      const pts = tri ? [[150, 25], [60, 170], [240, 170]] : [[90, 40], [220, 40], [255, 165], [45, 165]];
      const off = tri ? [[0, -14], [-14, 10], [14, 10]] : [[-10, -12], [10, -12], [14, 10], [-14, 10]];
      const pic = svg(`<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${SOFT}" stroke="${INK}" stroke-width="3"/>${pts.map((p, i) => label(p[0] + off[i][0], p[1] + off[i][1], L[i])).join('')}`, '0 0 300 195');
      const nm = `hình ${tri ? 'tam giác' : 'tứ giác'} ${L.join('')}`, edges = L.map((x, i) => x + L[(i + 1) % L.length]);
      if (Math.random() < 0.5) {
        const right = L.join(', '), wrong = [edges.slice(0, L.length - 1).join(', '), [...L.slice(0, -1), pickOne(['K', 'H', 'X'])].join(', ')];
        return { text: `Các đỉnh của ${nm} là:`, svg: pic, choices: shuffle([right, ...wrong]), answer: right, explain: `Đỉnh là các điểm góc: ${right}.` };
      }
      const right = edges.join(', '), bad1 = L.join(', '), bad2 = edges.slice(0, -1).join(', ');
      return { text: `Các cạnh của ${nm} là:`, svg: pic, choices: shuffle([right, bad1, bad2]), answer: right, explain: `${tri ? 3 : 4} cạnh nối các đỉnh liền nhau: ${right}.` };
    }, 3],
    // Như sách: đếm tam giác / tứ giác trong hình thang chia 3.
    [() => {
      const [A, B, C, D, E] = shuffle(['A', 'B', 'C', 'D', 'E', 'M', 'N', 'P', 'Q']).slice(0, 5), isTri = Math.random() < 0.5;
      const pic = svg(`<polygon points="70,30 230,30 280,170 20,170" fill="${SOFT}" stroke="${INK}" stroke-width="3"/><polyline points="70,30 150,170 230,30" fill="none" stroke="${INK}" stroke-width="3"/>${label(62, 18, A)}${label(238, 18, B)}${label(150, 186, C)}${label(12, 182, D)}${label(288, 182, E)}`, '0 0 300 195');
      return isTri ? { text: 'Trong hình bên có mấy hình tam giác? 🔺', svg: pic, max: 1, answer: '3', explain: `3 hình tam giác: ${A}${C}${D}, ${A}${B}${C}, ${C}${B}${E}.` }
        : { text: 'Trong hình bên có mấy hình tứ giác? (kể cả hình to)', svg: pic, max: 1, answer: '3', explain: `3 hình tứ giác: ${A}${B}${C}${D}, ${A}${B}${E}${C}, ${A}${B}${E}${D}.` };
    }, 2],
    // Như sách: cắt hình chữ nhật theo một đoạn thẳng.
    [() => {
      const k = rnd(0, 2), N = [120, 170], M = k === 0 ? [200, 30] : [40, 30];
      const res = ['2 hình tứ giác', '1 hình tam giác và 1 hình tứ giác', '2 hình tam giác'];
      // k=0: cạnh trên → cạnh dưới (2 tứ giác); k=1: đỉnh → cạnh dưới (tam giác + tứ giác); k=2: đường chéo (2 tam giác).
      const seg = k === 2 ? [[40, 30], [260, 170]] : [M, N], ans = k === 0 ? res[0] : k === 1 ? res[1] : res[2];
      const pic = svg(`<rect x="40" y="30" width="220" height="140" fill="${SOFT}" stroke="${INK}" stroke-width="3"/><line x1="${seg[0][0]}" y1="${seg[0][1]}" x2="${seg[1][0]}" y2="${seg[1][1]}" stroke="${HI}" stroke-width="4" stroke-dasharray="8 6"/>`, '20 15 260 170');
      return { text: 'Cắt tờ giấy hình chữ nhật theo nét đứt ✂️ thì được:', svg: pic, choices: res, answer: ans, explain: k === 0 ? 'Mỗi phần có 4 cạnh → 2 hình tứ giác.' : k === 1 ? 'Phần nhỏ có 3 cạnh (tam giác), phần to có 4 cạnh (tứ giác).' : 'Cắt theo đường chéo được 2 hình tam giác.' };
    }, 2],
    // Như sách: kiến bò theo cạnh hình vuông, bọ rùa theo cạnh hình chữ nhật.
    [() => {
      const a = rnd(2, 9), l = rnd(3, 9), w = rnd(1, l - 1), ant = 2 * a, bug = l + w;
      if (Math.random() < 0.5) return { text: `Hình vuông ABCD có cạnh ${a} cm. Kiến bò theo các cạnh từ A đến C (qua B). Kiến bò bao nhiêu cm? 🐜`, max: 2, unit: 'cm', answer: String(ant), explain: `AB + BC = ${a} + ${a} = ${ant} cm.` };
      if (ant === bug) return { text: `Hình chữ nhật MNPQ dài ${l} cm, rộng ${w} cm. Bọ rùa bò từ M đến P (qua N) dài bao nhiêu cm? 🐞`, max: 2, unit: 'cm', answer: String(bug), explain: `MN + NP = ${l} + ${w} = ${bug} cm.` };
      return { text: `Kiến bò theo cạnh hình vuông ABCD (cạnh ${a} cm) từ A đến C qua B. Bọ rùa bò theo cạnh hình chữ nhật MNPQ (dài ${l} cm, rộng ${w} cm) từ M đến P qua N. Ai bò quãng đường dài hơn?`, choices: ['Kiến 🐜', 'Bọ rùa 🐞'], answer: ant > bug ? 'Kiến 🐜' : 'Bọ rùa 🐞', explain: `Kiến: ${a} + ${a} = ${ant} cm. Bọ rùa: ${l} + ${w} = ${bug} cm.` };
    }, 2],
    // Như sách: xếp hình chữ nhật bằng que tính.
    [() => {
      const l = rnd(1, 4), w = rnd(1, l), n = 2 * (l + w), sq = l === w;
      return { text: `Rô-bốt xếp một hình ${sq ? 'vuông' : 'chữ nhật'} mỗi cạnh dài ${sq ? `${l} que` : `${l} que, rộng ${w} que`} 🤖. Cần tất cả mấy que tính?`, max: 2, answer: String(n), explain: `${l} + ${w} + ${l} + ${w} = ${n} que tính.` };
    }, 1],
    // Như sách: 2 đường chéo chia hình vuông.
    [() => {
      const [t, ok] = pickOne([['Kẻ 2 đường chéo, hình vuông được chia thành 4 hình tam giác.', true], ['Kẻ 1 đường chéo, hình vuông được chia thành 2 hình tam giác.', true], ['Kẻ 2 đường chéo, hình vuông được chia thành 2 hình tam giác.', false]]);
      return tf(t, ok, '1 đường chéo → 2 tam giác; 2 đường chéo cắt nhau ở giữa → 4 tam giác.', svg(`<rect x="90" y="20" width="120" height="120" fill="${SOFT}" stroke="${INK}" stroke-width="3"/>`, '60 10 180 140'));
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

export const SHAPE_TOPICS = [motPhan, trungDiem, hinhTron, goc, hinhPhang, khoi];
