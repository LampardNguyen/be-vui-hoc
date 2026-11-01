# CLAUDE.md — Bé Vui Học (Bảng Cửu Chương Vui)

## 1. Bối cảnh

- Web app tĩnh giúp bé lớp 3 học thuộc và phản xạ nhanh bảng nhân/chia 2–9, vừa học vừa chơi.
- Thiết bị chính: **iPad (Safari, thêm vào MH chính)**, đôi khi điện thoại → giao diện ưu tiên chạm, chữ to.
- Repo: `LampardNguyen/be-vui-hoc` (thư mục máy vẫn tên `bang-cuu-chuong`), chạy trên GitHub Pages:
  https://lampardnguyen.github.io/be-vui-hoc/ — push lên `main` là tự deploy (~1 phút).

## 2. Kỹ thuật

- HTML/CSS/JS thuần, ES modules, **không build, không thư viện, không npm**. Giữ nguyên như vậy.
- Không backend, không analytics; tiến độ chỉ lưu `localStorage` (khóa `be-vui-hoc-v1`; khóa cũ `bang-cuu-chuong-v1` tự chuyển sang khi mở app).
  Đổi cấu trúc `state` → giữ tương thích dữ liệu cũ qua `merge()` trong `js/storage.js`, không đổi khóa.
- Tạo DOM bằng `h()` trong `js/ui/widgets.js`; timer/listener của màn hình phải dọn bằng `onLeave()`.
- Chuỗi giao diện và comment code: **tiếng Việt**, giọng thân thiện với trẻ em ("con", emoji vừa phải).

## 3. Bắt đầu mỗi lần làm

1. Đọc `graphify/index.md` trước khi phân tích một chức năng (xem §6), chỉ đọc code khi bản đồ chưa đủ.
2. Trao đổi với người dùng bằng tiếng Việt.

## 4. Quy trình sửa code

1. Thay đổi tối thiểu, theo style hiện có (2 dấu cách, nháy đơn, dấu `;`).
2. Chạy thử: `python3 -m http.server 8765` rồi mở http://localhost:8765 trong browser pane,
   kiểm tra ở cỡ **tablet (768×1024)** và **mobile (375×812)**, không có lỗi console.
   Service worker không chạy ở localhost (cố ý) — muốn thử offline thì thử trên GitHub Pages.
3. Hành vi Claude không tự kiểm được (giọng đọc tiếng Việt trên iPad, cảm giác chạm, tốc độ game hợp với bé)
   → liệt kê bước để người dùng kiểm trên iPad.
4. **Trước khi push bất kỳ thay đổi nào**: tăng `VERSION` trong `sw.js` (vd `v2` → `v3`).
   Thêm/xoá/đổi tên file JS/CSS/ảnh → cập nhật mảng `FILES` trong `sw.js`.
5. Commit tiếng Việt, ngắn gọn. Chỉ push khi người dùng yêu cầu deploy.
6. **Mỗi task đều ghi vào `CHANGELOG.md`** (gốc repo, tạo nếu chưa có): thêm mục mới lên đầu file
   dạng `## YYYY-MM-DD — <tên task>` + gạch đầu dòng thay đổi chính (tiếng Việt), commit cùng thay đổi.
   `CHANGELOG.md` không nằm trong `FILES` của `sw.js`.

## 5. Thêm nội dung thường gặp

- **Nguyên tắc nội dung (bắt buộc)**: trò chơi/bài học phải mang tính giáo dục là chủ yếu.
  Không cổ xúy hay tạo cảm xúc tiêu cực cho học sinh: không bạo lực, không chế giễu/phạt nặng khi sai,
  không so sánh hạ thấp, không cờ bạc/may rủi ăn tiền, không gây áp lực hay sợ hãi.
  Khi bé sai → động viên, gợi ý đáp án đúng; phần thưởng khuyến khích sự cố gắng và tiến bộ.

- **Trò chơi mới**: tạo `js/games/<id>.js` (dùng `gameResult`, `saveBest`, `backFor` trong `common.js`),
  thêm vào `GAMES` (`js/games/index.js`), route trong `js/app.js`, `FILES` trong `sw.js`,
  sticker kỷ lục trong `js/screens/rewards.js` nếu cần. Xem [[games]] trong graphify.
- **Sticker mới**: thêm vào `STICKERS` (điều kiện tính từ `state` sẵn có, không thêm trường mới nếu tránh được).
- Câu trả lời của bé phải đi qua `answer()` (`js/leitner.js`) để cập nhật mức thuộc.

## 6. Bản đồ tri thức `graphify/`

- **Trước khi phân tích** một chức năng: đọc `graphify/index.md` rồi note liên quan.
- **Sau khi phân tích xong** một chức năng chưa có note: ghi thành note mới trong `graphify/`.
  Kiểu Obsidian: mỗi note 1 chủ đề, liên kết chéo bằng `[[tên-note]]`, có mục *Liên quan*;
  `graphify/index.md` là chỉ mục gốc (MOC) trỏ tới mọi note.
  Nội dung note: mục đích, file chính (đường dẫn), luồng xử lý, phụ thuộc, lưu ý/bẫy.
- **Khi sửa logic** làm note không còn đúng: cập nhật note (và `index.md` nếu thêm/xoá note) trong cùng commit.
- `graphify/` không nằm trong `FILES` của `sw.js` (chỉ là tài liệu).

## 7. Tiết kiệm token

- Việc nhỏ (sửa vài dòng, hỏi đáp, git): làm trực tiếp, không tạo agent, không thêm bước kiểm tra không cần.
- Chỉ dùng agent khi việc thật sự lớn và người dùng đồng ý.
