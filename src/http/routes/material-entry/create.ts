import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { equipamentRepository } from '../../../db/repositories/equipament-repository.ts'
import { materialEntryRepository } from '../../../db/repositories/material-entry-repository.ts'
import { stockRepository } from '../../../db/repositories/stock-repository.ts'
import { supplierRepository } from '../../../db/repositories/supplier-repository.ts'
import { verifyAdmin } from '../../middleware/verify-admin.ts'
import { verifyJwt } from '../../middleware/verify-jwt.ts'

const createMaterialEntrySchema = z.object({
	equipamentId: z.number().int().positive(),
	supplierId: z.number().int().positive(),
	quantity: z.number().int().positive(),
	entryDate: z.coerce.date().optional(),
})

export const createMaterialEntry: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/entradas-material',
		{
			schema: {
				tags: ['material-entries'],
				description: 'Criar uma nova entrada de material',
				body: createMaterialEntrySchema,
				response: {
					201: z.object({
						txId: z.number(),
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
			const { equipamentId, supplierId, quantity, entryDate } = request.body

			const equipament = await equipamentRepository.findById(equipamentId)

			if (!equipament) {
				return reply.status(400).send({ message: 'Equipamento não encontrado' })
			}

			const supplier = await supplierRepository.findById(supplierId)

			if (!supplier) {
				return reply.status(400).send({ message: 'Fornecedor não encontrado' })
			}

			const newMaterialEntry = await materialEntryRepository.create({
				equipamentId,
				supplierId,
				quantity,
				entryDate,
			})

			const stock = await stockRepository.findByEquipamentId(equipamentId)

			if (!stock) {
				await stockRepository.create({
					equipamentId,
					quantity: quantity,
					minimumQuantity: 0,
				})
			}

			await stockRepository.update(equipamentId, {
				quantity: (stock?.quantity ?? 0) + (quantity ?? 0),
			})

			return reply.status(201).send({ txId: newMaterialEntry.txId })
		},
	)
}
