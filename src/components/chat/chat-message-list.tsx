import { Message } from '@/core/types'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

interface ChatMessageListProps {
	messages: Message[]
	highlightIndex: number
}

function formatTimestamp(timestamp: string): string {
	const date = new Date(timestamp)
	return date.toLocaleString()
}

export default function MessageList({
	messages,
	highlightIndex
}: ChatMessageListProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	return (
		<div className="flex flex-col space-y-4 p-4">
			{messages.map((message, index) => (
				<div
					key={message.id}
					className={`flex space-x-2 ${
						message.role === 'assistant'
							? 'flex-row-reverse space-x-reverse'
							: ''
					} ${highlightIndex === index ? 'bg-blue-100' : ''}`}
					data-message-id={index}
				>
					<div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300" />
					<div className="flex flex-col">
						<div
							className={`px-4 py-2 rounded-lg ${
								message.role === 'assistant'
									? 'bg-gray-200'
									: 'bg-blue-500 text-white'
							}`}
						>
							{message.content}
							{message.attachment && (
								<div className="mt-2">
									<Image
										src={message.attachment}
										alt="Message attachment"
										width={200}
										height={200}
										className="rounded-lg"
									/>
								</div>
							)}
						</div>
						<div className="mt-1 text-xs text-gray-500">
							{formatTimestamp(message.timestamp)}
						</div>
					</div>
				</div>
			))}
			<div ref={messagesEndRef} />
		</div>
	)
}
