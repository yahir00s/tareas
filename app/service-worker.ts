/// <reference lib="webworker" />

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = "task-manager-cache-v1"
const OFFLINE_URL = "/offline"

// Add an event listener to the install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      // Cache the offline page and other essential assets
      await cache.addAll([
        OFFLINE_URL,
        "/",
        "/tasks",
        "/categories",
        "/reports",
        "/settings",
        "/manifest.json",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
      ])
    })(),
  )

  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable()
      }

      // Clean up old caches
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName)),
      )

      // Tell the active service worker to take control of the page immediately
      self.clients.claim()
    })(),
  )
})

// Fetch event: serve from cache if available, otherwise fetch from network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's supported
          const preloadResponse = await event.preloadResponse
          if (preloadResponse) {
            return preloadResponse
          }

          // Always try the network first
          const networkResponse = await fetch(event.request)
          return networkResponse
        } catch (error) {
          // If network fails, serve from cache
          const cache = await caches.open(CACHE_NAME)
          const cachedResponse = await cache.match(event.request)
          if (cachedResponse) {
            return cachedResponse
          }

          // If the requested resource is not in the cache, serve the offline page
          const offlineResponse = await cache.match(OFFLINE_URL)
          return offlineResponse
        }
      })(),
    )
  } else if (
    event.request.destination === "image" ||
    event.request.destination === "style" ||
    event.request.destination === "script"
  ) {
    // Use cache-first strategy for assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse
        }

        // Otherwise fetch from network and cache the response
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response as it can only be consumed once
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
      }),
    )
  } else {
    // For other requests, use network first, falling back to cache
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request)
      }),
    )
  }
})

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || "New Notification"
  const options = {
    body: data.body || "You have a new task reminder",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    data: {
      url: data.url || "/",
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus()
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url)
      }
    }),
  )
})

export {}
