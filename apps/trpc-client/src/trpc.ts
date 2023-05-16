import type { AppRouter } from '@trpc-server/trpc/client';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();

export type TrpcModels<T extends typeof trpc> = keyof Omit<
	T,
	| 'Provider'
	| 'createClient'
	| 'useContext'
	| 'useDehydratedState'
	| 'useQueries'
>;

//export type TrpcAuthModels<T extends typeof trpc> = keyof Pick<T, 'auth'>;
