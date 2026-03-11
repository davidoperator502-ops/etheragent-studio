// public/sw.js
self.addEventListener('push', function (event) {
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { body: event.data.text() };
        }
    } else {
        data = {
            title: 'EtherAgent OS',
            body: 'Nueva actualización de telemetría recibida.',
            icon: '/icon-192x192.png'
        };
    }

    const options = {
        body: data.body || 'Alerta de sistema recibida.',
        icon: data.icon || '/icon-192x192.png',
        badge: '/badge.png', // Icono pequeño para la barra de estado
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40], // Patrón táctico
        tag: 'deployment-alert',
        renotify: true, // Hace que el móvil vibre de nuevo si llega otra
        data: {
            url: data.url || '/'
        },
        actions: [
            { action: 'open', title: 'Ver en Nexus' },
            { action: 'close', title: 'Ignorar' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Alerta Nexus', options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
