'use client'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from 'ui'
import { getChatStatistics } from '@/actions/get-chat-statistics'
import { useEffect, useState } from 'react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

type ChatStatistics = Awaited<ReturnType<typeof getChatStatistics>>

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function ChatStatisticsModal({
	isOpen,
	onClose,
	chatId
}: {
	isOpen: boolean
	onClose: () => void
	chatId: string | null
}) {
	const [statistics, setStatistics] = useState<ChatStatistics | null>(null)

	useEffect(() => {
		if (isOpen && chatId) {
			const fetchStatistics = async () => {
				const stats = await getChatStatistics(chatId)
				setStatistics(stats)
			}
			fetchStatistics()
		}
	}, [isOpen, chatId])

	if (!statistics) {
		return null
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>Chat Statistics</DialogTitle>
				</DialogHeader>
				<Tabs defaultValue="overview">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="users">Users</TabsTrigger>
						<TabsTrigger value="activity">Activity</TabsTrigger>
						<TabsTrigger value="content">Content</TabsTrigger>
					</TabsList>
					<TabsContent value="overview">
						<div className="grid grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Total Messages</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold">
										{statistics.totalMessages}
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>
										Recent Messages (30 days)
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold">
										{statistics.recentMessages}
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Busiest Hour</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold">
										{statistics.busiestHour.hour}:00
									</p>
									<p className="text-sm text-gray-500">
										{statistics.busiestHour.count} messages
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Most Active Day</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold">
										{statistics.mostActiveDay.day}
									</p>
									<p className="text-sm text-gray-500">
										{statistics.mostActiveDay.count}{' '}
										messages
									</p>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
					<TabsContent value="users">
						<Card>
							<CardHeader>
								<CardTitle>Messages by User</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<PieChart>
										<Pie
											data={statistics.messagesByUser}
											dataKey="count"
											nameKey="name"
											cx="50%"
											cy="50%"
											outerRadius={80}
											label
										>
											{statistics.messagesByUser.map(
												(entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={
															COLORS[
																index %
																	COLORS.length
															]
														}
													/>
												)
											)}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
								<ul className="mt-4">
									{statistics.messagesByUser.map(user => (
										<li
											key={user.name}
											className="flex justify-between items-center py-2"
										>
											<span>{user.name}</span>
											<span className="text-sm text-gray-500">
												Avg: {user.avgLength} | Max:{' '}
												{user.maxLength} | Min:{' '}
												{user.minLength}
											</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="activity">
						<Card>
							<CardHeader>
								<CardTitle>Message Frequency</CardTitle>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<BarChart data={statistics.messagesByDate}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="date" />
										<YAxis />
										<Tooltip />
										<Bar dataKey="count" fill="#8884d8" />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="content">
						<div className="grid grid-cols-2 gap-4">
							<Card>
								<CardHeader>
									<CardTitle>Longest Message</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										<strong>By:</strong>{' '}
										{statistics.longestMessage.name}
									</p>
									<p>
										<strong>Length:</strong>{' '}
										{statistics.longestMessage.length}{' '}
										characters
									</p>
									<p className="mt-2 text-sm text-gray-500 truncate">
										{statistics.longestMessage.message}
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Top 10 Words</CardTitle>
								</CardHeader>
								<CardContent>
									<ul>
										{statistics.wordFrequency.map(word => (
											<li
												key={word.word}
												className="flex justify-between items-center py-1"
											>
												<span>{word.word}</span>
												<span className="text-sm text-gray-500">
													{word.count}
												</span>
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
