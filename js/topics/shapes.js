// Chương Đo lường, Phân số và Hình học. Hình vẽ là chuỗi SVG (viewBox 200×140).
import { rnd, pickOne, shuffle, fmt } from './util.js';

const INK = '#3a3f58', FILL = '#ffd166', SOFT = '#e7ecf7', HI = '#ff6b6b';
const svg = (body, vb = '0 0 200 140') => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" font-family="system-ui" font-weight="700">${body}</svg>`;
const dot = (x, y, label, dy = -10) => `<circle cx="${x}" cy="${y}" r="4" fill="${INK}"/><text x="${x}" y="${y + dy}" font-size="16" text-anchor="middle" fill="${INK}">${label}</text>`;
const rad = (d) => (d * Math.PI) / 180;

// ---------- Đo lường ----------
const LENGTH = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
const MASS = ['kg', 'hg', 'dag', 'g'];
const TEMPS = [
  ['Nước đang sôi có nhiệt độ khoảng bao nhiêu?', '100°C'],
  ['Nước đá đang tan có nhiệt độ khoảng bao nhiêu?', '0°C'],
  ['Nhiệt độ cơ thể người khỏe mạnh khoảng bao nhiêu?', '37°C'],
  ['Một ngày hè nóng bức ở Hà Nội khoảng bao nhiêu?', '35°C'],
];

const donVi = {
  id: 'don-vi', title: 'Đổi đơn vị đo', emoji: '🌡️',
  tips: [
    'Độ dài từ lớn đến bé: km → hm → dam → m → dm → cm → mm. Mỗi bậc gấp 10 lần.',
    'Khối lượng: kg → hg → dag → g. 1 kg = 1000 g.',
    'Nhiệt độ đo bằng độ C (°C): nước đá 0°C, cơ thể người 37°C, nước sôi 100°C.',
  ],
  make() {
    const kind = rnd(0, 4);
    if (kind === 4) {
      const [text, answer] = pickOne(TEMPS);
      return { text: `🌡️ ${text}`, choices: shuffle(['0°C', '37°C', '35°C', '100°C']), answer, explain: `Đáp án: ${answer}.` };
    }
    const units = kind === 3 ? MASS : LENGTH;
    // Đổi từ đơn vị lớn sang đơn vị bé, cách nhau 1–3 bậc.
    const i = rnd(0, units.length - 2);
    const j = Math.min(units.length - 1, i + rnd(1, 3));
    const f = 10 ** (j - i), n = rnd(1, 9);
    if (kind === 2 && j - i === 1) {
      const m = rnd(1, 9);
      return { text: `${n} ${units[i]} ${m} ${units[j]} = ? ${units[j]}`, max: 3, answer: String(n * f + m), explain: `${n} ${units[i]} = ${n * f} ${units[j]}, thêm ${m} ${units[j]} là ${n * f + m} ${units[j]}.` };
    }
    return { text: `${n} ${units[i]} = ? ${units[j]}`, max: 4, answer: String(n * f), explain: `1 ${units[i]} = ${fmt(f)} ${units[j]}, nên ${n} ${units[i]} = ${fmt(n * f)} ${units[j]}.` };
  },
};

// ---------- Phân số ----------
function fractionSvg(n) {
  if (Math.random() < 0.5) {
    const w = 180 / n;
    let body = '';
    for (let k = 0; k < n; k++) body += `<rect x="${10 + k * w}" y="30" width="${w}" height="80" fill="${k === 0 ? FILL : SOFT}" stroke="${INK}" stroke-width="2"/>`;
    return svg(body);
  }
  let body = `<circle cx="100" cy="70" r="60" fill="${SOFT}" stroke="${INK}" stroke-width="2"/>`;
  const a = 360 / n, p = (d) => `${100 + 60 * Math.cos(rad(d - 90))} ${70 + 60 * Math.sin(rad(d - 90))}`;
  body += `<path d="M100 70 L${p(0)} A60 60 0 ${a > 180 ? 1 : 0} 1 ${p(a)} Z" fill="${FILL}" stroke="${INK}" stroke-width="2"/>`;
  for (let k = 0; k < n; k++) body += `<line x1="100" y1="70" x2="${p(k * a).replace(' ', '" y2="')}" stroke="${INK}" stroke-width="2"/>`;
  return svg(body);
}

