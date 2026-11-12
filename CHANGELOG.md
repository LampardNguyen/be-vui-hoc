# Nhật ký thay đổi

## 2026-11-12 — Chương Đo lường: luyện riêng từng phần, thêm thời gian

- Chương "Đổi đơn vị đo" đổi thành "Đo lường", tách sang `js/topics/measure.js`, gồm 6 phần có nút luyện riêng (sao riêng): Độ dài, Khối lượng, Dung tích (lít), Nhiệt độ, Xem đồng hồ, Ngày tháng thứ. Nút "Luyện trộn" vẫn trộn tất cả.
- Mẫu bài theo sách: cân đồng hồ (quả mít, dưa hấu, nặng hơn bao nhiêu kg), hai can dầu (cả hai / hơn bao nhiêu lít), rót can 3 l – 5 l, l ↔ ml.
- Thời gian: đọc đồng hồ kim (đáp án nhiễu đảo kim), giờ điện tử 13–22 giờ ↔ giờ chiều/tối, chọn đồng hồ đúng, thêm 15/30/60 phút; thứ trong tuần, ngày của thứ tuần sau, số ngày trong tháng, tuần–ngày–giờ–phút, bài gạo ăn mấy tuần.
- Route `#/quiz/<chương>.<phần>`; sao của phần cũng nâng sao của chương.

## 2026-11-12 — Thêm dạng bài theo sách: Tìm thành phần trong phép cộng, trừ

- Sơ đồ đoạn thẳng (tổng gồm 2 phần, tìm phần còn thiếu hoặc tìm tổng).
- Bảng Số hạng/Tổng và Số bị trừ/Số trừ/Hiệu, mỗi cột 1 ô ? (làm từng ô).
- Chọn câu trả lời đúng A/B/C (biết số trừ và hiệu → số bị trừ; biết số bị trừ và hiệu → số trừ).
- Toán lời văn: hai bến thuyền, vịt xuống ao, viên bi, vườn cam bưởi; hình viên bi bị gạch.
- Các câu mới đều có nút ✍️ Đặt tính.

## 2026-11-12 — Nút "Đặt tính" (nháp) cho câu có cộng trừ

- Câu chọn đáp án / nhập số / chạm hình có phép + − thì hiện nút ✍️ Đặt tính: bấm vào mở nháp đặt tính dọc, tính xong ghi kết quả lên trên rồi bé điền đáp án.
- Nhiều phép liên tiếp (a + b − c) thì đặt tính lần lượt, lấy kết quả lần trước làm số đầu của lần sau (nút "Đặt tính 1/2").
- Câu so sánh trên cân, chum, toán 2 bước có sẵn phép tính để đặt tính (`calcText`).

## 2026-11-12 — Thêm dạng bài theo sách: ôn số đến 1000, cộng trừ

- So sánh số: so sánh tổng trăm-chục-đơn vị (400 + 70 + 5 ? 475), điền dãy số đếm thêm/bớt 1, số gồm mấy trăm-chục-đơn vị, đọc/viết số bằng chữ, viết số thành tổng, ba số liên tiếp, tìm con vật nặng nhất/nhẹ nhất.
- Cộng trừ: tính nhẩm tròn chục/trăm (80 + 20, 1000 − 700), gọi tên số hạng/tổng/số bị trừ/số trừ/hiệu, chuỗi phép tính theo mũi tên, chạm chọn chum có kết quả lớn hơn một số, toán 2 bước (ít hơn rồi tính tổng; trâu và nghé).

## 2026-11-11 — Làm lại 15 chương Toán: vừa học vừa chơi
- Mỗi chương có thêm **Trò chơi**: 6 trò (bóng bay, đua 60 giây, lật thẻ, đua xe, ếch, quái vật) dùng câu hỏi của chương (`js/games/source.js`, key `t-<id>`).
- Dạng bài mới (`js/ui/kinds.js`): đặt tính dọc cộng/trừ/nhân (điền từng chữ số, hiện số nhớ, gợi ý từng hàng), đặt tính chia (thương + số dư), chạm chọn trên hình, tô màu, sắp xếp thẻ số, bài nhiều bước.
- Hình vẽ ngẫu nhiên (`js/topics/draw.js`): cân thăng bằng nghiêng theo đáp án, thước kẻ, nhiệt kế, cân quả cân, bãi hình xoay ngẫu nhiên, đa giác tự tính góc vuông, khối xếp chồng, phân số chia đều/không đều, chia kẹo.
- Nội dung: so sánh có biểu thức, toán có lời văn, "bạn tính đúng hay sai", biểu thức từng bước, tìm số trong hộp quà, chọn đơn vị hợp lý, tô 1/n hình, chạm trung điểm trên thước, chạm bán kính/đường kính/tâm, chạm góc vuông, đếm khối lập phương.
- Màn luyện: thỏ/rùa… chạy theo tiến độ tới 🏁, chuỗi đúng 🔥, pháo giấy mỗi 5 câu đúng liền, xong thì có nút "Chơi trò thưởng".

## 2026-11-10 — Làm đủ 15 chương Toán lớp 3 còn lại
- Bộ máy chương chung: `js/screens/topic.js` (trang "Con cần nhớ" + luyện 10 câu, sai → giải thích rồi hỏi thêm câu cùng dạng, chấm sao).
- Câu hỏi sinh ngẫu nhiên: `js/topics/numbers.js` (so sánh, cộng trừ, nhân chia lớn, chia có dư, biểu thức, gấp mấy lần, tìm thành phần), `js/topics/shapes.js` (đổi đơn vị, một phần mấy, trung điểm, hình tròn, góc, hình phẳng, khối — hình vẽ SVG).
- Route `#/topic/<id>` và `#/quiz/<id>`; sao từng chương lưu `state.topics`, hiện trong màn môn Toán.

