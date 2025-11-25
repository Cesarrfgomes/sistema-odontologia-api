import { hash } from 'bcrypt'
import { reset, seed } from 'drizzle-seed'
import { db, sql } from './connection.ts'
import { schema } from './schema/index.ts'

await reset(db, schema)

const hashedPassword = await hash('12345678', 8)

// 1. Profile (sem dependências)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.profile]).refine(f => ({
		profile: {
			name: f.firstName(),
			isActive: f.boolean()
		}
	}))
}

// 2. Role (depende de profile)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.role]).refine(f => async () => ({
		role: {
			name: f.firstName(),
			profileId: f.valuesFromArray({
				values: await db
					.select()
					.from(schema.profile)
					.then(res => res.map(r => r.id))
			})
		}
	}))
}

// 3. User (depende de role)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.user]).refine(f => async () => ({
		user: {
			id: f.uuid(),
			fullName: f.fullName(),
			username: `${f.firstName()}${f.int({
				minValue: 1,
				maxValue: 9999
			})}`,
			email: f.email(),
			password: f.default({ defaultValue: hashedPassword }),
			roleId: f.valuesFromArray({
				values: await db
					.select()
					.from(schema.role)
					.then(res => res.map(r => r.id))
			}),
			isActive: f.boolean()
		}
	}))
}

// 4. Patient (sem dependências)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.patient]).refine(f => ({
		patient: {
			id: f.uuid(),
			fullName: f.fullName(),
			email: f.email(),
			phoneNumber: f.phoneNumber(),
			birthDate: f.date({
				minDate: new Date('1940-01-01'),
				maxDate: new Date()
			}),
			cpf: f
				.int({ minValue: 10000000000, maxValue: 99999999999 })
				.toString(),
			isActive: f.boolean()
		}
	}))
}

// 5. ProcedureCategory (sem dependências)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.procedureCategory]).refine(f => ({
		procedureCategory: {
			id: f.uuid(),
			name: f.firstName()
		}
	}))
}

// 6. Procedure (depende de procedureCategory)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.procedure]).refine(f => async () => ({
		procedure: {
			id: f.uuid(),
			name: f.firstName(),
			description: f.loremIpsum({ sentencesCount: 3 }),
			categoryId: f.valuesFromArray({
				values: await db
					.select()
					.from(schema.procedureCategory)
					.then(res => res.map(r => r.id))
			}),
			value: f.int({ minValue: 100, maxValue: 1000 }).toString(),
			durationInMinutes: f.int({ minValue: 10, maxValue: 120 }),
			isActive: f.boolean()
		}
	}))
}

// 7. PaymentMethod (sem dependências)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.paymentMethod]).refine(f => ({
		paymentMethod: {
			id: f.uuid(),
			name: f.firstName(),
			installmentMax: f.int({ minValue: 1, maxValue: 12 }),
			maximumTerm: f.int({ minValue: 30, maxValue: 365 }),
			isActive: f.boolean()
		}
	}))
}

// 8. PaymentPlan (sem dependências)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.paymentPlan]).refine(f => ({
		paymentPlan: {
			id: f.uuid(),
			name: f.firstName(),
			installmentMax: f.int({ minValue: 1, maxValue: 12 }),
			maximumterm: f.int({ minValue: 30, maxValue: 365 }),
			paymentType: f.valuesFromArray({ values: ['VV', 'VP'] }),
			isActive: f.boolean()
		}
	}))
}

// 9. PaymentPlanCharge (depende de paymentPlan e paymentMethod)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.paymentPlanCharge]).refine(f => async () => {
		const paymentPlans = await db
			.select()
			.from(schema.paymentPlan)
			.then(res => res.map(r => r.id))
		const paymentMethods = await db
			.select()
			.from(schema.paymentMethod)
			.then(res => res.map(r => r.id))

		return {
			paymentPlanCharge: {
				paymentPlanId: f.valuesFromArray({ values: paymentPlans }),
				paymentMethodId: f.valuesFromArray({ values: paymentMethods })
			}
		}
	})
}

// 10. Department (sem dependências)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.department]).refine(f => ({
		department: {
			name: f.firstName(),
			isActive: f.boolean()
		}
	}))
}

// 11. Supplier (sem dependências)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.supplier]).refine(f => ({
		supplier: {
			supplier: f.firstName(),
			email: f.email(),
			phoneNumber: f.phoneNumber(),
			isActive: f.boolean()
		}
	}))
}

