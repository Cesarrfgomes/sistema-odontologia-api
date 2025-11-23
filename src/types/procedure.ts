export type Procedure = {
	id?: string
	name: string
	description: string
	categoryId: string
	value: string
	durationInMinutes: number
	isActive: boolean
	createdAt?: Date
}

export type ProcedureCategory = {
	id?: string
	name: string
	description?: string
	createdAt?: Date
}
