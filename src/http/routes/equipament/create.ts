import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { departmentRepository } from '../../../db/repositories/department-repository.ts'
import { equipamentRepository } from '../../../db/repositories/equipament-repository.ts'
import { supplierRepository } from '../../../db/repositories/supplier-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'
import { BadRequestError } from '../_errors/bad-request-error.ts'
import { NotFoundError } from '../_errors/not-found-error.ts'

const createEquipamentSchema = z.object({
	description: z.string().min(1),
	barCode: z.string().min(1),
	supplierId: z.number().int().positive().optional().nullable(),
	departmentId: z.number().int().positive().optional().nullable(),
	isActive: z.boolean().optional().default(true),
})

export const createEquipament: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/equipamentos',
		{
			schema: {
				tags: ['equipaments'],
				description: 'Criar um novo equipamento',
				body: createEquipamentSchema,
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
			const { description, barCode, supplierId, departmentId, isActive } =
				request.body

			const equipamentByBarCode =
				await equipamentRepository.findByBarCode(barCode)

			if (equipamentByBarCode) {
				throw new BadRequestError('Código de barras já existe')
			}

			if (supplierId) {
				const supplier = await supplierRepository.findById(supplierId)

				if (!supplier) {
					throw new NotFoundError('Fornecedor não encontrado')
				}
			}

			if (departmentId) {
				const department = await departmentRepository.findById(departmentId)

				if (!department) {
					throw new BadRequestError('Departamento não encontrado')
				}
			}

			const equipament = await equipamentRepository.create({
				description,
				barCode,
				supplierId: supplierId ?? null,
				departmentId: departmentId ?? null,
				isActive,
			})

			return reply.status(201).send({ id: equipament.id })
		},
	)
}
