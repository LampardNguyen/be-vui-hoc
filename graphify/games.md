# Trò chơi

File: `js/games/*.js`, `js/screens/games.js`.

## Danh sách (`js/games/index.js` → `GAMES`)
- 🎈 `balloon`: 12 vòng, 3 mạng, 4 bóng bay lên nhanh dần; cờ `over` chống gọi kết thúc 2 lần.
- ⏱️ `sprint`: đếm 3-2-1, 60s, combo; sai → hiện đáp án, đưa phép lại hàng đợi.
- 🃏 `memory`: 6 cặp (đáp án khác nhau), thẻ lật 3D; điểm = max(10, 200 − (lượt−6)×10 − giây).
- 👾 `boss`: quái 10 HP, 3 mạng, 8s/câu (thanh CSS), 4 lựa chọn; < 3s = chí mạng 2 sát thương.

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
