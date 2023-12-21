import { AllowNotificationsAlert, PushNotificationsToggle } from "@/components/features/notifications";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList, IonButton, IonFooter } from "@ionic/react"

export const Notifications = () => {

    const isIPhone = navigator.userAgent.includes('iPhone')

    return (
        <IonPage>
            <IonHeader translucent>
                <IonToolbar>
                    <IonTitle>Notifications</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    <IonItem>
                        <PushNotificationsToggle />
                    </IonItem>
                </IonList>
                <AllowNotificationsAlert />
                {Notification.permission}
            </IonContent>
            <IonFooter>
                {Notification.permission == 'default' && !isIPhone && <IonButton className="justify-center" id='allow-notifications'>Allow Notifications</IonButton>}
            </IonFooter>
        </IonPage>
    )
}