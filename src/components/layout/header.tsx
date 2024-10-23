import { Button } from 'ui'
import { cn } from '@/core/lib/utils'
import { RefreshCw } from 'lucide-react'

interface DashboardHeaderProps {
	heading: string
	text?: string
	children?: React.ReactNode
	className?: string
	onRefresh?: () => void
}

export function DashboardHeader({
	heading,
	text,
	children,
	className,
	onRefresh
}: DashboardHeaderProps) {
	return (
		<div
			className={cn(
				'flex flex-col gap-4 md:flex-row md:items-center md:justify-between',
				className
			)}
		>
			<div className="grid gap-1">
				<h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
					{heading}
				</h1>
				{text && <p className="text-muted-foreground">{text}</p>}
			</div>
			<div className="flex items-center gap-2">
				{onRefresh && (
					<Button
						variant="outline"
						size="sm"
						onClick={onRefresh}
						className="h-8"
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						Refresh
					</Button>
				)}
				{children}
			</div>
		</div>
	)
}
