import { neon, NeonQueryFunction, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

type DatabaseConfig = {
	POSTGRES_URL: string
	SCHEMA: string
	MESSAGES: string
	FAVORITES: string
}

const databaseConfig: DatabaseConfig = {
	POSTGRES_URL: process.env.POSTGRES_URL || '',
	SCHEMA: process.env.SCHEMA || '',
	MESSAGES: process.env.MESSAGES || '',
	FAVORITES: process.env.FAVORITES || ''
}

let sql: NeonQueryFunction<boolean, boolean>
let db: ReturnType<typeof drizzle>
let pool: Pool

if (typeof window === 'undefined') {
	sql = neon(databaseConfig.POSTGRES_URL)
	db = drizzle(sql, {
		schema: {
			messages: databaseConfig.MESSAGES,
			favorites: databaseConfig.FAVORITES
		}
	})
	pool = new Pool({ connectionString: databaseConfig.POSTGRES_URL })
}

export { db, pool, sql }
