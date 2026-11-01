# Lặp lại ngắt quãng (Leitner)

File: `js/leitner.js`.

## Luật
- Hộp 0 = chưa gặp, 1–5. `FAST_MS = 3000`.
- Đúng & nhanh (< 3s) → lên 1 hộp; đúng nhưng chậm → xuống 1 (tối thiểu 1); sai → hộp 1.
- `isMastered(f)` = hộp ≥ 4. `answer(f, correct, ms)` cập nhật hộp + gọi `markStudied` (giới hạn 15s/câu khi tính giờ học).
- `pick(pool, n)` chọn có trọng số theo hộp `[6, 9, 5, 3, 1.2, 0.5]` → phép yếu/mới hỏi nhiều hơn.
- `tableProgress(t)`: tỉ lệ thuộc → sao (≥0.9 / 0.6 / 0.3 = 3/2/1 sao).
- `poolFor(key)`: `mix` | `3` | `3m` | `3d`.

## Lưu ý
- Mọi chỗ bé trả lời (luyện + trò chơi) phải qua `answer()`; trò Lật thẻ chỉ gọi `markStudied` (không đo tốc độ).

## Liên quan
- [[index]] · [[facts]] · [[storage]] · [[practice-learn]] · [[games]]
