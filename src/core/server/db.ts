import { createClient } from '@supabase/supabase-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

type DatabaseConfig = {
	POSTGRES_URL: string
	SUPABASE_URL: string
	SUPABASE_ANON_KEY: string
	ADMIN_EMAIL: string
}

const databaseConfig: DatabaseConfig = {
	POSTGRES_URL: process.env.POSTGRES_URL || '',
	SUPABASE_URL: process.env.SUPABASE_URL || '',
	SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
	ADMIN_EMAIL: process.env.ADMIN_EMAIL || ''
}

let db: ReturnType<typeof drizzle>
let supabase: ReturnType<typeof createClient>

if (typeof window === 'undefined') {
	const client = postgres(databaseConfig.POSTGRES_URL, { ssl: 'require' })
	db = drizzle(client)

	supabase = createClient(
		databaseConfig.SUPABASE_URL,
		databaseConfig.SUPABASE_ANON_KEY
	)
}

export { db, supabase }

export const isAdminEmail = (email: string) => {
	return email === databaseConfig.ADMIN_EMAIL
}
