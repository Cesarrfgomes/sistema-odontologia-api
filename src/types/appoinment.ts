export type Appointment = {
	id: number
	patientId: string
	procedureId: string
	scheduleDate: string
	scheduleTime: string
	userId: string
	doctorId: string
	status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'COMPLETO'
	createdAt: Date
	updatedAt: Date
}

export type AppointmentPayment = {
	appointmentId: number
	paymentId: number
	paymentPlanId: number
	paymentStatus: string
	value: number
	createdAt: Date
	updatedAt: Date
}

export type AppointmentEquipament = {
	appointmentId: number
	equipamentId: number
	quantity: number
	createdAt: Date
	updatedAt: Date
}
