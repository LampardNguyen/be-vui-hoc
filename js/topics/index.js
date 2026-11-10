// Danh sách các chương có bài luyện (trừ bảng cửu chương có màn riêng).
import { NUMBER_TOPICS } from './numbers.js';
import { SHAPE_TOPICS } from './shapes.js';

export const TOPICS = Object.fromEntries([...NUMBER_TOPICS, ...SHAPE_TOPICS].map((t) => [t.id, t]));
