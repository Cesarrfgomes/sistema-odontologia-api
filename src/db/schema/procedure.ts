import {
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { procedureCategory } from './procedure-category.ts'

export const procedureStatus = pgEnum('procedure_status', ['ativo', 'inativo'])

export const procedure = pgTable('procedure', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	name: text().notNull(),
	description: text().notNull(),
	categoryId: text('category_id')
		.notNull()
		.references(() => procedureCategory.id),
	value: numeric('value', { precision: 10, scale: 2 }).notNull(),
	durationInMinutes: integer('duration_in_minutes').notNull(),
	status: procedureStatus().default('ativo').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})
