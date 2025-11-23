import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { profile } from './profile.ts'

export const user = pgTable('usuario', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	username: text('username').notNull().unique(),
	fullName: text('nome').notNull(),
	email: text('email').notNull().unique(),
	password: text('senha').notNull(),
	profileId: integer('perfil_id')
		.references(() => profile.id)
		.notNull(),
	isActive: boolean('ativo').notNull().default(true),
	createdAt: timestamp('criado_em').notNull().defaultNow(),
})
