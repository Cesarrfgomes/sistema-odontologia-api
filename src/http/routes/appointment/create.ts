import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { appointmentRepository } from '../../../db/repositories/appointment-repository.ts'
import { patientRepository } from '../../../db/repositories/patient-repository.ts'
import { procedureRepository } from '../../../db/repositories/procedure-repository.ts'
import { userRepository } from '../../../db/repositories/user-repository.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'
import { NotFoundError } from '../_errors/not-found-error.ts'

export const createAppointmentRoute: FastifyPluginCallbackZod = (app) => {
	app.addHook('preHandler', verifyJwt)

	app.post(
		'/agendamentos',
		{
			schema: {
				body: z.object({
					scheduleDate: z.string(),
					scheduleTime: z.string(),
					patientId: z.string(),
					procedureId: z.string(),
					doctorId: z.string(),
				}),
				response: {
					201: z.object({
						id: z.number(),
					}),
					400: z.object({
						message: z.string(),
					}),
					404: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { scheduleDate, scheduleTime, patientId, procedureId, doctorId } =
				request.body

			const userId = request.user?.sub

			if (!userId) {
				throw new NotFoundError('Usuário não autenticado')
			}

			const user = await userRepository.findById(userId)

			if (!user) {
				throw new NotFoundError('Usuário não encontrado')
			}

			const _doctor = await userRepository.findById(doctorId)

			const patient = await patientRepository.findById(patientId)

			if (!patient) {
				throw new NotFoundError('Paciente não encontrado')
			}

			const procedure = await procedureRepository.findById(procedureId)

			if (!procedure) {
				throw new NotFoundError('Procedimento não encontrado')
			}

			const appointment = await appointmentRepository.create({
				scheduleDate,
				scheduleTime,
				patientId,
				procedureId,
				doctorId,
				userId,
			})

			return reply.status(201).send({ id: appointment.id })
		},
	)
}
