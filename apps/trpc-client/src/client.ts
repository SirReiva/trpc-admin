import {
	Operation,
	createWSClient,
	httpBatchLink,
	loggerLink,
	splitLink,
	wsLink,
} from '@trpc/client';
import { TrpcModels, trpc } from './trpc';

export const createClient = (
	baseUrl: string,
	linksConfig: Record<TrpcModels<typeof trpc>, boolean>
) => {
	return trpc.createClient({
		links: [
			loggerLink({
				enabled: _opts => process.env.NODE_ENV === 'development',
			}),
			splitLink({
				condition(op: Operation) {
					const model = op.path.split('.').shift() as TrpcModels<typeof trpc>;
					return linksConfig[model];
				},
				false: httpBatchLink({
					url: 'http:' + baseUrl,
				}),
				true: wsLink({
					client: createWSClient({
						url: 'ws:' + baseUrl + '-socket',
					}),
				}),
			}),
		],
	});
};
