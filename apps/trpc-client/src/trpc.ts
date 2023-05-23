import type { AppRouter } from '@trpc-server/trpc/client';
import { models } from '@trpc-shared/models';
import { TRPCClientError, createTRPCReact } from '@trpc/react-query';
import pick from 'just-pick';

export const trpc = createTRPCReact<AppRouter>({
	abortOnUnmount: true,
});

export type TrpcModels = keyof Omit<
	typeof trpc,
	| 'Provider'
	| 'createClient'
	| 'useContext'
	| 'useDehydratedState'
	| 'useQueries'
>;

export const mergedModels = {
	...models.common,
	...pick(models, 'auth'),
};

export const TrpcProvider = trpc.Provider;

export const isTRPCClientError = (
	cause: unknown
): cause is TRPCClientError<AppRouter> => cause instanceof TRPCClientError;

//export type TrpcAuthModels<T extends typeof trpc> = keyof Pick<T, 'auth'>;
