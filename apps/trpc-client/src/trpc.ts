import type { AppRouter } from '@trpc-server/trpc/client';
import { TRPCClientError, createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>({
	abortOnUnmount: true,
});

export const TrpcProvider = trpc.Provider;

export const isTRPCClientError = (
	cause: unknown
): cause is TRPCClientError<AppRouter> => cause instanceof TRPCClientError;

//export type TrpcAuthModels<T extends typeof trpc> = keyof Pick<T, 'auth'>;
