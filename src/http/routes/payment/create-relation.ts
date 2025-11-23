import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db/connection.ts'
import { paymentMethodRepository } from '../../../db/repositories/payment-method-repository.ts'
import { paymentPlanRepository } from '../../../db/repositories/payment-plan-repository.ts'
import { schema } from '../../../db/schema/index.ts'

export const createPaymentRelation: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/pagamento/relacionar',
		{
			schema: {
				tags: ['payments'],
				description:
					'Relacionar um plano de pagamento com um método de pagamento',
				body: z.object({
					paymentPlanId: z.string(),
					paymentMethodId: z.string(),
				}),
				response: {
					204: z.object({
						message: z.string(),
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
			const { paymentPlanId, paymentMethodId } = request.body

			const paymentPlan = await paymentPlanRepository.findById(paymentPlanId)

			if (!paymentPlan) {
				return reply.status(404).send({
					message: 'Plano de pagamento não encontrado',
				})
			}

			const paymentMethod =
				await paymentMethodRepository.findById(paymentMethodId)

			if (!paymentMethod) {
				return reply.status(404).send({
					message: 'Método de pagamento não encontrado',
				})
			}

			if (paymentPlan.paymentType === 'VP') {
				if (paymentMethod.maximumTerm < paymentPlan.maximumterm) {
					return reply.status(400).send({
						message:
							'O método de pagamento não suporta o número de parcelas do plano de pagamento',
					})
				}

				await db.insert(schema.paymentPlanCharge).values({
					paymentMethodId: paymentMethod?.id ?? '',
					paymentPlanId: paymentPlan.id ?? '',
				})

				return reply.status(204).send()
			}

			await db.insert(schema.paymentPlanCharge).values({
				paymentMethodId: paymentMethod?.id ?? '',
				paymentPlanId: paymentPlan.id ?? '',
			})

			return reply.status(204).send()
		},
	)
}
