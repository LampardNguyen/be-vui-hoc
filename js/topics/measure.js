// Chương Đo lường: mỗi loại đơn vị là một phần luyện riêng (parts), "Luyện tập" chung thì trộn tất cả.
import { rnd, pickOne, shuffle, fmt, gq, mix, FRIENDS } from './util.js';
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
      return { text: 'Kim cân đồng hồ chỉ số mấy? Vật nặng bao nhiêu ki-lô-gam?', svg: svg(dialScale(v, e), '0 0 150 180'), max: 2, unit: 'kg', answer: String(v), explain: `Kim đỏ chỉ số ${v} → ${v} kg.` };
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
  ]),
};

const nhietDo = {
  id: 'nhiet-do', title: 'Nhiệt độ', emoji: '🌡️',
  make: mix([
    [() => { const v = rnd(0, 20) * 5; return { text: 'Nhiệt kế chỉ bao nhiêu độ C? 🌡️', svg: thermometer(v), max: 3, unit: '°C', answer: String(v), explain: `Mỗi vạch dài là 10°C, vạch ngắn ở giữa là 5°C. Cột đỏ tới ${v}°C.` }; }, 3],
    [() => { const [t, v] = pickOne(TEMPS); return { text: `🌡️ ${t} có nhiệt độ khoảng bao nhiêu?`, choices: shuffle(['0°C', '37°C', '35°C', '100°C']), answer: `${v}°C`, explain: `${t}: khoảng ${v}°C.` }; }, 2],
    [() => {
      const a = rnd(18, 30), d = rnd(2, 9), up = Math.random() < 0.5;
      return { text: `Buổi sáng trời ${a}°C. Đến trưa nhiệt độ ${up ? 'tăng thêm' : 'giảm đi'} ${d}°C. Buổi trưa trời bao nhiêu độ C? ☀️`, max: 2, unit: '°C', answer: String(up ? a + d : a - d), explain: `${a} ${up ? '+' : '−'} ${d} = ${up ? a + d : a - d} (°C).` };
    }, 2],
    [() => {
      const a = rnd(2, 19) * 5, b = rnd(2, 19) * 5;
      if (a === b) return nhietDo.make();
      return { text: `Nhiệt kế A chỉ ${a}°C, nhiệt kế B chỉ ${b}°C. Nơi nào nóng hơn? 🔥`, choices: ['A', 'B'], answer: a > b ? 'A' : 'B', explain: `${Math.max(a, b)}°C > ${Math.min(a, b)}°C.` };
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
      // Như sách: ngày 4 tháng 10 là thứ Ba thì ngày 10 tháng 10 là thứ mấy?
      const d1 = rnd(1, 20), w1 = rnd(0, 6), d2 = d1 + rnd(2, 10), w2 = (w1 + d2 - d1) % 7, mo = rnd(1, 12);
      const opts = shuffle([...new Set([w2, (w2 + 1) % 7, (w2 + 6) % 7, (w2 + 2) % 7])]).map((w) => DAYS[w]);
      return { text: `Nếu ngày ${d1} tháng ${mo} là ${DAYS[w1]} thì ngày ${d2} tháng ${mo} là thứ mấy? 📅`, choices: opts, answer: DAYS[w2], calcText: `${d2} − ${d1}`, explain: `Từ ngày ${d1} đến ngày ${d2} cách ${d2 - d1} ngày${d2 - d1 >= 7 ? ` (= 1 tuần + ${d2 - d1 - 7} ngày)` : ''}, đếm tiếp từ ${DAYS[w1]} được ${DAYS[w2]}.` };
    }, 3],
    [() => {
      // Thứ X tuần này là ngày d thì thứ Y tuần sau là ngày?
      const ia = rnd(0, 6), ib = rnd(0, 6), d = rnd(1, 15), d2 = d + 7 - ia + ib, mo = rnd(1, 12);
      const opts = shuffle([...new Set([d2, d2 - 1, d2 + 1, d2 - 7])]);
      return { text: `Nếu ${DAYS[ia]} tuần này là ngày ${d} tháng ${mo} thì ${DAYS[ib]} tuần sau là ngày nào?`, choices: opts.map((v) => `${v} tháng ${mo}`), answer: `${d2} tháng ${mo}`, explain: `${DAYS[ia]} tuần sau là ngày ${d + 7}, ${ib >= ia ? 'đếm thêm' : 'đếm lùi'} ${Math.abs(ib - ia)} ngày được ngày ${d2}.` };
    }, 2],
    [() => {
      const mo = rnd(1, 12), n = MONTH_DAYS[mo - 1];
      return { text: `Tháng ${mo} có bao nhiêu ngày? 🗓️ (năm thường)`, choices: ['28', '30', '31'], answer: String(n), explain: 'Tháng 1, 3, 5, 7, 8, 10, 12 có 31 ngày; tháng 4, 6, 9, 11 có 30 ngày; tháng 2 có 28 hoặc 29 ngày. (Nắm tay đếm khớp xương nhé ✊)' };
    }, 2],
    [() => {
      const [t, a] = pickOne([['1 tuần lễ có bao nhiêu ngày?', 7], ['1 ngày có bao nhiêu giờ?', 24], ['1 giờ có bao nhiêu phút?', 60], ['1 năm có bao nhiêu tháng?', 12]]);
      return { text: t, max: 2, answer: String(a), explain: `${t.replace(' có bao nhiêu', ' có').replace('?', '')} ${a}.` };
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
