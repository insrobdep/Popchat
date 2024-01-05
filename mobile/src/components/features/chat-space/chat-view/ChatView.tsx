import { IonList } from '@ionic/react'
import { createContext } from 'react'
import { DateBlock, MessageBlock } from '../../../../../../types/Messaging/Message'
import { ChannelMembersMap } from '../ChatInterface'
import { DateSeparator } from './DateSeparator'
import { MessageBlockItem } from './MessageBlock'

type ChatViewProps = {
    messages: (DateBlock | MessageBlock)[],
    members: ChannelMembersMap,
    onMessageSelected: (message: MessageBlock) => void
    refreshMessages: VoidFunction
}

export const ChannelMembersContext = createContext<ChannelMembersMap>({})
export const ChatView = ({ messages, members, onMessageSelected, refreshMessages }: ChatViewProps) => {

    /** The ChatHistory component renders all the messages in the Chat.
     * It receives a messages array - which consists of two blocks: a Date Block (to show a date separator) and a Message Block (to show a message)
     */

    return (
        <ChannelMembersContext.Provider value={members}>
            <IonList lines='none' className='flex flex-col'>
                {messages.map((message: DateBlock | MessageBlock) => {
                    if (message.block_type === "date") {
                        return <DateSeparator key={message.data} date={message.data} />
                    }
                    if (message.block_type === "message")
                        return (
                            <MessageBlockItem key={message.data.name} message={message} onMessageSelect={onMessageSelected} refreshMessages={refreshMessages} />
                        )
                }
                )}
            </IonList>
        </ChannelMembersContext.Provider>
    )
}