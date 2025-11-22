import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const userRole = pgEnum('papel', ['basico', 'admin', 'medico'])
export const userStatus = pgEnum('status', ['ativo', 'inativo'])

export const user = pgTable('usuario', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	username: text('username').notNull().unique(),
	fullName: text('nome').notNull(),
	email: text('email').notNull().unique(),
	password: text('senha').notNull(),
	role: userRole().default('basico').notNull(),
	status: userStatus().default('ativo').notNull(),
	createdAt: timestamp('criado_em').notNull().defaultNow()
})
