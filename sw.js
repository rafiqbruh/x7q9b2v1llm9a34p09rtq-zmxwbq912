const CACHE_NAME = '3d-viewer-local-v2';

// Complete list of local app files and 3D assets to store offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './face.html',
  './accessories.html',
  './rc20.html',
  './rc24.html',
  './audio-manager.js',
  './js/three.min.js',
  './js/OrbitControls.js',
  './js/OBJLoader.js',
  
  // All assets matching your assets directory exact case-sensitivity
  './assets/ACCESSORIES.png',
  './assets/bat.obj',
  './assets/batsman_full.obj',
  './assets/batsman_half.obj',
  './assets/cap.obj',
  './assets/click.mp3',
  './assets/cbg.png',
  './assets/face.obj',
  './assets/FACE.png',
  './assets/fielder_full.obj',
  './assets/fielder_half.obj',
  './assets/helmet.obj',
  './assets/keeper.obj',
  './assets/RC20.png',
  './assets/rc24.obj',
  './assets/RC24.png',
  './assets/stump.obj',
  './assets/umpire.obj'
];

// Install Event: Fetch and cache every local asset individually
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachePromises = ASSETS_TO_CACHE.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
          } else {
            console.warn(`[SW] Skipping missing file (${response.status}): ${url}`);
          }
        } catch (err) {
          console.error(`[SW] Offline Cache Error for ${url}:`, err);
        }
      });
      await Promise.allSettled(cachePromises);
    })
  );
  self.skipWaiting();
});

// Activate Event: Delete old legacy cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Cache-First strategy for offline availability
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
