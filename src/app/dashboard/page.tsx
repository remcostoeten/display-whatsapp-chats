import { Metadata } from 'next'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { DashboardHeader } from '@/components/layout/header'
import { DashboardStats } from '@/components/layout/dashboard-stats'
import { ChatOverview } from '@/components/layout/chat-overview'
import MessageTimeline from '@/components/layout/message-timeline'
import { getChatOverview, getDashboardStats, getMessageTimeline, getChats } from '@/core/server/actions'
import { DashboardSidebar } from '@/components/layout/aside'

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Chat application dashboard and analytics',
}

export default async function DashboardPage() {
    const stats = await getDashboardStats()
    const chatOverview = await getChatOverview()
    const messageTimeline = await getMessageTimeline()
    const chats = await getChats()

    return (
        <div className="flex h-screen overflow-hidden">
            <DashboardSidebar chats={chats} />
            <DashboardShell className="flex-1 overflow-y-auto">
                <DashboardHeader
                    heading="Dashboard"
                    text="Overview of your chat application statistics and analytics."
                />
                <div className="grid gap-4 md:gap-8 p-4 md:p-8">
                    <DashboardStats data={stats} />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <ChatOverview data={chatOverview} className="md:col-span-1 lg:col-span-4" />
                        <MessageTimeline data={messageTimeline} className="md:col-span-1 lg:col-span-3" />
                    </div>
                </div>
            </DashboardShell>
        </div>
    )
}
