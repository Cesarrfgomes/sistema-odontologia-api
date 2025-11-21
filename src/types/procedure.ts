export type Procedure = {
	id?: string
	name: string
	description: string
	categoryId: string
	value: string
	duration: string
	status: 'ativo' | 'inativo'
	createdAt?: Date
}

export type ProcedureCategory = {
	id?: string
	name: string
	description?: string
	createdAt?: Date
}
