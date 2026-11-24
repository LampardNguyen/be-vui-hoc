// Chương Đo lường: mỗi loại đơn vị là một phần luyện riêng (parts), "Luyện tập" chung thì trộn tất cả.
import { rnd, pickOne, shuffle, fmt, gq, mix, numChoice, FRIENDS } from './util.js';
import { INK, HI, svg, label, balance, ruler, thermometer, weights } from './draw.js';

const sign = (a, b) => (a > b ? '>' : a < b ? '<' : '=');
const tiltOf = (a, b) => (a > b ? -1 : a < b ? 1 : 0);

const LENGTH = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
const MASS = ['kg', 'hg', 'dag', 'g'];
const SIZES = [
  ['Chiếc bút chì dài khoảng', [14, 18], 'cm'], ['Cái bàn học cao khoảng', [6, 8], 'dm'], ['Cột cờ cao khoảng', [8, 15], 'm'],
  ['Quãng đường từ nhà bà tới thành phố dài khoảng', [20, 90], 'km'], ['Con kiến dài khoảng', [3, 6], 'mm'],
];
const MASS_SIZES = [['Quả trứng gà nặng khoảng', [50, 60], 'g'], ['Bao gạo nặng khoảng', [10, 25], 'kg'], ['Quyển vở nặng khoảng', [100, 200], 'g'], ['Con mèo nặng khoảng', [3, 5], 'kg']];
const VOL_SIZES = [['Một thìa thuốc ho khoảng', [5, 10], 'ml'], ['Xô nước đầy khoảng', [8, 12], 'l'], ['Một hộp sữa nhỏ khoảng', [110, 180], 'ml'], ['Bể cá nhà em chứa khoảng', [20, 60], 'l']];
const TEMPS = [['Nước đang sôi', 100], ['Nước đá đang tan', 0], ['Cơ thể người khỏe mạnh', 37], ['Một ngày hè nóng bức', 35]];

const unitQ = ([t, [lo, hi], u], all) => {
  const n = rnd(lo, hi);
  return { text: `${t} ${n} … (chọn đơn vị hợp lý) 🤔`, choices: shuffle([u, ...shuffle(all.filter((x) => x !== u)).slice(0, 2)]), answer: u, explain: `${t} ${n} ${u}.` };
};
function convQ(units) {
  const i = rnd(0, units.length - 2), j = Math.min(units.length - 1, i + rnd(1, 3)), f = 10 ** (j - i), n = rnd(1, 9);
  if (j - i === 1 && Math.random() < 0.5) {
    const m = rnd(1, 9);
    return { text: `${n} ${units[i]} ${m} ${units[j]} = ? ${units[j]}`, max: 3, unit: units[j], answer: String(n * f + m), explain: `${n} ${units[i]} = ${n * f} ${units[j]}, thêm ${m} ${units[j]} là ${n * f + m} ${units[j]}.` };
  }
  return { text: `${n} ${units[i]} = ? ${units[j]}`, max: 4, unit: units[j], answer: String(n * f), explain: `1 ${units[i]} = ${fmt(f)} ${units[j]}, nên ${n} ${units[i]} = ${fmt(n * f)} ${units[j]}.` };
}

// ---------- Hình vẽ riêng của chương ----------
// Cân đồng hồ 10 kg (kim chỉ v kg), vật emoji trên đĩa; dx dịch ngang để vẽ 2 cân cạnh nhau.
function dialScale(v, emoji, dx = 0) {
  const cx = 75 + dx, cy = 120;
  let nums = '';
  for (let k = 0; k < 10; k++) {
    const a = ((k * 36 - 90) * Math.PI) / 180;
    nums += label(cx + 30 * Math.cos(a), cy + 30 * Math.sin(a), k === 0 ? '10' : k, k === 0 ? 9 : 11);
  }
  const a = ((v * 36 - 90) * Math.PI) / 180;
  return `<rect x="${cx - 70}" y="58" width="140" height="10" rx="4" fill="#4cc9f0" stroke="${INK}" stroke-width="2"/>${label(cx, 36, emoji, 40)}
    <path d="M${cx - 55} 172 L${cx - 48} 82 Q${cx} 64 ${cx + 48} 82 L${cx + 55} 172 Z" fill="#8ecae6" stroke="${INK}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="42" fill="#fff" stroke="${INK}" stroke-width="2"/>${nums}${label(cx, cy - 15, 'kg', 8)}
    <line x1="${cx}" y1="${cy}" x2="${(cx + 24 * Math.cos(a)).toFixed(1)}" y2="${(cy + 24 * Math.sin(a)).toFixed(1)}" stroke="${HI}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="4" fill="${INK}"/>`;
}
// Cân đồng hồ 1 kg (vạch 0–1000 g, mỗi vạch 50 g), kim chỉ v gam.
function gramScale(v, emoji, dx = 0) {
  const cx = 75 + dx, cy = 118;
  let t = `<rect x="${cx - 60}" y="56" width="120" height="10" rx="4" fill="#4cc9f0" stroke="${INK}" stroke-width="2"/>${label(cx, 36, emoji, 38)}<rect x="${cx - 52}" y="70" width="104" height="104" rx="14" fill="#8ecae6" stroke="${INK}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="44" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
  for (let k = 0; k < 20; k++) { const a = ((k * 18 - 90) * Math.PI) / 180, L = k % 5 === 0 ? 9 : 4; t += `<line x1="${(cx + 44 * Math.cos(a)).toFixed(1)}" y1="${(cy + 44 * Math.sin(a)).toFixed(1)}" x2="${(cx + (44 - L) * Math.cos(a)).toFixed(1)}" y2="${(cy + (44 - L) * Math.sin(a)).toFixed(1)}" stroke="${INK}" stroke-width="1.5"/>`; }
  [['1 kg', 0], ['250 g', 90], ['500 g', 180], ['750 g', 270]].forEach(([n, d]) => { const a = ((d - 90) * Math.PI) / 180; t += label(cx + 26 * Math.cos(a), cy + 26 * Math.sin(a), n, 8); });
  const a = ((v * 0.36 - 90) * Math.PI) / 180;
  return t + `<line x1="${cx}" y1="${cy}" x2="${(cx + 38 * Math.cos(a)).toFixed(1)}" y2="${(cy + 38 * Math.sin(a)).toFixed(1)}" stroke="${HI}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="4" fill="${INK}"/>`;
}
// Ca đong 500 ml, nước tới mức v ml; vạch mỗi 100 ml.
function jug(x, v, name) {
  const top = 30, H = 110, lvl = top + H - (H * v) / 500;
  let t = `<rect x="${x}" y="${lvl}" width="60" height="${top + H - lvl}" fill="#4cc9f0"/><path d="M${x} ${top} v${H} h60 v-${H}" fill="none" stroke="${INK}" stroke-width="3"/><path d="M${x + 60} ${top + 20} q22 0 22 30 t-22 30" fill="none" stroke="${INK}" stroke-width="3"/>`;
  for (let k = 1; k <= 5; k++) { const y = top + H - (H * k * 100) / 500; t += `<line x1="${x}" y1="${y}" x2="${x + 10}" y2="${y}" stroke="${INK}" stroke-width="1.5"/>`; }
  return t + label(x + 30, 18, '500 ml', 11) + label(x + 30, top + H + 16, name, 15);
}
// Can dầu: chiều cao theo dung tích.
function can(x, l, max) {
  const hgt = 50 + (90 * l) / max, y = 170 - hgt;
  return `<path d="M${x} ${y + 12} q0 -12 12 -12 h46 q12 0 12 12 v${hgt - 12} h-70 Z" fill="#4cc9f0" stroke="${INK}" stroke-width="2"/>
    <rect x="${x + 8}" y="${y - 10}" width="16" height="10" fill="#1b6f8f"/><path d="M${x + 36} ${y} q10 -16 26 0" fill="none" stroke="${INK}" stroke-width="5"/>${label(x + 35, y + hgt / 2 + 6, `${l} l`, 18)}`;
}
// Đồng hồ kim: giờ h (1–12), phút m.
export function clock(h, m) {
  let nums = '';
  for (let k = 1; k <= 12; k++) {
    const a = ((k * 30 - 90) * Math.PI) / 180;
    nums += label(100 + 66 * Math.cos(a), 100 + 66 * Math.sin(a), k, 18);
  }
  const hand = (deg, len, w, c) => { const a = ((deg - 90) * Math.PI) / 180; return `<line x1="100" y1="100" x2="${(100 + len * Math.cos(a)).toFixed(1)}" y2="${(100 + len * Math.sin(a)).toFixed(1)}" stroke="${c}" stroke-width="${w}"/>`; };
  return svg(`<circle cx="100" cy="100" r="88" fill="#fff" stroke="#4cc9f0" stroke-width="8"/>${nums}
    ${hand((h % 12) * 30 + m / 2, 42, 7, INK)}${hand(m * 6, 66, 4, HI)}<circle cx="100" cy="100" r="6" fill="${INK}"/>`, '2 2 196 196');
}
const timeText = (h, m) => (m ? `${h} giờ ${m} phút` : `${h} giờ`);
const DAYS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật'];   // tuần bắt đầu Thứ Hai
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const dayOpts = (a) => shuffle([a, (a + 1) % 7, (a + 6) % 7, (a + 2) % 7]).map((w) => DAYS[w]);
const firstDow = (y, mo) => (new Date(y, mo - 1, 1).getDay() + 6) % 7;   // 0 = Thứ Hai
const daysIn = (y, mo) => new Date(y, mo, 0).getDate();

