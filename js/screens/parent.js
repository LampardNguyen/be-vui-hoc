// Trang dành cho bố mẹ: xem bé thuộc phép nào, hay sai phép nào, học bao lâu mỗi ngày.
import { h, topBar } from '../ui/widgets.js';
import { TABLES, NS, mul, div, factsOf } from '../facts.js';
import { rec, isMastered } from '../leitner.js';
import { state, save, dateKey, currentStreak, replaceState, resetState } from '../storage.js';

let unlocked = false;   // chỉ nhớ trong lần mở trang này

const BOX_COLORS = ['#e9ecef', '#ef476f', '#f8961e', '#ffd166', '#9be564', '#06a77d'];
const BOX_LABELS = ['Chưa làm', 'Chưa thuộc', 'Đang học', 'Khá', 'Thuộc', 'Thuộc làu'];

export function parentScreen() {
  const root = h('div', { class: 'screen parent' }, topBar('👨‍👩‍👧 Dành cho bố mẹ'));
  root.append(unlocked ? dashboard() : gate(() => { unlocked = true; root.replaceWith(parentScreen()); }));
  return root;
}

function gate(onPass) {
  const a = 11 + Math.floor(Math.random() * 9);
  const b = 3 + Math.floor(Math.random() * 7);
  const input = h('input', { type: 'number', inputmode: 'numeric', class: 'gate-input' });
  const msg = h('p', { class: 'gate-msg' });
  const check = () => {
    if (+input.value === a * b) onPass();
    else { msg.textContent = 'Chưa đúng, thử lại nhé.'; input.value = ''; }
  };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
  return h('div', { class: 'card gate' },
    h('p', {}, 'Câu hỏi cho người lớn:'),
    h('p', { class: 'gate-q' }, `${a} × ${b} = ?`),
    input,
    h('button', { class: 'btn-primary', onclick: check }, 'Mở'),
    msg,
  );
}

function fmtSec(ms) { return ms ? `${(ms / 1000).toFixed(1)} giây` : '—'; }

function dashboard() {
  const all = factsOf(TABLES);
  const recs = all.map((f) => ({ f, r: rec(f.id) }));
  const seen = recs.filter(({ r }) => r.seen);
  const right = seen.reduce((s, { r }) => s + r.right, 0);
  const tries = seen.reduce((s, { r }) => s + r.seen, 0);
  const timed = seen.filter(({ r }) => r.ms);
  const avgMs = timed.length ? timed.reduce((s, { r }) => s + r.ms, 0) / timed.length : 0;

  const summary = h('div', { class: 'stats' },
    stat('🧠', `${all.filter(isMastered).length}/${all.length}`, 'phép đã thuộc'),
    stat('✅', tries ? `${Math.round((right / tries) * 100)}%` : '—', 'trả lời đúng'),
    stat('⏱️', fmtSec(avgMs), 'trả lời TB'),
    stat('🔥', `${currentStreak()} ngày`, 'học liên tiếp'),
  );

  // Lưới mức thuộc: hàng = bảng 2–9, cột = 1–10
  let type = 'm';
  const gridWrap = h('div');
  const tabM = h('button', { class: 'tab', onclick: () => { type = 'm'; renderGrid(); } }, 'Nhân ×');
  const tabD = h('button', { class: 'tab', onclick: () => { type = 'd'; renderGrid(); } }, 'Chia :');
  function renderGrid() {
    tabM.classList.toggle('on', type === 'm');
    tabD.classList.toggle('on', type === 'd');
    const table = h('table', { class: 'heat' },
      h('tr', {}, h('th', {}, type === 'm' ? '×' : ':'), NS.map((n) => h('th', {}, type === 'm' ? n : `=${n}`))),
      TABLES.map((t) => h('tr', {}, h('th', {}, t), NS.map((n) => {
        const f = type === 'm' ? mul(t, n) : div(t, n);
        const r = rec(f.id);
        return h('td', {
          style: `background:${BOX_COLORS[r.box]}`,
          title: `${f.text} = ${f.answer} · ${BOX_LABELS[r.box]} · đúng ${r.right}/${r.seen} · ${fmtSec(r.ms)}`,
        }, type === 'm' ? f.answer : f.a);
      }))),
    );
    gridWrap.replaceChildren(table);
  }
  renderGrid();
  const legend = h('div', { class: 'legend' },
    BOX_LABELS.map((l, i) => h('span', {}, h('i', { style: `background:${BOX_COLORS[i]}` }), l)));

  // Phép hay sai nhất
  const hardest = recs.filter(({ r }) => r.wrong).sort((x, y) => y.r.wrong - x.r.wrong || y.r.ms - x.r.ms).slice(0, 8);
  const hardList = hardest.length
    ? h('ul', { class: 'hard' }, hardest.map(({ f, r }) =>
      h('li', {}, h('b', {}, `${f.text} = ${f.answer}`), ` — sai ${r.wrong}/${r.seen} lần, TB ${fmtSec(r.ms)}`)))
    : h('p', { class: 'muted' }, 'Chưa có phép nào bị sai. 🎉');

  // Số phút học 7 ngày gần nhất
  const days = [];
  for (let k = 6; k >= 0; k--) {
    const d = new Date();
    d.setDate(d.getDate() - k);
    const info = state.days[dateKey(d)] || { ms: 0, answers: 0 };
    days.push({ label: `${d.getDate()}/${d.getMonth() + 1}`, min: info.ms / 60000, answers: info.answers });
  }
  const maxMin = Math.max(5, ...days.map((d) => d.min));
  const chart = h('div', { class: 'week' }, days.map((d) => h('div', { class: 'day' },
    h('span', { class: 'day-val' }, d.min >= 1 ? `${Math.round(d.min)}′` : d.answers ? '<1′' : ''),
    h('span', { class: 'day-bar', style: `height:${(d.min / maxMin) * 100}%` }),
    h('small', {}, d.label))));

  return h('div', { class: 'parent-body' },
    summary,
    card('Mức thuộc từng phép', h('div', { class: 'tabs' }, tabM, tabD), gridWrap, legend,
      h('p', { class: 'muted' }, 'Một phép được tính là "thuộc" khi bé trả lời đúng dưới 3 giây nhiều lần liên tiếp.')),
    card('Phép bé hay sai nhất', hardList),
    card('Thời gian học 7 ngày qua (phút)', chart),
    settingsCard(),
  );
}

