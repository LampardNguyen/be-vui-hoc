# Checklist công việc

Đánh dấu `[x]` khi xong (đã code + test browser). Session sau đọc file này để biết tiến độ.

## Task 1 — Trang chủ phân cấp Lớp → Môn → Chương trình
- [x] 1.1 Dữ liệu chương trình `js/curriculum.js` (lớp 3, Toán, Tiếng Việt, 16 chương chia nhóm)
- [x] 1.2 Trang chủ mới `#/`: chọn lớp + thẻ môn học
- [x] 1.3 Màn môn `#/subject/<id>`: thẻ chương theo nhóm, chương chưa có → "🔒 Sắp có"
- [x] 1.4 Màn `#/topic/cuu-chuong` (trang chủ bảng cửu chương cũ) + sửa các nút quay lại
- [x] 1.5 CSS thẻ môn/chương, test tablet 768×1024 + mobile 375×812, không lỗi console
- [x] 1.6 sw.js (VERSION, FILES), CHANGELOG.md, graphify, commit

## Task 2 — Nội dung 15 chương Toán còn lại
Cách làm: mỗi chương = trang "Kiến thức + mẹo" + luyện 10 câu (chọn đáp án hoặc bàn phím số),
sai → giải thích + hỏi lại; xong → sao (lưu `state.topics`). Hình học vẽ bằng SVG.
- [x] 2.1 Bộ máy chung: `js/screens/topic.js`, `js/topics/*.js`, route `#/topic/<id>`, sao trong màn môn
- [x] 2.2 Nhóm Số và phép tính (6 chương)
- [x] 2.3 Tìm thành phần (2), Đo lường (1), Phân số (1)
- [x] 2.4 Hình học (5 chương)
- [x] 2.5 Test browser tablet + mobile từng chương, không lỗi console
- [x] 2.6 sw.js, CHANGELOG, graphify, commit

## Task 3 — Làm lại 15 chương: phong phú, sinh động, có trò chơi
- [x] 3.1 6 trò chơi (bóng bay, đua 60s, lật thẻ, đua xe, ếch, quái vật) chơi được với câu hỏi của mọi chương (`js/games/source.js`)
- [x] 3.2 Dạng bài mới (`js/ui/kinds.js`): đặt tính dọc (+ − ×), đặt tính chia, chạm chọn trên hình, tô màu, sắp xếp thẻ số, bài nhiều bước
- [x] 3.3 Hình vẽ ngẫu nhiên (`js/topics/draw.js`): cân thăng bằng, thước, nhiệt kế, quả cân, hình phẳng xoay, đa giác, khối xếp chồng
- [x] 3.4 Số & phép tính: so sánh có biểu thức + cân, sắp xếp; cộng trừ/nhân chia đặt tính; tìm lỗi sai; toán có lời; chia kẹo có dư; biểu thức từng bước
- [x] 3.5 Tìm thành phần, Đo lường, Phân số: hộp bí ẩn từng bước, thước/nhiệt kế/cân, chọn đơn vị hợp lý, tô màu phân số, chọn hình chia đúng
- [x] 3.6 Hình học: chạm trung điểm trên thước, chạm bán kính/đường kính/tâm, chạm góc vuông của đa giác, chạm tất cả hình cùng loại, đếm khối
- [x] 3.7 Màn chương: nút Học / Luyện / Trò chơi; luyện có chuỗi 🔥 và nhân vật chạy theo tiến độ
- [x] 3.8 Test browser tablet + mobile mọi dạng bài và trò chơi, sw.js, CHANGELOG, graphify, commit

## Danh sách chương Toán lớp 3
- [x] Bảng cửu chương
- [x] So sánh số dưới 1000
- [x] Cộng trừ dưới 1000
- [x] Tìm thành phần phép cộng trừ (số hạng, tổng, số trừ, số bị trừ, hiệu)
- [x] Tìm thành phần phép nhân chia
- [x] Nhân, chia số 2–3 chữ số với 1 chữ số
- [x] Phép chia hết và có dư
- [x] Biểu thức số, tính giá trị biểu thức
- [x] So sánh số lớn gấp mấy lần số bé
- [x] Đổi đơn vị đo (khối lượng, độ dài, nhiệt độ)
- [x] Phân số một phần mấy
- [x] Điểm giữa, trung điểm đoạn thẳng
- [x] Hình tròn, tâm, bán kính, đường kính
- [x] Góc vuông, góc không vuông
- [x] Hình tam giác, tứ giác, hình vuông, hình chữ nhật
- [x] Khối lập phương, khối hộp chữ nhật
- [ ] Môn Tiếng Việt
