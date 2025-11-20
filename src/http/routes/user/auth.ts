import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod"
import z from "zod"
import { userRepository } from "../../../db/repositories/user-repository.ts"
import { compare } from "bcrypt"
import { env } from "../../../env/index.ts"

export const auth: FastifyPluginCallbackZod = (app) => {
    app.post('/auth', {
        schema: {
            tags: ['users'],
            body: z.object({
                username: z.string(),
                password: z.string(),
            }),
            response: {
                200: z.object({
                    token: z.string(),
                }),
                401: z.object({
                    message: z.string(),
                }),
            }
        },
    }, async (request, reply) => {
        const { username, password } = request.body

        const user = await userRepository.findByUsername(username)

        if (!user) {
            return reply.status(401).send({ message: 'Invalid credentials' })
        }

        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) {
            return reply.status(401).send({ message: 'Invalid credentials' })
        }

        const token = await reply.jwtSign(
            {},
            {
            sign: {
                sub: user.id,
            }
        })

        return reply.status(200).send({ token })
    })
}
