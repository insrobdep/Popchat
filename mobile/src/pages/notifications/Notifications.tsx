import { PushNotificationsToggle, IOSRequirementsError, NotificationPermissionCheck } from "@/components/features/notifications"
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList, IonFooter } from "@ionic/react"
import { useDeviceInfo } from "@/hooks/useDeviceInfo";

export const Notifications = () => {

    const deviceInfo = useDeviceInfo()

    const isIPhone = deviceInfo?.operatingSystem === "ios" && deviceInfo.manufacturer == "Apple Computer, Inc."
    const isNotificationSupported = !!(window.Notification)

    return (
        <IonPage>
            <IonHeader translucent>
                <IonToolbar>
                    <IonTitle>Notifications</IonTitle>
                </IonToolbar>
            </IonHeader>
            {
                isNotificationSupported ?
                    <>
                        <IonContent fullscreen>
                            <IonList>
                                <IonItem>
                                    <PushNotificationsToggle />
                                </IonItem>
                            </IonList>
                        </IonContent>
                        <IonFooter>
                            <NotificationPermissionCheck />
                        </IonFooter>
                    </>
                    :
                    (
                        deviceInfo && isIPhone &&
                        <IOSRequirementsError info={deviceInfo} />
                    )
            }
        </IonPage>
    )
}