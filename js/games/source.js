// Nguồn câu hỏi cho trò chơi: bảng cửu chương (key '2', '3m', 'mix'…) hoặc một chương (key 't-<id>').
// Câu hỏi chương do topic.game() tạo: { text, ask, answer (số), wrong: [số sai], reveal }.
import { pick, poolFor, answer } from '../leitner.js';
import { distractors, shuffle } from '../facts.js';
import { TOPICS } from '../topics/index.js';

export const topicOf = (key) => (String(key).startsWith('t-') ? TOPICS[key.slice(2)] : null);

export function source(key) {
  const t = topicOf(key);
  if (!t) {
    const pool = poolFor(key);
    return {
      draw: (n) => pick(pool, n),
      distractors: (q, k) => distractors(q, k),
      record: (q, ok, ms) => answer(q, ok, ms),
      ask: (q) => `${q.text} = ?`,
      reveal: (q) => `${q.text} = ${q.answer}`,
      isFact: true,
    };
  }
  return {
    draw: (n) => Array.from({ length: n }, () => t.game()),
    distractors: (q, k) => shuffle([...q.wrong]).slice(0, k),
    record: () => {},
    ask: (q) => q.ask,
    reveal: (q) => q.reveal,
    isFact: false,
  };
}
