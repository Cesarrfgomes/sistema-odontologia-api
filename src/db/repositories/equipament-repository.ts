import { desc, eq } from 'drizzle-orm'
import type { Equipament } from '../../types/equipament.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class EquipamentRepository {
	async findAll(): Promise<Equipament[]> {
		return await db
			.select()
			.from(schema.equipament)
			.orderBy(desc(schema.equipament.createdAt))
	}

	async findById(id: number): Promise<Equipament | null> {
		const [equipament] = await db
			.select()
			.from(schema.equipament)
			.where(eq(schema.equipament.id, id))

		if (!equipament) {
			return null
		}

		return equipament
	}

	async findByBarCode(barCode: string): Promise<Equipament | null> {
		const [equipament] = await db
			.select()
			.from(schema.equipament)
			.where(eq(schema.equipament.barCode, barCode))

		if (!equipament) {
			return null
		}

		return equipament
	}

	async create(data: Equipament): Promise<{ id: number }> {
		const [newEquipament] = await db
			.insert(schema.equipament)
			.values(data)
			.returning({ id: schema.equipament.id })

		return newEquipament
	}
}

export const equipamentRepository = new EquipamentRepository()
