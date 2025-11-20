import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {uuidv7} from 'uuidv7'

export const user = pgTable('user', {
    id: text().primaryKey().$default(() => uuidv7()),
    username: text().notNull().unique(),
    fullName: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})
