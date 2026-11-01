# Phép tính

File: `js/facts.js`.

## Nội dung
- `TABLES` = 2–9, `NS` = 1–10 → 80 phép nhân + 80 phép chia = **160 phép**.
- `mul(t,n)` id `m{t}x{n}` (vd `m3x4`); `div(t,n)` id `d{t*n}:{t}` (vd `d12:3`). Ký hiệu hiển thị `×` và `:`.
- `factsOf(tables, types)`, `family(f)` (gia đình phép tính 3×4, 4×3, 12:3, 12:4), `distractors(f,k)` đáp án nhiễu gần đúng, `shuffle`.
- `ISLANDS[t]`: emoji, tên, màu của từng đảo; `TIPS[t]` mẹo nhớ, `DIV_TIP`.

## Lưu ý
- Đổi id phép tính → mất tiến độ đã lưu trong `state.facts` ([[storage]]).
- Đổi số phép (vd bỏ ×1) → sửa sticker `master160` và mốc thú cưng trong [[rewards]].

## Liên quan
- [[index]] · [[leitner]] · [[practice-learn]]
