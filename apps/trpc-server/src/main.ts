import cors from '@fastify/cors';
import ws from '@fastify/websocket';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { getFastifyPlugin } from 'trpc-playground/handlers/fastify';
import { appRouter } from './trpc/router';
import figlet from 'figlet';
import { createContext } from './trpc/context';

const TRPC_ENDPOINT = '/trpc';
const TRPC_PLAYGROUND_ENDPOINT = '/playground';

const server = fastify({
	maxParamLength: 5000,
});

(async () => {
	try {
		await server.register(ws);
		await server.register(cors);

		await server.register(fastifyTRPCPlugin, {
			prefix: TRPC_ENDPOINT + '-socket',
			trpcOptions: { router: appRouter, createContext },
			logLevel: 'debug',
			useWSS: true,
		});
		await server.register(fastifyTRPCPlugin, {
			prefix: TRPC_ENDPOINT,
			trpcOptions: { router: appRouter, createContext },
			logLevel: 'debug',
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
		process.exit(1);
	}
})();
