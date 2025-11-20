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

app.get('/health', (): string => 'OK')

app.listen({ port: env.PORT }).then(() => {
	console.log(`HTTP server is running on port ${process.env.PORT}`)
    console.log(`Docs are available at http://localhost:${env.PORT}/docs`)
})
