// Vẽ hình SVG (chuỗi) cho các chương. Phần tử có data-k là chỗ bé chạm được (dạng bài 'pick' / 'paint').
import { rnd, pickOne, shuffle } from './util.js';

export const INK = '#3a3f58', FILL = '#ffd166', SOFT = '#e7ecf7', HI = '#ff6b6b';
export const COLORS = ['#ffd166', '#06d6a0', '#4cc9f0', '#f78c6b', '#c77dff', '#90be6d', '#ff8fab'];
export const rad = (d) => (d * Math.PI) / 180;
const r1 = (n) => Math.round(n * 10) / 10;

export const svg = (body, vb = '0 0 300 200') =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" stroke-linejoin="round" font-family="system-ui" font-weight="700">${body}</svg>`;

export const label = (x, y, t, size = 18, color = INK) =>
  `<text x="${r1(x)}" y="${r1(y)}" font-size="${size}" text-anchor="middle" dominant-baseline="middle" fill="${color}">${t}</text>`;

export const dot = (x, y, t, dx = 0, dy = -16) =>
  `<circle cx="${r1(x)}" cy="${r1(y)}" r="5" fill="${INK}"/>${t ? label(x + dx, y + dy, t) : ''}`;

// Đoạn thẳng chạm được: nét thật + nét trong suốt dày cho dễ chạm.
export const tapLine = (k, x1, y1, x2, y2, color = INK, w = 5) =>
  `<g data-k="${k}"><line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${color}" stroke-width="${w}" class="vis"/><line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="transparent" stroke-width="26"/></g>`;

export const tapDot = (k, x, y, t, dy = -18) =>
  `<g data-k="${k}"><circle cx="${r1(x)}" cy="${r1(y)}" r="22" fill="transparent"/><circle cx="${r1(x)}" cy="${r1(y)}" r="7" fill="${INK}" class="vis"/>${t ? label(x, y + dy, t) : ''}</g>`;

// ---------- Cân thăng bằng: chữ trên 2 đĩa, beam nghiêng sau khi bé trả lời ----------
export function balance(left, right) {
  const pan = (x, t) => `<line x1="${x}" y1="60" x2="${x - 38}" y2="110" stroke="${INK}" stroke-width="2"/><line x1="${x}" y1="60" x2="${x + 38}" y2="110" stroke="${INK}" stroke-width="2"/>
    <path d="M${x - 58} 110 Q${x} 140 ${x + 58} 110 Z" fill="${FILL}" stroke="${INK}" stroke-width="3"/>${label(x, 96, t, 17)}`;
  return svg(`<polygon points="150,62 125,190 175,190" fill="#b8c0d9" stroke="${INK}" stroke-width="3"/>
    <rect x="95" y="186" width="110" height="10" rx="5" fill="${INK}"/>
    <g class="beam" style="transform-origin:150px 60px">
      <rect x="55" y="55" width="190" height="10" rx="5" fill="${INK}"/>${pan(70, left)}${pan(230, right)}
    </g><circle cx="150" cy="60" r="9" fill="${HI}"/>`, '0 0 300 205');
}

// ---------- Thước kẻ cm, vật nằm từ `from` tới `to` ----------
export function ruler(n, from, to, emoji = '✏️') {
  const L = 20, W = (300 - 2 * L) / n;
  let ticks = '';
  for (let i = 0; i <= n; i++) {
    ticks += `<line x1="${r1(L + i * W)}" y1="110" x2="${r1(L + i * W)}" y2="${i % 5 ? 124 : 132}" stroke="${INK}" stroke-width="2"/>${label(L + i * W, 146, i, 13)}`;
    if (i < n) ticks += `<line x1="${r1(L + i * W + W / 2)}" y1="110" x2="${r1(L + i * W + W / 2)}" y2="117" stroke="${INK}" stroke-width="1"/>`;
  }
  const x1 = L + from * W, x2 = L + to * W;
  return svg(`<rect x="8" y="108" width="284" height="50" rx="6" fill="#fff3c4" stroke="${INK}" stroke-width="2"/>${ticks}
    <rect x="${r1(x1)}" y="74" width="${r1(x2 - x1)}" height="24" rx="12" fill="${pickOne(COLORS)}" stroke="${INK}" stroke-width="2"/>
    ${label((x1 + x2) / 2, 86, emoji, 16)}
    <line x1="${r1(x1)}" y1="70" x2="${r1(x1)}" y2="110" stroke="${HI}" stroke-width="1.5" stroke-dasharray="3 3"/>
    <line x1="${r1(x2)}" y1="70" x2="${r1(x2)}" y2="110" stroke="${HI}" stroke-width="1.5" stroke-dasharray="3 3"/>`, '0 60 300 105');
}

