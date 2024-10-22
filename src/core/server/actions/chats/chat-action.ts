'use server'

import { db } from 'db'
import { desc, eq, sql } from 'drizzle-orm'
import { messages } from '../../schema'

export async function getChatMessages(chatId: string, page: number, pageSize: number) {
    const offset = (page - 1) * pageSize
    const messagesResult = await db
        .select({
            id: messages.id,
            name: messages.name,
            message: messages.message,
            timestamp: messages.timestamp,
            attachment: messages.attachment,
        })
        .from(messages)
        .where(eq(messages.chatId, chatId))
        .orderBy(desc(messages.timestamp))
        .limit(pageSize)
        .offset(offset)

    const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(messages)
        .where(eq(messages.chatId, chatId))

    const totalPages = Math.ceil(totalCount[0].count / pageSize)

    return {

        messages: messagesResult,
        totalPages: totalPages
    }
}

export async function getChats() {
    const chats = await db
        .select({
            chatId: messages.chatId,
            lastMessage: messages.message,
            timestamp: messages.timestamp,
        })
        .from(messages)
        .orderBy(desc(messages.timestamp))
        .groupBy(messages.chatId)

    return chats.map(chat => ({
        id: chat.chatId,
        lastMessage: chat.lastMessage,
        timestamp: chat.timestamp?.toISOString(),
    }))
}

export async function searchMessages(chatId: string, query: string) {
    const searchResults = await db
        .select({
            id: messages.id,
            message: messages.message,
            timestamp: messages.timestamp,
        })
        .from(messages)
        .where(sql`${messages.chatId} = ${chatId} AND ${messages.message} ILIKE ${`%${query}%`}`)
        .orderBy(desc(messages.timestamp))
        .limit(20)

    return searchResults.map((result, index) => ({
        index: index,
        message: result.message,
        timestamp: result.timestamp?.toISOString(),
    }))
}
export async function getChatOverview() {
    const result = await db
        .select({
            chatId: messages.chatId,
            count: sql<number>`count(*)`,
        })
        .from(messages)
        .groupBy(messages.chatId)
        .orderBy(desc(sql<number>`count(*)`))
        .limit(5)

    return result.map(row => ({
        name: row.chatId,
        messages: row.count,
    }))
}

export async function getMessageTimeline() {
    const result = await db
        .select({
            date: sql<string>`date_trunc('month', ${messages.timestamp})`,
            count: sql<number>`count(*)`,
        })
        .from(messages)
        .groupBy(sql`date_trunc('month', ${messages.timestamp})`)
        .orderBy(sql`date_trunc('month', ${messages.timestamp})`)
        .limit(12)

    return result.map(row => ({
        date: new Date(row.date).toString().slice(0, 7), // Format as YYYY-MM
        messages: row.count,
    }))
}
