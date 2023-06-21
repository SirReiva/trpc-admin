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
import { renderTrpcPanel } from 'trpc-panel';
import { ENV } from './env';
import mongoose from 'mongoose';

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

		server.get('/panel', (_, reply) => {
			return reply.header('Content-Type', 'text/html; charset=utf-8').send(
				renderTrpcPanel(appRouter, {
					url: 'http://localhost:3000' + TRPC_ENDPOINT,
				})
			);
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
		await mongoose.connect(ENV.DB_URL);
		await server.listen({ port: ENV.PORT });
		figlet('TRPC-SERVER\n---ready---', (_, r) => console.log(r));
	} catch (err) {
		server.log.error(err);
	}
})();
