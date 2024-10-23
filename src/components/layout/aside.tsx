"use client"

import { MessageSquare } from "lucide-react"
import Link from "next/link"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/core/lib/utils"
import { ChatStatisticsModal } from "../cmodal"

interface Chat {
  id: string
  name: string
  lastMessage: string
  messages: number
}

interface DashboardSidebarProps {
  chats: Chat[]
}

export function DashboardSidebar({ chats }: DashboardSidebarProps) {
  return (
    <div className="w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-2 p-4">
          {chats.map((chat) => (
            <ContextMenu key={chat.id}>
              <ContextMenuTrigger asChild>
                <Link
                  href={`/chat/${chat.id}`}
                  className={cn(
                    "flex items-center space-x-4 rounded-lg p-2",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground focus:outline-none"
                  )}
                >
                  <MessageSquare className="h-5 w-5 shrink-0" />
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <p className="truncate text-sm font-medium leading-none">{chat.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{chat.lastMessage}</p>
                  </div>
                  <div className="shrink-0 text-xs text-muted-foreground">{chat.messages}</div>
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-64">
                <ContextMenuItem>
                  <ChatStatisticsModal chatId={chat.id} />
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
