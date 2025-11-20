import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { clientRepository } from "../../../db/repositories/client-repository.ts";

const createClientSchema = z.object({
    name: z.string(),
    email: z.email(),
    phone: z.string().min(10).max(15),
    cpf: z.string().min(11).max(14),
})

export const createClient: FastifyPluginCallbackZod = (app) => {
    app.post('/clientes', {
        schema: {
            body: createClientSchema,
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
        const { name, email, phone, cpf } = request.body

        const clientByEmail = await clientRepository.findByEmail(email)

        if (clientByEmail) {
            return reply.status(400).send({ message: 'Email already exists' })
        }

        const clientByCpf = await clientRepository.findByCpf(cpf)

        if (clientByCpf) {
            return reply.status(400).send({ message: 'CPF already exists' })
        }

        const client = await clientRepository.create({ name, email, phone, cpf })

        return reply.status(201).send({ id: client.id })
    })
}
