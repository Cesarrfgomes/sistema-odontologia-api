import {
	boolean,
	integer,
	numeric,
	pgTable,
	text,
	timestamp
} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { procedureCategory } from './procedure-category.ts'

export const procedure = pgTable('procedimento', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	name: text('nome').notNull(),
	description: text('descricao').notNull(),
	categoryId: text('categoria_id')
		.notNull()
		.references(() => procedureCategory.id),
	value: numeric('valor', { precision: 10, scale: 2 }).notNull(),
	durationInMinutes: integer('duracao_em_minutos').notNull(),
	isActive: boolean('ativo').notNull().default(true),
	createdAt: timestamp('criado_em').notNull().defaultNow()
})
