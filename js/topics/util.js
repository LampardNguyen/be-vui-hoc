// Tiện ích tạo câu hỏi ngẫu nhiên cho các chương.
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

// Câu hỏi trò chơi (đáp án là số).
export const gq = (text, answer, spread, ask = `${text} = ?`, reveal = `${text} = ${answer}`) =>
  ({ text, ask, answer, wrong: wrongNums(answer, spread), reveal });

// Chọn ngẫu nhiên 1 trong các hàm tạo câu hỏi (có trọng số [fn, w]).
export function mix(list) {
  const total = list.reduce((s, [, w]) => s + w, 0);
  return () => {
    let x = Math.random() * total;
    for (const [fn, w] of list) if ((x -= w) < 0) return fn();
    return list[0][0]();
  };
}

// Nhân vật & đồ vật cho toán có lời văn.
export const FRIENDS = ['Thỏ Bông', 'Gấu Nâu', 'Mèo Mun', 'Sóc Nhí', 'Chú Voi', 'Bạn Cún'];
export const THINGS = [['🥕', 'củ cà rốt'], ['🍎', 'quả táo'], ['🌰', 'hạt dẻ'], ['🍬', 'cái kẹo'], ['📚', 'quyển sách'], ['🌸', 'bông hoa'], ['🐟', 'con cá']];
