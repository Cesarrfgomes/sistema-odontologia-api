import { date, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'

export const patient = pgTable('patient', {
	id: text()
		.primaryKey()
		.$default(() => uuidv7()),
	fullName: text('full_name').notNull(),
	email: text().notNull().unique(),
	phoneNumber: text('phone_number').notNull(),
	cpf: text().notNull().unique(),
	birthDate: date('birth_date').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
