import { hash } from 'bcrypt'
import { reset, seed } from 'drizzle-seed'
import { db, sql } from './connection.ts'
import { schema } from './schema/index.ts'

await reset(db, schema)

await seed(db, [schema.client]).refine((f) => {
	return {
		client: {
			name: f.firstName(),
			email: f.email(),
			phone: f.phoneNumber(),
			cpf: f.int({ minValue: 10000000000, maxValue: 99999999999 }),
		},
	}
})

await seed(db, [schema.user]).refine((f) => {
	return async () => {
		return {
			user: {
				fullName: f.firstName(),
				username: f.firstName(),
				email: f.email(),
				password: f.default({
					defaultValue: (await hash('12345678', 8)) as string,
				}),
				role: f.valuesFromArray({ values: ['basic', 'admin'] }),
			},
		}
	}
})

await sql.end()

console.log('Database seeded successfully')