// ---------- Nhiệt kế: 0–max °C, vạch mỗi 10 độ, cột đỏ tới value ----------
export function thermometer(value, max = 100) {
  const top = 20, bot = 230, y = (v) => bot - ((bot - top) * v) / max;
  let ticks = '';
  for (let v = 0; v <= max; v += max / 10) ticks += `<line x1="160" y1="${r1(y(v))}" x2="176" y2="${r1(y(v))}" stroke="${INK}" stroke-width="2"/>${label(198, y(v), v, 13)}`;
  for (let v = max / 20; v < max; v += max / 10) ticks += `<line x1="160" y1="${r1(y(v))}" x2="169" y2="${r1(y(v))}" stroke="${INK}" stroke-width="1"/>`;
  return svg(`<rect x="132" y="10" width="26" height="232" rx="13" fill="#fff" stroke="${INK}" stroke-width="3"/>
    <rect x="139" y="${r1(y(value))}" width="12" height="${r1(bot - y(value) + 12)}" fill="${HI}"/>
    <circle cx="145" cy="250" r="20" fill="${HI}" stroke="${INK}" stroke-width="3"/>${ticks}${label(100, 30, '°C', 18)}`, '60 0 180 280');
}

// ---------- Cân đĩa có quả cân: vật (emoji) bên trái, các quả cân bên phải ----------
export function weights(emoji, list) {
  let x = 175, body = '';
  for (const w of list) {
    const s = w >= 1000 ? 46 : w >= 500 ? 40 : w >= 200 ? 34 : 28;
    body += `<path d="M${x} 112 l6 -${s} h${s - 12} l6 ${s} Z" fill="#8d99ae" stroke="${INK}" stroke-width="2"/>${label(x + s / 2, 112 - s / 2, w >= 1000 ? `${w / 1000}kg` : `${w}g`, 11, '#fff')}`;
    x += s + 4;
  }
  return svg(`<rect x="10" y="112" width="130" height="12" rx="6" fill="${INK}"/><rect x="160" y="112" width="${Math.max(130, x - 156)}" height="12" rx="6" fill="${INK}"/>
    <rect x="60" y="124" width="${Math.max(170, x - 56)}" height="16" rx="6" fill="#b8c0d9" stroke="${INK}" stroke-width="2"/>
    ${label(75, 82, emoji, 54)}${body}`, `0 40 ${Math.max(300, x + 10)} 110`);
}

// ---------- Hình phẳng ngẫu nhiên ----------
// type: tri | square | rect | quad | circle. Trả về chuỗi hình tại tâm (cx, cy), cỡ s, xoay ngẫu nhiên.
export function shape(type, cx, cy, s, fill) {
  const rot = rnd(0, 3) * 90 + rnd(-25, 25);
  const pts = {
    tri: () => [[-0.5 + Math.random() * 0.3, 0.42], [0.5, 0.42], [rnd(-30, 30) / 100, -0.48]],
    square: () => [[-0.36, -0.36], [0.36, -0.36], [0.36, 0.36], [-0.36, 0.36]],
    rect: () => { const w = 0.48, hh = rnd(18, 28) / 100; return [[-w, -hh], [w, -hh], [w, hh], [-w, hh]]; },
    quad: () => [[-0.5, 0.35], [0.48, 0.38], [0.28 + Math.random() * 0.15, -0.4], [-0.3 - Math.random() * 0.15, -0.28]],
  };
  if (type === 'circle') return `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(s * 0.4)}" fill="${fill}" stroke="${INK}" stroke-width="3"/>`;
  const p = pts[type]().map(([x, y]) => {
    const a = rad(rot);
    return `${r1(cx + s * (x * Math.cos(a) - y * Math.sin(a)))},${r1(cy + s * (x * Math.sin(a) + y * Math.cos(a)))}`;
  }).join(' ');
  return `<polygon points="${p}" fill="${fill}" stroke="${INK}" stroke-width="3"/>`;
}

