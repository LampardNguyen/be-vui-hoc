// Chương nhóm "Số và phép tính" và "Tìm thành phần".
// Mỗi chương: { id, title, emoji, tips: [..], make() → câu hỏi }.
// Câu hỏi: { text, svg?, choices? (mảng chuỗi) | max? (số chữ số bàn phím), answer (chuỗi), explain }.
import { rnd, pickOne } from './util.js';

const soSanh = {
  id: 'so-sanh-1000', title: 'So sánh số dưới 1000', emoji: '⚖️',
  tips: [
    'So sánh từ trái sang phải: hàng trăm trước, rồi hàng chục, rồi hàng đơn vị.',
    'Chữ số nào lớn hơn thì số đó lớn hơn. Ví dụ 532 > 528 vì 3 chục > 2 chục.',
    'Dấu > và < luôn "há miệng" về phía số lớn hơn 🐊.',
  ],
  make() {
    const a = rnd(100, 999);
    const kind = rnd(0, 5);
    let b = kind === 0 ? a : kind < 3 ? a + pickOne([-1, 1]) * rnd(1, 9) : a + pickOne([-1, 1]) * rnd(10, 90);
    b = Math.min(999, Math.max(100, b));
    const ans = a > b ? '>' : a < b ? '<' : '=';
    return {
      text: `${a} ☐ ${b}`, choices: ['<', '=', '>'], answer: ans,
      explain: a === b ? 'Hai số giống hệt nhau nên bằng nhau.' : `So từng hàng từ trái sang: ${a} ${ans} ${b}.`,
    };
  },
};

const congTru = {
  id: 'cong-tru-1000', title: 'Cộng trừ dưới 1000', emoji: '➕',
  tips: [
    'Đặt tính thẳng cột: đơn vị dưới đơn vị, chục dưới chục, trăm dưới trăm.',
    'Tính từ phải sang trái. Cộng quá 10 thì "nhớ 1" sang hàng bên trái.',
    'Trừ mà không đủ thì "mượn 1" ở hàng bên trái (nhớ trả lại nhé).',
  ],
  make() {
    if (Math.random() < 0.5) {
      const a = rnd(100, 800), b = rnd(10, 999 - a);
      return { text: `${a} + ${b} = ?`, max: 3, answer: String(a + b), explain: `${a} + ${b} = ${a + b}` };
    }
    const a = rnd(200, 999), b = rnd(10, a - 50);
    return { text: `${a} − ${b} = ?`, max: 3, answer: String(a - b), explain: `${a} − ${b} = ${a - b}` };
  },
};

const nhanChiaLon = {
  id: 'nhan-chia-lon', title: 'Nhân, chia số 2–3 chữ số với 1 chữ số', emoji: '🧮',
  tips: [
    'Nhân: lấy số 1 chữ số nhân lần lượt đơn vị, chục, trăm (từ phải sang trái), nhớ sang hàng tiếp theo.',
    'Chia: chia từ trái sang phải, mỗi lần: chia → nhân → trừ → hạ chữ số tiếp theo.',
    'Ví dụ 123 × 3 = 369, vì 3×3=9, 2×3=6, 1×3=3.',
  ],
  make() {
    const b = rnd(2, 9);
    if (Math.random() < 0.5) {
      const a = Math.random() < 0.5 ? rnd(11, 99) : rnd(100, Math.floor(999 / b));
      return { text: `${a} × ${b} = ?`, max: 4, answer: String(a * b), explain: `${a} × ${b} = ${a * b}` };
    }
    const q = rnd(11, Math.floor(999 / b));
    return { text: `${q * b} : ${b} = ?`, max: 3, answer: String(q), explain: `${q * b} : ${b} = ${q} (vì ${q} × ${b} = ${q * b})` };
  },
};

