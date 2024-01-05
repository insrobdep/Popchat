import { DeviceInfo } from "@/hooks/useDeviceInfo"

function minVersionCheck(
    versionString: string,
    majorVersion: number,
    minorVersion: number
) {
    const [osMajorVersion, osMinorVersion] = versionString.split(".")
    if (
        Number(osMajorVersion) < majorVersion ||
        (Number(osMajorVersion) === majorVersion &&
            Number(osMinorVersion) < minorVersion)
    ) {
        return false
    } else {
        return true
    }
}

export const IOSRequirementsError = ({ info }: { info: DeviceInfo }) => {
    if (minVersionCheck(info.osVersion.toString(), 16, 5)) {
        if (info.platform == 'web') return (
            <div key='error' className="ion-margin bg-zinc-900 border-l-4 border-red-500 p-4" role="alert">
                <p className="font-bold text-red-400">
                    Please add Raven to your home screen to enable push notifications.
                </p>
            </div>
        )
    } else {
        return (
            <div key='error' className="ion-margin bg-zinc-900 border-l-4 border-red-500 p-4" role="alert">
                <p className="font-bold text-red-400">
                    Raven requires iOS 16.5 or later to enable push notifications. Please update your iOS version.
                </p>
            </div>
        )
    }
}