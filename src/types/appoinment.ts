export type Appointment = {
	id: number
	patientId: string
	procedureId: string
	scheduleDate: string
	scheduleTime: string
	userId: string
	doctorId: string
	status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETO'
	paymentStatus: 'PENDENTE' | 'PAGO'
	createdAt: Date
	updatedAt: Date
}

export type AppointmentPayment = {
	appointmentId: number
	paymentId: string
	paymentPlanId: string
	paymentStatus: 'PENDENTE' | 'PAGO'
	value: number
	createdAt?: Date
	updatedAt?: Date
}

export type AppointmentEquipament = {
	appointmentId: number
	equipamentId: number
	quantity: number
	createdAt?: Date
	updatedAt?: Date
}
