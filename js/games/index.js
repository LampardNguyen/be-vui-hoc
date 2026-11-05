// Danh sách trò chơi (không import các màn hình trò chơi để tránh vòng lặp import).
export const GAMES = [
  { id: 'balloon', emoji: '🎈', name: 'Bắn bóng bay', desc: 'Chạm đúng bóng trước khi bay mất', color: '#4cc9f0' },
  { id: 'sprint', emoji: '⏱️', name: 'Đua 60 giây', desc: 'Trả lời thật nhiều trong 1 phút', color: '#ff7b54' },
  { id: 'memory', emoji: '🃏', name: 'Lật thẻ', desc: 'Ghép phép tính với kết quả', color: '#c77dff' },
  { id: 'race', emoji: '🏎️', name: 'Đua xe ba làn', desc: 'Lái xe qua cổng có đáp án đúng', color: '#f15bb5' },
  { id: 'frog', emoji: '🐸', name: 'Ếch nhảy lá sen', desc: 'Nhảy đúng lá sen để qua sông', color: '#80b918' },
  { id: 'boss', emoji: '👾', name: 'Đánh quái vật', desc: 'Trả lời đúng để hạ quái vật', color: '#06d6a0' },
];

export function randomGame(except) {
  const list = GAMES.filter((g) => g.id !== except);
  return list[Math.floor(Math.random() * list.length)];
}

export function randomGameHash(key, except) {
  return `#/${randomGame(except).id}/${key}`;
}