// Tờ lịch tháng (cột T2 → CN), tô vàng ngày hl nếu có.
function calendar(y, mo, hl) {
  const f = firstDow(y, mo), n = daysIn(y, mo), rows = Math.ceil((f + n) / 7), W = 40, H = 34, x0 = 10, y0 = 68;
  let t = `<rect x="4" y="4" width="292" height="${y0 + rows * H}" rx="12" fill="#fff" stroke="#4cc9f0" stroke-width="4"/>`;
  t += `<rect x="4" y="4" width="292" height="36" rx="12" fill="#4cc9f0"/>${label(150, 23, `Tháng ${mo}`, 19, '#fff')}`;
  SHORT.forEach((s, i) => { t += label(x0 + i * W + W / 2, 54, s, 14, i === 6 ? HI : INK); });
  for (let d = 1; d <= n; d++) {
    const k = f + d - 1, c = k % 7, cx = x0 + c * W + W / 2, cy = y0 + Math.floor(k / 7) * H + H / 2;
    if (d === hl) t += `<circle cx="${cx}" cy="${cy}" r="15" fill="#ffd166"/>`;
    t += label(cx, cy, d, 16, c === 6 ? HI : INK);
  }
  return svg(t, `0 0 300 ${y0 + rows * H + 8}`);
}

// Hai hàng tuần, cột col có 2 ô: vals[0] ở hàng trên, vals[1] ở hàng dưới.
function twoWeeks(col, names, vals) {
  const x0 = 76, W = 32;
  let t = '';
  SHORT.forEach((s, i) => { t += label(x0 + i * W + 15, 14, s, 13, i === 6 ? HI : INK); });
  names.forEach((nm, r) => {
    const y = 28 + r * 42;
    t += label(38, y + 17, nm, 12);
    for (let i = 0; i < 7; i++) {
      const on = i === col, v = on ? vals[r] : '';
      t += `<rect x="${x0 + i * W}" y="${y}" width="30" height="34" rx="6" fill="${on ? (v === '?' ? '#bde0fe' : '#ffd166') : '#fff'}" stroke="${INK}" stroke-width="1.5"/>`;
      if (v !== '') t += label(x0 + i * W + 15, y + 18, v, 15);
    }
  });
  return svg(t, '0 0 310 116');
}

// Dải ô từ ngày d1 tới d1 + gap: ô đầu ghi thứ, ô cuối dấu "?".
function dayStrip(d1, gap, w1) {
  const n = gap + 1, W = 62, x0 = (300 - n * W) / 2;
  let t = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + i * W, last = i === n - 1;
    t += `<rect x="${x + 3}" y="6" width="56" height="74" rx="10" fill="${i === 0 ? '#ffd166' : last ? '#bde0fe' : '#fff'}" stroke="${INK}" stroke-width="2"/>`;
    t += label(x + 31, 30, d1 + i, 20) + label(x + 31, 60, i === 0 ? SHORT[w1] : last ? '?' : '', 16, i === 0 ? INK : HI);
  }
  return svg(t, '0 0 300 86');
}

