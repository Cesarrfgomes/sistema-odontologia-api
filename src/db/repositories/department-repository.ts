import { desc, eq } from 'drizzle-orm'
import type { Department } from '../../types/department.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class DepartmentRepository {
	async findAll(): Promise<Department[]> {
		return await db
			.select()
			.from(schema.department)
			.orderBy(desc(schema.department.createdAt))
	}

	async findById(id: number): Promise<Department | null> {
		const [department] = await db
			.select()
			.from(schema.department)
			.where(eq(schema.department.id, id))

		if (!department) {
			return null
		}

		return department
	}

	async findByName(name: string): Promise<Department | null> {
		const [department] = await db
			.select()
			.from(schema.department)
			.where(eq(schema.department.name, name))

		if (!department) {
			return null
		}

		return department
	}

	async create(data: Department): Promise<{ id: number }> {
		const [newDepartment] = await db
			.insert(schema.department)
			.values(data)
			.returning({ id: schema.department.id })

		return newDepartment
	}
}

export const departmentRepository = new DepartmentRepository()
