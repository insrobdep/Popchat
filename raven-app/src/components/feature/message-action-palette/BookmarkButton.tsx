import { IconButton, Tooltip } from '@chakra-ui/react'
import { useFrappePostCall } from 'frappe-react-sdk'
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5'
import { Message } from '../../../../../types/Messaging/Message'
import { useCallback, useContext, useMemo } from 'react'
import { UserContext } from '@/utils/auth/UserProvider'

interface BookmarkButtonProps {
    message: Message,
    updateMessages: () => void
}

export const BookmarkButton = ({ message, updateMessages }: BookmarkButtonProps) => {

    const { currentUser } = useContext(UserContext)
    const { call } = useFrappePostCall('frappe.desk.like.toggle_like')

    const handleLike = useCallback((value: string) => {
        call({
            doctype: 'Raven Message',
            name: message.name,
            add: value
        }).then((r) => updateMessages())
    }, [updateMessages, call, message])

    const isLiked = useMemo(() => {
        const likedBy = message._liked_by
        return JSON.parse(likedBy ?? '[]')?.length > 0 && JSON.parse(likedBy ?? '[]')?.includes(currentUser)
    }, [message._liked_by, currentUser])

    return (
        <Tooltip hasArrow label={isLiked ? 'unsave' : 'save'} size='xs' placement='top' rounded='md'>
            <IconButton
                aria-label="save message"
                icon={isLiked ? <IoBookmark fontSize={'0.8rem'} /> : <IoBookmarkOutline fontSize={'0.8rem'} />}
                size='xs'
                onClick={() => handleLike(isLiked ? 'No' : 'Yes')} />
        </Tooltip>
    )
}