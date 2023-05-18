import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { models } from '@trpc-shared/models';
import { useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createClient } from '../client';
import { buildRouter } from '../router';
import { TrpcProvider } from '../trpc';
import { useAuth } from './context/authContext';
import Index from './pages';
import Admin from './pages/admin';
import Login from './pages/login';
import { withAuth } from './hoc/withAuth';
import pick from 'just-pick';
import { withNoAuth } from './hoc/withNoAuth';

const routes = buildRouter({
	...models.common,
	...pick(models, 'auth'),
});

const App = () => {
	const { auth } = useAuth();
	const queryClient = useMemo(() => new QueryClient(), [auth?.token]);
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
