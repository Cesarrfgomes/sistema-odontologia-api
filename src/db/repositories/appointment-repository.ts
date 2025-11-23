import { desc, eq } from 'drizzle-orm'
import type { Appointment } from '../../types/appoinment.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

type AppointmentCreate = {
	scheduleDate: string
	scheduleTime: string
	patientId: string
	procedureId: string
	userId: string
	doctorId: string
	status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETO'
}

type AppointmentResponse = {
	id: number
}

export class AppointmentRepository {
	async findAll(): Promise<Appointment[]> {
		const appointments = await db
			.select()
			.from(schema.appointment)
			.orderBy(desc(schema.appointment.createdAt))

		return appointments
	}

	async findById(id: number): Promise<Appointment | null> {
		const [appointment] = await db
			.select()
			.from(schema.appointment)
			.where(eq(schema.appointment.id, id))

		return appointment
	}

	async create(data: AppointmentCreate): Promise<AppointmentResponse> {
		const [appointment] = await db
			.insert(schema.appointment)
			.values(data)
			.returning()

		return {
			id: appointment.id,
		}
	}
}

export const appointmentRepository = new AppointmentRepository()
