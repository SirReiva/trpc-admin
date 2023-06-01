import cors from '@fastify/cors';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import figlet from 'figlet';
import { install } from 'source-map-support';
import { getFastifyPlugin } from 'trpc-playground/handlers/fastify';
import 'zod-metadata/register';
import { logger } from './logger';
import { createContext } from './trpc/context';
import { appRouter } from './trpc/router';

install({
	environment: 'node',
});

const TRPC_ENDPOINT = '/trpc';
const TRPC_PLAYGROUND_ENDPOINT = '/playground';

const server = fastify({
	maxParamLength: 5000,
	logger,
});

(async () => {
	try {
		await server.register(cors);
		await server.register(ws);

		await server.register(fastifyTRPCPlugin, {
			prefix: TRPC_ENDPOINT + '-socket',
			trpcOptions: { router: appRouter, createContext },
			useWSS: true,
		});
		await server.register(fastifyTRPCPlugin, {
			prefix: TRPC_ENDPOINT,
			trpcOptions: { router: appRouter, createContext },
		});

		await server.register(
			await getFastifyPlugin({
				router: appRouter,
				trpcApiEndpoint: TRPC_ENDPOINT,
				playgroundEndpoint: TRPC_PLAYGROUND_ENDPOINT,
			}),
			{
				prefix: TRPC_PLAYGROUND_ENDPOINT,
			}
		);

		await server.ready();
		await server.listen({ port: 3000 });
		figlet('TRPC-SERVER\n---ready---', (_, r) => console.log(r));
	} catch (err) {
		server.log.error(err);
	}
})();
