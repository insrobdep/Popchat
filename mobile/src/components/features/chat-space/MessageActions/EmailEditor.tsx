import { EditorContent, ReactRenderer, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useContext } from 'react'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
// import '../../chat-input/tiptap.styles.css'
import Mention from '@tiptap/extension-mention'
import { UserListContext } from '@/utils/users/UserListProvider'
import tippy from 'tippy.js'
import { PluginKey } from '@tiptap/pm/state'
import { ChannelListContext, ChannelListContextType } from '@/utils/channel/ChannelListProvider'
import { common, createLowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import python from 'highlight.js/lib/languages/python'
import { BiSend } from 'react-icons/bi'
import { IonButton, IonButtons } from '@ionic/react'
import MentionList from '../../chat-input/MentionList'
import ChannelMentionList from '../../chat-input/ChannelMentionList'
import { useFormContext } from 'react-hook-form'

const lowlight = createLowlight(common)

lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)
lowlight.register('json', json)
lowlight.register('python', python)

type EmailEditorProps = {
    messageSending: boolean,
    defaultText?: string
}

const UserMention = Mention.extend({
    name: 'userMention',
})
    .configure({
        suggestion: {
            char: '@',
            pluginKey: new PluginKey('userMention'),
        }
    })

const ChannelMention = Mention.extend({
    name: 'channelMention',
})
    .configure({
        suggestion: {
            char: '#',
            pluginKey: new PluginKey('channelMention'),
        }
    })
export const EmailEditor = ({ messageSending, defaultText = '' }: EmailEditorProps) => {

    const { users } = useContext(UserListContext)

    const { setValue } = useFormContext()

    const { channels } = useContext(ChannelListContext) as ChannelListContextType

    const extensions = [
        StarterKit.configure({
            heading: false,
            codeBlock: false,
            bold: {
                HTMLAttributes: {
                    class: 'font-bold'
                }
            },
            italic: {
                HTMLAttributes: {
                    class: 'italic'
                }
            },
            strike: {
                HTMLAttributes: {
                    class: 'line-through'
                }
            },
            listItem: {
                HTMLAttributes: {
                    class: 'ml-4'
                }
            },
            blockquote: {
                HTMLAttributes: {
                    class: 'pl-4 border-l-4 border-gray-500'
                }
            },
            orderedList: {
                HTMLAttributes: {
                    class: 'ml-1'
                }
            },
            code: {
                HTMLAttributes: {
                    class: 'font-mono bg-slate-950 text-sm radius-md p-1 text-white'
                }
            },

        }),
        UserMention.configure({
            HTMLAttributes: {
                class: 'mention text-blue-500',
            },
            renderLabel({ options, node }) {
                return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
            },
            suggestion: {
                items: (query) => {
                    return users.filter((user) => user.full_name.toLowerCase().startsWith(query.query.toLowerCase()))
                        .slice(0, 10);
                },
                // char: '@',
                render: () => {
                    let component: any;
                    let popup: any;

                    return {
                        onStart: props => {
                            component = new ReactRenderer(MentionList, {
                                props,
                                editor: props.editor,
                            })

                            if (!props.clientRect) {
                                return
                            }

                            popup = tippy('body' as any, {
                                getReferenceClientRect: props.clientRect as any,
                                appendTo: () => document.body,
                                content: component.element,
                                showOnCreate: true,
                                interactive: true,
                                trigger: 'manual',
                                placement: 'top-start',
                            })
                        },

                        onUpdate(props) {
                            component.updateProps(props)

                            if (!props.clientRect) {
                                return
                            }

                            popup[0].setProps({
                                getReferenceClientRect: props.clientRect,
                            })
                        },

                        onKeyDown(props) {
                            if (props.event.key === 'Escape') {
                                popup[0].hide()

                                return true
                            }

                            return component.ref?.onKeyDown(props)
                        },

                        onExit() {
                            popup[0].destroy()
                            component.destroy()
                        },
                    }
                },

            }
        }),
        ChannelMention.configure({
            HTMLAttributes: {
                class: 'mention text-blue-500',
            },
            renderLabel({ options, node }) {
                return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
            },
            suggestion: {
                items: (query) => {
                    return channels.filter((channel) => channel.channel_name.toLowerCase().startsWith(query.query.toLowerCase()))
                        .slice(0, 10);
                },
                // char: '#',
                render: () => {
                    let component: any;
                    let popup: any;

                    return {
                        onStart: props => {
                            component = new ReactRenderer(ChannelMentionList, {
                                props,
                                editor: props.editor,
                            })

                            if (!props.clientRect) {
                                return
                            }

                            popup = tippy('body' as any, {
                                getReferenceClientRect: props.clientRect as any,
                                appendTo: () => document.body,
                                content: component.element,
                                showOnCreate: true,
                                interactive: true,
                                trigger: 'manual',
                                placement: 'top-start',
                            })
                        },

                        onUpdate(props) {
                            component.updateProps(props)

                            if (!props.clientRect) {
                                return
                            }

                            popup[0].setProps({
                                getReferenceClientRect: props.clientRect,
                            })
                        },

                        onKeyDown(props) {
                            if (props.event.key === 'Escape') {
                                popup[0].hide()

                                return true
                            }

                            return component.ref?.onKeyDown(props)
                        },

                        onExit() {
                            popup[0].destroy()
                            component.destroy()
                        },
                    }
                },

            }
        }),
        Underline,
        Highlight.configure({
            multicolor: true,
        }),
        Link.configure({
            protocols: ['mailto', 'https', 'http'],
            HTMLAttributes: {
                class: 'underline text-blue-500',

            },
            linkOnPaste: true,
            openOnClick: false,
        }),
        CodeBlockLowlight.configure({
            lowlight
        }),
        Placeholder.configure({
            placeholder: 'Type a message...'
        }),
    ]

    const editor = useEditor({
        extensions,
        content: defaultText,
        editorProps: {
            attributes: {
                class: 'outline-none text-md py-1.5 email'
            }
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            setValue('content', html)
        }
    })


    return (
        <div className='content-start w-full min-h-full'>
            {/* <div className='w-full focus:outline-none rounded-md border border-zinc-800 text-md overflow-hidden'> */}
            <EditorContent editor={editor} />
        </div>
    )
}