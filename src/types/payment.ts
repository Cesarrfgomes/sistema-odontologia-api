export type PaymentMethod = {
	id?: string
	name: string
	installmentMax: number
	maximumTerm: number
	isActive: boolean
	createdAt?: Date
}

export type PaymentPlan = {
	id?: string
	name: string
	installmentMax: number
	maximumterm: number
	paymentType: 'VV' | 'VP'
	isActive: boolean
	createdAt?: Date
}
