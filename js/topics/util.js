// Tiện ích tạo câu hỏi ngẫu nhiên cho các chương.
import { state, save } from '../storage.js';
export const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
export const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Số có khoảng trắng hàng nghìn cho dễ đọc: 1250 → "1 250".
export const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

// 3 số sai gần đáp án (khác nhau, không âm) cho trò chơi.
export function wrongNums(ans, spread = [1, 2, 10]) {
  const set = new Set();
  let guard = 0;
  while (set.size < 3 && guard++ < 80) {
    const v = ans + pickOne(spread) * pickOne([-1, 1]) * (guard > 40 ? rnd(1, 3) : 1);
    if (v >= 0 && v !== ans) set.add(v);
  }
  for (let v = ans + 1; set.size < 3; v++) set.add(v);
  return [...set];
}

// Đổi câu đáp án số thành trắc nghiệm 4 lựa chọn (đáp án + 3 số nhiễu), có thể kèm đơn vị.
export function numChoice(ans, spread, unit = '', wrong = wrongNums(ans, spread)) {
  const f = (v) => (!unit ? String(v) : unit[0] === '°' ? `${v}${unit}` : `${v} ${unit}`);
  return { choices: shuffle([ans, ...wrong.slice(0, 3)]).map(f), answer: f(ans) };
}

// Câu hỏi trò chơi (đáp án là số).
export const gq = (text, answer, spread, ask = `${text} = ?`, reveal = `${text} = ${answer}`) =>
  ({ text, ask, answer, wrong: wrongNums(answer, spread), reveal });

// Chọn lần lượt các hàm tạo câu hỏi (có trọng số nguyên [fn, w]) theo kiểu "rút thăm trong túi":
// túi có w lá cho mỗi dạng, xáo lên rồi rút hết mới xáo túi mới → các dạng/phần ra đều nhau.
// Có next.key (topic.js gán id chương/phần) thì túi lưu vào state.bags để tắt app vẫn rút tiếp túi cũ.
export function mix(list) {
  let bag = [];
  const next = () => {
    if (next.key) bag = (state.bags[next.key] || []).filter((i) => i < list.length);
    if (!bag.length) bag = shuffle(list.flatMap(([, w], i) => Array(w).fill(i)));
    const i = bag.pop();
    if (next.key) { state.bags[next.key] = bag; save(); }
    return list[i][0]();
  };
  next.types = list.map(([fn]) => fn);   // Chế độ dev duyệt lần lượt từng dạng (js/screens/dev.js).
  return next;
}

// Nhân vật & đồ vật cho toán có lời văn.
export const FRIENDS = ['Thỏ Bông', 'Gấu Nâu', 'Mèo Mun', 'Sóc Nhí', 'Chú Voi', 'Bạn Cún'];
export const THINGS = [['🥕', 'củ cà rốt'], ['🍎', 'quả táo'], ['🌰', 'hạt dẻ'], ['🍬', 'cái kẹo'], ['📚', 'quyển sách'], ['🌸', 'bông hoa'], ['🐟', 'con cá']];
