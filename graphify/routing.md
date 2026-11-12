# Điều hướng & vòng đời màn hình

File: `js/app.js`, `js/ui/widgets.js`.

## Luồng
- `routes` map tên → hàm màn hình; URL dạng `#/<tên>/<param>` (vd `#/subject/toan3`, `#/topic/cuu-chuong`, `#/table/3`, `#/practice/3m`, `#/boss/mix`). `#/quiz/<chương>.<phần>` mở luyện 1 phần của chương (xem [[topics]]).
- `render()` (mỗi `hashchange`): `leave()` → `stopSpeaking()` → `screen(param)` thay nội dung `#app`.
- Màn hình là hàm trả về 1 element, tạo bằng `h(tag, attrs, ...children)` (`onclick` → listener, `class`, `style`).
- `onLeave(fn)` đăng ký dọn dẹp (clearInterval, cancelAnimationFrame, gỡ listener bàn phím); `leave()` gọi hết.
- `go(hash)` chuyển màn; `topBar(title, back)` thanh tiêu đề + nút quay lại.

## Lưu ý
- Quên `onLeave` cho timer → timer chạy tiếp sau khi rời màn hình (lỗi kiểu gọi finish 2 lần, xem [[games]]).
- Param `key` của luyện/trò chơi: `mix` (các bảng bật trong cài đặt), `3` (bảng 3 nhân+chia), `3m` / `3d` → [[leitner]] `poolFor`.

## Liên quan
- [[index]] · [[games]] · [[practice-learn]]
