import { UserContext } from "@/utils/auth/UserProvider"
import { urlB64ToUint8Array } from "@/utils/operations/operations"
import { IonToggle, IonLabel } from "@ionic/react"
import { useFrappeCreateDoc, useFrappeDeleteDoc, useFrappeGetDoc } from "frappe-react-sdk"
import { useContext, useState } from "react"

export const PushNotificationsToggle = () => {

    const { data, isLoading, error } = useFrappeGetDoc('Raven VAPID', 'Raven VAPID')

    const [subscribed, setSubscribed] = useState(false)

    const { createDoc } = useFrappeCreateDoc()

    const { deleteDoc } = useFrappeDeleteDoc()

    const { currentUser } = useContext(UserContext)

    console.log(navigator.serviceWorker.controller)

    const subscribeToPushNotifications = async () => {
        const registration = await navigator.serviceWorker.getRegistration()
        const subscribed = await registration?.pushManager.getSubscription()
        if (subscribed) {
            setSubscribed(true)
            console.info('User is already subscribed.')
            return;
        }
        const subscription = await registration?.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(data.public_key)
        })
        console.log(subscription)
        //save subscription details in frappe
        createDoc('Raven Push Subscription', {
            name: subscription?.endpoint?.split('/')?.pop()?.split(':')[0],
            user: currentUser,
            subscription_info: subscription?.toJSON(),
        }).then(() => {
            setSubscribed(true)
            console.info('Successfully subscribed to push notifications.')
        })
    }

    const unsubscribeFromPushNotifications = async () => {
        const registration = await navigator.serviceWorker.getRegistration()
        const subscription = await registration?.pushManager.getSubscription()
        // remove subscription from frappe
        const unsubscribed = await subscription?.unsubscribe();
        if (unsubscribed) {
            deleteDoc('Raven Push Subscription', subscription?.endpoint?.split('/')?.pop()?.split(':')[0]).then(() => {
                setSubscribed(false)
                console.info('Successfully unsubscribed from push notifications.')
            })
        }
    }

    const toggleNotifications = (checked: boolean) => {
        if (checked) {
            Notification.requestPermission().then((permission) => {
                switch (permission) {
                    case 'granted':
                        subscribeToPushNotifications()
                        break
                    case 'denied':
                        alert('You have denied notifications permission. Please enable it from your browser settings.')
                        break
                    default:
                        break
                }
            }
            )
        }
        else {
            unsubscribeFromPushNotifications()
        }
    }

    return (
        <div className="w-full">
            <IonToggle onIonChange={e => toggleNotifications(e.detail.checked)} disabled={Notification.permission != 'granted'} checked={subscribed} >Receive Push Notifications</IonToggle>
            {Notification.permission == 'denied' && <IonLabel className="ion-text-wrap font-light text-gray-500">You have denied notifications permission. Please enable it from your browser settings.</IonLabel>}
        </div>
    )
}