const motPhan = {
  id: 'mot-phan', title: 'Một phần mấy', emoji: '🍰',
  tips: [
    'Chia hình thành n phần BẰNG NHAU, tô 1 phần → đã tô 1/n hình.',
    'Ví dụ chia cái bánh thành 4 phần bằng nhau, lấy 1 phần → 1/4 cái bánh.',
    'Tìm 1/n của một số: lấy số đó chia cho n. 1/3 của 12 là 12 : 3 = 4.',
  ],
  make() {
    const n = rnd(2, 9);
    if (Math.random() < 0.6) {
      const opts = shuffle([...new Set([n, n === 2 ? 3 : n - 1, n === 9 ? 8 : n + 1, rnd(2, 9)])]).slice(0, 4);
      if (!opts.includes(n)) opts[0] = n;
      return { text: 'Phần tô màu là một phần mấy của hình?', svg: fractionSvg(n), choices: shuffle(opts).map((k) => `1/${k}`), answer: `1/${n}`, explain: `Hình chia thành ${n} phần bằng nhau, tô 1 phần → 1/${n}.` };
    }
    const k = rnd(2, 9);
    return { text: `1/${n} của ${n * k} là bao nhiêu?`, max: 2, answer: String(k), explain: `${n * k} : ${n} = ${k}.` };
  },
};

// ---------- Hình học ----------
const trungDiem = {
  id: 'trung-diem', title: 'Điểm ở giữa, trung điểm', emoji: '📍',
  tips: [
    'M là điểm ở giữa A và B khi A, M, B thẳng hàng và M nằm giữa hai điểm đó.',
    'M là trung điểm của AB khi M ở giữa A, B VÀ MA = MB.',
    'Trung điểm chia đoạn thẳng thành 2 phần bằng nhau: AM = AB : 2.',
  ],
  make() {
    if (Math.random() < 0.35) {
      const ab = rnd(2, 10) * 2;
      return { text: `Đoạn AB dài ${ab} cm, M là trung điểm của AB. AM dài mấy cm?`, max: 2, answer: String(ab / 2), explain: `AM = AB : 2 = ${ab} : 2 = ${ab / 2} cm.` };
    }
    const kind = rnd(0, 2); // 0: trung điểm, 1: ở giữa nhưng lệch, 2: không thẳng hàng
    const t = kind === 0 ? 0.5 : pickOne([0.25, 0.32, 0.68, 0.75]);
    const mx = 20 + 160 * t, my = kind === 2 ? 40 : 80;
    const pic = svg(`<line x1="20" y1="80" x2="180" y2="80" stroke="${INK}" stroke-width="3"/>${dot(20, 80, 'A', 26)}${dot(180, 80, 'B', 26)}${dot(mx, my, 'M', kind === 2 ? -10 : 26)}`);
    const answer = kind === 0 ? 'Trung điểm' : kind === 1 ? 'Điểm ở giữa' : 'Không ở giữa';
    const explain = kind === 0 ? 'M nằm giữa A, B và MA = MB → M là trung điểm của AB.'
      : kind === 1 ? 'M nằm giữa A và B nhưng MA khác MB → chỉ là điểm ở giữa.'
        : 'M không nằm trên đoạn thẳng AB → không phải điểm ở giữa.';
    return { text: 'Điểm M là gì của đoạn AB?', svg: pic, choices: ['Trung điểm', 'Điểm ở giữa', 'Không ở giữa'], answer, explain };
  },
};

