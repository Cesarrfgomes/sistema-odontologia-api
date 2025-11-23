import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { supplierRepository } from '../../../db/repositories/supplier-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'

const createSupplierSchema = z.object({
	supplier: z.string().min(1),
	email: z.email(),
	phoneNumber: z.string().min(1),
	isActive: z.boolean().optional().default(true),
})

export const createSupplier: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/fornecedores',
		{
			schema: {
				tags: ['suppliers'],
				description: 'Criar um novo fornecedor',
				body: createSupplierSchema,
				response: {
					201: z.object({
						id: z.number(),
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
			const { supplier, email, phoneNumber, isActive } = request.body

			const supplierByEmail = await supplierRepository.findByEmail(email)

			if (supplierByEmail) {
				return reply.status(400).send({ message: 'Email já cadastrado' })
			}

			const newSupplier = await supplierRepository.create({
				supplier,
				email,
				phoneNumber,
				isActive,
			})

			return reply.status(201).send({ id: newSupplier.id })
		},
	)
}
