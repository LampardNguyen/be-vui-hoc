// Tiện ích dựng giao diện dùng chung.

export function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) {
    if (c != null && c !== false) el.append(c instanceof Node ? c : String(c));
  }
  return el;
}

// Dọn dẹp (timer, sự kiện bàn phím…) khi rời màn hình.
const disposers = [];
export function onLeave(fn) { disposers.push(fn); }
export function leave() { while (disposers.length) disposers.pop()(); }

export function go(hash) { location.hash = hash; }

export function topBar(title, back = '#/') {
  return h('header', { class: 'topbar' },
    h('a', { class: 'btn-icon', href: back, 'aria-label': 'Quay lại' }, '⬅️'),
    h('h1', {}, title),
    h('a', { class: 'btn-icon', href: '#/', 'aria-label': 'Về bản đồ' }, '🏠'),
  );
}

export function starsText(n, max = 3) {
  return '★'.repeat(n) + '☆'.repeat(max - n);
}

// Lưới chấm giúp bé "nhìn thấy" phép tính.
export function dotArray(f) {
  const [rows, cols] = f.type === 'm' ? [f.b, f.a] : [f.b, f.answer];
  const caption = f.type === 'm'
    ? `${f.b} hàng, mỗi hàng ${f.a} chấm → ${f.answer} chấm`
    : `${f.a} chấm chia đều ${f.b} hàng → mỗi hàng ${f.answer} chấm`;
  const grid = h('div', { class: 'dots', style: `grid-template-columns: repeat(${cols}, 1fr)` });
  for (let i = 0; i < rows * cols; i++) grid.append(h('span', { style: `animation-delay:${i * 12}ms` }));
  return h('div', { class: 'dot-wrap' }, grid, h('p', { class: 'dot-caption' }, caption));
}

export function confetti(count = 40) {
  const layer = h('div', { class: 'confetti' });
  const bits = ['⭐', '🎉', '✨', '🌟', '🎈', '💖'];
  for (let i = 0; i < count; i++) {
    layer.append(h('span', {
      style: `left:${Math.random() * 100}%;animation-delay:${Math.random() * 0.6}s;animation-duration:${1.6 + Math.random() * 1.2}s;font-size:${18 + Math.random() * 22}px`,
    }, bits[i % bits.length]));
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 3200);
}

export function wait(ms) {
  return new Promise((resolve) => {
    const id = setTimeout(resolve, ms);
    onLeave(() => clearTimeout(id));
  });
}
