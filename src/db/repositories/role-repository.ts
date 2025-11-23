import { desc, eq } from 'drizzle-orm'
import type { Role } from '../../types/role.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class RoleRepository {
	async findAll(): Promise<Role[]> {
		return await db
			.select()
			.from(schema.role)
			.orderBy(desc(schema.role.createdAt))
	}

	async findById(id: number): Promise<Role | null> {
		const [role] = await db
			.select()
			.from(schema.role)
			.where(eq(schema.role.id, id))

		if (!role) {
			return null
		}

		return role
	}

	async findByProfileId(profileId: number): Promise<Role[]> {
		return await db
			.select()
			.from(schema.role)
			.where(eq(schema.role.profileId, profileId))
			.orderBy(desc(schema.role.createdAt))
	}

	async create(data: Role): Promise<{ id: number }> {
		const [newRole] = await db
			.insert(schema.role)
			.values(data)
			.returning({ id: schema.role.id })

		return newRole
	}
}

export const roleRepository = new RoleRepository()