const chiaDu = {
  id: 'chia-du', title: 'Phép chia hết và có dư', emoji: '🍬',
  tips: [
    'Chia hết: số dư bằng 0. Ví dụ 12 : 3 = 4.',
    'Chia có dư: 13 : 4 = 3 (dư 1), vì 4 × 3 = 12, 13 − 12 = 1.',
    '⭐ Số dư luôn bé hơn số chia!',
  ],
  make() {
    const b = rnd(2, 9), q = rnd(2, 9), r = rnd(0, b - 1), a = b * q + r;
    const explain = `${a} : ${b} = ${q}${r ? ` (dư ${r})` : ''} vì ${b} × ${q} = ${b * q}${r ? `, ${a} − ${b * q} = ${r}` : ''}.`;
    const kind = rnd(0, 2);
    if (kind === 0) return { text: `${a} : ${b} = ${q} dư mấy?`, max: 1, answer: String(r), explain };
    if (kind === 1) return { text: `${a} : ${b} = ? (dư ${r})`, max: 2, answer: String(q), explain };
    return { text: `Phép chia ${a} : ${b} là phép chia…`, choices: ['Chia hết', 'Có dư'], answer: r ? 'Có dư' : 'Chia hết', explain };
  },
};

const bieuThuc = {
  id: 'bieu-thuc', title: 'Biểu thức số', emoji: '🧾',
  tips: [
    'Chỉ có cộng, trừ (hoặc chỉ có nhân, chia): tính từ trái sang phải.',
    'Có cả cộng/trừ và nhân/chia: tính nhân, chia trước, cộng, trừ sau.',
    'Có dấu ngoặc ( ): tính trong ngoặc trước.',
  ],
  make() {
    const kind = rnd(0, 3);
    if (kind === 0) {
      const a = rnd(20, 90), b = rnd(10, 60), c = rnd(5, a + b - 1);
      return { text: `${a} + ${b} − ${c} = ?`, max: 3, answer: String(a + b - c), explain: `Từ trái sang phải: ${a} + ${b} = ${a + b}, ${a + b} − ${c} = ${a + b - c}.` };
    }
    if (kind === 1) {
      const a = rnd(10, 90), b = rnd(2, 9), c = rnd(2, 9);
      return { text: `${a} + ${b} × ${c} = ?`, max: 3, answer: String(a + b * c), explain: `Nhân trước: ${b} × ${c} = ${b * c}, rồi ${a} + ${b * c} = ${a + b * c}.` };
    }
    if (kind === 2) {
      const a = rnd(2, 20), b = rnd(2, 20), c = rnd(2, 9);
      return { text: `(${a} + ${b}) × ${c} = ?`, max: 3, answer: String((a + b) * c), explain: `Trong ngoặc trước: ${a} + ${b} = ${a + b}, rồi ${a + b} × ${c} = ${(a + b) * c}.` };
    }
    const b = rnd(2, 9), q = rnd(2, 9), a = rnd(q + 1, 90);
    return { text: `${a} − ${b * q} : ${b} = ?`, max: 3, answer: String(a - q), explain: `Chia trước: ${b * q} : ${b} = ${q}, rồi ${a} − ${q} = ${a - q}.` };
  },
};

const gapMayLan = {
  id: 'gap-may-lan', title: 'Số lớn gấp mấy lần số bé', emoji: '📊',
  tips: [
    'Muốn biết số lớn gấp mấy lần số bé: lấy số lớn chia cho số bé.',
    'Ví dụ 12 gấp 3 mấy lần? 12 : 3 = 4 → gấp 4 lần.',
    'Gấp một số lên mấy lần thì lấy số đó nhân với số lần.',
  ],
  make() {
    const b = rnd(2, 9), k = rnd(2, 9);
    const items = pickOne(['🍎 quả táo', '🐟 con cá', '⭐ ngôi sao', '🎈 quả bóng']);
    if (Math.random() < 0.6) {
      return { text: `Có ${b * k} ${items} và ${b} ${items}. Số lớn gấp số bé mấy lần?`, max: 1, answer: String(k), explain: `${b * k} : ${b} = ${k}, vậy gấp ${k} lần.` };
    }
    return { text: `Gấp ${b} lên ${k} lần được bao nhiêu?`, max: 2, answer: String(b * k), explain: `${b} × ${k} = ${b * k}.` };
  },
};

