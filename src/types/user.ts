export type User = {
	id?: string
	username: string
	fullName: string
	email: string
	password: string
	profileId: number
	isActive?: boolean
	createdAt?: Date
}
