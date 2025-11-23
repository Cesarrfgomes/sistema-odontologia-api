import { hash } from 'bcrypt'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { profileRepository } from '../../../db/repositories/profile-repository.ts'
import { userRepository } from '../../../db/repositories/user-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'
import { BadRequestError } from '../_errors/bad-request-error.ts'
import { NotFoundError } from '../_errors/not-found-error.ts'

const createUserSchema = z.object({
	fullName: z.string(),
	username: z.string(),
	email: z.email(),
	password: z.string().min(8),
	profileId: z.number().int().positive(),
	confirmPassword: z.string().min(8),
})

export const createUser: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/usuarios',
		{
			schema: {
				tags: ['users'],
				description: 'Criar um novo usuário',
				body: createUserSchema,
				response: {
					201: z.object({
						id: z.string(),
					}),
					400: z.object({
						message: z.string(),
					}),
				},
			},
			onRequest: [verifyJwt, verifyAdmin],
		},
		async (request, reply) => {
			const {
				fullName,
				username,
				email,
				password,
				confirmPassword,
				profileId,
			} = request.body

			const userByEmail = await userRepository.findByEmail(email)

			if (userByEmail) {
				return reply.status(400).send({ message: 'Email already exists' })
			}

			const profile = await profileRepository.findById(profileId)

			if (!profile) {
				throw new NotFoundError('Perfil não encontrado')
			}

			if (password !== confirmPassword) {
				throw new BadRequestError('Senhas não conferem')
			}

			const encryptedPassword = await hash(password, 10)

			const { id } = await userRepository.create({
				fullName,
				username,
				email,
				password: encryptedPassword,
				profileId,
			})

			return reply.status(201).send({ id })
		},
	)
}