const tpCongTru = {
  id: 'tp-cong-tru', title: 'Tìm thành phần trong phép cộng, trừ', emoji: '🔍',
  tips: [
    'Số hạng + Số hạng = Tổng. Tìm số hạng: lấy Tổng trừ số hạng kia.',
    'Số bị trừ − Số trừ = Hiệu.',
    'Tìm số bị trừ: lấy Hiệu cộng Số trừ. Tìm số trừ: lấy Số bị trừ trừ Hiệu.',
  ],
  make() {
    const x = rnd(10, 400), y = rnd(10, 400), s = x + y;
    switch (rnd(0, 3)) {
      case 0: return { text: `? + ${y} = ${s}`, max: 3, answer: String(x), explain: `Số hạng = Tổng − số hạng kia: ${s} − ${y} = ${x}.` };
      case 1: return { text: `${x} + ? = ${s}`, max: 3, answer: String(y), explain: `Số hạng = Tổng − số hạng kia: ${s} − ${x} = ${y}.` };
      case 2: return { text: `? − ${y} = ${x}`, max: 3, answer: String(s), explain: `Số bị trừ = Hiệu + Số trừ: ${x} + ${y} = ${s}.` };
      default: return { text: `${s} − ? = ${x}`, max: 3, answer: String(y), explain: `Số trừ = Số bị trừ − Hiệu: ${s} − ${x} = ${y}.` };
    }
  },
};

const tpNhanChia = {
  id: 'tp-nhan-chia', title: 'Tìm thành phần trong phép nhân, chia', emoji: '🔎',
  tips: [
    'Thừa số × Thừa số = Tích. Tìm thừa số: lấy Tích chia thừa số kia.',
    'Số bị chia : Số chia = Thương.',
    'Tìm số bị chia: lấy Thương nhân Số chia. Tìm số chia: lấy Số bị chia chia Thương.',
  ],
  make() {
    const a = rnd(2, 9), b = rnd(2, 9), p = a * b;
    switch (rnd(0, 3)) {
      case 0: return { text: `? × ${b} = ${p}`, max: 2, answer: String(a), explain: `Thừa số = Tích : thừa số kia: ${p} : ${b} = ${a}.` };
      case 1: return { text: `${a} × ? = ${p}`, max: 2, answer: String(b), explain: `Thừa số = Tích : thừa số kia: ${p} : ${a} = ${b}.` };
      case 2: return { text: `? : ${b} = ${a}`, max: 2, answer: String(p), explain: `Số bị chia = Thương × Số chia: ${a} × ${b} = ${p}.` };
      default: return { text: `${p} : ? = ${a}`, max: 2, answer: String(b), explain: `Số chia = Số bị chia : Thương: ${p} : ${a} = ${b}.` };
    }
  },
};

// Câu hỏi "tên gọi" xen kẽ cho 2 chương tìm thành phần.
const NAMES = {
  'tp-cong-tru': [['Trong 25 + 13 = 38, số 38 gọi là gì?', ['Số hạng', 'Tổng', 'Hiệu'], 'Tổng'],
    ['Trong 50 − 20 = 30, số 20 gọi là gì?', ['Số bị trừ', 'Số trừ', 'Hiệu'], 'Số trừ'],
    ['Trong 50 − 20 = 30, số 50 gọi là gì?', ['Số bị trừ', 'Số trừ', 'Hiệu'], 'Số bị trừ'],
    ['Trong 50 − 20 = 30, số 30 gọi là gì?', ['Số bị trừ', 'Số trừ', 'Hiệu'], 'Hiệu']],
  'tp-nhan-chia': [['Trong 4 × 5 = 20, số 20 gọi là gì?', ['Thừa số', 'Tích', 'Thương'], 'Tích'],
    ['Trong 18 : 3 = 6, số 6 gọi là gì?', ['Số bị chia', 'Số chia', 'Thương'], 'Thương'],
    ['Trong 18 : 3 = 6, số 18 gọi là gì?', ['Số bị chia', 'Số chia', 'Thương'], 'Số bị chia'],
    ['Trong 4 × 5 = 20, số 4 gọi là gì?', ['Thừa số', 'Tích', 'Thương'], 'Thừa số']],
};
for (const t of [tpCongTru, tpNhanChia]) {
  const base = t.make;
  t.make = () => {
    if (Math.random() > 0.25) return base();
    const [text, choices, answer] = pickOne(NAMES[t.id]);
    return { text, choices, answer, explain: `Đáp án: ${answer}.` };
  };
}

export const NUMBER_TOPICS = [soSanh, congTru, nhanChiaLon, chiaDu, bieuThuc, gapMayLan, tpCongTru, tpNhanChia];
