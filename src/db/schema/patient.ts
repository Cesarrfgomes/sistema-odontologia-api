import { date, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const patient = pgTable('paciente', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	fullName: text('nome').notNull(),
	email: text('email').notNull().unique(),
	phoneNumber: text('telefone').notNull(),
	cpf: text('cpf').notNull().unique(),
	birthDate: date('data_nascimento').notNull(),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
	updatedAt: timestamp('atualizado_em').notNull().defaultNow()
})
