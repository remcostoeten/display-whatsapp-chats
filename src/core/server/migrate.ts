import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { env } from '@/core/config/env.mjs'

const runMigrate = async () => {
	const connection = postgres(env.POSTGRES_URL, { max: 1 })
	const db = drizzle(connection)

	console.log('Running migrations...')

	await migrate(db, { migrationsFolder: './src/core/server/migrations' })

	console.log('Migrations complete!')

	await connection.end()
}

runMigrate().catch(err => {
	console.error('Migration failed!')
	console.error(err)
	process.exit(1)
})
