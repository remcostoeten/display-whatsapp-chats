import { env } from '@/core/config/env.mjs'
import type { Config } from 'drizzle-kit'

export default {
	schema: './src/core/server/schema/index.ts',
	out: './src/core/server/migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: env.POSTGRES_URL
	}
} satisfies Config
