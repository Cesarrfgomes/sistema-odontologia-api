import { desc, eq } from 'drizzle-orm'
import type { PaymentMethod } from '../../types/payment.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class PaymentMethodRepository {
	async findAll(): Promise<PaymentMethod[]> {
		return await db
			.select()
			.from(schema.paymentMethod)
			.orderBy(desc(schema.paymentMethod.createdAt))
	}

	async findById(id: string): Promise<PaymentMethod | null> {
		const [paymentMethod] = await db
			.select()
			.from(schema.paymentMethod)
			.where(eq(schema.paymentMethod.id, id))

		if (!paymentMethod) {
			return null
		}

		return paymentMethod
	}

	async findByName(name: string): Promise<PaymentMethod | null> {
		const [paymentMethod] = await db
			.select()
			.from(schema.paymentMethod)
			.where(eq(schema.paymentMethod.name, name))

		if (!paymentMethod) {
			return null
		}

		return paymentMethod
	}

	async create(data: PaymentMethod): Promise<{ id: string }> {
		const [newPaymentMethod] = await db
			.insert(schema.paymentMethod)
			.values(data)
			.returning({ id: schema.paymentMethod.id })

		return newPaymentMethod
	}
}

export const paymentMethodRepository = new PaymentMethodRepository()
