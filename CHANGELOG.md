# Nhật ký thay đổi

## 2026-11-25 — Luôn hiện "Con cần nhớ" trong luyện tập

- Màn luyện của mọi chương có khung 💡 Con cần nhớ ở cuối (tips của phần nếu có, không thì của chương).
- Bé thu gọn/mở được, app nhớ lựa chọn; lần đầu trên điện thoại thu gọn sẵn.

## 2026-11-25 — Lưu túi dạng bài để tắt app không mất

- `mix()` lưu túi dạng bài còn lại vào `state.bags` theo chương/phần; mở lại app sẽ rút tiếp túi cũ → mỗi 35 câu (chương Nhân, chia lớn) chắc chắn đủ mọi dạng.

## 2026-11-24 — Đặt tính chia: viết các dòng số dư như trên giấy

- Bỏ dòng chữ giải thích dưới số bị chia; thay bằng các dòng số dư (số dư + hạ chữ số tiếp), thẳng cột với chữ số vừa hạ.
- Mỗi dòng hiện khi bé điền đúng chữ số thương tương ứng; dòng số dư cuối hiện sau khi điền số dư.

## 2026-11-24 — Cộng trừ dưới 1000: gộp 2 dạng tính nhẩm
- Tính nhẩm tròn trăm và tính nhẩm đủ 100 / 1000 giờ là một dạng, tần suất như cũ. Chương còn 9 dạng.

## 2026-11-24 — So sánh số dưới 1000: gộp 3 dạng cái cân
- Phép tính – số, tổng – tổng, trăm + chục + đơn vị – số giờ là một dạng (chọn ngẫu nhiên kiểu đặt lên cân), tần suất như cũ. Chương còn 10 dạng.

## 2026-11-24 — Sửa dạng câu tự nhảy sang dạng khác
- So sánh số dưới 1000 (dạng tổng = tổng), Nhân chia số lớn (Đúng/Sai thương có 0), Nhiệt độ (so 2 nhiệt kế): khi số không hợp lệ thì tạo lại chính dạng đó thay vì rút ngẫu nhiên cả chương (chế độ dev bị nhảy dạng).

## 2026-11-24 — Luyện nhân/chia 2–9 thành trắc nghiệm
- `js/screens/practice.js`: bỏ bàn phím số, thay bằng 4 nút đáp án (2×2), chạm là chấm.
- Đáp án nhiễu dễ nhầm: lệch một hàng trong bảng hoặc ±1 (nhân), thương lân cận (chia).
- Sai: nút đỏ, nút đúng xanh, ẩn lựa chọn và hiện hình minh hoạ như cũ.

## 2026-11-24 — Chế độ dev xem lần lượt các dạng câu hỏi
- Chỉ bật khi URL có `?dev=1` (mặc định tắt, không nhớ lại), có nhãn 🛠 DEV góc màn hình.
- Mỗi chương có nút "🛠 Xem các dạng" (`#/dev/<id>`): duyệt từng dạng không lặp, hiện sẵn đáp án, giải thích, kiểu nhập; nút Trước / Số khác / Tiếp; không ghi tiến độ.
- `mix()` gắn thêm `.types` (danh sách hàm dạng). CLAUDE.md thêm quy tắc câu luyện tập ưu tiên trắc nghiệm.

## 2026-11-24 — Câu không cần đặt tính tự thành trắc nghiệm

- `renderKind` (`js/ui/kinds.js`): câu nhập số không có nút ✍️ Đặt tính → tự đổi thành 4 lựa chọn (kèm đơn vị) qua `numChoice`.
- Giữ bàn phím số cho câu có đặt tính (cộng/trừ số lớn) và câu "Viết số" (`keypad: true`).
- Câu "347 = 300 + 40 + ❓" bỏ nút đặt tính thừa (`calc: []`) nên cũng thành trắc nghiệm.

## 2026-11-24 — Câu không cần tính chuyển sang trắc nghiệm

- Thêm `numChoice(ans, spread, unit, wrong)` trong `js/topics/util.js`: đổi câu đáp án số thành 4 lựa chọn.
- Đổi sang trắc nghiệm các câu ghi nhớ / đọc số trên hình / đếm hình: 1 tuần–ngày–giờ–năm, ngày đi học/nghỉ,
  đếm thứ trên tờ lịch, 1 m = 1000 mm, đọc cân đồng hồ (kg, g), đọc nhiệt kế, nhiệt độ viết bằng số,
  số liền trước/sau, số gồm trăm–chục–đơn vị, đếm góc vuông, đếm hình, đếm tam giác/tứ giác.
- Câu cần tính toán và "Viết số" vẫn nhập bằng bàn phím số.

## 2026-11-24 — Ngày, tháng, thứ dễ hiểu hơn + chia đều dạng bài

