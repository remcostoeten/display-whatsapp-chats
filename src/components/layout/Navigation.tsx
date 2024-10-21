import Link from 'next/link'

interface NavLink {
	href: string
	label: string
	showDivider?: boolean
}

const Navigation = () => {
	const navLinks: NavLink[] = [
		{ href: '/', label: 'Home', showDivider: true },
		{ href: '/posts', label: 'Blog', showDivider: true },
		{ href: '/dx', label: 'DX', showDivider: true }
	]

	const PlusSvg = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="1.5"
			stroke="currentColor"
			className="h-6 w-6 bg-transparent text-gray-300/40 transform rotate-45 mx-20"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 6v12m6-6H6"
			/>
		</svg>
	)

	return (
		<nav className="flex pr-2 pl-8 py-2 items-center justify-center space-x-4 border border-transparent">
			{navLinks.map((link, index) => (
				<Link
					key={link.href}
					href={link.href}
					className="relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
				>
					<span className="hidden text-sm sm:block mr-[1.20rem]">
						{link.label}
					</span>
					{link.showDivider && <PlusSvg />}
				</Link>
			))}

			<Link
				aria-role="button"
				href="/authenticate"
				className="relative py-2 px-4 text-sm font- rounded-full border dark:text-white border-neutral-200 dark:border-white/[0.2]"
			>
				<span>Login</span>
				<span className="absolute inset-x-0 -bottom-px mx-auto w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
			</Link>
		</nav>
	)
}

export default Navigation
