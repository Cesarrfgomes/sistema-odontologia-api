import {
	date,
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	time,
	timestamp,
} from 'drizzle-orm/pg-core'
import { equipament } from './equipament.ts'
import { patient } from './patient.ts'
import { paymentMethod } from './payment-method.ts'
import { paymentPlan } from './payment-plan.ts'
import { procedure } from './procedure.ts'
import { user } from './user.ts'

export const appointmentStatus = pgEnum('status_agendamento', [
	'PENDENTE',
	'CONFIRMADO',
	'CANCELADO',
	'COMPLETO',
])

export const appointmentPaymentStatus = pgEnum('status_pagamento', [
	'PENDENTE',
	'PAGO',
])

export const appointment = pgTable('agendamento', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	patientId: text('paciente_id')
		.references(() => patient.id)
		.notNull(),
	procedureId: text('procedimento_id')
		.references(() => procedure.id)
		.notNull(),
	scheduleDate: date('data').notNull(),
	scheduleTime: time('hora').notNull(),
	userId: text('usuario_id')
		.references(() => user.id)
		.notNull(),
	doctorId: text('medico_id')
		.references(() => user.id)
		.notNull(),
	status: appointmentStatus('status').notNull().default('PENDENTE'),
	paymentStatus: appointmentPaymentStatus('status_pagamento')
		.notNull()
		.default('PENDENTE'),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
	updatedAt: timestamp('atualizado_em').notNull().defaultNow(),
})

export const appointmentPayment = pgTable('agendamento_pagamento', {
	appointmentId: integer('agendamento_id').references(() => appointment.id),
	paymentId: text('pagamento_id').references(() => paymentMethod.id),
	paymentPlanId: text('plano_pagamento_id').references(() => paymentPlan.id),
	paymentStatus: appointmentPaymentStatus('status_pagamento')
		.notNull()
		.default('PENDENTE'),
	value: numeric('valor').notNull(),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
	updatedAt: timestamp('atualizado_em').notNull().defaultNow(),
})

export const appointmentEquipament = pgTable('agendamento_equipamento', {
	appointmentId: integer('agendamento_id').references(() => appointment.id),
	equipamentId: integer('equipamento_id').references(() => equipament.id),
	quantity: integer('quantidade').notNull(),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
	updatedAt: timestamp('atualizado_em').notNull().defaultNow(),
})
