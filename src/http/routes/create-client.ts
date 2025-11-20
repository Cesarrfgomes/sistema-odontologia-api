import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { clientRepository } from "../../db/repositories/client-repository.ts";

export const createClient: FastifyPluginCallbackZod = (app) => {
    app.post('/clientes', {
        schema: {
            body: z.object({
                name: z.string(),
                email: z.email(),
                phone: z.string().min(10).max(15),
                cpf: z.string().min(11).max(14),
            }),
        },
    }, async (request, reply) => {
        const { name, email, phone, cpf } = request.body

        const clientByEmail = await clientRepository.findByEmail(email)

        if (clientByEmail) {
            return reply.status(400).send({ error: 'Email already exists' })
        }

        const clientByCpf = await clientRepository.findByCpf(cpf)

        if (clientByCpf) {
            return reply.status(400).send({ error: 'CPF already exists' })
        }

        const client = await clientRepository.create({ name, email, phone, cpf })

        return reply.status(201).send(client[0])
    })
}
