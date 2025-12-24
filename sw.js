const CACHE_NAME = 'fmk-portal-v4';
const urlsToCache = [
    '.',
    'index.html',
    'manifest.json',
    'logo.svg',
    'buxgalteriya_trenajyor/index.html',
    'buxgalteriya_simulyator/index.html',
    'kassa_tizimi/index.html',
    'bank_tizimi/index.html',
    'ombor_tizimi/index.html',
    'ombor_tizimi_aveco/index.html',
    'kadrlar/index.html',
    'tabel/index.html',
    'xizmat_safari/index.html',
    'asosiy_vositalar/index.html',
    'nomoddiy_aktivlar/index.html',
    'debitorlar/index.html',
    'kreditorlar/index.html',
    'ishlab_chiqarish/index.html',
    'soliq/index.html',
    'buxgalteriya/index.html',
    'korxona_profili/index.html',
    'AMALIY_VAZIFALAR.html'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
