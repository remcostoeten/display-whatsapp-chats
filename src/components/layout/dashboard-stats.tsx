import { Calendar, MessageSquare, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from 'ui'

interface DashboardStatsProps {
	data: {
		totalMessages: number
		totalChats: number
		uniqueContacts: number
		dateRange: string
	}
	className?: string
}

export function DashboardStats({ data, className }: DashboardStatsProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total Messages
					</CardTitle>
					<MessageSquare className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{data ? (
							data.totalMessages.toLocaleString()
						) : (
							<Skeleton className="h-8 w-[100px]" />
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						+20.1% from last month
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total Chats
					</CardTitle>
					<MessageSquare className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{data ? (
							data.totalChats.toLocaleString()
						) : (
							<Skeleton className="h-8 w-[100px]" />
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						+12 since last week
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Unique Contacts
					</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{data ? (
							data.uniqueContacts.toLocaleString()
						) : (
							<Skeleton className="h-8 w-[100px]" />
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						+4 new contacts this week
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Active Period
					</CardTitle>
					<Calendar className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{data ? (
							data.dateRange
						) : (
							<Skeleton className="h-8 w-[100px]" />
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						First to last message
					</p>
				</CardContent>
			</Card>
		</div>
	)
}
