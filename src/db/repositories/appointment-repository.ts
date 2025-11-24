import { desc, eq } from 'drizzle-orm'
import type {
	Appointment,
	AppointmentEquipament,
	AppointmentPayment,
} from '../../types/appoinment.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

type AppointmentCreate = {
	scheduleDate: string
	scheduleTime: string
	patientId: string
	procedureId: string
	userId: string
	doctorId: string
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

	async cretePayment(data: AppointmentPayment): Promise<void> {
		await db
			.insert(schema.appointmentPayment)
			.values({
				appointmentId: data.appointmentId,
				paymentId: data.paymentId,
				paymentPlanId: data.paymentPlanId,
				value: data.value.toString(),
				paymentStatus: data.paymentStatus,
			})
			.returning()
	}

	async creteEquipament(data: AppointmentEquipament): Promise<void> {
		await db.insert(schema.appointmentEquipament).values(data).returning()
	}

	async update(id: number, data: Partial<Appointment>): Promise<void> {
		await db
			.update(schema.appointment)
			.set(data)
			.where(eq(schema.appointment.id, id))
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
