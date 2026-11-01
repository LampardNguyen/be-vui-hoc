// Lưu toàn bộ tiến độ của bé trong localStorage của chính máy.
// Khóa đặt theo tên app để sau này thêm loại bài học khác vẫn dùng chung.
const KEY = 'be-vui-hoc-v1';
const OLD_KEY = 'bang-cuu-chuong-v1';   // khóa cũ, chỉ đọc để chuyển dữ liệu

function defaults() {
  return {
    facts: {},                       // id phép tính -> { box, seen, right, wrong, ms, last }
    played: {},                      // số lượt đã hoàn thành theo từng chế độ
    best: {},                        // kỷ lục trò chơi
    streak: { count: 0, last: null, best: 0 },
    seenStickers: [],                // sticker bé đã được thông báo
    days: {},                        // 'YYYY-MM-DD' -> { ms, answers }
    settings: { voice: true, sound: true, tables: [2, 3, 4, 5, 6, 7, 8, 9], level: 'normal' },
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
    // Máy đang dùng khóa cũ: chuyển sang khóa mới để bé không mất tiến độ.
    const old = localStorage.getItem(OLD_KEY);
    if (old) {
      const data = merge(JSON.parse(old));
      localStorage.setItem(KEY, JSON.stringify(data));
      localStorage.removeItem(OLD_KEY);
      return data;
    }
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
    state.streak.best = Math.max(state.streak.best || 0, state.streak.count);
  }
  save();
}

// Chuỗi ngày học còn hiệu lực nếu bé học hôm nay hoặc hôm qua.
export function currentStreak() {
  const { count, last } = state.streak;
  return last === dateKey() || last === yesterdayKey() ? count : 0;
}
