export type User = {
	id?: string
	username: string
	fullName: string
	email: string
	password: string
	roleId: number
	isActive?: boolean
	createdAt?: Date
}
