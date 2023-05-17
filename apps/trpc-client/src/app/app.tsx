import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Post } from '@trpc-shared/models/Post';
import { User } from '@trpc-shared/models/User';
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

const routes = buildRouter({
	auth: User,
	post: Post,
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
							Component: Login,
						},
					])}></RouterProvider>
			</QueryClientProvider>
		</TrpcProvider>
	);
};

export default App;
