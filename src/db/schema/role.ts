import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { profile } from './profile.ts'

export const role = pgTable('funcao', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: text('nome').notNull(),
	profileId: integer('perfil_id')
		.references(() => profile.id)
		.notNull(),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
})