// Thước 0–4 cm có vạch mm, đoạn AB từ a mm tới b mm.
function mmRuler(a, b) {
  const x0 = 20, u = 6.5;
  let t = `<rect x="10" y="60" width="285" height="50" rx="8" fill="#bde0fe" stroke="${INK}" stroke-width="2"/>`;
  for (let i = 0; i <= 40; i++) { const x = x0 + i * u, big = i % 10 === 0, mid = i % 5 === 0; t += `<line x1="${x}" y1="60" x2="${x}" y2="${60 + (big ? 18 : mid ? 12 : 7)}" stroke="${INK}" stroke-width="${big ? 2 : 1}"/>`; if (big) t += label(x, 94, i ? i / 10 : 0, 14); }
  const xa = x0 + a * u, xb = x0 + b * u;
  t += `<line x1="${xa}" y1="38" x2="${xb}" y2="38" stroke="${HI}" stroke-width="4"/><circle cx="${xa}" cy="38" r="4" fill="${INK}"/><circle cx="${xb}" cy="38" r="4" fill="${INK}"/>${label(xa, 22, 'A', 15)}${label(xb, 22, 'B', 15)}`;
  t += `<line x1="${xa}" y1="38" x2="${xa}" y2="60" stroke="${INK}" stroke-dasharray="3 3"/><line x1="${xb}" y1="38" x2="${xb}" y2="60" stroke="${INK}" stroke-dasharray="3 3"/>`;
  return svg(t, '0 10 305 105');
}

// ---------- Các phần ----------
const doDai = {
  id: 'do-dai', title: 'Độ dài', emoji: '📏',
  make: mix([
    [() => {
      const from = rnd(0, 4), len = rnd(2, 9), e = pickOne(['✏️', '🖍️', '🐛', '🔑', '🥖']);
      return { text: 'Vật này dài mấy xăng-ti-mét? 📏', svg: ruler(14, from, from + len, e), max: 2, unit: 'cm', answer: String(len), explain: from ? `Đầu vật ở vạch ${from}, cuối ở vạch ${from + len}: ${from + len} − ${from} = ${len} cm.` : `Đầu vật ở vạch 0, cuối ở vạch ${len} → ${len} cm.` };
    }, 2],
    [() => convQ(LENGTH), 3],
    [() => {
      const i = rnd(2, 4), n = rnd(2, 9), u = LENGTH[i + 1], lv = n * 10, rv = lv + pickOne([0, 1, -1, 5, -5]);
      const lt = `${n} ${LENGTH[i]}`, rt = `${rv} ${u}`;
      return { text: 'So sánh hai độ dài ⚖️', svg: balance(lt, rt), choices: ['<', '=', '>'], answer: sign(lv, rv), tilt: tiltOf(lv, rv), show: `${lt} ${sign(lv, rv)} ${rt}`, explain: `${lt} = ${lv} ${u}, so với ${rv} ${u}.` };
    }, 2],
    [() => unitQ(pickOne(SIZES), ['mm', 'cm', 'dm', 'm', 'km']), 2],
    [() => {
      const a = rnd(20, 90), b = rnd(10, a - 5);
      return { text: `Sợi dây đỏ dài ${a} cm, sợi dây xanh dài ${b} cm. Sợi dây đỏ dài hơn sợi dây xanh bao nhiêu xăng-ti-mét?`, max: 2, unit: 'cm', answer: String(a - b), calcText: `${a} − ${b}`, explain: `${a} − ${b} = ${a - b} (cm).` };
    }, 1],
    // ----- Mi-li-mét (như sách) -----
    [() => {
      const len = rnd(5, 38), from = Math.random() < 0.6 ? 0 : rnd(1, 2) * 10;
      return { text: 'Đoạn thẳng AB dài mấy mi-li-mét? 📏 (mỗi vạch nhỏ là 1 mm)', svg: mmRuler(from, from + len), max: 2, unit: 'mm', answer: String(len), explain: from ? `Từ vạch ${from / 10} cm (${from} mm) tới ${from + len} mm: ${from + len} − ${from} = ${len} mm.` : `Đếm từ vạch 0: ${Math.floor(len / 10)} cm là ${Math.floor(len / 10) * 10} mm, thêm ${len % 10} vạch nhỏ → ${len} mm.` };
    }, 2],
    [() => {
      const k = rnd(0, 3), n = rnd(1, 9);
      if (k === 0) return { text: `${n} cm = ? mm`, max: 2, unit: 'mm', answer: String(n * 10), explain: `1 cm = 10 mm, nên ${n} cm = ${n * 10} mm.` };
      if (k === 1) return { text: `${n * 10} mm = ? cm`, max: 1, unit: 'cm', answer: String(n), explain: `10 mm = 1 cm, nên ${n * 10} mm = ${n} cm.` };
      if (k === 2) return { text: `1 m = ? mm`, ...numChoice(1000, 0, 'mm', [10, 100, 10000]), explain: '1 m = 100 cm = 1000 mm.' };
      const m = rnd(1, 9);
      return { text: `${n} cm ${m} mm = ? mm`, max: 2, unit: 'mm', answer: String(n * 10 + m), explain: `${n} cm = ${n * 10} mm, thêm ${m} mm là ${n * 10 + m} mm.` };
    }, 2],
    [() => {
      const pairs = [['1 cm', 10, '10 mm', 10], ['10 cm', 100, '10 mm', 10], ['1000 mm', 1000, '500 mm', 500], ['1 mm', 1, '1 m', 1000]];
      const n = rnd(2, 9), m = rnd(1, 99), extra = [[`${n} cm`, n * 10, `${m} mm`, m]];
      const [lt, lv, rt, rv] = pickOne([...pairs, ...extra, ...extra]);
      return { text: 'So sánh hai độ dài ⚖️', svg: balance(lt, rt), choices: ['<', '=', '>'], answer: sign(lv, rv), tilt: tiltOf(lv, rv), show: `${lt} ${sign(lv, rv)} ${rt}`, explain: `Đổi về mm: ${lv} mm và ${rv} mm.` };
    }, 2],
    [() => {
      const k = rnd(0, 3);
      if (k === 0) { const a = rnd(10, 500), b = rnd(3, 400); return { text: `${a} mm + ${b} mm = ?`, max: 3, unit: 'mm', answer: String(a + b), explain: `${a} + ${b} = ${a + b} (mm).` }; }
      if (k === 1) { const a = rnd(30, 600), b = rnd(5, a - 5); return { text: `${a} mm − ${b} mm = ?`, max: 3, unit: 'mm', answer: String(a - b), explain: `${a} − ${b} = ${a - b} (mm).` }; }
      if (k === 2) { const a = rnd(11, 30), b = rnd(2, 3); return { text: `${a} mm × ${b} = ?`, max: 2, unit: 'mm', answer: String(a * b), explain: `${a} × ${b} = ${a * b} (mm).` }; }
      const b = rnd(2, 5), q = rnd(5, 19); return { text: `${q * b} mm : ${b} = ?`, max: 2, unit: 'mm', answer: String(q), explain: `${q * b} : ${b} = ${q} (mm).` };
    }, 2],
    [() => {
      const n = rnd(2, 9), [a, b] = shuffle([['Ve sầu', `${n} cm`], ['Kiến', `${n} mm`]]);
      return { text: `${a[0]} nói: "Tớ dài ${a[1]}". ${b[0]} nói: "Tớ dài ${b[1]}". Bạn nào dài hơn?`, choices: [a[0], b[0]], answer: 'Ve sầu', explain: `${n} cm = ${n * 10} mm, mà ${n * 10} mm > ${n} mm nên ve sầu dài hơn kiến.` };
    }, 1],
    [() => {
      if (Math.random() < 0.5) {
        const a = rnd(100, 400), b = rnd(100, 500);
        return { text: `Ốc sên 🐌 đi từ nhà đến trường. Bạn ấy đã đi được ${a} mm, còn phải đi ${b} mm nữa. Quãng đường từ nhà đến trường dài bao nhiêu mi-li-mét?`, max: 3, unit: 'mm', answer: String(a + b), explain: `${a} + ${b} = ${a + b} (mm).` };
      }
      const a = rnd(10, 30), k = rnd(2, 3);
      return { text: `Ngày đầu cào cào 🦗 nhảy xa được ${a} mm. Một tuần sau cào cào nhảy xa gấp ${k} lần ngày đầu. Khi đó cào cào nhảy xa được bao nhiêu mi-li-mét?`, max: 2, unit: 'mm', answer: String(a * k), explain: `${a} × ${k} = ${a * k} (mm).` };
    }, 2],
    [() => {
      const k = rnd(2, 5), up = Math.random() < 0.5, a = up ? rnd(5, 19) : k * rnd(3, 19);
      return { text: `${a} mm → ${up ? 'gấp' : 'giảm'} ${k} lần → ? mm`, max: 2, unit: 'mm', answer: String(up ? a * k : a / k), explain: up ? `${a} × ${k} = ${a * k} (mm).` : `${a} : ${k} = ${a / k} (mm).` };
    }, 1],
  ]),
};

