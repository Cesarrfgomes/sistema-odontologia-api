import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const supplier = pgTable('fornecedor', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	supplier: text('fornecedor').notNull(),
	email: text('email').notNull().unique(),
	phoneNumber: text('telefone').notNull(),
	isActive: boolean('ativo').notNull().default(true),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
})