// 12. Equipament (depende de supplier e department)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.equipament]).refine(f => async () => {
		const suppliers = await db
			.select()
			.from(schema.supplier)
			.then(res => res.map(r => r.id))
		const departments = await db
			.select()
			.from(schema.department)
			.then(res => res.map(r => r.id))

		return {
			equipament: {
				description: f.loremIpsum({ sentencesCount: 2 }),
				barCode: f
					.int({ minValue: 100000000000, maxValue: 999999999999 })
					.toString(),
				supplierId: f.valuesFromArray({ values: suppliers }),
				departmentId: f.valuesFromArray({ values: departments }),
				isActive: f.boolean()
			}
		}
	})
}

// 13. Stock (depende de equipament)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.stock]).refine(f => async () => ({
		stock: {
			equipamentId: f.valuesFromArray({
				values: await db
					.select()
					.from(schema.equipament)
					.then(res => res.map(r => r.id))
			}),
			quantity: f.int({ minValue: 0, maxValue: 1000 }),
			minimumQuantity: f.int({ minValue: 0, maxValue: 100 })
		}
	}))
}

// 14. MaterialEntry (depende de equipament e supplier)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.materialEntry]).refine(f => async () => {
		const equipaments = await db
			.select()
			.from(schema.equipament)
			.then(res => res.map(r => r.id))
		const suppliers = await db
			.select()
			.from(schema.supplier)
			.then(res => res.map(r => r.id))

		return {
			materialEntry: {
				equipamentId: f.valuesFromArray({ values: equipaments }),
				supplierId: f.valuesFromArray({ values: suppliers }),
				quantity: f.int({ minValue: 1, maxValue: 100 })
			}
		}
	})
}

// 15. Appointment (depende de patient, procedure, user)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.appointment]).refine(f => async () => {
		const patients = await db
			.select()
			.from(schema.patient)
			.then(res => res.map(r => r.id))
		const procedures = await db
			.select()
			.from(schema.procedure)
			.then(res => res.map(r => r.id))
		const users = await db
			.select()
			.from(schema.user)
			.then(res => res.map(r => r.id))

		return {
			appointment: {
				patientId: f.valuesFromArray({ values: patients }),
				procedureId: f.valuesFromArray({ values: procedures }),
				scheduleDate: f.date({
					minDate: new Date(),
					maxDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
				}),
				scheduleTime: f.time(),
				userId: f.valuesFromArray({ values: users }),
				doctorId: f.valuesFromArray({ values: users }),
				status: f.valuesFromArray({
					values: ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'COMPLETO']
				}),
				paymentStatus: f.valuesFromArray({
					values: ['PENDENTE', 'PAGO']
				})
			}
		}
	})
}

// 16. AppointmentPayment (depende de appointment, paymentMethod, paymentPlan)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.appointmentPayment]).refine(f => async () => {
		const appointments = await db
			.select()
			.from(schema.appointment)
			.then(res => res.map(r => r.id))
		const paymentMethods = await db
			.select()
			.from(schema.paymentMethod)
			.then(res => res.map(r => r.id))
		const paymentPlans = await db
			.select()
			.from(schema.paymentPlan)
			.then(res => res.map(r => r.id))

		return {
			appointmentPayment: {
				appointmentId: f.valuesFromArray({ values: appointments }),
				paymentId: f.valuesFromArray({ values: paymentMethods }),
				paymentPlanId: f.valuesFromArray({ values: paymentPlans }),
				paymentStatus: f.valuesFromArray({
					values: ['PENDENTE', 'PAGO']
				}),
				value: f.int({ minValue: 50, maxValue: 5000 }).toString()
			}
		}
	})
}

// 17. AppointmentEquipament (depende de appointment e equipament)
for (let i = 0; i < 20; i++) {
	await seed(db, [schema.appointmentEquipament]).refine(f => async () => {
		const appointments = await db
			.select()
			.from(schema.appointment)
			.then(res => res.map(r => r.id))
		const equipaments = await db
			.select()
			.from(schema.equipament)
			.then(res => res.map(r => r.id))

		return {
			appointmentEquipament: {
				appointmentId: f.valuesFromArray({ values: appointments }),
				equipamentId: f.valuesFromArray({ values: equipaments }),
				quantity: f.int({ minValue: 1, maxValue: 10 })
			}
		}
	})
}

await sql.end()

console.log('Database seeded successfully with 20 records of each table')
