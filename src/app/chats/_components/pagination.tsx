'use client'

import { Button } from 'ui'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

export default function Pagination({
	currentPage,
	totalPages,
	chatId
}: {
	currentPage: number
	totalPages: number
	chatId: string
}) {
	const renderPageNumbers = () => {
		const pageNumbers = []
		const maxVisiblePages = 5
		let startPage = Math.max(1, currentPage - 2)
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1)
		}

		if (startPage > 1) {
			pageNumbers.push(
				<Link key={1} href={`/dashboard/chats/${chatId}?page=1`}>
					<Button variant="ghost" size="icon" className="h-8 w-8">
						1
					</Button>
				</Link>
			)
			if (startPage > 2) {
				pageNumbers.push(
					<Button
						key="ellipsis1"
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						disabled
					>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				)
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<Link key={i} href={`/dashboard/chats/${chatId}?page=${i}`}>
					<Button
						variant={currentPage === i ? 'secondary' : 'ghost'}
						size="icon"
						className="h-8 w-8"
					>
						{i}
					</Button>
				</Link>
			)
		}

		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pageNumbers.push(
					<Button
						key="ellipsis2"
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						disabled
					>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				)
			}
			pageNumbers.push(
				<Link
					key={totalPages}
					href={`/dashboard/chats/${chatId}?page=${totalPages}`}
				>
					<Button variant="ghost" size="icon" className="h-8 w-8">
						{totalPages}
					</Button>
				</Link>
			)
		}

		return pageNumbers
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-border bg-background px-4 py-3 sm:px-6">
			<div className="flex flex-1 justify-between sm:hidden">
				<Link
					href={`/dashboard/chats/${chatId}?page=${Math.max(1, currentPage - 1)}`}
				>
					<Button
						variant="outline"
						size="sm"
						disabled={currentPage === 1}
					>
						Previous
					</Button>
				</Link>
				<Link
					href={`/dashboard/chats/${chatId}?page=${Math.min(totalPages, currentPage + 1)}`}
				>
					<Button
						variant="outline"
						size="sm"
						disabled={currentPage === totalPages}
					>
						Next
					</Button>
				</Link>
			</div>
			<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<p className="text-sm text-muted-foreground">
						Page{' '}
						<span className="font-medium text-foreground">
							{currentPage}
						</span>{' '}
						of{' '}
						<span className="font-medium text-foreground">
							{totalPages}
						</span>
					</p>
				</div>
				<div>
					<nav
						className="isolate inline-flex -space-x-px rounded-md shadow-sm"
						aria-label="Pagination"
					>
						<Link
							href={`/dashboard/chats/${chatId}?page=${Math.max(1, currentPage - 1)}`}
						>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 mr-2"
								disabled={currentPage === 1}
							>
								<ChevronLeft className="h-4 w-4" />
								<span className="sr-only">Previous page</span>
							</Button>
						</Link>
						{renderPageNumbers()}
						<Link
							href={`/dashboard/chats/${chatId}?page=${Math.min(totalPages, currentPage + 1)}`}
						>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 ml-2"
								disabled={currentPage === totalPages}
							>
								<ChevronRight className="h-4 w-4" />
								<span className="sr-only">Next page</span>
							</Button>
						</Link>
					</nav>
				</div>
			</div>
		</div>
	)
}
