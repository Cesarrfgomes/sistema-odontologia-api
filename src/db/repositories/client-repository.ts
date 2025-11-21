import { desc, eq } from 'drizzle-orm'
import type { Client } from '../../types/client.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class ClientRepository {
	async findAll(): Promise<Client[]> {
		return await db
			.select()
			.from(schema.client)
			.orderBy(desc(schema.client.createdAt))
	}

	async findById(id: string): Promise<Client | null> {
		const [client] = await db
			.select()
			.from(schema.client)
			.where(eq(schema.client.id, id))

		if (!client) {
			return null
		}

		return client
	}

	async findByEmail(email: string): Promise<Client | null> {
		const [client] = await db
			.select()
			.from(schema.client)
			.where(eq(schema.client.email, email))

		if (!client) {
			return null
		}

		return client
	}

	async findByCpf(cpf: string): Promise<Client | null> {
		const [client] = await db
			.select()
			.from(schema.client)
			.where(eq(schema.client.cpf, cpf))

		if (!client) {
			return null
		}

		return client
	}

	async create(data: Client): Promise<{ id: string }> {
		const [newClient] = await db
			.insert(schema.client)
			.values(data)
			.returning({ id: schema.client.id })

		return newClient
	}
}

export const clientRepository = new ClientRepository()
