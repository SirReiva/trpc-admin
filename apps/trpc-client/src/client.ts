import {
	Operation,
	createWSClient,
	httpBatchLink,
	loggerLink,
	splitLink,
	wsLink,
} from '@trpc/client';
import { trpc } from './trpc';

export const createClient = (
	baseUrl: string,
	useWS: boolean,
	token?: string
) => {
	return trpc.createClient({
		links: [
			loggerLink({
				enabled: _opts => process.env.NODE_ENV === 'development',
			}),
			splitLink({
				condition(op: Operation) {
					return op.type === 'subscription' || useWS;
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
