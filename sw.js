const CACHE_NAME = 'pathfinder-lk-v3';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/careers.html',
  '/career-details.html',
  '/quiz.html',
  '/roadmaps.html',
  '/resources.html',
  '/contact.html',
  '/manifest.json',
  '/css/style.css',
  '/css/components.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/careers.js',
  '/js/quiz.js',
  '/js/roadmaps.js',
  '/js/resources.js',
  '/assets/icons/logo.svg',
  '/assets/images/photos/hero-campus.jpg',
  '/assets/images/careers/software-engineer.svg',
  '/assets/images/careers/fullstack-developer.svg',
  '/assets/images/careers/cloud-devops.svg',
  '/assets/images/careers/data-analyst.svg',
  '/assets/images/careers/data-engineer.svg',
  '/assets/images/careers/data-scientist.svg',
  '/assets/images/careers/cybersecurity.svg',
  '/assets/images/careers/ui-ux.svg',
  '/assets/images/careers/qa-engineer.svg',
  '/assets/images/careers/business-analyst.svg',
  '/assets/images/careers/product-manager.svg',
  '/assets/images/careers/digital-marketing.svg',
  '/assets/images/careers/financial-analyst.svg',
  '/assets/images/careers/multimedia-designer.svg',
  '/assets/images/careers/robotics-iot.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html')))
  );
});
