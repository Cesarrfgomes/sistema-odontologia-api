import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import ScalarApiRefecence from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env/index.ts'
import { healthCheckRoute } from './http/routes/health-check.ts'
import { createPatient } from './http/routes/patient/create.ts'
import { createProcedure } from './http/routes/procedure/create.ts'
import { createProcedureCategory } from './http/routes/procedure/create-category.ts'
import { auth } from './http/routes/user/auth.ts'
import { createUser } from './http/routes/user/create.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
	origin: '*',
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Dentist API',
			version: '1.0.0',
			description: 'API for the dentist',
		},
	},
	transform: jsonSchemaTransform,
})

app.register(ScalarApiRefecence, {
	routePrefix: '/docs',
})

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	sign: {
		expiresIn: '8h',
	},
})

app.register(healthCheckRoute)

app.register(auth)
app.register(createPatient)
app.register(createUser)
app.register(createProcedureCategory)
app.register(createProcedure)

app.listen({ port: env.PORT }).then(() => {
	console.log(`HTTP server is running on port ${process.env.PORT}`)
	console.log(`Docs are available at http://localhost:${env.PORT}/docs`)
})