const khoiLuong = {
  id: 'khoi-luong', title: 'Khối lượng', emoji: '⚖️',
  make: mix([
    [() => {
      const list = shuffle([pickOne([0, 1000]), pickOne([0, 500]), pickOne([200, 100, 0]), pickOne([100, 200]), pickOne([0, 50])]).filter(Boolean);
      const total = list.reduce((s, w) => s + w, 0), e = pickOne(['🍉', '🎃', '🍍', '🥥', '🧸']);
      return { text: 'Cân thăng bằng. Vật bên trái nặng bao nhiêu gam?', svg: weights(e, list), max: 4, unit: 'g', answer: String(total), explain: `Cộng các quả cân: ${list.map((w) => `${w} g`).join(' + ')} = ${fmt(total)} g.` };
    }, 2],
    [() => {
      const v = rnd(1, 9), e = pickOne(['🍉', '🎃', '🍍', '🥥', '🍈']);
      return { text: 'Kim cân đồng hồ chỉ số mấy? Vật nặng bao nhiêu ki-lô-gam?', svg: svg(dialScale(v, e), '0 0 150 180'), ...numChoice(v, [1, 2], 'kg'), explain: `Kim đỏ chỉ số ${v} → ${v} kg.` };
    }, 2],
    [() => {
      // Như sách: quả mít và quả dưa hấu trên 2 cân đồng hồ.
      const a = rnd(4, 9), b = rnd(1, a - 1), sw = Math.random() < 0.5, [e1, n1] = ['🍈', 'quả mít'], [e2, n2] = ['🍉', 'quả dưa hấu'];
      const [l, r] = sw ? [b, a] : [a, b];
      return {
        kind: 'steps', text: `Nhìn hai cân đồng hồ: ${e1} ${n1} và ${e2} ${n2}.`, svg: svg(dialScale(l, e1) + dialScale(r, e2, 150), '0 0 300 180'),
        steps: [
          { text: `${n1[0].toUpperCase() + n1.slice(1)} cân nặng bao nhiêu kg?`, max: 1, unit: 'kg', answer: String(l) },
          { text: `${n2[0].toUpperCase() + n2.slice(1)} cân nặng bao nhiêu kg?`, max: 1, unit: 'kg', answer: String(r) },
          { text: `Quả nào nặng hơn, nặng hơn bao nhiêu kg?`, max: 1, unit: 'kg', answer: String(a - b), explain: `${a} − ${b} = ${a - b} (kg), ${l > r ? n1 : n2} nặng hơn` },
        ],
        explain: `${n1}: ${l} kg, ${n2}: ${r} kg, hơn nhau ${a} − ${b} = ${a - b} kg.`,
      };
    }, 2],
    [() => convQ(MASS), 1],
    [() => { const n = rnd(1, 9); return Math.random() < 0.5 ? { text: `${n} kg = ? g`, max: 4, unit: 'g', answer: String(n * 1000), explain: `1 kg = 1000 g → ${n} kg = ${fmt(n * 1000)} g.` } : { text: `${n * 1000} g = ? kg`, max: 1, unit: 'kg', answer: String(n), explain: `1000 g = 1 kg.` }; }, 1],
    [() => unitQ(pickOne(MASS_SIZES), ['g', 'kg']), 1],
    // ----- Gam (như sách) -----
    [() => {
      const v = pickOne([250, 500, 750, 100, 200, 300, 400, 600, 700, 800, 900, 150, 350, 450]), e = pickOne(['🍎', '🧈', '🍬', '🥕', '🍇']);
      return { text: 'Cân đồng hồ 1 kg (mỗi vạch nhỏ 50 g). Vật nặng bao nhiêu gam?', svg: svg(gramScale(v, e), '0 0 150 180'), ...numChoice(v, [50, 100], 'g'), explain: `Kim chỉ ${v} g.` };
    }, 2],
    [() => {
      const a = pickOne([600, 700, 800, 900, 750]), b = pickOne([250, 300, 400, 500].filter((x) => x < a));
      return {
        kind: 'steps', text: 'Túi táo 🍎 và gói bột mì 🥡 trên hai cân đồng hồ 1 kg.', svg: svg(gramScale(a, '🍎') + gramScale(b, '🥡', 150), '0 0 300 180'),
        steps: [
          { text: 'Túi táo cân nặng bao nhiêu gam?', max: 3, unit: 'g', answer: String(a) },
          { text: 'Gói bột mì cân nặng bao nhiêu gam?', max: 3, unit: 'g', answer: String(b) },
          { text: 'Túi táo nặng hơn gói bột mì bao nhiêu gam?', max: 3, unit: 'g', answer: String(a - b), explain: `${a} − ${b} = ${a - b} (g)` },
          { text: 'Cả túi táo và gói bột mì nặng bao nhiêu gam?', max: 4, unit: 'g', answer: String(a + b), explain: `${a} + ${b} = ${a + b} (g)` },
        ],
        explain: `Táo ${a} g, bột mì ${b} g.`,
      };
    }, 2],
    [() => {
      const k = rnd(0, 2);
      if (k === 0) { const a = rnd(30, 95) * 10, b = rnd(10, a / 10 - 5) * 10; return { text: `${a} g − ${b} g = ?`, max: 3, unit: 'g', answer: String(a - b), explain: `${a} − ${b} = ${a - b} (g).` }; }
      if (k === 1) { const a = rnd(11, 25), b = rnd(2, 4); return { text: `${a} g × ${b} = ?`, max: 3, unit: 'g', answer: String(a * b), explain: `${a} × ${b} = ${a * b} (g).` }; }
      const b = rnd(2, 9), q = rnd(2, 9); return { text: `${q * b} g : ${b} = ?`, max: 2, unit: 'g', answer: String(q), explain: `${q * b} : ${b} = ${q} (g).` };
    }, 2],
    [() => {
      const [e, name, w] = pickOne([['🐦', 'Con chim sẻ', '200 g'], ['🐔', 'Con gà', '2 kg'], ['🐕', 'Con chó', '20 kg'], ['🐄', 'Con bò', '200 kg']]);
      return { text: `${e} ${name} nặng khoảng bao nhiêu?`, choices: ['200 g', '2 kg', '20 kg', '200 kg'], answer: w, explain: `${name} nặng khoảng ${w}.` };
    }, 1],
  ]),
};

