import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { paymentPlanRepository } from '../../../db/repositories/payment-plan-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'
import { BadRequestError } from '../_errors/bad-request-error.ts'

const createPaymentPlanSchema = z.object({
	name: z.string().min(1),
	installmentMax: z.number().int().positive().default(1),
	maximumterm: z.number().int().positive().default(30),
	paymentType: z.enum(['VV', 'VP']),
	isActive: z.boolean().optional().default(true),
})

export const createPaymentPlan: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/planos-pagamento',
		{
			schema: {
				tags: ['payments'],
				description: 'Criar um novo plano de pagamento',
				body: createPaymentPlanSchema,
				response: {
					201: z.object({
						id: z.string(),
					}),
					400: z.object({
						message: z.string(),
					}),
					401: z.object({
						message: z.string(),
						code: z.string(),
					}),
				},
			},
			onRequest: [verifyJwt, verifyAdmin],
		},
		async (request, reply) => {
			const { name, installmentMax, maximumterm, paymentType, isActive } =
				request.body

			const paymentPlanByName = await paymentPlanRepository.findByName(name)

			if (paymentPlanByName) {
				throw new BadRequestError('Plano de pagamento já existe')
			}

			const paymentPlan = await paymentPlanRepository.create({
				name,
				installmentMax,
				maximumterm,
				paymentType,
				isActive,
			})

			return reply.status(201).send({ id: paymentPlan.id })
		},
	)
}
