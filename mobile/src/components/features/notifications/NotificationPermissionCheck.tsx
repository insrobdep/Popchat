import { IonButton } from "@ionic/react"
import { AllowNotificationsAlert } from "."

export const NotificationPermissionCheck = () => {
    if (Notification?.permission != 'granted')
        return (
            Notification?.permission == 'denied' ?
                <div key='error' className="ion-margin bg-zinc-900 border-l-4 border-red-500 p-4" role="alert">
                    <p className="font-bold text-red-400">
                        You have denied notifications permission. Please enable it from your browser settings.
                    </p>
                </div>
                :
                <>
                    <AllowNotificationsAlert />
                    <IonButton className="justify-center" id='allow-notifications'>Allow Notifications</IonButton>
                </>
        )
}