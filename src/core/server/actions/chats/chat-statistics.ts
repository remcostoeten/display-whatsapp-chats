'use server'

import { db } from 'db'
import { messages } from 'schema'
import { desc, eq, sql } from 'drizzle-orm'

export async function getChatStatistics(chatId: string) {
	const messageCount = await db
		.select({ count: sql<number>`count(*)` })
		.from(messages)
		.where(eq(messages.chatId, chatId))

	const participantCount = await db
		.select({ count: sql<number>`count(DISTINCT ${messages.name})` })
		.from(messages)
		.where(eq(messages.chatId, chatId))

	const firstMessage = await db
		.select({ timestamp: messages.timestamp })
		.from(messages)
		.where(eq(messages.chatId, chatId))
		.orderBy(messages.timestamp)
		.limit(1)

	const lastMessage = await db
		.select({ timestamp: messages.timestamp })
		.from(messages)
		.where(eq(messages.chatId, chatId))
		.orderBy(desc(messages.timestamp))
		.limit(1)

	return {
		messageCount: messageCount[0].count,
		participantCount: participantCount[0].count,
		firstMessageDate: firstMessage[0]?.timestamp?.toISOString() || null,
		lastMessageDate: lastMessage[0]?.timestamp?.toISOString() || null
	}
}
