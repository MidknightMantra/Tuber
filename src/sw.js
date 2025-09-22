// sw.js — Service Worker for offline caching

const CACHE_NAME = 'tuber-v1';
const urlsToCache = [
  '/',
  '/css/style.css',
  '/js/script.js',
  'https://i.ytimg.com/vi/default/mqdefault.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});