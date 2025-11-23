import { desc, eq } from 'drizzle-orm'
import type { Profile } from '../../types/profile.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class ProfileRepository {
	async findAll(): Promise<Profile[]> {
		return await db
			.select()
			.from(schema.profile)
			.orderBy(desc(schema.profile.createdAt))
	}

	async findById(id: number): Promise<Profile | null> {
		const [profile] = await db
			.select()
			.from(schema.profile)
			.where(eq(schema.profile.id, id))

		if (!profile) {
			return null
		}

		return profile
	}

	async findByName(name: string): Promise<Profile | null> {
		const [profile] = await db
			.select()
			.from(schema.profile)
			.where(eq(schema.profile.name, name))

		if (!profile) {
			return null
		}

		return profile
	}

	async create(data: Profile): Promise<{ id: number }> {
		const [newProfile] = await db
			.insert(schema.profile)
			.values(data)
			.returning({ id: schema.profile.id })

		console.log(newProfile)

		if (!newProfile || typeof newProfile.id !== 'number') {
			throw new Error('Falha ao criar perfil: ID não retornado')
		}

		return newProfile
	}
}

export const profileRepository = new ProfileRepository()
