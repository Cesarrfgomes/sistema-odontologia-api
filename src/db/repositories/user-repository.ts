import { desc, eq } from 'drizzle-orm'
import type { User } from '../../types/user.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class UserRepository {
	async findAll(): Promise<User[]> {
		return await db.select().from(schema.user).orderBy(desc(schema.user.id))
	}

	async findById(id: string): Promise<User | null> {
		const [user] = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.id, id))

		if (!user) {
			return null
		}

		return user
	}

	async findByUsername(username: string): Promise<User | null> {
		const [user] = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.username, username))

		if (!user) {
			return null
		}

		return user
	}

	async findByEmail(email: string): Promise<User | null> {
		const [user] = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.email, email))

		if (!user) {
			return null
		}

		return user
	}

	async create(data: User): Promise<{ id: string }> {
		const [newUser] = await db
			.insert(schema.user)
			.values(data)
			.returning({ id: schema.user.id })

		return newUser
	}
}

export const userRepository = new UserRepository()
