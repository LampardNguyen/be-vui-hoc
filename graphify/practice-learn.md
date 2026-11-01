# Màn Học & Luyện tập

File: `js/screens/learn.js`, `js/screens/practice.js`, `js/screens/home.js`, `js/ui/numpad.js`.

## Home / Đảo
- Home: chip (chuỗi ngày, số phép thuộc), nút *Luyện hôm nay* (`#/practice/mix`), *Trò chơi* (`#/games/mix`), dải thú cưng, 8 đảo (mở hết, không khóa), link phụ huynh. Hiện popup sticker mới ([[rewards]]).
- `tableScreen`: Học / Luyện nhân / Luyện chia / Trò chơi của 1 bảng.

## Học
- Tab × / :, "che kết quả", "đọc cả bảng" (`speakList`), bấm phép → chi tiết: lưới chấm `dotArray`, gia đình phép tính, mẹo.

## Luyện
- 15 câu từ `pick(poolFor(key))`, nhập bằng `numpad` (bàn phím ảo 3×4 + phím thật).
- Sai → giữ đáp án bé gạch ngang, hiện đáp án đúng màu xanh + lưới chấm + nút "Hiểu rồi 👍", chèn lại phép ở vị trí i+3 (tối đa 2 lần).
- Kết quả: *Chơi trò thưởng* (`randomGameHash`), *Luyện tiếp*, *Quay về*.

## Liên quan
- [[index]] · [[leitner]] · [[speech-sound]] · [[games]]
