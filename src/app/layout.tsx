import Providers from '@/components/base/providers'
import { Sidebar } from '@/components/sidebar'
import { TopNavigation } from '@/components/top-navigation'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
	src: '../core/config/fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900'
})

const geistMono = localFont({
	src: '../core/config/fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900'
})

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			className={`dark ${geistSans.variable} ${geistMono.variable}`}
		>
			<body className="bg-background text-foreground">
				<Providers
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex h-screen">
						<Sidebar />
						<div className="flex flex-col flex-1 overflow-hidden">
							<TopNavigation />
							<main className="flex-1 overflow-auto pl-64">
								{children}
							</main>
						</div>
					</div>
				</Providers>
			</body>
		</html>
	)
}
