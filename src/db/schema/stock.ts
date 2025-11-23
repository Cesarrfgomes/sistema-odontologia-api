import { integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core'
import { equipament } from './equipament.ts'

export const stock = pgTable(
	'estoque',
	{
		equipamentId: integer('equipamento_id')
			.references(() => equipament.id)
			.notNull(),
		quantity: integer('qt').notNull().default(0),
		minimumQuantity: integer('qt_minima').notNull().default(0),
		createdAt: timestamp('criado_em').notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.equipamentId] })],
)
