import { SearchBar } from "../_components/search-bar";

export default function ChatPage({ params }: { params: { id: string } }) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border">
                <SearchBar chatId={params.id} />
            </div>
            <div className="flex-1 overflow-hidden">
                <ChatMessages chatId={params.id} />
            </div>
        </div>
    )
}
