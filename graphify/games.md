# Trò chơi

File: `js/games/*.js`, `js/screens/games.js`.

## Danh sách (`js/games/index.js` → `GAMES`)
- 🎈 `balloon`: chơi tới khi hết mạng, 4 bóng bay lên nhanh dần; cờ `over` chống gọi kết thúc 2 lần.
- ⏱️ `sprint`: đếm 3-2-1, 60s, combo; sai → hiện đáp án, đưa phép lại hàng đợi.
- 🃏 `memory`: 6 cặp (đáp án khác nhau), thẻ lật 3D; điểm = max(10, 200 − (lượt−6)×10 − giây).
- 👾 `boss`: quái 10 HP (hạ xong → quái mới), chơi tới khi hết 3 mạng, thanh thời gian CSS, 4 lựa chọn; < 3s = chí mạng 2 sát thương. Điểm = quái × 100 + (đòn + chí mạng) × 5.

## Độ khó (`level()` trong `common.js`, đặt ở [[parent]])
`state.settings.level`: `easy` / `normal` (mặc định) / `hard`, đọc lúc mở màn hình trò chơi.
- balloon: mạng 5/3/3; bóng bay hết màn hình 12/8/4s ở câu đầu.
- boss: 12/8/4 giây cho câu đầu.
- Cả 2: mỗi câu sau nhanh hơn 0,2s, nhanh nhất 2,4s.
- sprint: 90/60/45 giây. memory: 4/6/8 cặp.
- Kỷ lục không tách theo độ khó.

## Dùng chung (`common.js`)
- `backFor(key)` → `#/games/<key>`; `saveBest(gameId, key, score)` → `state.best`; `gameResult({...})` màn kết quả: Chơi lại / 🎲 Trò khác / Quay về.
- Bộ chọn `#/games/<key>`: nút 🎲 ngẫu nhiên + 4 thẻ có kỷ lục. `randomGame(except)`, `randomGameHash(key, except)`.
- `index.js` không import màn hình game (tránh vòng lặp import).

## Thêm trò mới
1. `js/games/<id>.js` export `<id>Screen(key)`, dùng `onLeave` cho timer ([[routing]]), `answer()` ([[leitner]]), `common.js`.
2. Thêm vào `GAMES`, `routes` trong `js/app.js`, `FILES` + tăng `VERSION` trong `sw.js` ([[pwa-deploy]]).
3. Tuỳ chọn: sticker kỷ lục trong [[rewards]].

## Bẫy đã gặp
- Keyframe dùng `transform` đè transform inline của bóng → dùng opacity + `scale`.
- Animation trên `.card-flip.matched` đè `rotateY` → đã bỏ.

## Liên quan
- [[index]] · [[rewards]] · [[speech-sound]]
