import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { procedureCategoryRepository } from '../../../db/repositories/procedure-category-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'

const createProcedureCategorySchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
})

export const createProcedureCategory: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/procedimentos/categorias',
		{
			schema: {
				tags: ['procedures'],
				body: createProcedureCategorySchema,
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
			const { name, description } = request.body

			const categoryByName = await procedureCategoryRepository.findByName(name)

			if (categoryByName) {
				return reply.status(400).send({ message: 'Category name already exists' })
			}

			const category = await procedureCategoryRepository.create({
				name,
				description,
			})

			return reply.status(201).send({ id: category.id })
		},
	)
}
