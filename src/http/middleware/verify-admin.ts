import type { FastifyReply, FastifyRequest } from 'fastify'
import { profileRepository } from '../../db/repositories/profile-repository.ts'
import { userRepository } from '../../db/repositories/user-repository.ts'

export const verifyAdmin = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const { sub } = request.user

	const user = await userRepository.findById(sub)

	if (!user) {
		return reply.status(403).send({ message: 'Unauthorized' })
	}

	const profile = await profileRepository.findById(user.profileId)

	if (!profile || profile.name.toLowerCase() !== 'admin') {
		return reply.status(403).send({ message: 'Unauthorized' })
	}
}
