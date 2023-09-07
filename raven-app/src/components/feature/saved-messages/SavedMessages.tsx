import { Text, Stack, Tooltip, Button, useDisclosure, Box } from "@chakra-ui/react"
import { useFrappeGetCall } from "frappe-react-sdk"
import { HiOutlineSearch } from "react-icons/hi"
import { useNavigate } from "react-router-dom"
import { TextMessage } from "../../../../../types/Messaging/Message"
import { ErrorBanner } from "../../layout/AlertBanner"
import { EmptyStateForSavedMessages } from "../../layout/EmptyState/EmptyState"
import { PageHeader } from "../../layout/Heading/PageHeader"
import { PageHeading } from "../../layout/Heading/PageHeading"
import { CommandPalette } from "../command-palette"
import { MessageBox } from "../global-search/MessageBox"

interface SavedMessage extends TextMessage {
    channel_id: string,
    file: string
}

export const SavedMessages = () => {

    const navigate = useNavigate()

    const { isOpen: isCommandPaletteOpen, onClose: onCommandPaletteClose, onToggle: onCommandPaletteToggle } = useDisclosure()

    const { data, error } = useFrappeGetCall<{ message: SavedMessage[] }>("raven.raven_messaging.doctype.raven_message.raven_message.get_saved_messages", undefined, undefined, {
        revalidateOnFocus: false
    })

    const handleScrollToMessage = (messageName: string, channelID: string) => {
        navigate(`/channel/${channelID}#message-${messageName}`)
    }

    if (error) {
        return <Box p={4}><ErrorBanner error={error} /></Box>
    }
    return (
        <>
            <PageHeader>
                <PageHeading>
                    <Text>Saved</Text>
                </PageHeading>
                <Tooltip hasArrow label='search' placement='bottom-start' rounded={'md'}>
                    <Button
                        size={"sm"}
                        aria-label="search"
                        leftIcon={<HiOutlineSearch />}
                        onClick={onCommandPaletteToggle}
                        fontWeight='light'>
                        Search
                    </Button>
                </Tooltip>
            </PageHeader>
            {data && data.message?.length === 0 && <EmptyStateForSavedMessages />}
            <Stack justify={'flex-start'} p={4} overflow='hidden' pt='20'>
                {data?.message?.map(({ name, text, owner, creation, channel_id, file, message_type }: SavedMessage) => {
                    return (
                        <MessageBox key={name} channelID={channel_id} messageName={name} creation={creation} owner={owner} messageText={text} file={file} message_type={message_type} handleScrollToMessage={handleScrollToMessage} />
                    )
                })}
            </Stack>
            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={onCommandPaletteClose}
                onToggle={onCommandPaletteToggle} />
        </>
    )
}