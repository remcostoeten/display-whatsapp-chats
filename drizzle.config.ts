export default {
	schema: './src/core/server/schema/index.ts',
	out: './src/core/server/migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.POSTGRES_URL,
		ssl: {
			rejectUnauthorized: false
		}
	}
}
