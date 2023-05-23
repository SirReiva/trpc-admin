import {
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { TRPC_MODES, createClient } from '../client';
import { buildRouter } from '../router';
import { TrpcProvider, isTRPCClientError, mergedModels } from '../trpc';
import { useAuth } from './context/authContext';
import { withAuth } from './hoc/withAuth';
import { withNoAuth } from './hoc/withNoAuth';
import Index from './pages';
import Admin from './pages/admin';
import Login from './pages/login';

const routes = buildRouter(mergedModels);

const App = () => {
	const { auth, logOut } = useAuth();
	const navigate = useNavigate();

	const mutationCache = useMemo(
		() =>
			new MutationCache({
				onError(error, _variables, _context, mutation) {
					if (isTRPCClientError(error)) {
						if (
							error.data?.path !== 'auth.login' &&
							error.data?.httpStatus === 401 &&
							error.data.code === 'UNAUTHORIZED'
						) {
							logOut();
							navigate('/login');
							return;
						}
						console.warn(error, error.data?.path, mutation);
						return error;
					}
				},
			}),
		[auth?.token]
	);

	const queryCache = useMemo(
		() =>
			new QueryCache({
				onError(error, query) {
					if (isTRPCClientError(error)) {
						if (
							error.data?.httpStatus === 401 &&
							error.data.code === 'UNAUTHORIZED'
						) {
							logOut();
							navigate('/login');
							return;
						}
						console.warn(error, query);
						return error;
					}
				},
			}),
		[auth?.token]
	);

	const queryClient = useMemo(
		() =>
			new QueryClient({
				mutationCache,
				queryCache,
			}),
		[queryCache, mutationCache]
	);
	const trpcClient = useMemo(
		() =>
			createClient(
				'//localhost:3000/trpc',
				{
					post: TRPC_MODES.WS,
					auth: TRPC_MODES.WS,
				},
				auth?.token
			),
		[auth?.token]
	);

	return (
		<TrpcProvider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path='/' index Component={Index} />
					<Route path='/login' Component={withNoAuth(Login)} />
					<Route path='/admin' Component={withAuth(Admin)}>
						{...routes}
					</Route>
				</Routes>
			</QueryClientProvider>
		</TrpcProvider>
	);
};

export default App;
