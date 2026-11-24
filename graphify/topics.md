# Chương học dạng luyện tập (topics)

**Mục đích:** 15 chương Toán lớp 3 (ngoài bảng cửu chương): Con cần nhớ + Luyện tập nhiều dạng bài + Trò chơi.

**File chính:**
- `js/topics/numbers.js`, `js/topics/measure.js` (Đo lường), `js/topics/shapes.js`: định nghĩa chương. `js/topics/index.js`: `TOPICS` theo id.
- `js/topics/util.js`: `rnd`, `pickOne`, `shuffle`, `fmt`, `mix([[fn, trọng số nguyên]])` (rút thăm theo túi: mỗi dạng w lá, rút hết mới xáo lại → các dạng/phần ra đều), `gq()` (câu trò chơi), `numChoice()` (câu đáp án số → 4 lựa chọn; dùng cho câu ghi nhớ/đọc hình/đếm, câu cần tính thì giữ `max`), `wrongNums`, `FRIENDS`, `THINGS`.
- `js/topics/draw.js`: SVG dạng chuỗi — `balance`, `ruler`, `thermometer`, `weights`, `shape`, `shapeField`, `polygonPick` (tự tính góc vuông), `place`, `cubeStack`, `box`, `fracShape`, `itemGrid`, `shareSvg`, `tapLine`, `tapDot`.
- `js/ui/kinds.js`: `renderKind(q, done, makePad)`, `colSteps`, `divSteps`, `picture`.
- `js/screens/topic.js`: `topicScreen` (`#/topic/<id>`), `quizScreen` (`#/quiz/<id>`), `topicStars`.

**Định nghĩa chương:** `{ id, title, emoji, tips, make(), game() }`.
- `make()` trả câu luyện `{ kind, text, svg?, answer, show?, explain, tilt? }`; `kind`:
  `choice` (`choices`: chuỗi hoặc `{ value, svg, label }`, `tf: true` cho Đúng/Sai) · `num` (`max`, `unit`) ·
  `column` (`col: { op: '+'|'-'|'×', a, b }`) · `divide` (`div: { a, b }`) · `pick` (svg có `data-k`, `pick: { multi, correct }`) ·
  `paint` (svg có `data-k` + `.part`, `paint: { need }`) · `order` (`order: { items, asc }`) · `steps` (`steps: [câu con choice/num]`).
  Không ghi `kind` thì tự suy: có `choices` → choice, không → num.
  **Câu `num` không có phép đặt tính tự đổi thành choice 4 lựa chọn** (`autoChoice` trong `renderKind`); muốn giữ bàn phím ghi `keypad: true`, muốn tắt nút đặt tính ghi `calc: []`.
- `numbers.js` có `readNum(n)` (đọc số 100–999 bằng chữ: linh, mốt, tư, lăm) và `digits(n)` → [trăm, chục, đơn vị]; dạng bài bám theo sách giáo khoa (dãy số, chum chạm chọn, chuỗi mũi tên, toán 2 bước).
- **Nháp đặt tính** (`withScratch` trong `kinds.js`): câu `choice`/`num`/`pick` có phép + − (từ `q.calc`, hoặc `q.calcText ?? q.text`; bỏ qua nếu có ×, :, ngoặc, "nhẩm", "gọi là gì") có nút ✍️ Đặt tính. Chuỗi a + b − c → đặt tính lần lượt, dùng kết quả trước. Nháp dùng `makePad` riêng; đóng nháp thì `el.remount()` tạo lại bàn phím của câu `num`.
- **Phần (parts)**: chương có `parts: [{ id, title, emoji, make }]` (vd Đo lường: do-dai, khoi-luong, dung-tich, nhiet-do, dong-ho, ngay-thang) → `topicScreen` hiện nút "Luyện từng phần" tới `#/quiz/<id>.<phần>`; `make` của chương trộn mọi phần. Sao lưu `state.topics['<id>.<phần>']` và nâng `state.topics[id]`. `measure.js` có `clock(h, m)` (đồng hồ kim), cân đồng hồ, can dầu; phần Ngày-tháng-thứ có `calendar(y, mo, hl)` (tờ lịch thật theo năm hiện tại), `twoWeeks`, `dayStrip`.
- `game()` trả câu trò chơi `{ text (ngắn, cho thẻ lật), ask, answer: số, wrong: [3 số], reveal }` — dùng `gq()`.

**Luồng luyện:** 10 câu, mỗi câu `renderKind` → `done(ok, { corrected })`. `corrected`: bé đã tự sửa trong bài (đặt tính, sắp xếp, nhiều bước) → khen + giải thích, không hiện "đáp án đúng". Sai lần đầu → thêm 1 câu cùng chương cuối lượt. `q.tilt` (−1/0/1) làm cân nghiêng sau khi trả lời. Sao: ≥90% đúng lần đầu 3⭐, ≥70% 2⭐ → `state.topics[id]`.

**Trò chơi:** xem [[games]] — `source(key)` với key `t-<id>` gọi `topic.game()`.

**Lưu ý/bẫy:**
- Câu trả lời chương không đi qua `answer()` của [[leitner]] (chỉ dành cho 160 phép cửu chương).
- SVG là chuỗi do app sinh, gán `innerHTML` an toàn — không chèn dữ liệu người dùng.
- Mỗi câu tạo numpad mới qua `makePad` (tắt numpad cũ) vì numpad nghe phím toàn trang.
- Vòng lặp sinh số ngẫu nhiên phải chắc chắn dừng (từng bị treo ở bài sắp xếp số).
- Kiểm thử: chép `js/` sang thư mục tạm, đổi đuôi `.mjs`, chạy node sinh vài nghìn câu mỗi chương để soát NaN, đáp án không có trong lựa chọn, trùng lựa chọn, đặt tính sai.

## Liên quan
[[curriculum]] · [[games]] · [[routing]] · [[storage]] · [[practice-learn]]