const dungTich = {
  id: 'dung-tich', title: 'Dung tích (lít)', emoji: '🧴',
  make: mix([
    [() => {
      // Như sách: hai can chứa đầy dầu.
      const a = rnd(2, 9), b = rnd(10, 25), both = Math.random() < 0.5;
      return { text: both ? 'Hai can chứa đầy dầu. Cả hai can có bao nhiêu lít dầu?' : 'Hai can chứa đầy dầu. Can to nhiều hơn can nhỏ bao nhiêu lít?', svg: svg(can(60, a, 25) + can(170, b, 25), '40 0 220 178'), max: 2, unit: 'l', answer: String(both ? a + b : b - a), calcText: both ? `${a} + ${b}` : `${b} − ${a}`, explain: both ? `${a} + ${b} = ${a + b} (l).` : `${b} − ${a} = ${b - a} (l).` };
    }, 3],
    [() => { const n = rnd(1, 5); return Math.random() < 0.5 ? { text: `${n} l = ? ml`, max: 4, unit: 'ml', answer: String(n * 1000), explain: `1 l = 1000 ml.` } : { text: `${n * 1000} ml = ? l`, max: 1, unit: 'l', answer: String(n), explain: `1000 ml = 1 l.` }; }, 2],
    [() => unitQ(pickOne(VOL_SIZES), ['l', 'ml']), 2],
    [() => {
      // Hai can a l và b l: đổ đầy can to, rót sang can nhỏ cho đầy, can to còn lại?
      const a = rnd(2, 5), b = a + rnd(1, 4);
      return { text: `Có can ${a} l và can ${b} l. Đổ đầy nước vào can ${b} l rồi rót sang can ${a} l cho đầy. Can ${b} l còn lại mấy lít? 💧`, svg: svg(can(60, a, 9) + can(170, b, 9), '40 0 220 178'), max: 1, unit: 'l', answer: String(b - a), explain: `${b} − ${a} = ${b - a} (l). Vậy dùng 2 can ${a} l và ${b} l có thể lấy được ${b - a} l nước!` };
    }, 2],
    [() => {
      const per = rnd(2, 5), days = rnd(2, 9), f = pickOne(FRIENDS);
      return { text: `Mỗi ngày nhà ${f} uống ${per} l sữa 🥛. Sau ${days} ngày uống hết bao nhiêu lít sữa?`, max: 2, unit: 'l', answer: String(per * days), explain: `${per} × ${days} = ${per * days} (l).` };
    }, 1],
    // ----- Mi-li-lít (như sách) -----
    [() => {
      const vs = [500, pickOne([100, 200, 300, 400]), pickOne([100, 200, 300, 400])], tot = vs[0] + vs[1] + vs[2];
      return {
        kind: 'steps', text: 'Rót hết nước từ bình sang 3 ca (mỗi vạch là 100 ml). Ca A có 500 ml nước.', svg: svg(jug(10, vs[0], 'A') + jug(110, vs[1], 'B') + jug(210, vs[2], 'C'), '0 0 300 165'),
        steps: [
          { text: 'Ca B có bao nhiêu mi-li-lít nước?', max: 3, unit: 'ml', answer: String(vs[1]) },
          { text: 'Ca C có bao nhiêu mi-li-lít nước?', max: 3, unit: 'ml', answer: String(vs[2]) },
          { text: 'Lúc đầu, trong bình có bao nhiêu mi-li-lít nước?', max: 4, unit: 'ml', answer: String(tot), explain: `500 + ${vs[1]} + ${vs[2]} = ${tot} (ml)` },
        ], explain: `Bình có ${tot} ml nước.` };
    }, 2],
    [() => {
      const a = pickOne([100, 200, 300]), b = pickOne([100, 200, 250]), c = pickOne([50, 100, 150]), rest = 1000 - a - b - c;
      return { text: `Trong phích có 1 l nước 🫖. Rót sang 3 ca: ${a} ml, ${b} ml và ${c} ml. Phích còn lại bao nhiêu mi-li-lít nước?`, max: 4, unit: 'ml', answer: String(rest), explain: `1 l = 1000 ml. ${a} + ${b} + ${c} = ${a + b + c} ml, 1000 − ${a + b + c} = ${rest} ml.` };
    }, 2],
    [() => {
      const k = rnd(0, 3);
      if (k === 0) return { text: '1 l = ? ml', max: 4, unit: 'ml', answer: '1000', explain: '1 l = 1000 ml.' };
      if (k === 1) { const a = rnd(5, 30) * 10, b = rnd(1, a / 10 - 1) * 10; return { text: `${a} ml − ${b} ml = ?`, max: 3, unit: 'ml', answer: String(a - b), explain: `${a} − ${b} = ${a - b} (ml).` }; }
      if (k === 2) { const a = rnd(11, 30), b = rnd(2, 3); return { text: `${a} ml × ${b} = ?`, max: 2, unit: 'ml', answer: String(a * b), explain: `${a} × ${b} = ${a * b} (ml).` }; }
      const b = rnd(2, 5), q = rnd(2, 19) ; return { text: `${q * b} ml : ${b} = ?`, max: 2, unit: 'ml', answer: String(q), explain: `${q * b} : ${b} = ${q} (ml).` };
    }, 2],
    [() => {
      const a = pickOne([500, 750, 900, 1000]), r = rnd(1, a / 50 - 1) * 50;
      return { text: `Một chai dầu ăn có ${a} ml dầu. Mẹ dùng để nấu ăn, trong chai còn lại ${r} ml. Mẹ đã dùng bao nhiêu mi-li-lít dầu?`, max: 4, unit: 'ml', answer: String(a - r), explain: `${a} − ${r} = ${a - r} (ml).` };
    }, 1],
    [() => {
      const most = Math.random() < 0.5;
      for (;;) {
        const vals = shuffle([[pickOne([100, 200, 300, 400, 500, 600, 700, 800, 900]), 'ml'], [pickOne([1, 2]), 'l'], [pickOne([150, 250, 450, 650, 850]), 'ml']]);
        const ml = vals.map(([v, u]) => (u === 'l' ? v * 1000 : v)), pick = most ? Math.max(...ml) : Math.min(...ml);
        if (ml.filter((x) => x === pick).length > 1) continue;
        const names = ['Chai A', 'Chai B', 'Chai C'];
        return { text: `${names.map((n, i) => `${n} đựng ${vals[i][0]} ${vals[i][1]}`).join(', ')} nước. Chai nào đựng ${most ? 'NHIỀU' : 'ÍT'} nước nhất?`, choices: names, answer: names[ml.indexOf(pick)], explain: `Đổi ra ml: ${ml.map((x, i) => `${names[i]} ${x} ml`).join(', ')}.` };
      }
    }, 1],
  ]),
};

