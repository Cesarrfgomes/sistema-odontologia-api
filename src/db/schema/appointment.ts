import {
	date,
	integer,
	numeric,
	pgEnum,
	pgTable,
	time,
	timestamp,
	uuid,
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

export const appointment = pgTable('agendamento', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	patientId: uuid('paciente_id')
		.references(() => patient.id)
		.notNull(),
	procedureId: uuid('procedimento_id')
		.references(() => procedure.id)
		.notNull(),
	scheduleDate: date('data').notNull(),
	scheduleTime: time('hora').notNull(),
	userId: uuid('usuario_id')
		.references(() => user.id)
		.notNull(),
	doctorId: uuid('medico_id')
		.references(() => user.id)
		.notNull(),
	status: appointmentStatus('status').notNull().default('PENDENTE'),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
	updatedAt: timestamp('atualizado_em').notNull().defaultNow(),
})

export const appointmentPaymentStatus = pgEnum('status_pagamento', [
	'PENDENTE',
	'PAGO',
])

export const appointmentPayment = pgTable('agendamento_pagamento', {
	appointmentId: integer('agendamento_id').references(() => appointment.id),
	paymentId: integer('pagamento_id').references(() => paymentMethod.id),
	paymentPlanId: integer('plano_pagamento_id').references(() => paymentPlan.id),
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
