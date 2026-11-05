# Nhật ký thay đổi

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
