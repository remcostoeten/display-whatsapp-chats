'use server'

import { db } from 'db'
import { desc, eq, sql } from 'drizzle-orm'
import { chatSettings, messages } from 'schema'
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
export async function getChats() {
    try {
        console.log('Fetching chats...')
        const result = await db
            .select({
                chatId: messages.chatId,
                lastMessage: sql<string>`MAX(${messages.message})`.as('lastMessage'),
                timestamp: sql<string>`MAX(${messages.timestamp})`.as('timestamp'),
                name: sql<string>`MAX(${messages.name})`.as('name'),
                pinCode: chatSettings.pinCode,
            })
            .from(messages)
            .leftJoin(chatSettings, eq(messages.chatId, chatSettings.chatId))
            .groupBy(messages.chatId, chatSettings.pinCode)
            .orderBy(desc(sql`MAX(${messages.timestamp})`))
            .limit(50)

        console.log('Fetched chats:', result)

        const chats = result.map(chat => ({
            id: chat.chatId,
            lastMessage: chat.lastMessage ? chat.lastMessage.replace(/[\u{1F600}-\u{1F64F}]/gu, '') : null,
            timestamp: chat.timestamp?.toString() || null,
            name: chat.name,
            isProtected: !!chat.pinCode,
        }))

        console.log('Processed chats:', chats)
        return chats
    } catch (error) {
        console.error('Error fetching chats:', error)
        throw error
    }
}

export async function getChatMessages(chatId: string, page: number, pageSize: number) {
    try {
        const offset = (page - 1) * pageSize

        const result = await db
            .select()
            .from(messages)
            .where(sql`${messages.chatId} = ${chatId}`)
            .orderBy(desc(messages.timestamp))
            .limit(pageSize)
            .offset(offset)

        const totalCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(messages)
            .where(sql`${messages.chatId} = ${chatId}`)

        const totalPages = Math.ceil(totalCount[0].count / pageSize)

        return {
            messages: result.map(msg => ({
                id: msg.id,
                name: msg.name,
                message: msg.message,
                timestamp: msg.timestamp.toString(),
                attachment: msg.attachment,
            })),
            totalPages,
        }
    } catch (error) {
        console.error('Error fetching chat messages:', error)
        throw error
    }
}

export async function getChatStatistics(chatId: string) {
    try {
        const messageCount = await db
            .select({ count: sql<number>`count(*)` })
            .from(messages)
            .where(sql`${messages.chatId} = ${chatId}`)

        const participantCount = await db
            .select({ count: sql<number>`count(DISTINCT ${messages.name})` })
            .from(messages)
            .where(sql`${messages.chatId} = ${chatId}`)

        const firstMessage = await db
            .select({ timestamp: messages.timestamp })
            .from(messages)
            .where(sql`${messages.chatId} = ${chatId}`)
            .orderBy(messages.timestamp)
            .limit(1)

        const lastMessage = await db
            .select({ timestamp: messages.timestamp })
            .from(messages)
            .where(sql`${messages.chatId} = ${chatId}`)
            .orderBy(desc(messages.timestamp))
            .limit(1)

        return {
            messageCount: messageCount[0].count,
            participantCount: participantCount[0].count,
            firstMessageDate: firstMessage[0]?.timestamp?.toString() || null,
            lastMessageDate: lastMessage[0]?.timestamp?.toString() || null,
        }
    } catch (error) {
        console.error('Error fetching chat statistics:', error)
        throw error
    }
}
export async function getDashboardStats() {
    const totalChats = await db
        .select({ count: sql<number>`count(DISTINCT ${messages.chatId})` })
        .from(messages)

    const totalMessages = await db
        .select({ count: sql<number>`count(*)` })
        .from(messages)

    const uniqueContacts = await db
        .select({ count: sql<number>`count(DISTINCT ${messages.name})` })
        .from(messages)

    const dateRange = await db
        .select({
            min: sql<string>`min(${messages.timestamp})`,
            max: sql<string>`max(${messages.timestamp})`,
        })
        .from(messages)

    return {
        totalChats: totalChats[0].count,
        totalMessages: totalMessages[0].count,
        uniqueContacts: uniqueContacts[0].count,
        dateRange: `${new Date(dateRange[0].min).getFullYear()} - ${new Date(dateRange[0].max).getFullYear()}`,
    }
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