const nhietDo = {
  id: 'nhiet-do', title: 'Nhiệt độ', emoji: '🌡️',
  make: mix([
    [() => { const v = rnd(0, 20) * 5; return { text: 'Nhiệt kế chỉ bao nhiêu độ C? 🌡️', svg: thermometer(v), ...numChoice(v, [5, 10], '°C'), explain: `Mỗi vạch dài là 10°C, vạch ngắn ở giữa là 5°C. Cột đỏ tới ${v}°C.` }; }, 3],
    [() => { const [t, v] = pickOne(TEMPS); return { text: `🌡️ ${t} có nhiệt độ khoảng bao nhiêu?`, choices: shuffle(['0°C', '37°C', '35°C', '100°C']), answer: `${v}°C`, explain: `${t}: khoảng ${v}°C.` }; }, 2],
    [() => {
      const a = rnd(18, 30), d = rnd(2, 9), up = Math.random() < 0.5;
      return { text: `Buổi sáng trời ${a}°C. Đến trưa nhiệt độ ${up ? 'tăng thêm' : 'giảm đi'} ${d}°C. Buổi trưa trời bao nhiêu độ C? ☀️`, max: 2, unit: '°C', answer: String(up ? a + d : a - d), explain: `${a} ${up ? '+' : '−'} ${d} = ${up ? a + d : a - d} (°C).` };
    }, 2],
    [function retry() {
      const a = rnd(2, 19) * 5, b = rnd(2, 19) * 5;
      if (a === b) return retry();
      return { text: `Nhiệt kế A chỉ ${a}°C, nhiệt kế B chỉ ${b}°C. Nơi nào nóng hơn? 🔥`, choices: ['A', 'B'], answer: a > b ? 'A' : 'B', explain: `${Math.max(a, b)}°C > ${Math.min(a, b)}°C.` };
    }, 1],
    // ----- Như sách: bảng nhiệt độ ba địa phương -----
    [() => {
      for (;;) {
        const places = shuffle(['Hà Nội', 'Lào Cai', 'Sa Pa', 'Đà Nẵng', 'Huế', 'Đà Lạt']).slice(0, 3), t = places.map(() => rnd(8, 36));
        if (new Set(t).size < 3) continue;
        const [i, j] = shuffle([0, 1, 2]).slice(0, 2), hot = Math.random() < 0.5, win = (hot ? t[i] > t[j] : t[i] < t[j]) ? places[i] : places[j];
        return { text: `Nhiệt độ buổi sáng: ${places.map((p, k) => `${p} ${t[k]}°C`).join(', ')}. Giữa ${places[i]} và ${places[j]}, nơi nào có nhiệt độ ${hot ? 'CAO' : 'THẤP'} hơn?`, choices: [places[i], places[j]], answer: win, explain: `${places[i]} ${t[i]}°C, ${places[j]} ${t[j]}°C.` };
      }
    }, 2],
    // Như sách: dự báo sáng – trưa – đêm, thấp nhất / cao nhất.
    [() => {
      const s = rnd(20, 29), tr = rnd(30, 38), d = rnd(12, 19), low = Math.random() < 0.5;
      return { text: `Dự báo nhiệt độ: sáng ${s}°C, trưa ${tr}°C, đêm ${d}°C. Nhiệt độ ${low ? 'thấp' : 'cao'} nhất là bao nhiêu độ C?`, max: 2, unit: '°C', answer: String(low ? d : tr), explain: `${low ? `Đêm ${d}°C là thấp nhất` : `Trưa ${tr}°C là cao nhất`}.` };
    }, 2],
    // Như sách: đọc số đo bằng chữ; so sánh nhiệt độ cơ thể với 37°C.
    [() => {
      const W = { 36: 'ba mươi sáu', 37: 'ba mươi bảy', 38: 'ba mươi tám', 39: 'ba mươi chín', 40: 'bốn mươi' }, v = rnd(36, 40), f = pickOne(FRIENDS);
      return { text: `Nhiệt độ cơ thể của ${f} là ${W[v]} độ xê. Viết bằng số:`, ...numChoice(v, [1, 2, 10], '°C'), explain: `${W[v]} độ xê = ${v}°C.` };
    }, 1],
    [() => {
      const pick = rnd(38, 40), vals = shuffle([37, 36, pick]);
      return { text: `Ba người đo nhiệt độ cơ thể: ${vals.map((v) => `${v}°C`).join('; ')}. Người bình thường là 37°C. Nhiệt độ nào cao hơn bình thường?`, choices: vals.map((v) => `${v}°C`), answer: `${pick}°C`, explain: `${pick}°C > 37°C.` };
    }, 1],
    // Như sách: nối cốc nước với nhiệt độ.
    [() => {
      const [n, t] = pickOne([['Cốc nước đá 🧊', '5°C'], ['Cốc nước nóng vừa rót từ phích ♨️', '95°C'], ['Cốc nước lọc thường 🥛', '25°C']]);
      return { text: `${n} có nhiệt độ khoảng bao nhiêu?`, choices: ['5°C', '25°C', '95°C'], answer: t, explain: 'Nước đá rất lạnh (5°C), nước lọc mát (25°C), nước phích rất nóng (95°C).' };
    }, 1],
  ]),
};

