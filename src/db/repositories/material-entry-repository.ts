import type { MaterialEntry } from '../../types/material-entry.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class MaterialEntryRepository {
	async create(data: MaterialEntry): Promise<{ txId: number }> {
		const [newMaterialEntry] = await db
			.insert(schema.materialEntry)
			.values(data)
			.returning({ txId: schema.materialEntry.txId })

		return newMaterialEntry
	}
}

export const materialEntryRepository = new MaterialEntryRepository()
