import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { role } from './role.ts'

export const user = pgTable('usuario', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	username: text('username').notNull().unique(),
	fullName: text('nome').notNull(),
	email: text('email').notNull().unique(),
	password: text('senha').notNull(),
	roleId: integer('funcao_id')
		.references(() => role.id)
		.notNull(),
	isActive: boolean('ativo').notNull().default(true),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
})
