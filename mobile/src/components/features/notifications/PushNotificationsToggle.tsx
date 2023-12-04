import { urlB64ToUint8Array } from "@/utils/operations/operations"
import { IonToggle, IonLabel } from "@ionic/react"
import { useFrappeGetDoc } from "frappe-react-sdk"

export const PushNotificationsToggle = () => {

    const { data, isLoading, error } = useFrappeGetDoc('Raven VAPID', 'Raven VAPID')

    console.log(data)

    const subscribeToPushNotifications = async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscribed = await registration?.pushManager.getSubscription();
        if (subscribed) {
            console.info('User is already subscribed.');
            return;
        }
        const subscription = await registration?.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(data.public_key)
        })
        console.log(subscription)
        //save subscription details in frappe
    }

    const unsubscribeFromPushNotifications = async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration?.pushManager.getSubscription();
        // remove subscription from frappe
        const unsubscribed = await subscription?.unsubscribe();
        if (unsubscribed) {
            console.info('Successfully unsubscribed from push notifications.');
        }
    }

    const toggleNotifications = (checked: boolean) => {
        if (checked) {
            if (Notification.permission == 'granted') {
                subscribeToPushNotifications()
            }
            else {
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        subscribeToPushNotifications()
                    } else if (permission === 'denied') {
                        unsubscribeFromPushNotifications()
                        alert('You have denied notifications permission. Please enable it from your browser settings.')
                    }
                    else {
                        unsubscribeFromPushNotifications()
                    }
                }
                )
            }
        }
        else {
            unsubscribeFromPushNotifications()
        }
    }

    return (
        <div className="w-full">
            <IonToggle onIonChange={e => toggleNotifications(e.detail.checked)} disabled={Notification.permission != 'granted'} >Receive Push Notifications</IonToggle>
            {Notification.permission == 'denied' && <IonLabel className="ion-text-wrap font-light text-gray-500">You have denied notifications permission. Please enable it from your browser settings.</IonLabel>}
        </div>
    )
}