const dongHo = {
  id: 'dong-ho', title: 'Xem đồng hồ', emoji: '⏰',
  make: mix([
    [() => {
      // Đọc đồng hồ kim, đáp án nhiễu: đảo kim giờ / kim phút như sách.
      const h = rnd(1, 12), m = rnd(0, 11) * 5, ans = timeText(h, m);
      const opts = new Set([ans]);
      for (const o of [timeText(m ? m / 5 : 12, (h % 12) * 5), timeText(h % 12 + 1, m), timeText(h, (m + 15) % 60), timeText(h === 1 ? 12 : h - 1, m)]) if (opts.size < 4 && o !== ans) opts.add(o);
      return { text: 'Đồng hồ chỉ mấy giờ? ⏰ (kim ngắn chỉ giờ, kim dài màu đỏ chỉ phút)', svg: clock(h, m), choices: shuffle([...opts]), answer: ans, explain: `Kim ngắn chỉ giờ ${h}${m ? `, kim dài chỉ số ${m / 5} là ${m} phút` : ', kim dài chỉ số 12'}.` };
    }, 3],
    [() => {
      // Giờ buổi chiều / tối: 19:15 = 7 giờ 15 phút tối.
      const H = rnd(13, 22), m = pickOne([0, 15, 30, 45]), h = H - 12;
      const wrong = [timeText(h + 1, m), timeText(H - 10, m), timeText(h, (m + 30) % 60)];
      return { text: `Đồng hồ điện tử chỉ ${H}:${String(m).padStart(2, '0')}. Đồng hồ kim lúc đó chỉ mấy giờ?`, choices: shuffle([timeText(h, m), ...new Set(wrong.filter((w) => w !== timeText(h, m)))]).slice(0, 4), answer: timeText(h, m), explain: `${H} giờ là ${H} − 12 = ${h} giờ ${H >= 18 ? 'tối' : 'chiều'}.` };
    }, 2],
    [() => {
      // Chọn đồng hồ kim đúng với giờ điện tử.
      const H = rnd(13, 22), m = pickOne([0, 15, 30, 45]), h = H - 12;
      const fakes = [[h, (m + 30) % 60], [h % 12 + 1, m], [m ? m / 5 : 12, h * 5 % 60]].filter(([a, b]) => !(a === h && b === m));
      const opts = shuffle([[h, m], ...fakes.slice(0, 2)]).map(([a, b]) => ({ value: `${a}:${b}`, svg: clock(a, b) }));
      return { text: `Chọn đồng hồ cùng giờ với ${H}:${String(m).padStart(2, '0')} 🕰️`, choices: opts, answer: `${h}:${m}`, show: timeText(h, m), explain: `${H}:${String(m).padStart(2, '0')} là ${timeText(h, m)} ${H >= 18 ? 'tối' : 'chiều'}.` };
    }, 2],
    [() => {
      const h = rnd(1, 10), m = pickOne([0, 15, 30]), add = pickOne([15, 30, 60]);
      const t = h * 60 + m + add, ans = timeText(Math.floor(t / 60), t % 60);
      return { text: `Bây giờ là ${timeText(h, m)}. ${add === 60 ? '1 giờ' : `${add} phút`} nữa là mấy giờ? ⏳`, svg: clock(h, m), choices: shuffle([ans, timeText(h, (m + add) % 60 === m ? m + 5 : (m + add) % 60), timeText(Math.floor(t / 60) + 1, t % 60), timeText(h, m + 5)].filter((v, i, a) => a.indexOf(v) === i)), answer: ans, explain: `${timeText(h, m)} thêm ${add} phút là ${ans}.` };
    }, 1],
  ]),
};

