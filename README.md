# Bảng Cửu Chương Vui 🎈

Trang web giúp bé lớp 3 học thuộc và phản xạ nhanh bảng nhân, bảng chia 2–9 — vừa học vừa chơi.

- **Bản đồ đảo**: mỗi bảng là một hòn đảo, thuộc càng nhiều càng được nhiều sao.
- **Học**: xem từng phép, lưới chấm minh họa, giọng đọc tiếng Việt, mẹo nhớ, chế độ che kết quả.
- **Luyện hôm nay**: 15 câu, chọn theo phương pháp lặp lại ngắt quãng (hộp Leitner) — phép hay sai sẽ được hỏi nhiều hơn.
- **Trò chơi** (chọn hoặc 🎲 ngẫu nhiên, theo từng bảng hoặc trộn):
  - 🎈 **Bắn bóng bay** — chạm đúng bóng trước khi bay mất, bóng nhanh dần.
  - ⏱️ **Đua 60 giây** — trả lời càng nhiều càng tốt, có chuỗi combo.
  - 🃏 **Lật thẻ** — ghép phép tính với kết quả.
  - 👾 **Đánh quái vật** — trả lời nhanh là đòn chí mạng, chậm/sai bị quái đánh lại.
- **Bộ sưu tập**: 20 sticker theo mốc (chuỗi ngày, kỷ lục trò chơi, 3 sao từng đảo…) và thú cưng tiến hóa theo số phép đã thuộc.
- **Dành cho bố mẹ**: lưới mức thuộc từng phép, phép hay sai, thời gian học 7 ngày, sao lưu/khôi phục.

Một phép được coi là "thuộc" khi bé trả lời đúng **dưới 3 giây** nhiều lần liên tiếp.

## Chạy thử trên máy

```bash
python3 -m http.server 8765
```

Mở http://localhost:8765. Không cần cài đặt gì; tiến độ lưu trong trình duyệt (localStorage) của từng máy.

## Thêm vào màn hình chính iPad

Mở link GitHub Pages bằng Safari → nút Chia sẻ → **Thêm vào MH chính**. Trang sẽ mở như app và chạy được khi không có mạng.
Mỗi lần sửa code, tăng `VERSION` trong `sw.js` để máy tải bản mới (bản mới hiện ra ở lần mở thứ hai).
