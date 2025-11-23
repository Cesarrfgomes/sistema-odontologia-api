import type { FastifyReply, FastifyRequest } from 'fastify'
import { userRepository } from '../../db/repositories/user-repository.ts'

export const verifyAdmin = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const { sub } = request.user

	const user = await userRepository.findById(sub)

	if (user?.role !== 'admin') {
		return reply.status(403).send({ message: 'Unauthorized' })
	}
}
