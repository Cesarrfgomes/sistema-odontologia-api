import { hash } from 'bcrypt'
import { reset, seed } from 'drizzle-seed'
import { db, sql } from './connection.ts'
import { schema } from './schema/index.ts'

await reset(db, schema)

await seed(db, [schema.patient]).refine((f) => {
	return {
		patient: {
			id: f.uuid(),
			fullName: f.fullName(),
			email: f.email(),
			phoneNumber: f.phoneNumber(),
			birthDate: f.date({
				minDate: new Date('1940-01-01'),
				maxDate: new Date(),
			}),
			cpf: f.int({ minValue: 10000000000, maxValue: 99999999999 }),
		},
	}
})

await seed(db, [schema.user]).refine((f) => {
	return async () => {
		return {
			user: {
				id: f.uuid(),
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

await seed(db, [schema.procedureCategory, schema.procedure]).refine((f) => {
	return async () => {
		return {
			procedureCategory: {
				id: f.uuid(),
				name: f.firstName(),
			},
			procedure: {
				id: f.uuid(),
				name: f.firstName(),
				description: f.loremIpsum({ sentencesCount: 3 }),
				categoryId: f.valuesFromArray({
					values: await db
						.select()
						.from(schema.procedureCategory)
						.then((res) => res.map((r) => r.id)),
				}),
				value: f.int({ minValue: 100, maxValue: 1000 }).toString(),
				durationInMinutes: f.int({ minValue: 10, maxValue: 120 }),
				status: f.valuesFromArray({ values: ['ativo', 'inativo'] }),
			},
		}
	}
})

await sql.end()

console.log('Database seeded successfully')
