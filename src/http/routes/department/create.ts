import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { departmentRepository } from '../../../db/repositories/department-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'
import { BadRequestError } from '../_errors/bad-request-error.ts'

const createDepartmentSchema = z.object({
	name: z.string().min(1),
	isActive: z.boolean().optional().default(true),
})

export const createDepartment: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/departamentos',
		{
			schema: {
				tags: ['departments'],
				description: 'Criar um novo departamento',
				body: createDepartmentSchema,
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
			const { name, isActive } = request.body

			const departmentByName = await departmentRepository.findByName(name)

			if (departmentByName) {
				throw new BadRequestError('Nome já cadastrado')
			}

			const newDepartment = await departmentRepository.create({
				name,
				isActive,
			})

			return reply.status(201).send({ id: newDepartment.id })
		},
	)
}
