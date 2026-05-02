const CACHE_NAME = "cuet-notes-maths-v2"; // 🔥 version change karte rehna

// App shell files
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./1.html",
  "./2.html",
  "./3.html",
  "./4.html",
  "./5.html",
  "./6.html",
  "./7.html",
  "./8.html",
  "./9.html",
  "./10.html",
  "./11.html",
  "./12.html",
  "./13.html",
  "./14.html",
  "./manifest.json"
];

// ✅ INSTALL
self.addEventListener("install", (event) => {
  console.log("SW: Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("SW: Caching core files");
      return cache.addAll(CORE_ASSETS);
    })
  );

  self.skipWaiting(); // 🔥 new SW immediately active
});

// ✅ ACTIVATE (delete old cache)
self.addEventListener("activate", (event) => {
  console.log("SW: Activated");

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim(); // 🔥 control all tabs
});

// ✅ FETCH (cache-first strategy)
self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {

      // 1️⃣ return cache if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2️⃣ fetch from network
      return fetch(event.request)
        .then((networkResponse) => {

          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });

        })
        .catch(() => {

          // 3️⃣ offline fallback
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }

        });

    })
  );
});
