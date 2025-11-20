import { eq } from "drizzle-orm";
import type { User } from "../../types/user.ts";
import { db } from "../connection.ts";
import { schema } from "../schema/index.ts";

export class UserRepository{

    async findByEmail(email: string): Promise<User | null> {
        const [user] = await db.select().from(schema.user).where(eq(schema.user.email, email))

        if (!user) {
            return null
        }

        return user
    }

    async create(data: User): Promise<{id: string}> {
        const [newUser] = await db.insert(schema.user).values(data).returning({id: schema.user.id})

        return newUser
    }
}

export const userRepository = new UserRepository()
