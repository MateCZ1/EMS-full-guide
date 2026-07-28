const SCOPE_PATH = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const CACHE_NAMESPACE = `field-guide:${SCOPE_PATH || "/"}`;
const CACHE_NAME = `${CACHE_NAMESPACE}:v4`;
const scopedPath = (path) => `${SCOPE_PATH}${path}`;
const APP_SHELL = [
  scopedPath("/"),
  scopedPath("/manifest.webmanifest"),
  scopedPath("/favicon.svg"),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) =>
                name !== CACHE_NAME &&
                (name.startsWith(`${CACHE_NAMESPACE}:`) ||
                  (SCOPE_PATH === "" && name.startsWith("field-guide-v"))),
            )
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(scopedPath("/"), copy));
          }
          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(request)) ??
            (await caches.match(scopedPath("/"))) ??
            Response.error()
          );
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
