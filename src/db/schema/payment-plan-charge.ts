import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { paymentMethod } from './payment-method.ts'
import { paymentPlan } from './payment-plan.ts'

export const paymentPlanCharge = pgTable(
	'plano_pagamento_cobranca',
	{
		paymentPlanId: text('plano_pagamento_id')
			.notNull()
			.references(() => paymentPlan.id),
		paymentMethodId: text('cobranca_id')
			.notNull()
			.references(() => paymentMethod.id),
		createdAt: timestamp('criado_em').notNull().defaultNow(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.paymentPlanId, table.paymentMethodId],
		}),
	}),
)
