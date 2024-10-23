import { cn } from '@/core/lib/utils'
import { Sidebar } from '../sidebar'

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({
	children,
	className,
	...props
}: DashboardShellProps) {
	return (
		<div className={cn('grid items-start gap-8', className)} {...props}>
			<Sidebar />
			{children}
		</div>
	)
}
