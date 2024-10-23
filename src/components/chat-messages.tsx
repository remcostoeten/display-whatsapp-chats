'use client'

import FavoriteButton from '@/app/chats/_components/favourite-btn'
import Pagination from '@/app/chats/_components/pagination'
import { LoaderWithText } from '@/components/loader'
import { getChatMessages } from '@/core/server/actions'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import {
	ChatBubble,
	ChatBubbleActionWrapper,
	ChatBubbleAvatar,
	ChatBubbleMessage,
	ChatBubbleTimestamp
} from './chat/chat-bubble'
import MessageList from './chat/chat-message-list'

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

function DateSeparator({ date }: { date: string }) {
	return (
		<div className="flex justify-center my-4">
			<div className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
				{date}
			</div>
		</div>
	)
}

function MessageBubble({
	message,
	isHighlighted,
	chatId
}: {
	message: Message
	isHighlighted: boolean
	chatId: string
}) {
	const [isOpen, setIsOpen] = useState(true)

	return (
		<ChatBubble
			id={`message-${message.id}`}
			variant={message.name === 'Remco' ? 'sent' : 'received'}
			className={`${isHighlighted ? 'bg-yellow-500/20' : ''} ${message.name === 'Remco' ? 'ml-auto' : ''}`}
		>
			<ChatBubbleAvatar
				src={
					message.name === 'Remco'
						? '/remco-avatar.jpg'
						: '/other-avatar.jpg'
				}
				fallback={message.name[0]}
			/>
			<ChatBubbleMessage
				className={message.name === 'Remco' ? 'bg-blue-600' : ''}
			>
				{message.name !== 'Remco' && (
					<p className="font-bold text-sm text-primary">
						{message.name}
					</p>
				)}
				<p>{message.message}</p>
				{message.attachment && (
					<div className="mt-2">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="flex items-center text-xs text-blue-400 hover:text-blue-500 mb-2"
						>
							{isOpen ? (
								<>
									<ChevronUp className="h-4 w-4 mr-1" />
									Hide attachment
								</>
							) : (
								<>
									<ChevronDown className="h-4 w-4 mr-1" />
									Show attachment
								</>
							)}
						</button>
						<AnimatePresence>
							{isOpen && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.2 }}
									style={{ overflow: 'hidden' }}
								>
									{message.attachment.endsWith('.mp4') ? (
										<video
											controls
											className="max-w-full h-auto rounded"
										>
											<source
												src={`/attachments/${message.attachment}`}
												type="video/mp4"
											/>
											Your browser does not support the
											video tag.
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
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				)}
			</ChatBubbleMessage>
			<ChatBubbleTimestamp
				timestamp={new Date(message.timestamp).toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit'
				})}
			/>
			<ChatBubbleActionWrapper>
				<FavoriteButton
					chatId={chatId}
					isFavorite={false}
					messageId={message.id}
				/>
			</ChatBubbleActionWrapper>
		</ChatBubble>
	)
}

export function ChatMessages({ chatId }: ChatMessagesProps) {
	const searchParams = useSearchParams()
	const page = parseInt(searchParams.get('page') || '1', 10)
	const [chatMessages, setChatMessages] = useState<Message[]>([])
	const [totalPages, setTotalPages] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const pageSize = 30
	const highlightIndex = searchParams.get('highlight')
		? parseInt(searchParams.get('highlight')!, 10)
		: -1
	const messageListRef = useRef<HTMLDivElement>(null)
	const [messageHeatmap, setMessageHeatmap] = useState<
		{ date: Date; weight: number }[]
	>([])

	useEffect(() => {
		const fetchMessages = async () => {
			setIsLoading(true)
			try {
				const result = await getChatMessages(chatId, page, pageSize)
				setChatMessages(
					result.messages.map(message => ({
						...message,
						id: parseInt(message.id, 10),
						attachment: message.attachment || undefined
					}))
				)
				setTotalPages(result.totalPages)

				// Calculate message heatmap data
				const heatmapData = result.messages.reduce(
					(acc, message) => {
						const date = new Date(message.timestamp).toDateString()
						acc[date] = (acc[date] || 0) + 1
						return acc
					},
					{} as Record<string, number>
				)

				setMessageHeatmap(
					Object.entries(heatmapData).map(([date, count]) => ({
						date: new Date(date),
						weight: count
					}))
				)
			} catch (error) {
				console.error('Error fetching messages:', error)
				setChatMessages([])
			} finally {
				setIsLoading(false)
			}
		}

		fetchMessages()
	}, [chatId, page, pageSize])

	const renderMessagesWithDateSeparators = () => {
		let currentDate = null
		return chatMessages.map((message, index) => {
			const messageDate = new Date(message.timestamp)
			const formattedDate = format(messageDate, 'MMMM d, yyyy')
			const showDateSeparator = currentDate !== formattedDate

			if (showDateSeparator) {
				currentDate = formattedDate
				return (
					<React.Fragment key={`${message.id}-fragment`}>
						<DateSeparator date={formattedDate} />
						<MessageBubble
							message={message}
							isHighlighted={message.id === highlightIndex}
							chatId={chatId}
						/>
					</React.Fragment>
				)
			}

			return (
				<MessageBubble
					key={message.id}
					message={message}
					isHighlighted={message.id === highlightIndex}
					chatId={chatId}
				/>
			)
		})
	}

	return (
		<div className="flex flex-col h-full">
			<MessageList
				ref={messageListRef}
				messages={chatMessages}
				highlightIndex={highlightIndex}
			/>
			{isLoading ? (
				<div className="flex justify-center items-center h-full">
					<LoaderWithText text="Loading messages..." />
				</div>
			) : chatMessages.length === 0 ? (
				<div className="flex justify-center items-center h-full">
					<p>No messages found. This chat might be empty.</p>
				</div>
			) : (
				renderMessagesWithDateSeparators()
			)}
			<Pagination
				chatId={chatId}
				currentPage={page}
				totalPages={totalPages}
			/>
		</div>
	)
}