- `mix()` (`js/topics/util.js`) đổi sang rút thăm theo túi: các dạng/phần ra đều nhau trong 10 câu, không còn dạng này nhiều dạng kia ít.
- Ngày, tháng, thứ: bỏ dạng tính thứ khi cách nhau tới 10 ngày và dạng "Thứ X tuần này → Thứ Y tuần sau".
- Thêm dạng: hôm qua/ngày mai/hôm kia/ngày kia, số ngày đi học/nghỉ, xem tờ lịch tìm thứ, đếm thứ trên lịch,
  cùng thứ tuần trước/tuần sau (±7, có hình 2 hàng tuần), đếm tiếp 1–3 ngày (có dải ô).
- Hình SVG mới: `calendar`, `twoWeeks`, `dayStrip` trong `js/topics/measure.js`.

## 2026-11-15 — Thêm dạng bài So sánh số lớn gấp mấy lần số bé

- Bút chì dài gấp mấy lần bút sáp / cái ghim.
- Bóng xếp hàng, cột: mỗi hàng, mỗi cột, hàng gấp cột mấy lần (có hình).
- Thuyền lớn – thuyền nhỏ: nhiều hơn bao nhiêu (trừ) và gấp mấy lần (chia).
- Gà – vịt trên sân: số gà gấp mấy lần số vịt.

## 2026-11-15 — Thêm dạng bài theo sách cho chương Biểu thức số

- Dạng biểu thức mới (`expr2`): nhân chia từ trái sang phải (30 : 5 × 2), ngoặc ở sau (32 − (25 + 4), 40 : (11 − 3)),
  (15 + 5) : 5, cộng thuận tiện ba số (123 + 80 + 20) — làm theo Bước 1 → Bước 2.
- Nối biểu thức với giá trị (thuyền A, B, C, D).
- Chọn biểu thức có giá trị lớn nhất / bé nhất (5 × (6 − 2), 5 × 6 − 2, …).
- So sánh A: 35 − 5 × 2 và B: (35 − 5) × 2.
- Bài toán: có k hộp bút, cho m hộp, mỗi hộp n chiếc.

## 2026-11-15 — Thêm dạng bài Chia số có ba chữ số cho số có một chữ số

- Tính nhẩm chia số tròn trăm (600 : 3…); giảm k lần với m, phút, ml, g (bài chú chuột và miếng phô mai).
- Bài toán có đặt tính: quãng đường Rô-bốt gấp 3 lần của Việt, xếp bánh vào hộp.
- Đóng bút chì vào hộp: được mấy hộp, thừa mấy chiếc (chia có dư).
- Đúng/Sai phép chia làm sẵn — lỗi quên viết 0 ở thương (808 : 8 = 11).
- Rô-bốt cân bằng các khối ru-bích; lạc đà 1 bướu – 2 bướu (hai bước).

## 2026-11-15 — Thêm dạng bài Nhân số có ba chữ số với số có một chữ số

- Tính nhẩm số tròn trăm (300 × 3…), tìm tích từ hai thừa số.
- Bài toán có đặt tính: hải âu – mèo gấp lần ngày tuổi, đường kính từ bán kính, cái ấm cân bằng các cái chén.
- Gấu đen và hũ mật ong (hai bước: nhân rồi trừ).
- Thừa số giảm 2 lần thì thừa số kia gấp 2 lần (sơ đồ 600 = 200 × 3 = 100 × 6).

## 2026-11-15 — Đo lường: thêm dạng bài Mi-li-mét, Gam, Mi-li-lít, Nhiệt độ theo sách

- Độ dài: thước có vạch mm đo đoạn AB, đổi cm/m ↔ mm, so sánh, tính với mm, ve sầu 3 cm – kiến 3 mm,
  ốc sên đi học, cào cào nhảy gấp 3 lần, gấp/giảm với mm.
- Khối lượng: cân đồng hồ 1 kg (vạch 50 g), túi táo – gói bột mì (hơn bao nhiêu, cả hai), tính với g,
  con vật nặng khoảng 200 g / 2 kg / 20 kg / 200 kg.
- Dung tích: rót bình sang 3 ca đong 500 ml, phích 1 l rót ra còn lại, tính với ml, chai dầu ăn, chai nào nhiều/ít nhất.
- Nhiệt độ: bảng ba địa phương (nơi cao/thấp hơn), dự báo sáng–trưa–đêm, đọc "ba mươi bảy độ xê",
  nhiệt độ cơ thể cao hơn 37°C, cốc nước đá / lọc / nóng.

## 2026-11-15 — Chương mới Bài toán giải bằng hai bước tính; thêm dạng Nhân số có hai chữ số

- Chương mới `hai-buoc` (nhóm Số và phép tính): sơ đồ tóm tắt hai đoạn thẳng, làm theo Bước 1 → Bước 2.
  Dạng: gấp k lần rồi tính tổng (can nước mắm), nhiều/ít hơn rồi tính tổng (gấp thuyền), bao ngô – bao gạo,
  bán sáng – bán chiều còn lại, nhân rồi trừ, chọn phép tính cho bước 1.
