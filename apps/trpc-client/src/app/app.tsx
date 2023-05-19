import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createClient } from '../client';
import { buildRouter } from '../router';
import { TrpcProvider, mergedModes } from '../trpc';
import { useAuth } from './context/authContext';
import { withAuth } from './hoc/withAuth';
import { withNoAuth } from './hoc/withNoAuth';
import Index from './pages';
import Admin from './pages/admin';
import Login from './pages/login';

const routes = buildRouter(mergedModes);

const App = () => {
	const { auth } = useAuth();
	const queryClient = useMemo(() => new QueryClient({}), [auth?.token]);
	const trpcClient = useMemo(
		() =>
			createClient(
				'//localhost:3000/trpc',
				{
					post: false,
					auth: false,
				},
				auth?.token
			),
		[auth?.token]
	);

	return (
		<TrpcProvider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider
					router={createBrowserRouter([
						{
							index: true,
							Component: Index,
						},
						{
							path: 'admin',
							Component: withAuth(Admin),
							children: routes,
						},
						{
							path: 'login',
							Component: withNoAuth(Login),
						},
					])}></RouterProvider>
			</QueryClientProvider>
		</TrpcProvider>
	);
};

export default App;
