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