function stat(emoji, value, label) {
  return h('div', { class: 'stat' }, h('span', {}, emoji), h('b', {}, value), h('small', {}, label));
}

function card(title, ...kids) {
  return h('section', { class: 'card' }, h('h3', {}, title), ...kids);
}

function settingsCard() {
  const toggle = (key, label) => h('label', { class: 'check' },
    h('input', { type: 'checkbox', checked: state.settings[key], onchange: (e) => { state.settings[key] = e.target.checked; save(); } }),
    label);

  const tableChecks = h('div', { class: 'table-checks' }, TABLES.map((t) => h('label', { class: 'check' },
    h('input', {
      type: 'checkbox',
      checked: state.settings.tables.includes(t),
      onchange: (e) => {
        const set = new Set(state.settings.tables);
        e.target.checked ? set.add(t) : set.delete(t);
        state.settings.tables = [...set].sort((x, y) => x - y);
        save();
      },
    }), `Bảng ${t}`)));

  const levelBtns = h('div', { class: 'tabs' });
  const LEVELS = [['easy', '🐢 Dễ'], ['normal', '🙂 Vừa'], ['hard', '🚀 Khó']];
  const renderLevel = () => levelBtns.replaceChildren(...LEVELS.map(([id, label]) => h('button', {
    class: `tab${(state.settings.level || 'normal') === id ? ' on' : ''}`,
    onclick: () => { state.settings.level = id; save(); renderLevel(); },
  }, label)));
  renderLevel();

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `cuu-chuong-${dateKey()}.json` });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const fileInput = h('input', {
    type: 'file', accept: 'application/json', style: 'display:none',
    onchange: async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        replaceState(JSON.parse(await file.text()));
        alert('Đã khôi phục dữ liệu.');
        location.reload();
      } catch { alert('File không hợp lệ.'); }
    },
  });
  const reset = () => {
    if (confirm('Xóa toàn bộ tiến độ học của bé trên máy này?')) { resetState(); location.reload(); }
  };

  return card('Cài đặt',
    toggle('voice', '🔊 Đọc phép tính bằng giọng nói'),
    toggle('sound', '🎵 Hiệu ứng âm thanh'),
    h('p', { class: 'muted' }, 'Các bảng dùng cho "Luyện hôm nay" và "Bắn bóng bay" ở trang chủ:'),
    tableChecks,
    h('p', { class: 'muted' }, 'Độ khó trò chơi (thời gian, tốc độ, số mạng, số thẻ):'),
    levelBtns,
    h('div', { class: 'row-btns' },
      h('button', { class: 'btn-secondary', onclick: exportData }, '💾 Sao lưu'),
      h('button', { class: 'btn-secondary', onclick: () => fileInput.click() }, '📂 Khôi phục'),
      h('button', { class: 'btn-danger', onclick: reset }, '🗑️ Xóa dữ liệu'),
      fileInput,
    ),
  );
}
