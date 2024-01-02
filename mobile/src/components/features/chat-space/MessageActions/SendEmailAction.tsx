import { mailOpenOutline } from 'ionicons/icons'
import React, { useState } from 'react'
import { ActionIcon, ActionItem, ActionLabel, ActionProps } from './common'
import { MessageEmailDrawer } from './MessageEmailDrawer'

export const SendEmailAction = ({ message, onSuccess }: ActionProps) => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <ActionItem onClick={() => setIsOpen(true)} >
            <ActionIcon icon={mailOpenOutline} />
            <ActionLabel label='Send as email' />
            <MessageEmailDrawer
                isOpen={isOpen}
                onDismiss={() => setIsOpen(false)}
                message={message}
                onSuccess={onSuccess}
            />
        </ActionItem>
    )
}

