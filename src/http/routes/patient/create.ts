import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { patientRepository } from '../../../db/repositories/patient-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'

const createPatientSchema = z.object({
	fullName: z.string(),
	email: z.email(),
	phoneNumber: z.string().min(10).max(15),
	birthDate: z.date(),
	cpf: z.string().min(11).max(14),
})

export const createPatient: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/pacientes',
		{
			schema: {
				tags: ['patients'],
				description: 'Criar um novo paciente',
				body: createPatientSchema,
				response: {
					201: z.object({
						id: z.string(),
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
			const { fullName, email, phoneNumber, cpf, birthDate } = request.body

			const patientByEmail = await patientRepository.findByEmail(email)

			if (patientByEmail) {
				return reply.status(400).send({ message: 'Email already exists' })
			}

			const patientByCpf = await patientRepository.findByCpf(cpf)

			if (patientByCpf) {
				return reply.status(400).send({ message: 'CPF already exists' })
			}

			const patient = await patientRepository.create({
				fullName,
				email,
				phoneNumber,
				cpf,
				birthDate,
			})

			return reply.status(201).send({ id: patient.id })
		},
	)
}
