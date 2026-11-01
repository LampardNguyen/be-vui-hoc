# Lưu trữ (state)

File: `js/storage.js`. Khóa localStorage: `bang-cuu-chuong-v1`.

## Cấu trúc `state`
- `facts`: id phép → `{ box, seen, right, wrong, ms, last }` (xem [[leitner]]).
- `played`: số lượt theo chế độ; khóa luyện tập không có `-`, trò chơi có (`sprint-mix`).
- `best`: kỷ lục trò chơi, khóa `${gameId}-${key}`.
- `streak {count, last, best}`, `seenStickers`, `days['YYYY-MM-DD'] = {ms, answers}`.
- `settings {voice, sound, tables}`.

## Hàm
- `save()`, `replaceState(obj)` (khôi phục từ JSON), `resetState()`, `dateKey()`.
- `markStudied(ms)`: cộng thời gian/câu trong ngày + cập nhật chuỗi ngày; `currentStreak()` (còn hiệu lực nếu học hôm nay/hôm qua).

## Lưu ý
- `merge()` trộn với `defaults()` → thêm trường mới vẫn đọc được dữ liệu cũ. **Không đổi khóa** (mất tiến độ của bé).
- iPad: app ở MH chính và tab Safari có thể là 2 kho localStorage khác nhau.
- `state` là `let` export: luôn import `state` rồi dùng trực tiếp, không giữ bản sao cũ sau `replaceState`.

## Liên quan
- [[index]] · [[leitner]] · [[rewards]] · [[parent]]
