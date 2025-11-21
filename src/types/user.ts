export type User = {
	id?: string
	role: 'basic' | 'admin'
	username: string
	fullName: string
	email: string
	password: string
	createdAt?: Date
}
