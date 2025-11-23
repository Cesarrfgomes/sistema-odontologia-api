import { desc, eq } from 'drizzle-orm'
import type { Stock } from '../../types/stock.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class StockRepository {
	async findAll(): Promise<Stock[]> {
		return await db
			.select()
			.from(schema.stock)
			.orderBy(desc(schema.stock.createdAt))
	}

	async findByEquipamentId(equipamentId: number): Promise<Stock | null> {
		const [stock] = await db
			.select()
			.from(schema.stock)
			.where(eq(schema.stock.equipamentId, equipamentId))

		if (!stock) {
			return null
		}

		return stock
	}

	async create(data: Stock): Promise<{ equipamentId: number }> {
		const [newStock] = await db
			.insert(schema.stock)
			.values(data)
			.returning({ equipamentId: schema.stock.equipamentId })

		return newStock
	}

	async update(equipamentId: number, data: Partial<Stock>): Promise<void> {
		await db
			.update(schema.stock)
			.set(data)
			.where(eq(schema.stock.equipamentId, equipamentId))
	}
}

export const stockRepository = new StockRepository()
