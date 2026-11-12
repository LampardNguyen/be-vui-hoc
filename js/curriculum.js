// Cây chương trình học: lớp → môn → nhóm → chương. Chương có href là đã có bài, chưa có thì hiện "Sắp có".
export const GRADES = [
  {
    id: 'lop3', name: 'Lớp 3',
    subjects: [
      {
        id: 'toan3', name: 'Toán', emoji: '🔢', color: '#ff8c42',
        groups: [
          { name: '🔢 Số và phép tính', topics: [
            { id: 'cuu-chuong', name: 'Bảng cửu chương', emoji: '✖️', href: '#/topic/cuu-chuong' },
            { id: 'so-sanh-1000', name: 'So sánh số dưới 1000', emoji: '⚖️', href: '#/topic/so-sanh-1000' },
            { id: 'cong-tru-1000', name: 'Cộng trừ dưới 1000', emoji: '➕', href: '#/topic/cong-tru-1000' },
            { id: 'nhan-chia-lon', name: 'Nhân, chia số 2–3 chữ số với 1 chữ số', emoji: '🧮', href: '#/topic/nhan-chia-lon' },
            { id: 'chia-du', name: 'Phép chia hết và có dư', emoji: '🍬', href: '#/topic/chia-du' },
            { id: 'bieu-thuc', name: 'Biểu thức số', emoji: '🧾', href: '#/topic/bieu-thuc' },
            { id: 'gap-may-lan', name: 'Số lớn gấp mấy lần số bé', emoji: '📊', href: '#/topic/gap-may-lan' },
          ] },
          { name: '🧩 Tìm thành phần', topics: [
            { id: 'tp-cong-tru', name: 'Trong phép cộng, trừ', emoji: '🔍', href: '#/topic/tp-cong-tru' },
            { id: 'tp-nhan-chia', name: 'Trong phép nhân, chia', emoji: '🔎', href: '#/topic/tp-nhan-chia' },
          ] },
          { name: '📏 Đo lường', topics: [
            { id: 'don-vi', name: 'Đo lường: độ dài, khối lượng, lít, nhiệt độ, thời gian', emoji: '📏', href: '#/topic/don-vi' },
          ] },
          { name: '🍕 Phân số', topics: [
            { id: 'mot-phan', name: 'Một phần mấy', emoji: '🍰', href: '#/topic/mot-phan' },
          ] },
          { name: '📐 Hình học', topics: [
            { id: 'trung-diem', name: 'Điểm giữa, trung điểm', emoji: '📍', href: '#/topic/trung-diem' },
            { id: 'hinh-tron', name: 'Hình tròn: tâm, bán kính, đường kính', emoji: '⭕', href: '#/topic/hinh-tron' },
            { id: 'goc', name: 'Góc vuông, góc không vuông', emoji: '📐', href: '#/topic/goc' },
            { id: 'hinh-phang', name: 'Tam giác, tứ giác, hình vuông, chữ nhật', emoji: '🔺', href: '#/topic/hinh-phang' },
            { id: 'khoi', name: 'Khối lập phương, khối hộp chữ nhật', emoji: '🧊', href: '#/topic/khoi' },
          ] },
        ],
      },
      { id: 'tv3', name: 'Tiếng Việt', emoji: '📚', color: '#4cc9f0', groups: [] },
    ],
  },
];

export function findSubject(id) {
  for (const g of GRADES) {
    const s = g.subjects.find((x) => x.id === id);
    if (s) return { grade: g, subject: s };
  }
  return null;
}
