import { ActionItem, ActionIcon, ActionLabel, ActionProps } from './common'
import { downloadOutline } from 'ionicons/icons'

type Props = {}

export const DownloadAction = ({ message, onSuccess }: ActionProps) => {


    const downloadFile = () => {

    }

    return (
        <ActionItem onClick={downloadFile}>
            <ActionIcon icon={downloadOutline} />
            <ActionLabel label='Download' />
        </ActionItem>
    )
}