// Cho phép mở trang khi không có mạng. Đổi VERSION mỗi lần cập nhật để máy tải bản mới.
const VERSION = 'v9';
const CACHE = `cuu-chuong-${VERSION}`;
const FILES = [
  './',
  // Giọng đọc ghi sẵn: số 0–100 và "nhân", "chia", "bằng".
  ...[...Array(101).keys(), 'nhan', 'chia', 'bang'].map((k) => `./audio/vi/${k}.m4a`),
  './css/style.css',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './index.html',
  './js/app.js',
  './js/facts.js',
  './js/games/balloon.js',
  './js/games/boss.js',
  './js/games/common.js',
  './js/games/index.js',
  './js/games/memory.js',
  './js/games/sprint.js',
  './js/leitner.js',
  './js/screens/games.js',
  './js/screens/home.js',
  './js/screens/learn.js',
  './js/screens/parent.js',
  './js/screens/practice.js',
  './js/screens/rewards.js',
  './js/sound.js',
  './js/speech.js',
  './js/storage.js',
  './js/ui/numpad.js',
  './js/ui/widgets.js',
  './manifest.webmanifest',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Trả bản trong cache ngay cho nhanh, đồng thời tải bản mới về cho lần sau.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async (cache) => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const fresh = fetch(e.request).then((res) => {
      if (res.ok || res.type === 'opaque') cache.put(e.request, res.clone());
      return res;
    }).catch(() => cached);
    return cached || fresh;
  }));
});
