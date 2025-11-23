import { patient } from './patient.ts'
import { paymentMethod } from './payment-method.ts'
import { paymentPlan } from './payment-plan.ts'
import { paymentPlanCharge } from './payment-plan-charge.ts'
import { procedure } from './procedure.ts'
import { procedureCategory } from './procedure-category.ts'
import { user } from './user.ts'

export const schema = {
	patient,
	user,
	procedure,
	procedureCategory,
	paymentMethod,
	paymentPlan,
	paymentPlanCharge,
}
