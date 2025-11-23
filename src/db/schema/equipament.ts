import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { department } from './department.ts'
import { supplier } from './supplier.ts'

export const equipament = pgTable('equipamento', {
	id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
	description: text('descricao').notNull(),
	barCode: text('codigo_barras').notNull().unique(),
	supplierId: integer('fornecedor_id').references(() => supplier.id),
	departmentId: integer('departamento_id').references(() => department.id),
	isActive: boolean('ativo').notNull().default(true),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
})
