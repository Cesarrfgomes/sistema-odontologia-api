import type { FastifyReply, FastifyRequest } from 'fastify'
import { profileRepository } from '../../db/repositories/profile-repository.ts'
import { roleRepository } from '../../db/repositories/role-repository.ts'
import { userRepository } from '../../db/repositories/user-repository.ts'
import { UnauthorizedError } from '../routes/_errors/unauthorized-error.ts'

export const verifyAdmin = async (
	request: FastifyRequest,
	_reply: FastifyReply,
) => {
	const { sub } = request.user

	const user = await userRepository.findById(sub)

	if (!user) {
		throw new UnauthorizedError('Não autorizado')
	}

	const role = await roleRepository.findById(user.roleId)

	if (!role) {
		throw new UnauthorizedError('Não autorizado')
	}

	const profile = await profileRepository.findById(role.profileId)

	if (!profile || profile.name.toLowerCase() !== 'admin') {
		throw new UnauthorizedError('Não autorizado')
	}
}
