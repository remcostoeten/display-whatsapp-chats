import { ChatMessages } from "@/components/chat-messages"
import { getChatMessages } from "@/core/server/actions/chats/chat-action"

export default async function ChatPage({ params, searchParams }: { params: { id: string }, searchParams: { page?: string } }) {
	const page = searchParams.page ? parseInt(searchParams.page, 10) : 1
	const initialData = await getChatMessages(params.id, page, 30)

	return (
		<div className="flex flex-col h-screen">
			<div className="flex-1 overflow-y-auto">
				<ChatMessages
					chatId={params.id}
				/>
			</div>
		</div>
	)
}
