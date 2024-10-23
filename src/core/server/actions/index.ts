'use server'

import { db } from '@/core/server/db'
import { sql } from 'drizzle-orm'
import { chatSettings, messages } from '../schema'
export async function getDashboardStats() {
	const totalMessages = await db
		.select({ count: sql<number>`count(*)` })
		.from(messages)
		.then(res => res[0].count)

	const totalChats = await db
		.select({ count: sql<number>`count(distinct ${messages.chatId})` })
		.from(messages)
		.then(res => res[0].count)

	const uniqueContacts = await db
		.select({ count: sql<number>`count(distinct ${messages.name})` })
		.from(messages)
		.then(res => res[0].count)

	const activePeriod = await db
		.select({
			start: sql<string>`min(${messages.timestamp})`,
			end: sql<string>`max(${messages.timestamp})`
		})
		.from(messages)
		.then(res => ({
			start: new Date(res[0].start).getFullYear(),
			end: new Date(res[0].end).getFullYear()
		}))

	const previousMonthMessages = await db
		.select({ count: sql<number>`count(*)` })
		.from(messages)
		.where(sql`${messages.timestamp} >= date_trunc('month', current_date - interval '1 month')
               AND ${messages.timestamp} < date_trunc('month', current_date)`)
		.then(res => res[0].count)

	const monthlyGrowth = ((totalMessages - previousMonthMessages) / previousMonthMessages) * 100

	const weeklyChatsGrowth = await db
		.select({
			current: sql<number>`count(distinct ${messages.chatId})`,
			previous: sql<number>`count(distinct case when ${messages.timestamp} < current_date - interval '1 week' then ${messages.chatId} end)`
		})
		.from(messages)
		.where(sql`${messages.timestamp} >= current_date - interval '2 weeks'`)
		.then(res => res[0].current - res[0].previous)

	const weeklyContactsGrowth = await db
		.select({
			current: sql<number>`count(distinct ${messages.name})`,
			previous: sql<number>`count(distinct case when ${messages.timestamp} < current_date - interval '1 week' then ${messages.name} end)`
		})
		.from(messages)
		.where(sql`${messages.timestamp} >= current_date - interval '2 weeks'`)
		.then(res => res[0].current - res[0].previous)

	return {
		totalMessages,
		totalChats,
		uniqueContacts,
		activePeriod: `${activePeriod.start} - ${activePeriod.end}`,
		monthlyGrowth: monthlyGrowth.toFixed(1),
		weeklyChatsGrowth,
		weeklyContactsGrowth
	}
}

export async function getChatOverview() {
	return db
		.select({
			chatId: messages.chatId,
			name: sql<string>`max(${messages.name})`,
			messageCount: sql<number>`count(*)`
		})
		.from(messages)
		.groupBy(messages.chatId)
		.orderBy(sql`count(*) desc`)
		.limit(5)
}

export async function getMessageTimeline() {
	return db
		.select({
			date: sql<string>`date_trunc('day', ${messages.timestamp})::date`,
			count: sql<number>`count(*)`
		})
		.from(messages)
		.groupBy(sql`date_trunc('day', ${messages.timestamp})::date`)
		.orderBy(sql`date_trunc('day', ${messages.timestamp})::date`)
		.limit(30)
}

export async function getChats() {
	return db
		.select({
			id: messages.chatId,
			name: sql<string>`max(${messages.name})`,
			lastMessage: sql<string>`max(${messages.message})`,
			timestamp: sql<Date>`max(${messages.timestamp})`,
			messageCount: sql<number>`count(*)`
		})
		.from(messages)
		.leftJoin(chatSettings, sql`${messages.chatId} = ${chatSettings.chatId}`)
		.groupBy(messages.chatId)
		.orderBy(sql`max(${messages.timestamp}) desc`)
}

export async function getChatStatistics(chatId: string) {
	const [basicStats, messagesByDay, messagesByHour, topUsers, wordFrequency] = await Promise.all([
		db
			.select({
				totalMessages: sql<number>`count(*)`,
				activeUsers: sql<number>`count(distinct ${messages.name})`,
				averageResponseTime: sql<number>`
          avg(extract(epoch from (${messages.timestamp} - lag(${messages.timestamp}) over (order by ${messages.timestamp}))))
        `
			})
			.from(messages)
			.where(sql`${messages.chatId} = ${chatId}`)
			.then(res => res[0]),

		db
			.select({
				date: sql<string>`date_trunc('day', ${messages.timestamp})::date`,
				count: sql<number>`count(*)`
			})
			.from(messages)
			.where(sql`${messages.chatId} = ${chatId}`)
			.groupBy(sql`date_trunc('day', ${messages.timestamp})::date`)
			.orderBy(sql`date_trunc('day', ${messages.timestamp})::date`)
			.limit(30),

		db
			.select({
				hour: sql<number>`extract(hour from ${messages.timestamp})`,
				count: sql<number>`count(*)`
			})
			.from(messages)
			.where(sql`${messages.chatId} = ${chatId}`)
			.groupBy(sql`extract(hour from ${messages.timestamp})`)
			.orderBy(sql`extract(hour from ${messages.timestamp})`),

		db
			.select({
				name: messages.name,
				messages: sql<number>`count(*)`
			})
			.from(messages)
			.where(sql`${messages.chatId} = ${chatId}`)
			.groupBy(messages.name)
			.orderBy(sql`count(*) desc`)
			.limit(10),

		db
			.select({
				word: sql<string>`word`,
				count: sql<number>`count(*)`
			})
			.from(sql`
        (SELECT unnest(string_to_array(lower(${messages.message}), ' ')) as word
         FROM ${messages}
         WHERE ${messages.chatId} = ${chatId}) as words
      `)
			.groupBy(sql`word`)
			.orderBy(sql`count(*) desc`)
			.limit(20)
	])

	// This is a placeholder for sentiment analysis
	// In a real application, you would integrate with a NLP service or implement your own algorithm
	const sentimentAnalysis = [
		{ sentiment: 'Positive', percentage: 60 },
		{ sentiment: 'Neutral', percentage: 30 },
		{ sentiment: 'Negative', percentage: 10 }
	]

	return {
		chatId,
		...basicStats,
		messagesByDay,
		messagesByHour,
		topUsers,
		wordFrequency,
		sentimentAnalysis
	}
}
