import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const paymentMethod = pgTable('cobranca', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	name: text('nome').notNull().unique(),
	installmentMax: integer('parcelas_maximas').notNull().default(1),
	maximumTerm: integer('prazo_maximo').notNull().default(30),
	isActive: boolean('ativo').notNull().default(true),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
})
