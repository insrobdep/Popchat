import { Button, Tooltip } from "@chakra-ui/react"
import { useCallback } from "react"

interface EmojiButtonProps {
    emoji: string,
    label: string,
    onClick?: (emoji: string) => void
}

export const EmojiButton = ({ emoji, label, onClick }: EmojiButtonProps) => {

    const onEmojiClick = useCallback(() => {
        onClick && onClick(emoji)
    }, [emoji, onClick])
    return (
        <Tooltip hasArrow label={label} size='xs' placement='top' rounded='md'>
            <Button size='xs' fontSize='md' onClick={onEmojiClick}>
                {emoji}
            </Button>
        </Tooltip>
    )
}