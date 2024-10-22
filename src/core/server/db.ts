import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

// For Next.js, ensure to use edge-runtime compatible config
if (!process.env.POSTGRES_URL) {
	throw new Error('POSTGRES_URL is missing')
}

const pool = new Pool({
	connectionString: process.env.POSTGRES_URL,
	ssl: true // Railway requires SSL
})

export const db = drizzle(pool)
