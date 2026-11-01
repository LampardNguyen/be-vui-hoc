# Bộ sưu tập (sticker & thú cưng)

File: `js/screens/rewards.js`.

## Sticker
- `STICKERS` (20): mỗi cái có `ok()` tính từ `state` sẵn có — số câu đã trả lời (100/500), chuỗi ngày (3/7), 5 lượt luyện, kỷ lục từng trò, 3 sao mỗi bảng (8), thuộc 80/160 phép.
- `takeNewStickers()` trả sticker vừa đạt chưa xem và ghi `state.seenStickers`; `newStickerPopup(list)` hiện ở Home.

## Thú cưng
- `pet()` theo số phép thuộc: mốc 0/5/20/50/90/130/160 → 🥚🐣🐥🦜🦚🦄🐉, kèm thanh tiến độ.

## Lưu ý
- Đếm lượt luyện dựa vào khóa `played` không có `-` ([[storage]]); đặt khóa trò chơi mới phải có `-`.

## Liên quan
- [[index]] · [[games]] · [[leitner]] · [[facts]]
