import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const procedureCategory = pgTable('procedure_category', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	name: text().notNull().unique(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})
