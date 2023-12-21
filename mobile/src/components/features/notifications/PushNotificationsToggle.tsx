import { ErrorBanner } from "@/components/layout"
import { UserContext } from "@/utils/auth/UserProvider"
import { urlB64ToUint8Array } from "@/utils/operations/operations"
import { IonToggle, IonLabel } from "@ionic/react"
import { useFrappeCreateDoc, useFrappeDeleteDoc, useFrappeGetDoc } from "frappe-react-sdk"
import { useContext, useEffect, useState } from "react"

export const PushNotificationsToggle = () => {

    const { data, isLoading, error } = useFrappeGetDoc('Raven VAPID', 'Raven VAPID')

    const [subscription, setSubscription] = useState<PushSubscription | null>(null)

    const { createDoc } = useFrappeCreateDoc()

    const { deleteDoc } = useFrappeDeleteDoc()

    const { currentUser } = useContext(UserContext)

    useEffect(() => {
        getPushSubscriptionStatus().then((subscription) => {
            if (subscription) {
                setSubscription(subscription)
            }
        })
    }, [])

    const getPushSubscriptionStatus = async () => {
        const registration = await navigator.serviceWorker.getRegistration()
        const subscription = await registration?.pushManager.getSubscription()
        return subscription
    }

    const subscribeToPushNotifications = async () => {

        if (subscription) {
            console.info('User is already subscribed.')
            return
        }

        const registration = await navigator.serviceWorker.getRegistration('/assets/raven/raven_mobile/')
        const newSubscription = await registration?.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(data.public_key)
        })
        console.log(newSubscription)
        //save subscription details in frappe
        createDoc('Raven Push Subscription', {
            name: newSubscription?.endpoint?.split('/')?.pop()?.split(':')[0],
            user: currentUser,
            subscription_info: newSubscription?.toJSON(),
        }).then(() => {
            if (newSubscription)
                setSubscription(newSubscription)
            console.info('Successfully subscribed to push notifications.')
        })
    }

    const isIPhone = navigator.userAgent.includes('iPhone')

    const unsubscribeFromPushNotifications = async () => {

        // remove subscription from frappe
        const unsubscribed = await subscription?.unsubscribe();
        if (unsubscribed) {
            deleteDoc('Raven Push Subscription', subscription?.endpoint?.split('/')?.pop()?.split(':')[0]).then(() => {
                setSubscription(null)
                console.info('Successfully unsubscribed from push notifications.')
            })
        }
    }

    const toggleNotifications = (checked: boolean) => {
        if (checked) {
            if (!isIPhone) {
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
                })
            }
            else {
                subscribeToPushNotifications()
            }
        }
        else {
            unsubscribeFromPushNotifications()
        }
    }

    return (
        <div className="w-full">
            <IonToggle onIonChange={e => toggleNotifications(e.detail.checked)}
                disabled={(Notification.permission != 'granted' && !isIPhone) || isLoading || !!error}
                checked={!!subscription} >
                Receive Push Notifications
            </IonToggle>
            {Notification.permission == 'denied' && !isIPhone && <IonLabel className="ion-text-wrap font-light text-gray-500">You have denied notifications permission. Please enable it from your browser settings.</IonLabel>}
            {error && <ErrorBanner error={error} />}
        </div>
    )
}