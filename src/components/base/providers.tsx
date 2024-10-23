import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<NextThemesProvider>{children}</NextThemesProvider>
		</ClerkProvider>
	)
}
