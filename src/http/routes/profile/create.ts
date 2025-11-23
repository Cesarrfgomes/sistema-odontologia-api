import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { profileRepository } from '../../../db/repositories/profile-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'

const createProfileSchema = z.object({
	name: z.string().min(1),
	isActive: z.boolean().optional().default(true),
})

export const createProfile: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/perfis',
		{
			schema: {
				tags: ['profiles'],
				description: 'Criar um novo perfil',
				body: createProfileSchema,
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

			const profileByName = await profileRepository.findByName(name)

			if (profileByName) {
				return reply.status(400).send({ message: 'Nome já cadastrado' })
			}

			const newProfile = await profileRepository.create({
				name,
				isActive,
			})

			return reply.status(201).send({ id: newProfile.id })
		},
	)
}
