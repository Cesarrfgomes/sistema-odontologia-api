import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const userRole = pgEnum('role', ['basic', 'admin', 'doctor'])

export const user = pgTable('user', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	username: text().notNull().unique(),
	fullName: text('full_name').notNull(),
	email: text().notNull().unique(),
	password: text().notNull(),
	role: userRole().default('basic').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})
