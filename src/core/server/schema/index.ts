import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core'

// Messages table with optimizations
export const messages = pgTable(
	'messages',
	{
		// Use UUID instead of text for better performance
		id: varchar('id', { length: 36 }).primaryKey(),

		// Fixed-length varchar for known-length fields
		chatId: varchar('chat_id', { length: 36 }).notNull(),
		name: varchar('name', { length: 100 }).notNull(),

		// Keep text for variable-length content
		message: text('message').notNull(),

		// Use timestamptz for timezone awareness
		timestamp: timestamp('timestamp', { withTimezone: true })
			.defaultNow()
			.notNull(),

		// Optional attachment field
		attachment: text('attachment')
	},
	table => {
		return {
			// Index for common queries
			chatIdIdx: index('chat_id_idx').on(table.chatId),
			// Compound index for time-based queries within a chat
			timestampIdx: index('timestamp_chat_idx').on(
				table.chatId,
				table.timestamp
			)
		}
	}
)

// Favorites table with optimizations
export const favorites = pgTable(
	'favorites',
	{
		id: varchar('id', { length: 36 }).primaryKey(),
		messageId: varchar('message_id', { length: 36 })
			.notNull()
			.references(() => messages.id),
		userId: varchar('user_id', { length: 36 }).notNull(),
		timestamp: timestamp('timestamp', { withTimezone: true })
			.defaultNow()
			.notNull()
	},
	table => {
		return {
			// Index for user's favorites queries
			userIdIdx: index('user_id_idx').on(table.userId),
			// Unique compound index to prevent duplicate favorites
			uniqueFavorite: uniqueIndex('unique_favorite_idx').on(
				table.messageId,
				table.userId
			)
		}
	}
)

// Chat settings table with optimizations
export const chatSettings = pgTable(
	'chat_settings',
	{
		chatId: varchar('chat_id', { length: 36 }).primaryKey(),
		pinCode: varchar('pin_code', { length: 64 }), // Optional pin code
		failedAttempts: integer('failed_attempts').default(0).notNull(),
		lastFailedAttempt: timestamp('last_failed_attempt', {
			withTimezone: true
		})
	},
	table => {
		return {
			// Index for failed attempts monitoring
			failedAttemptsIdx: index('failed_attempts_idx').on(
				table.failedAttempts,
				table.lastFailedAttempt
			)
		}
	}
)
