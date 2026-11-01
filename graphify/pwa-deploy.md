# Offline & deploy

File: `sw.js`, `manifest.webmanifest`, `icons/`, `index.html`.

## Service worker
- Cache `cuu-chuong-${VERSION}`, precache mảng `FILES`; fetch = stale-while-revalidate (trả cache ngay, tải bản mới cho lần sau).
- Đăng ký trong `js/app.js` trừ khi `hostname === 'localhost'`. In-app browser ở 127.0.0.1 không đăng ký được — thử trên GitHub Pages.
- **Mỗi lần deploy tăng `VERSION`**; thêm/đổi file → sửa `FILES`. Bản mới hiện ở lần mở thứ hai.

- **Cập nhật thủ công**: chạm chữ "Bé Vui Học" ở trang chủ 3 lần trong 1,5 giây → hỏi xác nhận → gỡ service worker, xoá mọi cache, tải lại (`refreshApp` trong `js/screens/home.js`). Tiến độ trong localStorage giữ nguyên.

## Icon
- `icons/icon.svg` → PNG 180/192/512 bằng `qlmanage -t -s <N>` (máy không có Pillow).

## Deploy
- GitHub Pages từ nhánh `main`, thư mục gốc, repo `LampardNguyen/be-vui-hoc` → https://lampardnguyen.github.io/be-vui-hoc/.
- Đường dẫn đều tương đối (`./`) vì site nằm dưới `/be-vui-hoc/`.

## Liên quan
- [[index]] · [[routing]]