const hinhTron = {
  id: 'hinh-tron', title: 'Hình tròn: tâm, bán kính, đường kính', emoji: '⭕',
  tips: [
    'Tâm O là điểm chính giữa hình tròn.',
    'Bán kính: đoạn thẳng nối tâm O với một điểm trên đường tròn.',
    'Đường kính: đoạn thẳng đi qua tâm, nối 2 điểm trên đường tròn. Đường kính = 2 × bán kính.',
  ],
  make() {
    if (Math.random() < 0.35) {
      const r = rnd(2, 9);
      return Math.random() < 0.5
        ? { text: `Hình tròn có bán kính ${r} cm. Đường kính dài mấy cm?`, max: 2, answer: String(r * 2), explain: `Đường kính = 2 × bán kính = 2 × ${r} = ${r * 2} cm.` }
        : { text: `Hình tròn có đường kính ${r * 2} cm. Bán kính dài mấy cm?`, max: 2, answer: String(r), explain: `Bán kính = đường kính : 2 = ${r * 2} : 2 = ${r} cm.` };
    }
    const kind = rnd(0, 2), a = rnd(0, 359), R = 55;
    const pt = (d) => [100 + R * Math.cos(rad(d)), 70 + R * Math.sin(rad(d))];
    const [x1, y1] = pt(a);
    const [x2, y2] = kind === 0 ? [100, 70] : kind === 1 ? pt(a + 180) : pt(a + rnd(70, 120));
    const pic = svg(`<circle cx="100" cy="70" r="${R}" fill="${SOFT}" stroke="${INK}" stroke-width="2"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${HI}" stroke-width="4"/>${dot(100, 70, 'O', 20)}`);
    const answer = ['Bán kính', 'Đường kính', 'Không phải'][kind];
    const explain = ['Đoạn đỏ nối tâm O với đường tròn → bán kính.', 'Đoạn đỏ đi qua tâm O, nối 2 điểm trên đường tròn → đường kính.', 'Đoạn đỏ không đi qua tâm O → không phải bán kính, cũng không phải đường kính.'][kind];
    return { text: 'Đoạn thẳng màu đỏ là gì?', svg: pic, choices: ['Bán kính', 'Đường kính', 'Không phải'], answer, explain };
  },
};

const goc = {
  id: 'goc', title: 'Góc vuông, góc không vuông', emoji: '📐',
  tips: [
    'Góc gồm 1 đỉnh và 2 cạnh xuất phát từ đỉnh đó.',
    'Góc vuông giống góc của quyển vở, góc bảng đen.',
    'Dùng ê ke để kiểm tra: khít với góc của ê ke là góc vuông.',
  ],
  make() {
    if (Math.random() < 0.25) {
      const [text, ans] = pickOne([['Hình vuông có mấy góc vuông?', 4], ['Hình chữ nhật có mấy góc vuông?', 4], ['Ê ke có mấy góc vuông?', 1]]);
      return { text, max: 1, answer: String(ans), explain: `Đáp án: ${ans}.` };
    }
    const right = Math.random() < 0.5;
    const ang = right ? 90 : pickOne([rnd(35, 70), rnd(110, 150)]);
    const base = rnd(0, 3) * 90 + rnd(-20, 20), L = 70, vx = 100, vy = 70;
    const end = (d) => `${vx + L * Math.cos(rad(d))}" y2="${vy - L * Math.sin(rad(d))}`;
    const pic = svg(`<line x1="${vx}" y1="${vy}" x2="${end(base)}" stroke="${INK}" stroke-width="4"/><line x1="${vx}" y1="${vy}" x2="${end(base + ang)}" stroke="${INK}" stroke-width="4"/><circle cx="${vx}" cy="${vy}" r="5" fill="${INK}"/><text x="${vx - 22 * Math.cos(rad(base + ang / 2))}" y="${vy + 22 * Math.sin(rad(base + ang / 2)) + 6}" font-size="18" text-anchor="middle" fill="${INK}">O</text>`, '20 -10 160 160');
    const answer = right ? 'Góc vuông' : 'Góc không vuông';
    return { text: 'Đây là góc gì?', svg: pic, choices: ['Góc vuông', 'Góc không vuông'], answer, explain: right ? 'Hai cạnh vuông góc, khít với ê ke → góc vuông.' : `Góc này ${ang < 90 ? 'nhỏ hơn' : 'lớn hơn'} góc vuông → góc không vuông.` };
  },
};

