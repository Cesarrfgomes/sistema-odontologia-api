import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { appointmentRepository } from '../../../db/repositories/appointment-repository.ts'
import { procedureRepository } from '../../../db/repositories/procedure-repository.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'
import { NotFoundError } from '../_errors/not-found-error.ts'
import { stockRepository } from '../../../db/repositories/stock-repository.ts'

export const finalizeAppointment: FastifyPluginCallbackZod = app => {
	app.addHook('preHandler', verifyJwt)

	app.post(
		'/agendamentos/:id/finalizar',
		{
			schema: {
				params: z.object({
					id: z.coerce.number()
				}),
				body: z.object({
					payments: z.array(
						z.object({
							paymentMethodId: z.string(),
							paymentPlanId: z.string(),
							amount: z.coerce.number().positive()
						})
					),
					equipaments: z.array(
						z.object({
							equipamentId: z.number(),
							quantity: z.coerce.number().positive()
						})
					)
				})
			}
		},
		async (request, reply) => {
			const { id } = request.params
			const { payments, equipaments } = request.body

			const appointment = await appointmentRepository.findById(id)

			if (!appointment) {
				throw new NotFoundError('Agendamento não encontrado')
			}

			const procedure = await procedureRepository.findById(
				appointment.procedureId
			)

			if (!procedure) {
				throw new NotFoundError('Procedimento não encontrado')
			}

			let amountToPay = 0

			for (const payment of payments) {
				amountToPay += payment.amount
			}

			if (amountToPay !== Number(procedure.value)) {
				for (const payment of payments) {
					await appointmentRepository.cretePayment({
						appointmentId: appointment.id,
						paymentId: payment.paymentMethodId,
						paymentPlanId: payment.paymentPlanId,
						paymentStatus: 'PAGO',
						value: payment.amount
					})
				}

				for (const equipament of equipaments) {
					await appointmentRepository.creteEquipament({
						appointmentId: appointment.id,
						equipamentId: equipament.equipamentId,
						quantity: equipament.quantity
					})

					const stock = await stockRepository.findByEquipamentId(
						equipament.equipamentId
					)

					await stockRepository.update(equipament.equipamentId, {
						quantity: stock!.quantity - equipament.quantity
					})
				}

				await appointmentRepository.update(appointment.id, {
					status: 'COMPLETO'
				})

				return reply.status(200).send({
					message: 'Agendamento finalizado com sucesso'
				})
			}

			for (const payment of payments) {
				await appointmentRepository.cretePayment({
					appointmentId: appointment.id,
					paymentId: payment.paymentMethodId,
					paymentPlanId: payment.paymentPlanId,
					paymentStatus: 'PAGO',
					value: payment.amount
				})
			}

			for (const equipament of equipaments) {
				await appointmentRepository.creteEquipament({
					appointmentId: appointment.id,
					equipamentId: equipament.equipamentId,
					quantity: equipament.quantity
				})
			}

			await appointmentRepository.update(appointment.id, {
				status: 'COMPLETO',
				paymentStatus: 'PAGO'
			})

			return reply.status(200).send({
				message: 'Agendamento finalizado com sucesso'
			})
		}
	)
}
