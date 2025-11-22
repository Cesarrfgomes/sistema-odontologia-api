import {
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp
} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { procedureCategory } from './procedure-category.ts'

export const procedureStatus = pgEnum('procedure_status', ['ativo', 'inativo'])

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
	status: procedureStatus().default('ativo').notNull(),
	createdAt: timestamp('criado_em').notNull().defaultNow()
})
