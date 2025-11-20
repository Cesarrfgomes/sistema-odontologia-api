import { reset, seed } from 'drizzle-seed'
import { db, sql } from './connection.ts'
import { schema } from './schema/index.ts'

await reset(db, schema)

await seed(db, schema).refine((f) => {
    return{
        client: {
            name: f.firstName(),
            email: f.email(),
            phone: f.phoneNumber(),
            cpf: f.int({ minValue: 10000000000, maxValue: 99999999999 }),
        }
    }
})

await sql.end()

console.log('Database seeded successfully')
