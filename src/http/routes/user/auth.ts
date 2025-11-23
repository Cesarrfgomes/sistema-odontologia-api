import { compare } from 'bcrypt'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { userRepository } from '../../../db/repositories/user-repository.ts'
import { UnauthorizedError } from '../_errors/unauthorized-error.ts'

const authSchema = z.object({
	username: z.string(),
	password: z.string(),
})

export const auth: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/auth',
		{
			schema: {
				tags: ['users'],
				description: 'Autenticar um usuário',
				body: authSchema,
				response: {
					200: z.object({
						access_token: z.string(),
					}),
					401: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { username, password } = request.body

			const user = await userRepository.findByUsername(username)

			if (!user) {
				throw new UnauthorizedError('Credenciais inválidas')
			}

			const isPasswordValid = await compare(password, user.password)

			if (!isPasswordValid) {
				throw new UnauthorizedError('Credenciais inválidas')
			}

			const token = await reply.jwtSign({
				sub: user.id,
			})

			return reply.status(200).send({ access_token: token })
		},
	)
}
