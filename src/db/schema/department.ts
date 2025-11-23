import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const department = pgTable('departamento', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('nome').notNull(),
	isActive: boolean('ativo').notNull().default(true),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
})
