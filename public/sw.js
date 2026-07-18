const CACHE_VERSION = 'v1';
const STATIC_CACHE = `aeroturbine-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `aeroturbine-dynamic-${CACHE_VERSION}`;

const MAX_CACHE_ENTRIES = 100;
const CACHE_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxEntries);
  }
}

async function expireCacheEntries(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const header = response.headers.get('sw-fetched-at');
      if (header) {
        const fetchedAt = parseInt(header, 10);
        if (Date.now() - fetchedAt > CACHE_EXPIRATION_MS) {
          await cache.delete(request);
        }
      }
    }
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;
  if (request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const cloned = response.clone();
        const cacheName = request.url.includes('/_next/static/')
          ? STATIC_CACHE
          : DYNAMIC_CACHE;

        caches.open(cacheName).then(async (cache) => {
          const timestamped = new Response(cloned.body, {
            status: cloned.status,
            statusText: cloned.statusText,
            headers: cloned.headers,
          });
          timestamped.headers.set('sw-fetched-at', Date.now().toString());
          await cache.put(request, timestamped);
          await trimCache(cacheName, MAX_CACHE_ENTRIES);
          await expireCacheEntries(cacheName);
        });

        return response;
      });
    }).catch(() => {
      return caches.match('/offline');
    })
  );
});
