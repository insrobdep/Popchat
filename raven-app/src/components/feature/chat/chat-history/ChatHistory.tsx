import { Box, useColorMode } from "@chakra-ui/react";
import { DividerWithText } from "../../../layout/Divider/DividerWithText";
import { DateObjectToFormattedDateString } from "../../../../utils/operations";
import { DateBlock, FileMessage, Message, MessageBlock, MessagesWithDate } from "../../../../../../types/Messaging/Message";
import { ChannelHistoryFirstMessage } from "../../../layout/EmptyState/EmptyState";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChatMessageBox } from "../chat-message/ChatMessageBox";
import { MarkdownRenderer } from "../../markdown-viewer/MarkdownRenderer";
import { FileMessageBlock } from "../chat-message/FileMessage";
import { ModalTypes, useModalManager } from "../../../../hooks/useModalManager";
import { FilePreviewModal } from "../../file-preview/FilePreviewModal";
import { scrollbarStyles } from "../../../../styles";
import { ChannelListItem, DMChannelListItem } from "@/utils/channel/ChannelListProvider";
import { useScrollToLocation } from "@/hooks/useScrollToLocation";

interface MessageItemProps {
    block: DateBlock | MessageBlock,
    handleScroll: (newState: boolean) => void,
    replyToMessage?: (message: Message) => void,
    channelData: ChannelListItem | DMChannelListItem,
    onFilePreviewModalOpen: (message: Partial<FileMessage>) => void
}
const MessageItem = ({ block, handleScroll, replyToMessage, channelData, onFilePreviewModalOpen }: MessageItemProps) => {

    if (block.block_type === 'date') {
        return (
            <Box p={4} key={block.data} zIndex={1} position={'relative'}>
                <DividerWithText>{DateObjectToFormattedDateString(new Date(block.data))}</DividerWithText>
            </Box>
        )
    }
    if (block.block_type === 'message') {
        return (
            <ChatMessageBox
                message={block.data}
                handleScroll={handleScroll}
                replyToMessage={replyToMessage}
                channelData={channelData}>
                {block.data.message_type === 'Text' && <MarkdownRenderer content={block.data.text} />}
                {(block.data.message_type === 'File' || block.data.message_type === 'Image') && <FileMessageBlock {...block.data} onFilePreviewModalOpen={onFilePreviewModalOpen} />}
            </ChatMessageBox>
        )
    }
    return null
}

const MemoizedMessageItem = memo(MessageItem, (prevProps, nextProps) => {
    if (prevProps.block.block_type === 'date' && nextProps.block.block_type === 'date') {
        return prevProps.block.data === nextProps.block.data
    }
    return JSON.stringify(prevProps.block.data) === JSON.stringify(nextProps.block.data)
})
interface ChatHistoryProps {
    parsedMessages: MessagesWithDate,
    replyToMessage?: (message: Message) => void,
    channelData: ChannelListItem | DMChannelListItem
}

export const ChatHistory = ({ parsedMessages, replyToMessage, channelData }: ChatHistoryProps) => {

    const { colorMode } = useColorMode()

    const boxRef = useRef<HTMLDivElement>(null)

    const [isScrollable, setScrollable] = useState<boolean>(true)

    const { openModal, modalType, closeModal, modalContent } = useModalManager()

    const onFilePreviewModalOpen = useCallback((message: Partial<FileMessage>) => {
        if (message) {
            openModal(ModalTypes.FilePreview, {
                file: message.file,
                owner: message.owner,
                creation: message.creation,
                message_type: message.message_type
            })
        }
    }, [openModal])

    useScrollToLocation()

    useEffect(() => {
        if (boxRef.current) {
            boxRef.current.scrollTop = boxRef.current.scrollHeight
        }
    }, [parsedMessages])

    return (
        <Box ref={boxRef} h='100%' overflowY={isScrollable ? 'scroll' : 'hidden'} sx={scrollbarStyles(colorMode)}>
            <ChannelHistoryFirstMessage channelID={channelData?.name} />
            {parsedMessages.map((block) => {
                return <MemoizedMessageItem
                    block={block}
                    channelData={channelData}
                    handleScroll={setScrollable}
                    onFilePreviewModalOpen={onFilePreviewModalOpen}
                    replyToMessage={replyToMessage}
                    key={block.block_type === "date" ? block.data : block.data.name}
                />
            })}
            <FilePreviewModal
                isOpen={modalType === ModalTypes.FilePreview}
                onClose={closeModal}
                {...modalContent}
            />
        </Box>
    )
}