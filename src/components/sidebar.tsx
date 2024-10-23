'use client'

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input
} from 'ui'
import { getChats, getChatStatistics } from '@/core/server/actions'
import { useSidebarStore } from '@/core/store/sidebar-store'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { Info, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Chat = {
	id: string
	lastMessage: string | null
	timestamp: string | null
}

type ChatStatistics = {
	messageCount: number
	participantCount: number
	firstMessageDate: string | null
	lastMessageDate: string | null
}

// Function to remove emojis from a string
const removeEmojis = (str: string) => {
	return str
		.replace(
			/[\p{Emoji_Presentation}\p{Emoji}\u{20E3}\u{FE0F}\u{1F000}-\u{1F6FF}]/gu,
			''
		)
		.trim()
}

// Function to get a preview of the last message
const getMessagePreview = (message: string | null) => {
	if (!message) return 'No messages'
	const cleanMessage = removeEmojis(message)
	return cleanMessage || 'No text message'
}

export function Sidebar() {
	const [chats, setChats] = useState<Chat[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedChat, setSelectedChat] = useState<string | null>(null)
	const [chatStats, setChatStats] = useState<ChatStatistics | null>(null)
	const pathname = usePathname()
	const isSidebarOpen = useSidebarStore(state => state.isSidebarOpen)

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const fetchedChats = await getChats()
				console.log('Fetched chats:', fetchedChats)
				setChats(fetchedChats)
			} catch (error) {
				console.error('Error fetching chats:', error)
			}
		}
		fetchChats()
	}, [])

	const handleInfoClick = async (chatId: string) => {
		setSelectedChat(chatId)
		try {
			const stats = await getChatStatistics(chatId)
			setChatStats(stats)
		} catch (error) {
			console.error('Error fetching chat statistics:', error)
		}
	}

	const filteredChats = chats.filter(
		chat =>
			chat.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(chat.lastMessage &&
				removeEmojis(chat.lastMessage)
					.toLowerCase()
					.includes(searchQuery.toLowerCase()))
	)

	return (
		<AnimatePresence>
			{isSidebarOpen && (
				<motion.aside
					initial={{ width: 0 }}
					animate={{ width: 300 }}
					exit={{ width: 0 }}
					transition={{ duration: 0.3, ease: 'easeInOut' }}
					className="fixed top-0 left-0 bottom-0 z-40 bg-background border-r border-border flex flex-col"
				>
					<div className="p-4 border-b border-border">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search chats..."
								className="pl-10"
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
					<nav className="flex-1 overflow-y-auto">
						{filteredChats.length === 0 ? (
							<div className="p-4 text-center text-muted-foreground">
								No chats found
							</div>
						) : (
							filteredChats.map(chat => (
								<ContextMenu key={chat.id}>
									<ContextMenuTrigger>
										<Link
											href={`/chats/${chat.id}`}
											className={`flex items-center px-4 py-3 hover:bg-muted transition-colors ${
												pathname === `/chats/${chat.id}`
													? 'bg-muted'
													: ''
											}`}
										>
											<Avatar className="w-10 h-10 mr-3">
												<AvatarImage
													src={`https://api.dicebear.com/7.x/initials/svg?seed=${chat.id}`}
												/>
												<AvatarFallback>
													{chat.id[0].toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium truncate">
													{chat.id}
												</p>
												<p className="text-xs text-muted-foreground truncate">
													{getMessagePreview(
														chat.lastMessage
													)}
												</p>
											</div>
											{chat.timestamp && (
												<span className="text-xs text-muted-foreground">
													{format(
														new Date(
															chat.timestamp
														),
														'MMM d'
													)}
												</span>
											)}
										</Link>
									</ContextMenuTrigger>
									<ContextMenuContent>
										<ContextMenuItem
											onSelect={() =>
												handleInfoClick(chat.id)
											}
										>
											<Info className="mr-2 h-4 w-4" />
											<span>Info</span>
										</ContextMenuItem>
									</ContextMenuContent>
								</ContextMenu>
							))
						)}
					</nav>
					<Dialog>
						<DialogTrigger asChild>
							<button className="sr-only">Open chat info</button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Chat Information</DialogTitle>
								<DialogDescription>
									Details about the selected chat.
								</DialogDescription>
							</DialogHeader>
							{selectedChat && chatStats && (
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-2 items-center gap-4">
										<span className="font-medium">
											Chat Name:
										</span>
										<span>{selectedChat}</span>
									</div>
									<div className="grid grid-cols-2 items-center gap-4">
										<span className="font-medium">
											Total Messages:
										</span>
										<span>{chatStats.messageCount}</span>
									</div>
									<div className="grid grid-cols-2 items-center gap-4">
										<span className="font-medium">
											Participants:
										</span>
										<span>
											{chatStats.participantCount}
										</span>
									</div>
									<div className="grid grid-cols-2 items-center gap-4">
										<span className="font-medium">
											First Message:
										</span>
										<span>
											{chatStats.firstMessageDate
												? format(
														new Date(
															chatStats.firstMessageDate
														),
														'PPP'
													)
												: 'N/A'}
										</span>
									</div>
									<div className="grid grid-cols-2 items-center gap-4">
										<span className="font-medium">
											Last Message:
										</span>
										<span>
											{chatStats.lastMessageDate
												? format(
														new Date(
															chatStats.lastMessageDate
														),
														'PPP'
													)
												: 'N/A'}
										</span>
									</div>
								</div>
							)}
						</DialogContent>
					</Dialog>
				</motion.aside>
			)}
		</AnimatePresence>
	)
}
