'use client'

import { getChats } from '@/core/server/actions'
import { format } from 'date-fns'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from 'ui'

type Chat = {
	id: string
	lastMessage: string | null
	timestamp: string | null
}

export default function ChatList({
	initialChats = []
}: {
	initialChats?: Chat[]
}) {
	const [chats, setChats] = useState(initialChats)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		async function fetchChats() {
			try {
				setLoading(true)
				const fetchedChats = await getChats()
				console.log('Fetched chats:', fetchedChats)
				setChats(fetchedChats)
			} catch (err) {
				console.error('Error fetching chats:', err)
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchChats()
	}, [])

	if (loading) return <div>Loading chats...</div>
	if (error) return <div>Error: {error}</div>

	if (!chats || chats.length === 0) {
		return (
			<div className="p-4 text-center text-zinc-500">No chats found</div>
		)
	}

	return (
		<div className="p-4 space-y-4">
			{chats.map(chat => (
				<Link
					key={chat.id}
					href={`/chats/${chat.id}`}
					className="block p-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
				>
					<div className="flex items-center">
						<Avatar className="w-12 h-12 mr-4">
							<AvatarImage
								src={`https://api.dicebear.com/7.x/initials/svg?seed=${chat.id}`}
							/>
							<AvatarFallback>
								{chat.id.substring(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<p className="text-lg font-medium truncate">
								{chat.id}
							</p>
							<p className="text-sm text-zinc-400 truncate">
								{chat.lastMessage ? (
									<span
										dangerouslySetInnerHTML={{
											__html: chat.lastMessage
										}}
									/>
								) : (
									'No messages'
								)}
							</p>
						</div>
						{chat.timestamp && (
							<span className="text-xs text-zinc-500">
								{format(
									new Date(chat.timestamp),
									'MMM d, yyyy'
								)}
							</span>
						)}
					</div>
				</Link>
			))}
		</div>
	)
}
