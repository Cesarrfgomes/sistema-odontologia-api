import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const profile = pgTable('perfil', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('nome').notNull().unique(),
	isActive: boolean('ativo').notNull().default(true),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
})
