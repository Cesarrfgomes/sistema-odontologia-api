import { desc, eq } from 'drizzle-orm'
import type { Supplier } from '../../types/supplier.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class SupplierRepository {
	async findAll(): Promise<Supplier[]> {
		return await db
			.select()
			.from(schema.supplier)
			.orderBy(desc(schema.supplier.createdAt))
	}

	async findById(id: number): Promise<Supplier | null> {
		const [supplier] = await db
			.select()
			.from(schema.supplier)
			.where(eq(schema.supplier.id, id))

		if (!supplier) {
			return null
		}

		return supplier
	}

	async findByEmail(email: string): Promise<Supplier | null> {
		const [supplier] = await db
			.select()
			.from(schema.supplier)
			.where(eq(schema.supplier.email, email))



		if (!supplier) {
			return null
		}

		return supplier
	}

	async create(data: Supplier): Promise<{ id: number }> {
		const [newSupplier] = await db
			.insert(schema.supplier)
			.values(data)
			.returning({ id: schema.supplier.id })


		return newSupplier
	}
}

export const supplierRepository = new SupplierRepository()
