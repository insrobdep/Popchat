import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', function (e) {
    console.log('push event')
    if (!(
        self.Notification &&
        self.Notification.permission === 'granted'
    )) {
        //notifications aren't supported or permission not granted!
        console.log('nononono')
        return;
    }

    console.log(self.Notification.permission)

    if (e.data) {
        let message = e.data.json();
        console.log('Push event! ', message);
        // const notification = new self.Notification("To do list", { body: "Hello world" });
        // notification.
        e.waitUntil(self.registration.showNotification(message.title, {
            body: message.body,
        }));
    }
});