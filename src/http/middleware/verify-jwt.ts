import type { FastifyReply, FastifyRequest } from 'fastify'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'

export const verifyJwt = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		await request.jwtVerify()
	} catch (error) {
		const code = (error as any).code
		const message = (error as any).message
		const statusCode = (error as any).statusCode

		if (code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
			return reply.status(401).send({
				message,
				code,
				statusCode,
			})
		} else if (code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
			return reply.status(401).send({
				message: 'No Authorization was found in request.headers',
				code: 'FST_JWT_NO_AUTHORIZATION_IN_HEADER',
				statusCode,
			})
		}
		return reply.status(403).send({ message: 'Unauthorized.' })
	}
}
