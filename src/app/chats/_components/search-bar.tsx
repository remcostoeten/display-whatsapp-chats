'use client'

import { Popover, PopoverContent, PopoverTrigger } from 'ui'
import { Button, Input, ScrollArea } from 'ui'
import ChatCalendarHeatmap from '@/components/ui/calender-heatmap'
import { searchMessages } from '@/core/server/actions'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
interface SearchResult {
	index: number
	message: string
	timestamp: string
}

interface SearchBarProps {
	chatId: string
}

export function SearchBar({ chatId }: SearchBarProps) {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<SearchResult[]>([])
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [showCalendar, setShowCalendar] = useState(false)
	const router = useRouter()
	const searchRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsSearchOpen(false)
				setShowCalendar(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!query.trim()) return

		const searchResults = await searchMessages(chatId, query)
		setResults(searchResults)
		setIsSearchOpen(true)
		setShowCalendar(false)
	}

	const jumpToMessage = (index: number) => {
		const page = Math.floor(index / 30) + 1
		router.push(`/chats/${chatId}?page=${page}&highlight=${index}`)
		setIsSearchOpen(false)
	}

	const closeSearch = () => {
		setIsSearchOpen(false)
		setResults([])
		setQuery('')
	}

	return (
		<div ref={searchRef} className="relative w-full max-w-md">
			<form onSubmit={handleSearch} className="relative">
				<Input
					type="text"
					value={query}
					onChange={e => setQuery(e.target.value)}
					placeholder="Search messages..."
					className="w-full pr-20"
				/>
				<div className="absolute right-0 top-0 h-full flex items-center">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="px-3"
							>
								<Calendar className="h-4 w-4" />
								<span className="sr-only">Open calendar</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<ChatCalendarHeatmap chatId={chatId} />
						</PopoverContent>
					</Popover>
					<Button
						type="submit"
						variant="ghost"
						size="icon"
						className="px-3"
					>
						<Search className="h-4 w-4" />
						<span className="sr-only">Search</span>
					</Button>
				</div>
			</form>
			<AnimatePresence>
				{isSearchOpen && results.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="absolute z-50 w-full mt-2 bg-popover rounded-md shadow-lg overflow-hidden"
					>
						<div className="flex justify-between items-center p-2 border-b">
							<span className="text-sm font-medium">
								Search Results
							</span>
							<Button
								variant="ghost"
								size="icon"
								onClick={closeSearch}
							>
								<X className="h-4 w-4" />
								<span className="sr-only">
									Close search results
								</span>
							</Button>
						</div>
						<ScrollArea className="max-h-60">
							{results.map((result, index) => (
								<div
									key={index}
									className="cursor-pointer hover:bg-muted p-3 transition-colors"
									onClick={() => jumpToMessage(result.index)}
								>
									<p className="text-sm line-clamp-2">
										{result.message}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										{new Date(
											result.timestamp
										).toLocaleString()}
									</p>
								</div>
							))}
						</ScrollArea>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
