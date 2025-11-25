import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/connection.ts'
import { paymentMethodRepository } from '../../../db/repositories/payment-method-repository.ts'
import { paymentPlanRepository } from '../../../db/repositories/payment-plan-repository.ts'
import { schema } from '../../../db/schema/index.ts'
import { BadRequestError } from '../_errors/bad-request-error.ts'
import { NotFoundError } from '../_errors/not-found-error.ts'

export const createPaymentRelation: FastifyPluginCallbackZod = app => {
	app.post(
		'/pagamento/relacionar',
		{
			schema: {
				tags: ['payments'],
				description:
					'Relacionar um plano de pagamento com um método de pagamento',
				body: z.object({
					paymentPlanId: z.string(),
					paymentMethodId: z.string()
				}),
				response: {
					204: z.object({
						message: z.string()
					}),
					400: z.object({
						message: z.string()
					}),
					404: z.object({
						message: z.string()
					})
				}
			}
		},
		async (request, reply) => {
			const { paymentPlanId, paymentMethodId } = request.body

			const paymentPlan = await paymentPlanRepository.findById(
				paymentPlanId
			)

			if (!paymentPlan) {
				throw new NotFoundError('Plano de pagamento não encontrado')
			}

			const paymentMethod = await paymentMethodRepository.findById(
				paymentMethodId
			)

			if (!paymentMethod) {
				throw new NotFoundError('Método de pagamento não encontrado')
			}

			if (paymentPlan.paymentType === 'VP') {
				if (paymentMethod.maximumTerm < paymentPlan.maximumterm) {
					throw new BadRequestError(
						'O método de pagamento não suporta o número de parcelas do plano de pagamento'
					)
				}

				await db.insert(schema.paymentPlanCharge).values({
					paymentMethodId: paymentMethod?.id ?? '',
					paymentPlanId: paymentPlan.id ?? ''
				})

				return reply.status(204).send()
			}

			await db.insert(schema.paymentPlanCharge).values({
				paymentMethodId: paymentMethod?.id ?? '',
				paymentPlanId: paymentPlan.id ?? ''
			})

			return reply.status(204).send()
		}
	)
}
