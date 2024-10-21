import { Session } from 'inspector'
import { User } from 'lucia'
import {
	NewUser,
	UsernameAndPassword,
	authRelations,
	authenticationSchema,
	isAdminEmail,
	sessions,
	users
} from './auth'

// Re-export everything from auth schema
export * from './auth'

// Export specific tables for drizzle config and queries
export const tables = {
	// Auth tables
	users,
	sessions
	// Add other tables as your app grows
	// chats,
	// messages,
	// etc.
} as const

// Export all relations
export const relations = {
	authRelations
	// Add other relations as your app grows
	// chatRelations,
	// messageRelations,
	// etc.
} as const

// Export schema validators
export const validators = {
	authenticationSchema
	// Add other validators as your app grows
	// chatSchema,
	// messageSchema,
	// etc.
} as const

// Helper type to infer all tables
export type Tables = typeof tables
export type TableName = keyof Tables

// Re-export commonly used types
export type { NewUser, Session, User, UsernameAndPassword }

// Re-export helpers
export { isAdminEmail }
