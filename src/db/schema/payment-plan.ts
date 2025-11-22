import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp
} from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

const paymentType = pgEnum('tipo_pagamento', ['VV', 'VP'])

export const paymentPlan = pgTable('plano_pagamento', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	name: text('nome').notNull().unique(),
	installmentMax: integer('parcelas_maximas').notNull().default(1),
	maximumterm: integer('prazo_maximo').notNull().default(30),
	paymentType: paymentType().notNull(),
	isActive: boolean('ativo').notNull().default(true),
	createdAt: timestamp('criado_em').notNull().defaultNow()
})
