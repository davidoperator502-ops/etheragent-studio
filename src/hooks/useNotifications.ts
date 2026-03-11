import { useState, useEffect } from 'react';

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }

        // Registrar el SW automáticamente al cargar
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('🛡️ Service Worker activo:', reg.scope))
                .catch(err => console.error('❌ Error SW:', err));
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) return false;

        const res = await Notification.requestPermission();
        setPermission(res);

        if (res === 'granted') {
            new Notification("EtherAgent OS", {
                body: "Enlace de notificaciones establecido. Bienvenida, Davicho.",
                icon: "/icon-192x192.png" // Asegúrate de tener este icono en public/, o se ignorará.
            });
        }
        return res === 'granted';
    };

    return { permission, requestPermission };
}
