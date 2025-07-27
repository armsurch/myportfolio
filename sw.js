// Service Worker for Portfolio
// Version 1.0.0

const CACHE_NAME = 'armstrong-portfolio-v1';
const urlsToCache = [
    '/',
    '/Index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/img/mine.jpg',
    '/img/mine.png',
    '/img/network.jpg',
    '/img/TP Link.png',
    '/img/Mikrotic.png',
    '/img/Professional ICT Portfolio Showcase.png',
    '/img/My.png',
    '/Pdf/Arms.pdf',
    '/Proposal.html',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
        .catch((error) => {
            console.error('Failed to cache resources:', error);
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // Return cached version or fetch from network
            if (response) {
                return response;
            }

            return fetch(event.request).then((response) => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                return response;
            });
        })
        .catch(() => {
            // Return offline page for navigation requests
            if (event.request.destination === 'document') {
                return caches.match('/Index.html');
            }
        })
    );
});

// Activate event - clean up old caches
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

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    try {
        // Get stored form data from IndexedDB
        const formData = await getStoredFormData();
        if (formData) {
            // Submit form data
            const response = await fetch('/submit-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Clear stored data on successful submission
                await clearStoredFormData();
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: '/img/mine.png',
        badge: '/img/mine.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [{
                action: 'explore',
                title: 'View Portfolio',
                icon: '/img/mine.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/img/mine.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Armstrong Portfolio', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper functions for IndexedDB operations
function getStoredFormData() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('PortfolioDB', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['formData'], 'readonly');
            const store = transaction.objectStore('formData');
            const getRequest = store.get('contactForm');

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore('formData');
        };
    });
}

function clearStoredFormData() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('PortfolioDB', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['formData'], 'readwrite');
            const store = transaction.objectStore('formData');
            const deleteRequest = store.delete('contactForm');

            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
        };
    });
}