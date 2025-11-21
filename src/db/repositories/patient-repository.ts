import { desc, eq } from 'drizzle-orm'
import type { Patient } from '../../types/patient.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class PatientRepository {
	async findAll(): Promise<Patient[]> {
		const patients = await db
			.select()
			.from(schema.patient)
			.orderBy(desc(schema.patient.createdAt))

		return patients.map((patient) => ({
			...patient,
			birthDate: new Date(patient.birthDate),
		}))
	}

	async findById(id: string): Promise<Patient | null> {
		const [patient] = await db
			.select()
			.from(schema.patient)
			.where(eq(schema.patient.id, id))

		if (!patient) {
			return null
		}

		return {
			...patient,
			birthDate: new Date(patient.birthDate),
		}
	}

	async findByEmail(email: string): Promise<Patient | null> {
		const [patient] = await db
			.select()
			.from(schema.patient)
			.where(eq(schema.patient.email, email))

		if (!patient) {
			return null
		}

		return {
			...patient,
			birthDate: new Date(patient.birthDate),
		}
	}

	async findByCpf(cpf: string): Promise<Patient | null> {
		const [patient] = await db
			.select()
			.from(schema.patient)
			.where(eq(schema.patient.cpf, cpf))

		if (!patient) {
			return null
		}

		return {
			...patient,
			birthDate: new Date(patient.birthDate),
		}
	}

	async create(data: Patient): Promise<{ id: string }> {
		const [newPatient] = await db
			.insert(schema.patient)
			.values({
				...data,
				birthDate:
					data.birthDate instanceof Date
						? data.birthDate.toISOString().split('T')[0]
						: data.birthDate,
			})
			.returning({ id: schema.patient.id })

		return newPatient
	}
}

export const patientRepository = new PatientRepository()
