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

    if (e.data) {
        let message = e.data.json();
        console.log('Push event! ', message);
        e.waitUntil(self.registration.showNotification(message.title, {
            body: message.body,
        }));
    }
});