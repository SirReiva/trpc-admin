import type { AppRouter } from '@trpc-server/trpc/client';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();

export type TrpcModels = keyof Omit<
	typeof trpc,
	| 'Provider'
	| 'createClient'
	| 'useContext'
	| 'useDehydratedState'
	| 'useQueries'
>;

export const TrpcProvider = trpc.Provider;

//export type TrpcAuthModels<T extends typeof trpc> = keyof Pick<T, 'auth'>;
