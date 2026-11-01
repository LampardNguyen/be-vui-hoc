// Sinh các phép tính của bảng nhân/chia 2–9 (mỗi bảng từ 1 đến 10, giống sách giáo khoa).
export const TABLES = [2, 3, 4, 5, 6, 7, 8, 9];
export const NS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function mul(t, n) {
  return { id: `m${t}x${n}`, type: 'm', table: t, n, a: t, b: n, answer: t * n, text: `${t} × ${n}` };
}

export function div(t, n) {
  return { id: `d${t * n}:${t}`, type: 'd', table: t, n, a: t * n, b: t, answer: n, text: `${t * n} : ${t}` };
}

// types: 'm' = nhân, 'd' = chia, 'md' = cả hai
export function factsOf(tables, types = 'md') {
  const out = [];
  for (const t of [].concat(tables)) {
    for (const n of NS) {
      if (types.includes('m')) out.push(mul(t, n));
      if (types.includes('d')) out.push(div(t, n));
    }
  }
  return out;
}

// "Gia đình phép tính": 3 × 4 = 12, 4 × 3 = 12, 12 : 3 = 4, 12 : 4 = 3
export function family(f) {
  const [x, y] = f.type === 'm' ? [f.a, f.b] : [f.b, f.answer];
  const p = x * y;
  const lines = [`${x} × ${y} = ${p}`, `${y} × ${x} = ${p}`, `${p} : ${x} = ${y}`, `${p} : ${y} = ${x}`];
  return [...new Set(lines)];
}

// Các đáp án sai "dễ nhầm" để làm lựa chọn trong trò chơi.
export function distractors(f, k = 3) {
  const cands = new Set();
  if (f.type === 'm') {
    [f.a * (f.b + 1), f.a * (f.b - 1), (f.a + 1) * f.b, (f.a - 1) * f.b, f.answer + 1, f.answer - 1, f.answer + 10]
      .forEach((v) => cands.add(v));
  } else {
    [f.answer + 1, f.answer - 1, f.answer + 2, f.answer - 2, f.answer + 3].forEach((v) => cands.add(v));
  }
  const list = [...cands].filter((v) => v > 0 && v !== f.answer);
  shuffle(list);
  return list.slice(0, k);
}

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const ISLANDS = {
  2: { emoji: '🐣', name: 'Đảo Gà Con', color: '#ffd166' },
  3: { emoji: '🐢', name: 'Đảo Rùa Xanh', color: '#06d6a0' },
  4: { emoji: '🐸', name: 'Đảo Ếch Nhảy', color: '#9be564' },
  5: { emoji: '🐬', name: 'Đảo Cá Heo', color: '#4cc9f0' },
  6: { emoji: '🦊', name: 'Đảo Cáo Lửa', color: '#f8961e' },
  7: { emoji: '🦁', name: 'Đảo Sư Tử', color: '#f9c74f' },
  8: { emoji: '🐙', name: 'Đảo Bạch Tuộc', color: '#c77dff' },
  9: { emoji: '🐉', name: 'Đảo Rồng Thần', color: '#ef476f' },
};

export const TIPS = {
  2: 'Bảng 2 là gấp đôi: 2 × 6 = 6 + 6 = 12.',
  3: 'Mỗi bước cộng thêm 3: 3, 6, 9, 12, 15… Đếm nhảy thật nhanh nhé!',
  4: 'Bảng 4 = gấp đôi bảng 2. Ví dụ 4 × 7: 2 × 7 = 14, gấp đôi lên là 28.',
  5: 'Kết quả luôn có tận cùng là 0 hoặc 5. Nhân số chẵn thì tận cùng là 0.',
  6: '6 nhân số chẵn: kết quả tận cùng bằng chính số đó — 6 × 4 = 24, 6 × 8 = 48.',
  7: 'Mẹo nhớ: 56 = 7 × 8 → 5, 6, 7, 8 xếp liền nhau! Và 7 × 3 cũng bằng 3 × 7 = 21.',
  8: 'Bảng 8 = gấp đôi bảng 4. Chữ số cuối giảm dần: 8, 6, 4, 2, 0, 8, 6…',
  9: 'Xòe 10 ngón tay, tính 9 × 4 thì gập ngón thứ 4: bên trái 3 ngón, bên phải 6 ngón → 36!',
};

export const DIV_TIP = 'Phép chia là phép nhân ngược lại: biết 3 × 4 = 12 thì 12 : 3 = 4.';
