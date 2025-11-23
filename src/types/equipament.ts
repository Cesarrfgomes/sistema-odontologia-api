export type Equipament = {
	id?: number
	description: string
	barCode: string
	supplierId?: number | null
	departmentId?: number | null
	isActive: boolean
	createdAt?: Date
}
