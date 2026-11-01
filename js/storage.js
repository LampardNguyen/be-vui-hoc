// Lưu toàn bộ tiến độ của bé trong localStorage của chính máy.
const KEY = 'bang-cuu-chuong-v1';

function defaults() {
  return {
    facts: {},                       // id phép tính -> { box, seen, right, wrong, ms, last }
    played: {},                      // số lượt đã hoàn thành theo từng chế độ
    best: {},                        // kỷ lục trò chơi
    streak: { count: 0, last: null },
    days: {},                        // 'YYYY-MM-DD' -> { ms, answers }
    settings: { voice: true, sound: true, tables: [2, 3, 4, 5, 6, 7, 8, 9] },
  };
}

function merge(obj) {
  const d = defaults();
  return { ...d, ...obj, settings: { ...d.settings, ...(obj?.settings || {}) } };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return merge(JSON.parse(raw));
  } catch { /* trình duyệt chặn lưu trữ: chạy với dữ liệu tạm */ }
  return defaults();
}

export let state = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* bỏ qua */ }
}

export function replaceState(obj) { state = merge(obj); save(); }
export function resetState() { state = defaults(); save(); }

export function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

// Ghi nhận một câu trả lời: cộng thời gian học trong ngày và cập nhật chuỗi ngày học.
export function markStudied(ms) {
  const today = dateKey();
  const day = state.days[today] ||= { ms: 0, answers: 0 };
  day.ms += ms;
  day.answers += 1;
  if (state.streak.last !== today) {
    state.streak.count = state.streak.last === yesterdayKey() ? state.streak.count + 1 : 1;
    state.streak.last = today;
  }
  save();
}

// Chuỗi ngày học còn hiệu lực nếu bé học hôm nay hoặc hôm qua.
export function currentStreak() {
  const { count, last } = state.streak;
  return last === dateKey() || last === yesterdayKey() ? count : 0;
}
