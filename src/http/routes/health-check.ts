import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const healthCheckRoute: FastifyPluginCallbackZod = (app) => {
	app.get(
		'/health-check',
		{
			schema: {
				tags: ['health-check'],
				description: 'Verificar se o servidor está funcionando',
				response: {
					200: z.object({
						status: z.string(),
					}),
				},
			},
		},
		(_req, res) => {
			res.status(200).send({ status: 'ok' })
		},
	)
}
