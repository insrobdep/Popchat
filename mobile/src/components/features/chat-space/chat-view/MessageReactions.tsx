import { useGetUserRecords } from "@/hooks/useGetUserRecords"
import { UserContext } from "@/utils/auth/UserProvider"
import { getUsers } from "@/utils/operations/operations"
import { IonButton } from "@ionic/react"
import { useFrappePostCall } from "frappe-react-sdk"
import { useCallback, useContext, useMemo } from "react"

interface ReactionObject {
    reaction: string,
    users: string[],
    count: number
}

export interface MessageReactionsProps {
    messageID: string,
    message_reactions?: string | null,
    updateMessages: VoidFunction
}

export const MessageReactions = ({ messageID, message_reactions, updateMessages }: MessageReactionsProps) => {

    const { currentUser } = useContext(UserContext)

    const { call: reactToMessage } = useFrappePostCall('raven.api.reactions.react')

    const saveReaction = useCallback((emoji: string) => {
        if (messageID) {
            return reactToMessage({
                message_id: messageID,
                reaction: emoji
            })
                .then(() => updateMessages())
        }
    }, [messageID, updateMessages, reactToMessage])

    const allUsers = useGetUserRecords()

    const reactions: ReactionObject[] = useMemo(() => {
        const parsed_json = JSON.parse(message_reactions ?? '{}') as Record<string, ReactionObject>
        return Object.values(parsed_json)
    }, [message_reactions])

    return (
        <>
            {reactions.map((reaction) => {
                return (
                    <ReactionButton
                        key={reaction.reaction}
                        reaction={reaction}
                        onReactionClick={saveReaction}
                        currentUser={currentUser}
                        allUsers={allUsers}
                    />
                )
            })}
        </>
    )
}


interface ReactionButtonProps {
    reaction: ReactionObject,
    onReactionClick: (e: string) => void,
    currentUser: string,
    allUsers: Record<string, any>
}

export const ReactionButton = ({ reaction, onReactionClick, currentUser, allUsers }: ReactionButtonProps) => {

    const { reaction: emoji, users, count } = reaction

    const onClick = useCallback(() => {
        console.log('clicked')
        onReactionClick(emoji)
    }, [onReactionClick, emoji])

    const { label, currentUserReacted } = useMemo(() => {
        return {
            label: `${getUsers(users, count, currentUser, allUsers)} reacted with ${emoji}`,
            currentUserReacted: users.includes(currentUser)
        }
    }, [allUsers, count, currentUser, reaction, users])

    return (
        <IonButton
            title={label}
            key={reaction.reaction}
            onClick={onClick}
            fill={'solid'}
            color={currentUserReacted ? 'medium' : 'light'}
            size='small'
        >
            {emoji} {reaction.count}
        </IonButton>
    )
}