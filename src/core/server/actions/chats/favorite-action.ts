'use server'

import { db } from 'db'
import { favorites, messages } from 'schema'
import { desc, eq } from 'drizzle-orm'

export async function addFavorite(userId: string, messageId: number) {
	await db.insert(favorites).values({
		messageId,
		userId: 'default-user' // Since there's no authentication, we'll use a default user
	})
}

export async function removeFavorite(messageId: number) {
	await db.delete(favorites).where(eq(favorites.messageId, messageId))
}

export async function isFavorite(userId: string, messageId: number) {
	const result = await db
		.select({ id: favorites.id })
		.from(favorites)
		.where(eq(favorites.messageId, messageId))
		.limit(1)

	return result.length > 0
}

export async function getFavoriteMessages() {
	const result = await db
		.select({
			id: messages.id,
			chatId: messages.chatId,
			message: messages.message,
			timestamp: messages.timestamp,
			name: messages.name
		})
		.from(favorites)
		.innerJoin(messages, eq(favorites.messageId, messages.id))
		.orderBy(desc(favorites.createdAt))
		.limit(50)

	return result
}
