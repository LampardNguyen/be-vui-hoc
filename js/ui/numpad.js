// Bàn phím số to, tự vẽ (không bật bàn phím của iPad). Hỗ trợ cả bàn phím máy tính.
import { h, onLeave } from './widgets.js';
import { play } from '../sound.js';

export function numpad({ onChange, onSubmit, max = 3 }) {
  let value = '';
  let enabled = true;

  const set = (v) => { value = v; onChange(value); };
  const press = (k) => {
    if (!enabled) return;
    play('tap');
    if (k === '⌫') set(value.slice(0, -1));
    else if (k === 'OK') { if (value) onSubmit(value); }
    else if (value.length < max) set(value === '0' ? k : value + k);
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'];
  const el = h('div', { class: 'numpad' },
    keys.map((k) => h('button', {
      class: k === 'OK' ? 'key key-ok' : k === '⌫' ? 'key key-del' : 'key',
      onpointerdown: (e) => { e.preventDefault(); press(k); },
    }, k === 'OK' ? '✓' : k)));

  const onKey = (e) => {
    if (/^[0-9]$/.test(e.key)) press(e.key);
    else if (e.key === 'Backspace') press('⌫');
    else if (e.key === 'Enter') press('OK');
  };
  document.addEventListener('keydown', onKey);
  onLeave(() => document.removeEventListener('keydown', onKey));

  return {
    el,
    clear() { set(''); },
    setEnabled(v) { enabled = v; el.classList.toggle('disabled', !v); },
  };
}
