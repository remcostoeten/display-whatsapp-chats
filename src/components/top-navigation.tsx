'use client'

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Input
} from 'ui'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import {
	MessageSquare,
	PanelLeftClose,
	PanelLeftOpen,
	Search
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SettingsDialog } from './settings/settings-dialog'
import { useCallback, useState } from 'react'
import { useSidebarStore } from '@/core/store/sidebar-store'

export function TopNavigation() {
	const { isSignedIn } = useUser()
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()
	const { isOpen, toggleSidebar } = useSidebarStore()
	const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams)
			params.set(name, value)
			return params.toString()
		},
		[searchParams]
	)

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery) {
			router.push(
				`/dashboard/search?${createQueryString('q', searchQuery)}`
			)
		}
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 max-w-screen-2xl items-center">
				<div className="mr-4 hidden md:flex items-center space-x-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleSidebar}
						className="w-9 px-0"
						aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
					>
						{isOpen ? (
							<PanelLeftClose className="h-5 w-5" />
						) : (
							<PanelLeftOpen className="h-5 w-5" />
						)}
					</Button>
					<SettingsDialog />
					<Link href="/" className="flex items-center space-x-2">
						<MessageSquare className="h-6 w-6" />
						<span className="hidden font-bold sm:inline-block">
							Chat App
						</span>
					</Link>
				</div>

				{/* Mobile Menu */}
				<div className="md:hidden flex items-center space-x-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="w-9 px-0"
							>
								<MessageSquare className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem onClick={toggleSidebar}>
								{isOpen ? 'Close Sidebar' : 'Open Sidebar'}
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/dashboard">Dashboard</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/chats">Chats</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{isSignedIn && (
					<nav className="ml-6 hidden items-center space-x-6 text-sm font-medium md:flex">
						<Link
							href="/dashboard"
							className={
								pathname === '/dashboard'
									? 'text-foreground'
									: 'text-foreground/60 hover:text-foreground/80 transition-colors'
							}
						>
							Dashboard
						</Link>
						<Link
							href="/chats"
							className={
								pathname.startsWith('/chats')
									? 'text-foreground'
									: 'text-foreground/60 hover:text-foreground/80 transition-colors'
							}
						>
							Chats
						</Link>
					</nav>
				)}

				<div className="flex flex-1 items-center justify-end space-x-2">
					{isSignedIn && (
						<form
							onSubmit={handleSearch}
							className="w-full flex-1 md:w-auto md:flex-none"
						>
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search chats..."
									className="h-9 md:w-[300px] lg:w-[400px] pl-8"
									value={searchQuery}
									onChange={e =>
										setSearchQuery(e.target.value)
									}
								/>
							</div>
						</form>
					)}
					<nav className="flex items-center space-x-2">
						{!isSignedIn ? (
							<>
								<SignInButton mode="modal">
									<Button variant="ghost">Sign In</Button>
								</SignInButton>
								<SignUpButton mode="modal">
									<Button>Sign Up</Button>
								</SignUpButton>
							</>
						) : (
							<UserButton
								afterSignOutUrl="/"
								appearance={{
									elements: {
										avatarBox: 'h-8 w-8'
									}
								}}
							/>
						)}
					</nav>
				</div>
			</div>
		</header>
	)
}
