import { desc, eq } from 'drizzle-orm'
import type { Procedure } from '../../types/procedure.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class ProcedureRepository {
	async findAll(): Promise<Procedure[]> {
		return await db
			.select()
			.from(schema.procedure)
			.orderBy(desc(schema.procedure.createdAt))
	}

	async findById(id: string): Promise<Procedure | null> {
		const [procedure] = await db
			.select()
			.from(schema.procedure)
			.where(eq(schema.procedure.id, id))

		if (!procedure) {
			return null
		}

		return procedure
	}

	async findByCategoryId(categoryId: string): Promise<Procedure[]> {
		return await db
			.select()
			.from(schema.procedure)
			.where(eq(schema.procedure.categoryId, categoryId))
			.orderBy(desc(schema.procedure.createdAt))
	}

	async create(data: Procedure): Promise<{ id: string }> {
		const [newProcedure] = await db
			.insert(schema.procedure)
			.values(data)
			.returning({ id: schema.procedure.id })

		return newProcedure
	}
}

export const procedureRepository = new ProcedureRepository()
