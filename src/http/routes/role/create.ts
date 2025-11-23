import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { profileRepository } from '../../../db/repositories/profile-repository.ts'
import { roleRepository } from '../../../db/repositories/role-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'

const createRoleSchema = z.object({
	name: z.string().min(1),
	profileId: z.number().int().positive(),
})

export const createRole: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/funcoes',
		{
			schema: {
				tags: ['roles'],
				description: 'Criar uma nova função',
				body: createRoleSchema,
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
			const { name, profileId } = request.body

			const profile = await profileRepository.findById(profileId)

			if (!profile) {
				return reply.status(400).send({ message: 'Perfil não encontrado' })
			}

			const newRole = await roleRepository.create({
				name,
				profileId,
			})

			return reply.status(201).send({ id: newRole.id })
		},
	)
}
