import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const users = pgTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	hashedPassword: text('hashed_password').notNull(),
	isAdmin: boolean('is_admin').notNull().default(false)
})

export const sessions = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
})

export const authenticationSchema = z.object({
	email: z.string().email().min(5).max(31),
	password: z
		.string()
		.min(4, { message: 'must be at least 4 characters long' })
		.max(15, { message: 'cannot be more than 15 characters long' })
})

export const isAdminEmail = (email: string) => {
	const adminEmail = process.env.ADMIN_EMAIL
	return adminEmail ? email === adminEmail : false
}

export const authRelations = relations(users, ({ many }) => ({
	sessions: many(sessions)
}))

export type UsernameAndPassword = z.infer<typeof authenticationSchema>
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
