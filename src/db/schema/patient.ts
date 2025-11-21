import { date, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const patient = pgTable('patient', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	fullName: text().notNull(),
	email: text().notNull().unique(),
	phoneNumber: text().notNull(),
	cpf: text().notNull().unique(),
	birthDate: date('birth_date').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
})
