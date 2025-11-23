import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core'
import { equipament } from './equipament.ts'
import { supplier } from './supplier.ts'

export const materialEntry = pgTable('entrada_material', {
	txId: integer('txid').primaryKey().generatedAlwaysAsIdentity(),
	equipamentId: integer('equipamento_id')
		.references(() => equipament.id)
		.notNull(),
	supplierId: integer('fornecedor_id')
		.references(() => supplier.id)
		.notNull(),
	quantity: integer('quantidade').notNull(),
	entryDate: timestamp('data_entrada').notNull().defaultNow(),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
})
