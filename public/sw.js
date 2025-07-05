/**
 * Service Worker для RUST Store - упрощенная версия для разработки
 * Кеширование ресурсов и оффлайн функциональность
 */

const CACHE_NAME = 'rust-store-v1.0';

// Минимальные ресурсы для кеширования
const STATIC_ASSETS = [
  '/',
  '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов - простая версия
self.addEventListener('fetch', (event) => {
  // Пропускаем все запросы для простоты во время разработки
  return;
});

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  const { action } = event.data;
  
  switch (action) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
  }
});

console.log('Service Worker loaded successfully'); 