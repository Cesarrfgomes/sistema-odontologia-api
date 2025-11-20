import { desc, eq } from "drizzle-orm";
import type { Client } from "../../types/client.ts";
import { db } from "../connection.ts";
import { schema } from "../schema/index.ts";

export class ClientRepository {

    async findAll(): Promise<Client[]> {
        return await db.select().from(schema.client).orderBy(desc(schema.client.createdAt))
    }

    async findById(id: string): Promise<Client | null> {
        const client = await db.select().from(schema.client).where(eq(schema.client.id, id))

        if (!client) {
            return null
        }

        return client[0]
    }

    async findByEmail(email: string): Promise<Client | null> {
        const client = await db.select().from(schema.client).where(eq(schema.client.email, email))

        if (!client) {
            return null
        }

        return client[0]
    }

    async findByCpf(cpf: string): Promise<Client | null> {
        const client = await db.select().from(schema.client).where(eq(schema.client.cpf, cpf))

        if (!client) {
            return null
        }

        return client[0]
    }

    async create(client: Client) {
        return await db.insert(schema.client).values(client).returning()
    }
}

export const clientRepository = new ClientRepository()
