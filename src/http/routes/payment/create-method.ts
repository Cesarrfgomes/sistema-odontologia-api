import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { paymentMethodRepository } from '../../../db/repositories/payment-method-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'
import { BadRequestError } from '../_errors/bad-request-error.ts'

const createPaymentMethodSchema = z.object({
	name: z.string().min(1),
	installmentMax: z.number().int().positive().default(1),
	maximumTerm: z.number().int().positive().default(30),
	isActive: z.boolean().optional().default(true),
})

export const createPaymentMethod: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/cobrancas',
		{
			schema: {
				tags: ['payments'],
				description: 'Criar um novo método de cobrança',
				body: createPaymentMethodSchema,
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
			const { name, installmentMax, maximumTerm, isActive } = request.body

			const paymentMethodByName = await paymentMethodRepository.findByName(name)

			if (paymentMethodByName) {
				throw new BadRequestError('Método de pagamento já existe')
			}

			const paymentMethod = await paymentMethodRepository.create({
				name,
				installmentMax,
				maximumTerm,
				isActive,
			})

			return reply.status(201).send({ id: paymentMethod.id })
		},
	)
}
