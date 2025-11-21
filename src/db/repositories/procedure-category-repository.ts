import { desc, eq } from 'drizzle-orm'
import type { ProcedureCategory } from '../../types/procedure.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class ProcedureCategoryRepository {
	async findAll(): Promise<ProcedureCategory[]> {
		return await db
			.select()
			.from(schema.procedureCategory)
			.orderBy(desc(schema.procedureCategory.createdAt))
	}

	async findById(id: string): Promise<ProcedureCategory | null> {
		const [category] = await db
			.select()
			.from(schema.procedureCategory)
			.where(eq(schema.procedureCategory.id, id))

		if (!category) {
			return null
		}

		return category
	}

	async findByName(name: string): Promise<ProcedureCategory | null> {
		const [category] = await db
			.select()
			.from(schema.procedureCategory)
			.where(eq(schema.procedureCategory.name, name))

		if (!category) {
			return null
		}

		return category
	}

	async create(data: ProcedureCategory): Promise<{ id: string }> {
		const [newCategory] = await db
			.insert(schema.procedureCategory)
			.values(data)
			.returning({ id: schema.procedureCategory.id })

		return newCategory
	}
}

export const procedureCategoryRepository = new ProcedureCategoryRepository()
