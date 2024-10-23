"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart } from "recharts"

interface MessageTimelineProps {
    data: {
        date: string
        messages: number
    }[]
    className?: string
}

export default function MessageTimeline({ data, className }: MessageTimelineProps) {
    return (
        <Card className={className}>

            <CardHeader>
                <CardTitle>Message Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        messages: {
                            label: "Messages",
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                    className="h-[300px]"
                >
                    <BarChart data={data}>
                        <Bar dataKey="messages" fill="var(--color-messages)" radius={[4, 4, 0, 0]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                    <LineChart data={data}>
                        <Line
                            type="monotone"
                            dataKey="messages"
                            stroke="var(--color-messages)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
