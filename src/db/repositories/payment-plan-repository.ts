import { desc, eq } from 'drizzle-orm'
import type { PaymentPlan } from '../../types/payment.ts'
import { db } from '../connection.ts'
import { schema } from '../schema/index.ts'

export class PaymentPlanRepository {
	async findAll(): Promise<PaymentPlan[]> {
		return await db
			.select()
			.from(schema.paymentPlan)
			.orderBy(desc(schema.paymentPlan.createdAt))
	}

	async findById(id: string): Promise<PaymentPlan | null> {
		const [paymentPlan] = await db
			.select()
			.from(schema.paymentPlan)
			.where(eq(schema.paymentPlan.id, id))

		if (!paymentPlan) {
			return null
		}

		return paymentPlan
	}

	async findByName(name: string): Promise<PaymentPlan | null> {
		const [paymentPlan] = await db
			.select()
			.from(schema.paymentPlan)
			.where(eq(schema.paymentPlan.name, name))

		if (!paymentPlan) {
			return null
		}

		return paymentPlan
	}

	async create(data: PaymentPlan): Promise<{ id: string }> {
		const [newPaymentPlan] = await db
			.insert(schema.paymentPlan)
			.values(data)
			.returning({ id: schema.paymentPlan.id })

		return newPaymentPlan
	}
}

export const paymentPlanRepository = new PaymentPlanRepository()