## 2026-11-10 — Trang chủ phân cấp Lớp → Môn → Chương trình
- Thêm `js/curriculum.js`: cây chương trình lớp 3 (Toán 16 chương chia 5 nhóm, Tiếng Việt sắp có).
- Trang chủ mới: chọn lớp + thẻ môn học; màn môn `#/subject/toan3` liệt kê chương theo nhóm, chương chưa có hiện "🔒 Sắp có".
- Trang chủ bảng cửu chương cũ chuyển sang `#/topic/cuu-chuong`; các nút quay lại trỏ về đây.
- Thêm `TODO.md` làm checklist tiến độ.

## 2026-11-05 — Đua xe: bánh xe lăn
- Bánh xe có vạch gai lốp chạy theo tốc độ xe (nhanh khi tăng tốc, chậm khi đi nhầm cổng), thêm vệt bụi sau bánh.

## 2026-11-05 — Ếch nhảy: chơi vô hạn, đếm giờ, ếch mới
- Bỏ mốc 5 hàng/về tổ: nhảy mãi tới khi hết tim; mỗi câu đúng thì lá trôi nhanh hơn, thời gian chọn ngắn lại.
- Đếm giờ bằng lá dưới chân ếch chìm dần (vòng sáng đếm lùi, ếch run đổ mồ hôi); hết giờ thì ếch rơi "tõm", mất 1 tim và hiện đáp án.
- Thêm hàng lá sen trang trí trôi ngược chiều; ếch vẽ lại kiểu tròn dễ thương (mắt to, má hồng).

## 2026-11-05 — Làm đẹp trò Ếch nhảy lá sen
- Lá sen vẽ SVG (khe chữ V, gân lá, số trong vòng trắng, lâu lâu có bông sen 🌸); mặt nước có gợn sóng.
- Ếch vẽ SVG đủ 4 chân: dáng ngồi và dáng nhảy duỗi chân, phóng to khi bật lên.
- Sửa ếch nhảy lệch khỏi lá; cả cảnh trượt theo ếch nên ếch đứng trên lá vừa đáp, không quay về bờ; hết sông thì nhảy lên tổ.
- Vòng sáng ngẫu nhiên giữa/trái/phải; ếch nhảy chéo tới đó và đứng lại vị trí mới, máy quay chỉ đi lên theo ếch. Sông mới ếch bắt đầu ở giữa bờ.

## 2026-11-05 — Hộp quà bất ngờ trong Đua xe và Ếch nhảy
- Cứ 5–7 câu có hộp quà 🎁 trên đáp án đúng, trả lời đúng mới nhận.
- Quà: 🐢 chạy chậm 5 câu, 🛡️ khiên đỡ 1 lần sai, ❤️ thêm tim, ⭐ nhân đôi điểm 5 câu; hiện trên thanh HUD.

## 2026-11-05 — Thêm trò Đua xe ba làn và Ếch nhảy lá sen
- 🏎️ Đua xe ba làn: chạm vào làn có đáp án đúng để lái xe qua cổng, chơi tới khi hết 3 mạng; đi nhầm cổng mất 1 mạng và hiện đáp án.
- 🐸 Ếch nhảy lá sen: chạm lá sen đúng khi nó trôi vào vòng sáng, qua sông này tới sông khác tới khi hết 3 mạng; chạm nhầm mất 1 mạng, lá đúng nhấp nháy gợi ý.
- Mạng (5/3/3) và tốc độ theo cài đặt độ khó của bố mẹ, nhanh dần sau mỗi câu; thêm sticker 🏁 Tay lái lụa và 🪷 Ếch vô địch (200 điểm).
- Xe đua vẽ bằng SVG nhìn từ trên xuống (thay emoji 🏎️ bị dựng đứng), nghiêng khi đổi làn, có vệt lửa khi tăng tốc.
- `sw.js` lên `v11`, thêm 2 file trò chơi.

## 2026-11-01 — Đổi khóa lưu trữ
- Khóa localStorage đổi từ `bang-cuu-chuong-v1` thành `be-vui-hoc-v1` để dùng chung cho các loại bài học sau này.
- Máy đang có dữ liệu ở khóa cũ sẽ tự chuyển sang khóa mới khi mở app, không mất tiến độ.

## 2026-11-01 — Quy tắc ghi CHANGELOG
- Thêm quy tắc vào CLAUDE.md: mỗi task đều ghi một mục vào `CHANGELOG.md`.

## 2026-11-01 — Độ khó trò chơi cho bố mẹ
- Trang phụ huynh: thêm chọn độ khó Dễ / Vừa / Khó.
- Bắn bóng bay và Đánh quái vật: câu đầu 12/8/4 giây, mỗi câu nhanh hơn 0,2 giây, nhanh nhất 2,4 giây; chơi tới khi hết mạng.
- Đánh quái vật: hạ xong quái thì quái mới xuất hiện; điểm tính theo số quái hạ được.
- Đua giây: 90/60/45 giây. Lật thẻ: 4/6/8 cặp. Bắn bóng mức Dễ có 5 mạng.
- CLAUDE.md: thêm nguyên tắc nội dung mang tính giáo dục, không tiêu cực với học sinh.