- Nhân 2 chữ số × 1 chữ số: tính nhẩm số tròn chục, nối phép tính với kết quả, bài toán chuồng gà / quạ thả sỏi (đặt tính).

## 2026-11-15 — Thêm dạng bài Phép chia hết, phép chia có dư

- Bông hoa → chậu: phép chia có số dư là mấy.
- Chia theo nhóm (mỗi rổ k con cá…) được mấy rổ, có đặt tính.
- Chọn phép chia có số chia b và số dư r.

## 2026-11-15 — Thêm dạng bài Chia số có hai chữ số cho số có một chữ số

- Tính nhẩm chia số tròn chục (60 : 2, 80 : 4…).
- Tìm thừa số: 3 × ? = 63, ? × 4 = 84.
- Nối phép chia với kết quả (chọn đáp án).
- Bài toán lời văn (chia tổ, chia trứng vào rổ) có đặt tính.
- Đúng/Sai phép chia làm sẵn (số dư phải bé hơn số chia); chọn phép chia có số dư k.

## 2026-11-15 — Thêm dạng bài theo sách cho chương Tam giác, tứ giác, chữ nhật, vuông

- Hình có chữ: chọn đúng các đỉnh / các cạnh của tam giác, tứ giác.
- Đếm hình tam giác, tứ giác trong hình thang chia 3.
- Cắt tờ giấy chữ nhật theo nét đứt được những hình gì.
- Kiến bò theo cạnh hình vuông, bọ rùa theo cạnh hình chữ nhật: tính quãng đường, ai bò xa hơn.
- Xếp hình chữ nhật/vuông bằng que tính; Đúng/Sai về đường chéo hình vuông.

## 2026-11-15 — Thêm dạng bài Gấp một số lên một số lần

- Mũi tên "gấp k lần" và "thêm k đơn vị" xen kẽ để bé phân biệt nhân với cộng.
- Chuỗi: thêm m đơn vị rồi gấp k lần.
- Chú kiến qua đường hầm: chọn "gấp k lần" hay "thêm k đơn vị".
- Bài toán lời văn: tuổi bố gấp k lần tuổi con, ghế xếp theo bàn.
- Số có 2 chữ số gấp k lần (14 gấp 6 lần…).

## 2026-11-15 — Thêm dạng bài Giảm một số đi một số lần

- Chương đổi tên: "Gấp mấy lần, giảm một số lần", thêm mẹo "giảm k lần là chia k".
- Mũi tên giảm k lần; chuỗi gấp rồi giảm (hoặc giảm rồi gấp).
- Bài toán lời văn: còn lại so với lúc đầu giảm đi k lần (nhãn vở, bút màu…).
- Đúng/Sai phân biệt "giảm k lần" (chia) với "bớt k" (trừ).
- Rô-bốt chọn đường gồm 2 phép gấp/giảm để có đúng số đồng vàng.

## 2026-11-15 — Thêm dạng bài theo sách cho chương Góc vuông

- Góc có chữ: hỏi đỉnh, hai cạnh, góc đỉnh … là góc vuông hay không vuông.
- Chọn hình có nhiều góc vuông nhất trong 3 hình.
- Con tàu tới hành tinh: chọn đường gấp khúc chỉ gồm góc vuông.

## 2026-11-15 — Thêm dạng bài theo sách cho chương Hình tròn

- Hình tròn có chữ: hỏi tâm là điểm nào, đoạn nào là bán kính / đường kính (có dây cung gây nhiễu).
- Các hình tròn bằng nhau xếp hàng: tính độ dài đường gấp khúc ABCD, hoặc dài bằng mấy bán kính.
- Đúng/Sai: các bán kính của một hình tròn dài bằng nhau.

## 2026-11-12 — Thêm dạng bài theo sách: Một phần mấy

- Đ/S: "Đã tô màu 1/m hình tròn / hình chữ nhật" với hình chia n phần.
- Đọc / viết: 1/4 đọc là "Một phần tư", "Một phần năm" viết là 1/5.
- Đã khoanh vào 1/n số cây ở hình nào (A/B/C, khoanh 1 hàng hoặc 1 cột).
- Chia 12 quả cam thành 3 phần bằng nhau (hình các đĩa), 1/3 là mấy quả.
- Chia bánh trung thu cho n bạn, mỗi bạn được mấy phần.

## 2026-11-12 — Thêm dạng bài theo sách: Tìm thành phần trong phép nhân, chia

- Bảng Thừa số/Tích và Số bị chia/Số chia/Thương, mỗi cột 1 ô ? (làm từng ô).
- Mũi tên ngược: ? →×2→ 8, ? →:5→ 6.
- Toán lời văn: ca nước (hình các ca có ?), ca-bin, cắm hoa vào lọ, xếp cam vào đĩa.
- Chọn câu trả lời đúng A/B/C (tìm số bị chia, số chia, thừa số).

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
