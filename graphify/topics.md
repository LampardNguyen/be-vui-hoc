# Chương học dạng luyện tập (topics)

**Mục đích:** 15 chương Toán lớp 3 (ngoài bảng cửu chương) dùng chung 1 bộ máy luyện.

**File chính:** `js/topics/numbers.js`, `js/topics/shapes.js` (định nghĩa chương), `js/topics/index.js` (`TOPICS` theo id), `js/topics/util.js` (`rnd`, `pickOne`, `shuffle`, `fmt`), `js/screens/topic.js` (`topicScreen`, `quizScreen`, `topicStars`).

**Định nghĩa chương:** `{ id, title, emoji, tips: [..], make() }`. `make()` trả câu hỏi `{ text, svg?, choices? | max?, answer (chuỗi), explain }` — có `choices` thì hiện nút chọn, không có thì hiện bàn phím số.

**Luồng:** `#/topic/<id>` (Con cần nhớ) → `#/quiz/<id>` 10 câu. Sai: hiện đáp án + `explain`, thêm 1 câu cùng dạng cuối lượt. Xong: sao theo tỉ lệ đúng lần đầu (≥90% 3⭐, ≥70% 2⭐), lưu `state.topics[id] = { best, played }`.

**Thêm chương:** viết object mới, thêm vào mảng export, thêm `href: '#/topic/<id>'` trong `js/curriculum.js` ([[curriculum]]).

**Lưu ý/bẫy:** câu trả lời chương không đi qua `answer()` của [[leitner]] (Leitner chỉ dành cho 160 phép cửu chương). SVG tạo từ chuỗi do app sinh nên gán `innerHTML` an toàn — đừng chèn dữ liệu người dùng vào đó.

## Liên quan
[[curriculum]] · [[routing]] · [[storage]] · [[practice-learn]]
