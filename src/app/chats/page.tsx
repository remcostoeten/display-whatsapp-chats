
import ChatList from '@/components/ck'
import { WelcomeScreen } from '@/components/landing/welcome-screen'
import { LoaderWithText } from '@/components/loader'
import { getChats } from '@/core/server/actions'
import { Suspense } from 'react'

export default async function ChatsPage() {
    const chats = await getChats()

    return (
        <div className="h-full flex flex-col">
            <Suspense fallback={<LoaderWithText text="Loading chats..." />}>
                {chats.length > 0 ? (
                    <ChatList initialChats={chats} />
                ) : (
                    <WelcomeScreen />
                )}
            </Suspense>
        </div>
    )
}
