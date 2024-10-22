import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const messages = pgTable('messages', {
    id: text('id').primaryKey(),
    chatId: text('chat_id').notNull(),
    name: text('name').notNull(),
    message: text('message').notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
    attachment: text('attachment'),
});

export const favorites = pgTable('favorites', {
    id: text('id').primaryKey(),
    messageId: text('message_id').notNull().references(() => messages.id),
    userId: text('user_id').notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const chatSettings = pgTable('chat_settings', {
    chatId: text('chat_id').primaryKey(),
    pinCode: text('pin_code'),
    failedAttempts: integer('failed_attempts').default(0),
    lastFailedAttempt: timestamp('last_failed_attempt'),
});
