# Giọng đọc & âm thanh

File: `js/speech.js`, `js/sound.js`, `audio/vi/*.m4a`.

## Giọng đọc
- Web Speech API, `lang = 'vi-VN'`. `numberToWords` đọc số kiểu Việt (mốt, tư, lăm), `factWords(f)` → "ba nhân bốn bằng mười hai".
- `sayFact`, `speakFacts(fs, onEach)` (đọc cả bảng), `stopSpeaking` (gọi mỗi lần đổi màn).
- **Máy không có giọng `vi`** (vd iPad iPadOS 15): ghép file ghi sẵn `audio/vi/<khóa>.m4a` (số 0–100, `nhan`, `chia`, `bang`) bằng Web Audio, dùng chung `audioCtx()` của `sound.js`; cắt khoảng lặng hai đầu khi giải mã.
- Tạo lại file: `say -v Linh -r 160 -o audio/vi/<khóa>.m4a --file-format=m4af --data-format=aac@22050 "<chữ>"` rồi `afconvert -f m4af -d aac -b 32000` để file nhỏ (~10 KB/file). Danh sách file nằm trong `FILES` của `sw.js`.
- Bật/tắt: `state.settings.voice`.

## Âm thanh
- `play('good'|'fast'|'bad'|'pop'|'tap'|'win')` tạo tiếng bằng oscillator Web Audio, không cần file âm thanh. Bật/tắt: `settings.sound`.

## Lưu ý
- iPad trả `getVoices()` rỗng lúc tải trang → `useClips()`/`utter` gọi lại `pickVoice()`; chưa thấy giọng `vi` thì dùng file ghi sẵn.
- Giọng ghi sẵn phát qua AudioContext: phải `audioCtx()` ngay trong lúc chạm, rồi mới `await` tải file.
- Safari chỉ phát âm thanh sau thao tác chạm đầu tiên.

## Liên quan
- [[index]] · [[practice-learn]] · [[parent]]
