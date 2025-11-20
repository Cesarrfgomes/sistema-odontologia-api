import z from "zod";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { userRepository } from "../../../db/repositories/user-repository.ts";
import { hash } from "bcrypt";

const createUserSchema = z.object({
    fullName: z.string(),
    username: z.string(),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
})

export const createUser: FastifyPluginCallbackZod = (app) => {
    app.post('/usuarios', {
        schema: {
            tags: ['users'],
            body: createUserSchema,
            response: {
                201: z.object({
                    id: z.string(),
                }),
                400: z.object({
                    message: z.string(),
                }),
            }
        },
    }, async (request, reply) => {
        const { fullName, username, email, password, confirmPassword } = request.body

        const userByEmail = await userRepository.findByEmail(email)

        if (userByEmail) {
                return reply.status(400).send({ message: 'Email already exists' })
        }

        if (password !== confirmPassword) {
            return reply.status(400).send({ message: 'Passwords do not match' })
        }

        const encryptedPassword = await hash(password, 10)

        const { id } = await userRepository.create({ fullName, username, email, password: encryptedPassword })

        return reply.status(201).send({ id })
    })
}
