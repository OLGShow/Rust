/**
 * Service Worker для RUST Store
 * Кеширование ресурсов и оффлайн функциональность
 */

const CACHE_NAME = 'rust-store-v1.0';
const STATIC_CACHE_NAME = 'rust-store-static-v1.0';
const DYNAMIC_CACHE_NAME = 'rust-store-dynamic-v1.0';

// Ресурсы для кеширования
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/src/App.css',
  '/src/App.jsx',
  '/src/main.jsx'
];

// Ресурсы для динамического кеширования
const CACHE_WHITELIST = [
  'https://api.steampowered.com/',
  'https://steamcommunity.com/',
  '/api/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Кеширование статических ресурсов
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Принудительная активация нового SW
      self.skipWaiting()
    ])
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Очистка старых кешей
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Захват всех клиентов
      self.clients.claim()
    ])
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Обработка различных типов запросов
  if (request.method === 'GET') {
    // Статические ресурсы
    if (STATIC_ASSETS.includes(url.pathname)) {
      event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    }
    // API запросы
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    }
    // Изображения
    else if (request.destination === 'image') {
      event.respondWith(cacheFirst(request, DYNAMIC_CACHE_NAME));
    }
    // Шрифты
    else if (request.destination === 'font') {
      event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    }
    // Внешние ресурсы из whitelist
    else if (CACHE_WHITELIST.some(domain => request.url.includes(domain))) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    }
    // Все остальные запросы
    else {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    }
  }
});

// Стратегия "Кеш сначала"
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Обновляем кеш в фоне
      fetchAndCache(request, cacheName);
      return cachedResponse;
    }
    
    // Если нет в кеше, запрашиваем из сети
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache first failed:', error);
    return createErrorResponse();
  }
}

// Стратегия "Сеть сначала"
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return createErrorResponse();
  }
}

// Фоновое обновление кеша
async function fetchAndCache(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    console.log('Background fetch failed:', error);
  }
}

// Создание ответа об ошибке
function createErrorResponse() {
  return new Response(
    JSON.stringify({
      error: 'Network unavailable',
      message: 'Please check your internet connection'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  const { action, data } = event.data;
  
  switch (action) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ size });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearCache(data.cacheName).then(success => {
        event.ports[0].postMessage({ success });
      });
      break;
      
    case 'PRELOAD_ROUTES':
      preloadRoutes(data.routes);
      break;
  }
});

// Получение размера кеша
async function getCacheSize() {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Failed to calculate cache size:', error);
    return 0;
  }
}

// Очистка кеша
async function clearCache(cacheName) {
  try {
    if (cacheName) {
      return await caches.delete(cacheName);
    } else {
      const cacheNames = await caches.keys();
      const deletePromises = cacheNames.map(name => caches.delete(name));
      await Promise.all(deletePromises);
      return true;
    }
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
}

// Предзагрузка маршрутов
async function preloadRoutes(routes) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const fetchPromises = routes.map(route => {
      return fetch(route).then(response => {
        if (response.ok) {
          return cache.put(route, response);
        }
      }).catch(error => {
        console.log(`Failed to preload ${route}:`, error);
      });
    });
    
    await Promise.all(fetchPromises);
    console.log('Routes preloaded successfully');
  } catch (error) {
    console.error('Failed to preload routes:', error);
  }
}

// Периодическая очистка старого кеша
setInterval(async () => {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const keys = await cache.keys();
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 часа
    
    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const dateHeader = response.headers.get('date');
        const cacheTime = dateHeader ? new Date(dateHeader).getTime() : 0;
        
        if (now - cacheTime > maxAge) {
          await cache.delete(request);
          console.log('Deleted old cache entry:', request.url);
        }
      }
    }
  } catch (error) {
    console.error('Failed to clean old cache:', error);
  }
}, 60 * 60 * 1000); // Каждый час

// Синхронизация в фоне
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Отправка отложенных аналитических данных
    const analyticsData = await getStoredAnalytics();
    if (analyticsData.length > 0) {
      await sendAnalytics(analyticsData);
      await clearStoredAnalytics();
    }
    
    // Синхронизация корзины
    await syncCart();
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Получение сохраненной аналитики
async function getStoredAnalytics() {
  // В реальном приложении здесь был бы IndexedDB
  return [];
}

// Отправка аналитики
async function sendAnalytics(data) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Failed to send analytics:', error);
  }
}

// Очистка сохраненной аналитики
async function clearStoredAnalytics() {
  // Очистка IndexedDB
}

// Синхронизация корзины
async function syncCart() {
  try {
    const cartData = localStorage.getItem('cart_items');
    if (cartData) {
      await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: cartData
      });
    }
  } catch (error) {
    console.error('Failed to sync cart:', error);
  }
}

// Push уведомления
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Открыть',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Закрыть',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Обработка нажатий на уведомления
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const url = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Ищем открытую вкладку
      for (let client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Открываем новую вкладку
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

console.log('Service Worker: Loaded successfully'); 