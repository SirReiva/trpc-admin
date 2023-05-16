import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@trpc-server/trpc/client';

export const trpc = createTRPCReact<AppRouter>();
export type TrpcModels = Exclude<
	keyof AppRouter,
	| 'Provider'
	| 'createClient'
	| 'useContext'
	| 'useDehydratedState'
	| 'useQueries'
	| '_def'
	| 'createCaller'
	| 'getErrorShape'
>;