// Bãi hình lộn xộn, mỗi hình chạm được (data-k = 'i:type').
export function shapeField(types) {
  const cols = 4, rows = Math.ceil(types.length / cols), cw = 300 / cols, ch = 80;
  const cells = shuffle([...Array(cols * rows).keys()]);
  const body = types.map((t, i) => {
    const c = cells[i], cx = (c % cols) * cw + cw / 2 + rnd(-6, 6), cy = Math.floor(c / cols) * ch + ch / 2 + rnd(-4, 4);
    return `<g data-k="${i}:${t}">${shape(t, cx, cy, rnd(62, 74), COLORS[i % COLORS.length])}<rect x="${r1(cx - cw / 2)}" y="${r1(cy - ch / 2)}" width="${r1(cw)}" height="${ch}" fill="transparent"/></g>`;
  }).join('');
  return svg(body, `0 0 300 ${rows * ch}`);
}

// ---------- Đa giác có đỉnh chạm được, tự tính góc vuông ----------
export function polygonPick(points, names = 'ABCDEFG') {
  const n = points.length;
  const cx = points.reduce((s, p) => s + p[0], 0) / n, cy = points.reduce((s, p) => s + p[1], 0) / n;
  const right = [];
  const body = points.map(([x, y], i) => {
    const [ax, ay] = points[(i + n - 1) % n], [bx, by] = points[(i + 1) % n];
    const v1 = [ax - x, ay - y], v2 = [bx - x, by - y];
    const cos = (v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2));
    if (Math.abs(cos) < 0.02) right.push(names[i]);
    const d = Math.hypot(x - cx, y - cy) || 1;
    return tapDot(names[i], x, y, '', 0) + label(x + ((x - cx) / d) * 22, y + ((y - cy) / d) * 22, names[i]);
  }).join('');
  return { svg: svg(`<polygon points="${points.map((p) => p.map(r1).join(',')).join(' ')}" fill="${FILL}" stroke="${INK}" stroke-width="4"/>${body}`, '0 0 300 220'), right };
}

// Xoay + đặt đa giác (toạ độ gốc quanh 0) vào khung 300×220.
export function place(pts, rot = rnd(0, 359)) {
  const a = rad(rot);
  const p = pts.map(([x, y]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]);
  const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
  const w = Math.max(...xs) - Math.min(...xs), hh = Math.max(...ys) - Math.min(...ys);
  const k = Math.min(230 / w, 160 / hh, 2.4);
  const ox = 150 - ((Math.max(...xs) + Math.min(...xs)) / 2) * k, oy = 110 - ((Math.max(...ys) + Math.min(...ys)) / 2) * k;
  return p.map(([x, y]) => [x * k + ox, y * k + oy]);
}

// ---------- Khối lập phương nhỏ xếp chồng (nhìn chéo) ----------
// heights[r][c] = số khối ở ô (r, c). Trả về svg.
export function cubeStack(heights) {
  const s = 26, dx = s * 0.6, dy = s * 0.45;
  let body = '';
  const R = heights.length;
  for (let r = R - 1; r >= 0; r--) {
    for (let c = 0; c < heights[r].length; c++) {
      for (let z = 0; z < heights[r][c]; z++) {
        const x = 60 + c * s + r * dx, y = 170 - z * s - r * dy;
        body += `<g stroke="${INK}" stroke-width="2"><rect x="${r1(x)}" y="${r1(y - s)}" width="${s}" height="${s}" fill="${FILL}"/>
          <polygon points="${r1(x)},${r1(y - s)} ${r1(x + dx)},${r1(y - s - dy)} ${r1(x + s + dx)},${r1(y - s - dy)} ${r1(x + s)},${r1(y - s)}" fill="#ffe29a"/>
          <polygon points="${r1(x + s)},${r1(y)} ${r1(x + s + dx)},${r1(y - dy)} ${r1(x + s + dx)},${r1(y - s - dy)} ${r1(x + s)},${r1(y - s)}" fill="#f4b740"/></g>`;
      }
    }
  }
  return svg(body, '40 20 220 170');
}

// Hộp (khối) nhìn chéo: w × h × d.
export function box(w, hgt, d, cx = 150, cy = 110, fill = FILL) {
  const dx = d * 0.6, dy = d * 0.5, x = cx - (w + dx) / 2, y = cy + (hgt - dy) / 2;
  return `<g stroke="${INK}" stroke-width="2.5">
    <rect x="${r1(x)}" y="${r1(y - hgt)}" width="${w}" height="${hgt}" fill="${fill}"/>
    <polygon points="${r1(x)},${r1(y - hgt)} ${r1(x + w)},${r1(y - hgt)} ${r1(x + w + dx)},${r1(y - hgt - dy)} ${r1(x + dx)},${r1(y - hgt - dy)}" fill="#fff" fill-opacity=".45"/>
    <polygon points="${r1(x + w)},${r1(y)} ${r1(x + w + dx)},${r1(y - dy)} ${r1(x + w + dx)},${r1(y - hgt - dy)} ${r1(x + w)},${r1(y - hgt)}" fill="#000" fill-opacity=".15"/></g>`;
}

