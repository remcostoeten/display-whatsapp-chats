'use client'

import Pagination from "@/app/chats/_components/pagination"
import { LoaderWithText } from "@/components/loader"
import { ChatBubble, ChatBubbleActionWrapper, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleTimestamp } from "@/components/ui/chat/chat-bubble"
import { ChatMessageList } from "@/components/ui/chat/chat-message-list"
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { getChatMessages } from "./actions/chat-action"
import FavoriteButton from "./favourite-button"

interface Message {
    id: number
    name: string
    message: string
    timestamp: string
    attachment?: string
}

interface ChatMessagesProps {
    chatId: string
}

export function ChatMessages({ chatId }: ChatMessagesProps) {
    const searchParams = useSearchParams()
    const page = parseInt(searchParams.get('page') || '1', 10)
    const [chatMessages, setChatMessages] = useState<Message[]>([])
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const pageSize = 30
    const highlightIndex = searchParams.get('highlight') ? parseInt(searchParams.get('highlight')!, 10) : -1
    const messageListRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true)
            try {
                const result = await getChatMessages(chatId, page, pageSize)
                setChatMessages(result.messages)
                setTotalPages(result.totalPages)
            } catch (error) {
                console.error('Error fetching messages:', error)
                setChatMessages([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchMessages()
    }, [chatId, page, pageSize])

    return (
        <div className="flex flex-col h-full">
            <ChatMessageList ref={messageListRef}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <LoaderWithText text="Loading messages..." />
                    </div>
                ) : chatMessages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <p>No messages found. This chat might be empty.</p>
                    </div>
                ) : (
                    chatMessages.map((message) => (
                        <ChatBubble
                            key={message.id}
                            id={`message-${message.id}`}
                            variant={message.name === 'Remco' ? 'sent' : 'received'}
                            className={`${message.id === highlightIndex ? 'bg-yellow-500/20' : ''} ${message.name === 'Remco' ? 'ml-auto' : ''}`}
                        >
                            <ChatBubbleAvatar
                                src={message.name === 'Remco' ? '/remco-avatar.jpg' : '/other-avatar.jpg'}
                                fallback={message.name[0]}
                            />
                            <ChatBubbleMessage className={message.name === 'Remco' ? 'bg-blue-600' : ''}>
                                {message.name !== 'Remco' && <p className="font-bold text-sm text-primary">{message.name}</p>}
                                <p>{message.message}</p>
                                {message.attachment && (
                                    <div className="mt-2">
                                        {message.attachment.endsWith('.mp4') ? (
                                            <video controls className="max-w-full h-auto rounded">
                                                <source src={`/attachments/${message.attachment}`} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            <Image
                                                src={`/attachments/${message.attachment}`}
                                                alt="Attachment"
                                                width={200}
                                                height={200}
                                                className="max-w-full h-auto rounded"
                                            />
                                        )}
                                    </div>
                                )}
                            </ChatBubbleMessage>
                            <ChatBubbleTimestamp timestamp={new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                            <ChatBubbleActionWrapper>
                                <FavoriteButton messageId={message.id} />
                            </ChatBubbleActionWrapper>
                        </ChatBubble>
                    ))
                )}
            </ChatMessageList>

            <Pagination chatId={chatId} currentPage={page} totalPages={totalPages} />

        </div>
    )
}
