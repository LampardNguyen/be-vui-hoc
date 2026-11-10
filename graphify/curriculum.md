# Chương trình học (lớp → môn → chương)

**Mục đích:** điều hướng phân cấp cho nhiều lớp/môn/chương.

**File chính:** `js/curriculum.js` (`GRADES`, `findSubject`), `js/screens/home.js` (`homeScreen`, `subjectScreen`, `cuuChuongScreen`).

**Luồng:** `#/` (chọn lớp, thẻ môn) → `#/subject/<id>` (chương theo nhóm) → `href` của chương (bảng cửu chương: `#/topic/cuu-chuong`).

**Thêm chương mới:** làm màn hình, thêm route trong `js/app.js`, rồi gán `href` cho chương trong `GRADES` (chương không có `href` tự hiện "🔒 Sắp có" + toast). Tích vào `TODO.md`.

**Lưu ý:** môn không có chương nào có `href` thì thẻ môn bị khoá. Tiến độ môn Toán hiện chỉ tính từ bảng cửu chương.

## Liên quan
[[routing]] · [[games]] · [[practice-learn]]
