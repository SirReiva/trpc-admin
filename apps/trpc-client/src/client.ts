import {
	Operation,
	createWSClient,
	httpBatchLink,
	loggerLink,
	splitLink,
	wsLink,
} from '@trpc/client';
import { TrpcModels, trpc } from './trpc';

export enum TRPC_MODES {
	HTTP = 0,
	WS = 1,
}

export const createClient = (
	baseUrl: string,
	linksConfig: Record<TrpcModels, TRPC_MODES>,
	token?: string
) => {
	return trpc.createClient({
		links: [
			loggerLink({
				enabled: _opts => process.env.NODE_ENV === 'development',
			}),
			splitLink({
				condition(op: Operation) {
					const model = op.path.split('.').shift() as TrpcModels;
					return (
						op.type === 'subscription' || Boolean(linksConfig[model] ?? false)
					);
				},
				false: httpBatchLink({
					url: 'http:' + baseUrl,
					headers: () => ({
						Authorization: token,
					}),
				}),
				true: wsLink({
					client: createWSClient({
						url: `ws:${baseUrl}-socket${
							token ? '?token=' + encodeURIComponent(token) : ''
						}`,
					}),
				}),
			}),
		],
	});
};
