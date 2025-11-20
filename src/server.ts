import fastifyCors from '@fastify/cors'
import { fastify } from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
    jsonSchemaTransform,
	type ZodTypeProvider
} from 'fastify-type-provider-zod'
import { env } from './env/index.ts'
import fastifySwagger from '@fastify/swagger'
import ScalarApiRefecence from '@scalar/fastify-api-reference'
import { createClient } from './http/routes/client/create-client.ts'
import { createUser } from './http/routes/user/create.user.ts'
import fastifyJwt from '@fastify/jwt'
import { auth } from './http/routes/user/auth.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
	origin: '*'
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Dentist API',
			version: '1.0.0',
			description: 'API for the dentist'
		}
	},
	transform: jsonSchemaTransform
})

app.register(ScalarApiRefecence, {
	routePrefix: '/docs',
})

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	sign: {
		expiresIn: '8h',
	}
})

app.get('/health', (): string => 'OK')

app.register(auth)
app.register(createClient)
app.register(createUser)

app.listen({ port: env.PORT }).then(() => {
	console.log(`HTTP server is running on port ${process.env.PORT}`)
    console.log(`Docs are available at http://localhost:${env.PORT}/docs`)
})
