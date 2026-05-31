// Nombre del caché para la versión actual de Mercado Manu (Actualizado a v8 para refresco forzado)
const CACHE_NAME = 'mercado-manu-v8';

// Archivos esenciales que se guardarán para que la app funcione sin internet
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Evento de instalación: guarda los archivos en el caché del teléfono
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Evento de activación: limpia versiones viejas de caché para evitar conflictos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento fetch: intercepta las peticiones y sirve la app desde el caché si no hay internet
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones externas como la API del BCV para que no rompa el caché local
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
  }
});
