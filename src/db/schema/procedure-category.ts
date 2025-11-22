import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const procedureCategory = pgTable('categoria_procedimento', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	name: text('nome').notNull().unique(),
	createdAt: timestamp('criado_em').notNull().defaultNow()
})
