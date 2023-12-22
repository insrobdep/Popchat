import { IonAlert } from "@ionic/react"

export const AllowNotificationsAlert = () => {

    const getNotificationsPermission = () => {
        Notification.requestPermission().then((permission) => {
            if (permission === 'denied') {
                alert('You have denied notifications permission. Please enable it from your browser settings.')
            }
        })
    }

    return (
        <IonAlert
            isOpen={Notification.permission == 'default'}
            header={'Allow Notifications?'}
            trigger='allow-notifications'
            message={'Please allow notifications permission to be able to receive push notifications.'}
            buttons={[
                {
                    text: 'Don\'t Allow',
                    role: 'cancel',
                }
                , {
                    text: 'Allow',
                    role: 'confirm',
                    handler: getNotificationsPermission
                }
            ]}
        />
    )
}