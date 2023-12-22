import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { Device } from '@capacitor/device'

export interface DeviceInfo {
    isVirtual: boolean
    manufacturer: string
    model: string
    operatingSystem: string
    osVersion: string
    platform: string
    webViewVersion: string
}

const DeviceInfoContext = createContext<DeviceInfo | null>(null)

export const DeviceInfoProvider = ({ children }: PropsWithChildren) => {
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

    useEffect(() => {
        const fetchDeviceInfo = async () => {
            const device = await Device.getInfo()
            setDeviceInfo({
                isVirtual: device.isVirtual,
                manufacturer: device.manufacturer,
                model: device.model,
                operatingSystem: device.operatingSystem,
                osVersion: device.osVersion,
                platform: device.platform,
                webViewVersion: device.webViewVersion
            })
        }

        fetchDeviceInfo()
    }, [])

    return (
        <DeviceInfoContext.Provider value={deviceInfo}>
            {children}
        </DeviceInfoContext.Provider>
    )
}

export const useDeviceInfo = (): DeviceInfo | null => {
    return useContext(DeviceInfoContext)
}