const SHAPES = {
  'Hình tam giác': () => `<polygon points="${rnd(20, 60)},120 ${rnd(140, 180)},120 ${rnd(60, 140)},${rnd(15, 35)}"/>`,
  'Hình vuông': () => '<rect x="55" y="25" width="90" height="90"/>',
  'Hình chữ nhật': () => `<rect x="20" y="${rnd(30, 45)}" width="160" height="${rnd(55, 75)}"/>`,
  'Hình tứ giác': () => `<polygon points="${rnd(15, 40)},120 ${rnd(160, 185)},120 ${rnd(130, 160)},${rnd(20, 40)} ${rnd(45, 80)},${rnd(25, 50)}"/>`,
};
const hinhPhang = {
  id: 'hinh-phang', title: 'Tam giác, tứ giác, vuông, chữ nhật', emoji: '🔺',
  tips: [
    'Hình tam giác: 3 cạnh, 3 đỉnh, 3 góc.',
    'Hình tứ giác: 4 cạnh, 4 đỉnh, 4 góc.',
    'Hình chữ nhật: 4 góc vuông, 2 cạnh dài bằng nhau, 2 cạnh ngắn bằng nhau. Hình vuông: 4 góc vuông và 4 cạnh bằng nhau.',
  ],
  make() {
    if (Math.random() < 0.3) {
      const [text, ans] = pickOne([['Hình tam giác có mấy cạnh?', 3], ['Hình tứ giác có mấy đỉnh?', 4], ['Hình chữ nhật có mấy cạnh?', 4], ['Hình tam giác có mấy góc?', 3]]);
      return { text, max: 1, answer: String(ans), explain: `Đáp án: ${ans}.` };
    }
    const answer = pickOne(Object.keys(SHAPES));
    const pic = svg(`<g fill="${FILL}" stroke="${INK}" stroke-width="3" stroke-linejoin="round">${SHAPES[answer]()}</g>`);
    return { text: 'Đây là hình gì? (chọn tên đúng nhất)', svg: pic, choices: Object.keys(SHAPES), answer, explain: `Đây là ${answer.toLowerCase()}.${answer === 'Hình vuông' || answer === 'Hình chữ nhật' ? ' (Nó cũng là một hình tứ giác đặc biệt đấy!)' : ''}` };
  },
};

function boxSvg(w, hgt, d) {
  const x = 100 - (w + d * 0.6) / 2, y = 70 + (hgt - d * 0.5) / 2;
  const dx = d * 0.6, dy = d * 0.5;
  return svg(`<g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round">
    <polygon points="${x},${y} ${x + w},${y} ${x + w},${y - hgt} ${x},${y - hgt}" fill="${FILL}"/>
    <polygon points="${x},${y - hgt} ${x + w},${y - hgt} ${x + w + dx},${y - hgt - dy} ${x + dx},${y - hgt - dy}" fill="#ffe29a"/>
    <polygon points="${x + w},${y} ${x + w + dx},${y - dy} ${x + w + dx},${y - hgt - dy} ${x + w},${y - hgt}" fill="#f4b740"/></g>`);
}
const khoi = {
  id: 'khoi', title: 'Khối lập phương, khối hộp chữ nhật', emoji: '🧊',
  tips: [
    'Khối lập phương (như con xúc xắc 🎲): 6 mặt đều là hình vuông bằng nhau.',
    'Khối hộp chữ nhật (như hộp sữa, viên gạch): 6 mặt là hình chữ nhật.',
    'Cả hai khối đều có 6 mặt, 8 đỉnh, 12 cạnh.',
  ],
  make() {
    if (Math.random() < 0.35) {
      const [text, ans] = pickOne([['Khối lập phương có mấy mặt?', 6], ['Khối hộp chữ nhật có mấy đỉnh?', 8], ['Khối lập phương có mấy cạnh?', 12], ['Khối hộp chữ nhật có mấy mặt?', 6]]);
      return { text, max: 2, answer: String(ans), explain: 'Khối lập phương và khối hộp chữ nhật đều có 6 mặt, 8 đỉnh, 12 cạnh.' };
    }
    const cube = Math.random() < 0.5;
    const s = rnd(60, 75);
    const pic = cube ? boxSvg(s, s, s) : boxSvg(rnd(95, 115), rnd(40, 55), rnd(40, 60));
    const answer = cube ? 'Khối lập phương' : 'Khối hộp chữ nhật';
    return { text: 'Đây là khối gì?', svg: pic, choices: ['Khối lập phương', 'Khối hộp chữ nhật'], answer, explain: cube ? 'Các cạnh dài bằng nhau, mặt là hình vuông → khối lập phương.' : 'Các cạnh dài ngắn khác nhau, mặt là hình chữ nhật → khối hộp chữ nhật.' };
  },
};

export const SHAPE_TOPICS = [donVi, motPhan, trungDiem, hinhTron, goc, hinhPhang, khoi];
