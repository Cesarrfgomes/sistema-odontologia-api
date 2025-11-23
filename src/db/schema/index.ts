import {
	appointment,
	appointmentEquipament,
	appointmentPayment,
} from './appointment.ts'
import { department } from './department.ts'
import { equipament } from './equipament.ts'
import { materialEntry } from './material-entry.ts'
import { patient } from './patient.ts'
import { paymentMethod } from './payment-method.ts'
import { paymentPlan } from './payment-plan.ts'
import { paymentPlanCharge } from './payment-plan-charge.ts'
import { procedure } from './procedure.ts'
import { procedureCategory } from './procedure-category.ts'
import { profile } from './profile.ts'
import { role } from './role.ts'
import { stock } from './stock.ts'
import { supplier } from './supplier.ts'
import { user } from './user.ts'

export const schema = {
	patient,
	user,
	procedure,
	procedureCategory,
	paymentMethod,
	paymentPlan,
	paymentPlanCharge,
	supplier,
	equipament,
	stock,
	department,
	materialEntry,
	profile,
	role,
	appointment,
	appointmentPayment,
	appointmentEquipament,
}
