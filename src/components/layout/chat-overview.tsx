import { Card, CardContent, CardHeader, CardTitle } from 'ui'
import { ArrowUpRight, MessageSquare } from 'lucide-react'

interface ChatOverviewProps {
	data: {
		name: string
		messages: number
	}[]
	className?: string
}

export function ChatOverview({ data, className }: ChatOverviewProps) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<MessageSquare className="h-5 w-5" />
					Most Active Chats
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{data.map(chat => (
						<div
							key={chat.name}
							className="flex items-center justify-between"
						>
							<div className="space-y-1">
								<p className="text-sm font-medium">
									{chat.name}
								</p>
								<p className="text-sm text-muted-foreground">
									{chat.messages.toLocaleString()} messages
								</p>
							</div>
							<ArrowUpRight className="h-4 w-4 text-muted-foreground" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