const ngayThang = {
  id: 'ngay-thang', title: 'Ngày, tháng, thứ', emoji: '📅',
  make: mix([
    [() => {
      // Bậc 1: hôm qua, ngày mai, hôm kia, ngày kia.
      const [word, k] = pickOne([['Ngày mai', 1], ['Hôm qua', -1], ['Ngày kia', 2], ['Hôm kia', -2]]);
      const w = rnd(0, 6), a = (w + k + 7) % 7;
      const chain = [w, ...Array.from({ length: Math.abs(k) }, (_, i) => (w + Math.sign(k) * (i + 1) + 7) % 7)].map((x) => DAYS[x]);
      return { text: `Hôm nay là ${DAYS[w]} 🌞. ${word} là thứ mấy?`, choices: dayOpts(a), answer: DAYS[a], explain: `${word} là ${Math.abs(k)} ngày ${k > 0 ? 'sau' : 'trước'} hôm nay, ${k > 0 ? 'đếm tiếp' : 'đếm lùi'}: ${chain.join(' → ')}.` };
    }, 2],
    [() => {
      const [t, a, e] = pickOne([
        ['Con đi học từ Thứ Hai đến Thứ Sáu. Mỗi tuần con đi học mấy ngày? 🎒', 5, 'Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu: 5 ngày.'],
        ['Thứ Bảy và Chủ nhật được nghỉ học. Mỗi tuần con được nghỉ mấy ngày? 🏖️', 2, 'Thứ Bảy và Chủ nhật: 2 ngày.'],
      ]);
      return { text: t, ...numChoice(a, 0, '', a === 5 ? [4, 6, 7] : [1, 3, 4]), explain: e };
    }, 1],
    [() => {
      // Bậc 2 (như sách): xem tờ lịch, tìm thứ của một ngày.
      const y = new Date().getFullYear(), mo = rnd(1, 12), d = rnd(1, daysIn(y, mo)), w = (firstDow(y, mo) + d - 1) % 7;
      return { text: `Xem tờ lịch: ngày ${d} tháng ${mo} là thứ mấy? 🗓️`, svg: calendar(y, mo, d), choices: dayOpts(w), answer: DAYS[w], explain: `Tìm ô số ${d} (tô vàng) rồi dò lên đầu cột: cột ${SHORT[w]} là ${DAYS[w]}.` };
    }, 3],
    [() => {
      const y = new Date().getFullYear(), mo = rnd(1, 12), f = firstDow(y, mo), n = daysIn(y, mo), wd = rnd(0, 6);
      const first = (wd - f + 7) % 7 + 1, days = [];
      for (let d = first; d <= n; d += 7) days.push(d);
      if (Math.random() < 0.5) return { text: `Xem tờ lịch: tháng ${mo} có mấy ngày ${DAYS[wd]}?`, svg: calendar(y, mo), ...numChoice(days.length, 0, '', [3, 9 - days.length, 6]), explain: `Đếm các số trong cột ${SHORT[wd]}: ${days.join(', ')} → ${days.length} ngày.` };
      return { text: `Xem tờ lịch: ${DAYS[wd]} đầu tiên của tháng ${mo} là ngày nào?`, svg: calendar(y, mo), ...numChoice(first, 0, '', [first + 7, first + 1, first > 1 ? first - 1 : first + 2]), explain: `Số đầu tiên trong cột ${SHORT[wd]} là ${first}.` };
    }, 1],
    [() => {
      // Bậc 3: cùng thứ thì cách nhau đúng 7 ngày.
      const col = rnd(0, 6), back = Math.random() < 0.5, d = back ? rnd(8, 24) : rnd(1, 21), ans = back ? d - 7 : d + 7;
      const op = back ? `${d} − 7` : `${d} + 7`;
      return { text: `${DAYS[col]} tuần này là ngày ${d}. ${DAYS[col]} tuần ${back ? 'trước' : 'sau'} là ngày mấy?`, svg: twoWeeks(col, back ? ['Tuần trước', 'Tuần này'] : ['Tuần này', 'Tuần sau'], back ? ['?', d] : [d, '?']), max: 2, answer: String(ans), calcText: op, explain: `Cùng là ${DAYS[col]} thì cách nhau đúng 7 ngày (1 tuần): ${op} = ${ans}.` };
    }, 1],
    [() => {
      // Như sách nhưng nhẹ hơn: cách 1–3 ngày, có dải ô để đếm.
      const d1 = rnd(1, 25), gap = rnd(1, 3), w1 = rnd(0, 6), w2 = (w1 + gap) % 7;
      const chain = Array.from({ length: gap + 1 }, (_, i) => `${d1 + i} (${DAYS[(w1 + i) % 7]})`);
      return { text: `Ngày ${d1} là ${DAYS[w1]}. Ngày ${d1 + gap} là thứ mấy?`, svg: dayStrip(d1, gap, w1), choices: dayOpts(w2), answer: DAYS[w2], explain: `Đếm tiếp từng ngày: ${chain.join(' → ')}.` };
    }, 1],
    [() => {
      const mo = rnd(1, 12), n = MONTH_DAYS[mo - 1];
      return { text: `Tháng ${mo} có bao nhiêu ngày? 🗓️ (năm thường)`, choices: ['28', '30', '31'], answer: String(n), explain: 'Tháng 1, 3, 5, 7, 8, 10, 12 có 31 ngày; tháng 4, 6, 9, 11 có 30 ngày; tháng 2 có 28 hoặc 29 ngày. (Nắm tay đếm khớp xương nhé ✊)' };
    }, 2],
    [() => {
      const [t, a] = pickOne([['1 tuần lễ có bao nhiêu ngày?', 7], ['1 ngày có bao nhiêu giờ?', 24], ['1 giờ có bao nhiêu phút?', 60], ['1 năm có bao nhiêu tháng?', 12]]);
      return { text: t, ...numChoice(a, 0, '', shuffle([7, 10, 12, 24, 30, 60, 100].filter((x) => x !== a))), explain: `${t.replace(' có bao nhiêu', ' có').replace('?', '')} ${a}.` };
    }, 1],
    [() => { const w = rnd(2, 5); return { text: `${w} tuần lễ có bao nhiêu ngày?`, max: 2, answer: String(w * 7), explain: `1 tuần có 7 ngày: 7 × ${w} = ${w * 7} ngày.` }; }, 1],
    [() => {
      // Như sách: mỗi tuần ăn hết 5 kg gạo, mua 20 kg thì ăn mấy tuần?
      const per = rnd(2, 9), weeks = rnd(2, 9);
      return { text: `Mỗi tuần nhà cô Hoa ăn hết ${per} kg gạo 🍚. Cô mua về ${per * weeks} kg gạo. Hỏi ăn trong mấy tuần thì hết?`, max: 1, unit: 'tuần', answer: String(weeks), explain: `${per * weeks} : ${per} = ${weeks} (tuần).` };
    }, 1],
  ]),
};

const PARTS = [doDai, khoiLuong, dungTich, nhietDo, dongHo, ngayThang];

export const donVi = {
  id: 'don-vi', title: 'Đo lường', emoji: '📏',
  tips: [
    'Độ dài: km → hm → dam → m → dm → cm → mm. Mỗi đơn vị gấp 10 lần đơn vị liền sau.',
    'Khối lượng: 1 kg = 1000 g. Dung tích: 1 l = 1000 ml. Nhiệt độ đo bằng °C.',
    'Đồng hồ: kim ngắn chỉ giờ, kim dài chỉ phút (mỗi số = 5 phút). 13 giờ = 1 giờ chiều, 19 giờ = 7 giờ tối.',
    '1 tuần có 7 ngày, 1 ngày có 24 giờ, 1 giờ có 60 phút, 1 năm có 12 tháng.',
  ],
  parts: PARTS,
  make: mix(PARTS.map((p) => [p.make, 1])),
  game() {
    const k = rnd(0, 5), n = rnd(1, 9);
    if (k === 0) return gq(`${n} m = ? dm`, n * 10, [1, 10], `${n} m = ? dm`, `${n} m = ${n * 10} dm`);
    if (k === 1) return gq(`${n} m = ? cm`, n * 100, [10, 100], `${n} m = ? cm`, `${n} m = ${n * 100} cm`);
    if (k === 2) return gq(`${n} kg = ? g`, n * 1000, [100, 1000], `${n} kg = ? g`, `${n} kg = ${n * 1000} g`);
    if (k === 3) { const w = rnd(1, 5); return gq(`${w} tuần = ? ngày`, w * 7, [1, 7], `${w} tuần = ? ngày`, `${w} tuần = ${w * 7} ngày`); }
    if (k === 4) { const H = rnd(13, 23); return gq(`${H} giờ là mấy giờ chiều/tối?`, H - 12, [1, 2], `${H} giờ = ? giờ chiều/tối`, `${H} giờ = ${H - 12} giờ`); }
    return gq(`${n} cm = ? mm`, n * 10, [1, 10], `${n} cm = ? mm`, `${n} cm = ${n * 10} mm`);
  },
};