// ---------- Phân số: hình chia phần, phần có data-k để tô ----------
// equal=false: chia không đều (để bé nhận ra "không phải 1/n").
export function fracShape(n, { kind = pickOne(['bar', 'pie', 'grid']), shade = [], equal = true, tap = false } = {}) {
  const fillOf = (i) => (shade.includes(i) ? FILL : '#fff');
  const wrap = (i, inner) => (tap ? `<g data-k="${i}">${inner}</g>` : inner);
  if (kind === 'pie') {
    const R = 80, p = (d) => `${r1(150 + R * Math.cos(rad(d - 90)))} ${r1(100 + R * Math.sin(rad(d - 90)))}`;
    let cuts = [...Array(n + 1).keys()].map((i) => (360 * i) / n);
    if (!equal) cuts = cuts.map((c, i) => (i && i < n ? c + (i % 2 ? 1 : -1) * (180 / n) * 0.55 : c));
    return svg(cuts.slice(0, n).map((a, i) => wrap(i, `<path d="M150 100 L${p(a)} A${R} ${R} 0 ${cuts[i + 1] - a > 180 ? 1 : 0} 1 ${p(cuts[i + 1])} Z" fill="${fillOf(i)}" stroke="${INK}" stroke-width="3" class="part"/>`)).join(''));
  }
  if (kind === 'grid' && [4, 6, 8, 9].includes(n)) {
    const cols = n === 9 ? 3 : n / 2, rows = n / cols, w = 240 / cols, hh = 160 / rows;
    return svg([...Array(n).keys()].map((i) => wrap(i, `<rect x="${r1(30 + (i % cols) * w)}" y="${r1(20 + Math.floor(i / cols) * hh)}" width="${r1(w)}" height="${r1(hh)}" fill="${fillOf(i)}" stroke="${INK}" stroke-width="3" class="part"/>`)).join(''));
  }
  let xs = [...Array(n + 1).keys()].map((i) => 20 + (260 * i) / n);
  if (!equal) xs = xs.map((x, i) => (i && i < n ? x + (i % 2 ? 1 : -1) * (130 / n) * 0.6 : x));
  return svg(xs.slice(0, n).map((x, i) => wrap(i, `<rect x="${r1(x)}" y="50" width="${r1(xs[i + 1] - x)}" height="100" fill="${fillOf(i)}" stroke="${INK}" stroke-width="3" class="part"/>`)).join(''));
}

// Lưới đồ vật (emoji) chạm được để tô/khoanh.
export function itemGrid(count, emoji, cols = Math.min(count, 6)) {
  const rows = Math.ceil(count / cols), w = 300 / cols;
  return svg([...Array(count).keys()].map((i) => {
    const x = (i % cols) * w + w / 2, y = Math.floor(i / cols) * 56 + 30;
    return `<g data-k="${i}"><circle cx="${r1(x)}" cy="${y}" r="25" fill="#fff" stroke="#c9cfdb" stroke-width="2" class="part"/>${label(x, y + 1, emoji, 28)}</g>`;
  }).join(''), `0 0 300 ${rows * 56 + 4}`);
}

// Chia kẹo: đống `n` đồ vật ở trên, `groups` bạn với đĩa trống ở dưới (bé tự nghĩ cách chia).
export function shareSvg(groups, n, emoji = '🍬') {
  const per = 10, rows = Math.ceil(n / per);
  let pile = '';
  for (let i = 0; i < n; i++) pile += label(24 + (i % per) * 28, 22 + Math.floor(i / per) * 30, emoji, 24);
  const y0 = rows * 30 + 34, w = 300 / groups;
  const kids = ['🧒', '👧', '👦', '🧒🏻', '👧🏻'];
  const plates = [...Array(groups).keys()].map((g) => {
    const x = w * g + w / 2;
    return `${label(x, y0, kids[g % kids.length], 30)}<ellipse cx="${x}" cy="${y0 + 36}" rx="${Math.min(26, w / 2 - 4)}" ry="11" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
  }).join('');
  return svg(pile + plates, `0 0 300 ${y0 + 54}`);
}
