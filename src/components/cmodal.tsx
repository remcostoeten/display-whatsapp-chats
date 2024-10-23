"use client"

import { Calendar, Clock, MessageSquare, Users } from "lucide-react"
import * as React from "react"
import { Bar, BarChart, Line, LineChart, Pie, PieChart } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ChatStatistics {
    chatId: string
    chatName: string
    totalMessages: number
    activeUsers: number
    averageResponseTime: number
    messagesByDay: { date: string; count: number }[]
    messagesByHour: { hour: number; count: number }[]
    topUsers: { name: string; messages: number }[]
    sentimentAnalysis: { sentiment: string; percentage: number }[]
    wordFrequency: { word: string; count: number }[]
}

interface ChatStatisticsModalProps {
    chatId: string
}

export function ChatStatisticsModal({ chatId }: ChatStatisticsModalProps) {
    const [statistics, setStatistics] = React.useState<ChatStatistics | null>(null)

    React.useEffect(() => {
        // Fetch chat statistics
        const fetchStatistics = async () => {
            // Replace this with your actual API call
            const response = await fetch(`/api/chat/${chatId}/statistics`)
            const data = await response.json()
            setStatistics(data)
        }

        fetchStatistics()
    }, [chatId])

    if (!statistics) {
        return null
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View Statistics</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{statistics.chatName} Statistics</DialogTitle>
                    <DialogDescription>Comprehensive analytics for this chat</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                        <TabsContent value="overview">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <StatCard
                                    icon={MessageSquare}
                                    title="Total Messages"
                                    value={statistics.totalMessages.toLocaleString()}
                                />
                                <StatCard
                                    icon={Users}
                                    title="Active Users"
                                    value={statistics.activeUsers.toLocaleString()}
                                />
                                <StatCard
                                    icon={Clock}
                                    title="Avg. Response Time"
                                    value={`${statistics.averageResponseTime.toFixed(2)}s`}
                                />
                                <StatCard
                                    icon={Calendar}
                                    title="Most Active Day"
                                    value={getMostActiveDay(statistics.messagesByDay)}
                                />
                            </div>
                        </TabsContent>
                        <TabsContent value="activity">
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Messages by Day</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer config={{ messages: { label: "Messages", color: "hsl(var(--chart-1))" } }} className="h-[200px]">
                                            <BarChart data={statistics.messagesByDay}>
                                                <Bar dataKey="count" fill="var(--color-messages)" radius={[4, 4, 0, 0]} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Messages by Hour</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer config={{ messages: { label: "Messages", color: "hsl(var(--chart-2))" } }} className="h-[200px]">
                                            <LineChart data={statistics.messagesByHour}>
                                                <Line type="monotone" dataKey="count" stroke="var(--color-messages)" strokeWidth={2} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                            </LineChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="users">
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top Users</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer config={{ messages: { label: "Messages", color: "hsl(var(--chart-3))" } }} className="h-[300px]">
                                            <BarChart data={statistics.topUsers} layout="vertical">
                                                <Bar dataKey="messages" fill="var(--color-messages)" radius={[0, 4, 4, 0]} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="content">
                            <div className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Sentiment Analysis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer config={{
                                            positive: { label: "Positive", color: "hsl(var(--chart-4))" },
                                            neutral: { label: "Neutral", color: "hsl(var(--chart-5))" },
                                            negative: { label: "Negative", color: "hsl(var(--chart-6))" },
                                        }} className="h-[300px]">
                                            <PieChart>
                                                <Pie
                                                    data={statistics.sentimentAnalysis}
                                                    dataKey="percentage"
                                                    nameKey="sentiment"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="var(--color-positive)"
                                                    label
                                                />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                            </PieChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Word Frequency</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ChartContainer config={{ frequency: { label: "Frequency", color: "hsl(var(--chart-7))" } }} className="h-[300px]">
                                            <BarChart data={statistics.wordFrequency} layout="vertical">
                                                <Bar dataKey="count" fill="var(--color-frequency)" radius={[0, 4, 4, 0]} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                            </BarChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

function StatCard({ icon: Icon, title, value }: { icon: React.ElementType; title: string; value: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

function getMostActiveDay(messagesByDay: { date: string; count: number }[]): string {
    const mostActive = messagesByDay.reduce((max, current) => (current.count > max.count ? current : max))
    return new Date(mostActive.date).toLocaleDateString('en-US', { weekday: 'long' })
}
