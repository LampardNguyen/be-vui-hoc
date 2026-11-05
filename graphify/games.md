# Trò chơi

File: `js/games/*.js`, `js/screens/games.js`.

## Danh sách (`js/games/index.js` → `GAMES`)
- 🎈 `balloon`: chơi tới khi hết mạng, 4 bóng bay lên nhanh dần; cờ `over` chống gọi kết thúc 2 lần.
- ⏱️ `sprint`: đếm 3-2-1, 60s, combo; sai → hiện đáp án, đưa phép lại hàng đợi.
- 🃏 `memory`: 6 cặp (đáp án khác nhau), thẻ lật 3D; điểm = max(10, 200 − (lượt−6)×10 − giây).
- 👾 `boss`: quái 10 HP (hạ xong → quái mới), chơi tới khi hết 3 mạng, thanh thời gian CSS, 4 lựa chọn; < 3s = chí mạng 2 sát thương. Điểm = quái × 100 + (đòn + chí mạng) × 5.
- 🏎️ `race`: chơi tới khi hết mạng; cổng 3 làn chạy xuống, chạm nửa/làn (hoặc phím ←→) để đổi làn; cổng chạm xe thì chấm theo làn hiện tại. Sai → mất 1 mạng, xe chậm lại, cổng đúng sáng lên. Điểm = 10 + thưởng nhanh (ms tính từ lần đổi làn cuối).
- 🐸 `frog`: chơi không giới hạn tới khi hết mạng. 4 lá sen (có đáp án) trôi ngang, chiều ngẫu nhiên; chỉ nhảy được khi lá đúng nằm trong vòng sáng. Mỗi câu giới hạn `T` giây = thời gian lá trôi 1 vòng; `T` giảm 0,25s mỗi câu đúng (`jumps`). Đếm giờ: lá dưới chân ếch (`.base-pad`, biến CSS `--p`) chìm dần, vòng sáng đếm lùi (conic `--left`), >70% thì ếch run + 💧; hết giờ → mất 1 tim, ếch rơi "tõm", hiện đáp án. Chạm sai → mất 1 tim, lá đúng nhấp nháy; chạm đúng nhưng chưa tới vòng → chỉ nhắc. Chuỗi 5 câu đúng → +20 điểm. Hàng lá trang trí `.deco-lane` (không bấm được) trôi ngược chiều. Lá sen + ếch tròn dễ thương (dáng ngồi/nhảy đổi bằng `.leap`) vẽ SVG trong `frog.js`. "Máy quay": `leapTo()` dời ếch tới tâm lá (tâm lá = 60% chiều cao ếch), `.scene` trượt `(rx − fx) × W − dx, −dy` rồi `fx = rx`. Vòng sáng `rx` ngẫu nhiên 0,5/0,28/0,72 mỗi câu, ếch đứng ở `fx`.

## Độ khó (`level()` trong `common.js`, đặt ở [[parent]])
`state.settings.level`: `easy` / `normal` (mặc định) / `hard`, đọc lúc mở màn hình trò chơi.
- balloon: mạng 5/3/3; bóng bay hết màn hình 12/8/4s ở câu đầu.
- boss: 12/8/4 giây cho câu đầu.
- Cả 2: mỗi câu sau nhanh hơn 0,2s, nhanh nhất 2,4s.
- race, frog: mạng 5/3/3.
- race: cổng chạy xuống trong 8/5,5/3,5s, mỗi câu nhanh hơn 0,15s, nhanh nhất 2s.
- frog: thời gian mỗi câu 12/8/5s, ít nhất 5/3,5/2,5s.
- sprint: 90/60/45 giây. memory: 4/6/8 cặp.
- Kỷ lục không tách theo độ khó.

## Dùng chung (`common.js`)
- `backFor(key)` → `#/games/<key>`; `saveBest(gameId, key, score)` → `state.best`; `gameResult({...})` màn kết quả: Chơi lại / 🎲 Trò khác / Quay về.
- Bộ chọn `#/games/<key>`: nút 🎲 ngẫu nhiên + 6 thẻ có kỷ lục. `randomGame(except)`, `randomGameHash(key, except)`.
- Hộp quà `giftBag()` (race, frog): cứ 5–7 câu gắn 🎁 lên đáp án đúng, trả lời đúng mới nhận. Quà: 🐢 5 câu chạy chậm như lúc đầu, 🛡️ đỡ 1 lần sai, ❤️ +1 tim (chỉ khi thiếu), ⭐ x2 điểm 5 câu. Mỗi câu gọi `bag.start()` (→ `{gift, slow}`), điểm qua `bag.points()`, sai thì `bag.hit()` trước khi trừ tim, `bag.open(box, lives, max)` trả id quà; `giftPop()` hiện bảng thông báo.
- `index.js` không import màn hình game (tránh vòng lặp import).

## Thêm trò mới
1. `js/games/<id>.js` export `<id>Screen(key)`, dùng `onLeave` cho timer ([[routing]]), `answer()` ([[leitner]]), `common.js`.
2. Thêm vào `GAMES`, `routes` trong `js/app.js`, `FILES` + tăng `VERSION` trong `sw.js` ([[pwa-deploy]]).
3. Tuỳ chọn: sticker kỷ lục trong [[rewards]].

## Bẫy đã gặp
- Ếch canh giữa bằng `translate: -50%` sẽ bị ghi đè khi nhảy (`style.translate`) → lệch nửa thân; dùng `margin-left` âm để canh giữa.
- Keyframe dùng `transform` đè transform inline của bóng → dùng opacity + `scale`.
- Animation trên `.card-flip.matched` đè `rotateY` → đã bỏ.

## Liên quan
- [[index]] · [[rewards]] · [[speech-sound]]
