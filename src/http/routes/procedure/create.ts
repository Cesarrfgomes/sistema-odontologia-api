import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { procedureCategoryRepository } from '../../../db/repositories/procedure-category-repository.ts'
import { procedureRepository } from '../../../db/repositories/procedure-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'
import { NotFoundError } from '../_errors/not-found-error.ts'

const createProcedureSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	categoryId: z.uuid(),
	value: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid value format'),
	duration: z.string().min(1),
	status: z.enum(['ativo', 'inativo']).optional().default('ativo'),
})

export const createProcedure: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/procedimentos',
		{
			schema: {
				tags: ['procedures'],
				description: 'Criar um novo procedimento',
				body: createProcedureSchema,
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
			const { name, description, categoryId, value, duration, status } =
				request.body

			const category = await procedureCategoryRepository.findById(categoryId)

			if (!category) {
				throw new NotFoundError('Categoria não encontrada')
			}

			const procedure = await procedureRepository.create({
				name,
				description,
				categoryId,
				value,
				duration,
				status,
			})

			return reply.status(201).send({ id: procedure.id })
		},
	)
}
