import { hash } from 'bcrypt'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { userRepository } from '../../../db/repositories/user-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'

const createUserSchema = z.object({
	fullName: z.string(),
	username: z.string(),
	email: z.email(),
	password: z.string().min(8),
	role: z.enum(['basic', 'admin']).optional().default('basic'),
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
			const { fullName, username, email, password, confirmPassword, role } =
				request.body

			const userByEmail = await userRepository.findByEmail(email)

			if (userByEmail) {
				return reply.status(400).send({ message: 'Email already exists' })
			}

			if (password !== confirmPassword) {
				return reply.status(400).send({ message: 'Passwords do not match' })
			}

			const encryptedPassword = await hash(password, 10)

			const { id } = await userRepository.create({
				fullName,
				username,
				email,
				password: encryptedPassword,
				role,
			})

			return reply.status(201).send({ id })
		},
	)
}
