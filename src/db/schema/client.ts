import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const client = pgTable('client', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	name: text().notNull(),
	email: text().notNull().unique(),
	phone: text().notNull(),
	cpf: text().notNull().unique(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})
