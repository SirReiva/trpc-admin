import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { httpBatchLink } from '@trpc/client';
import { createWSClient, wsLink } from '@trpc/client/links/wsLink';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { trpc } from '../client';
import { buildRouter } from '../router';
import { User } from '@trpc-shared/models/User';

const router = buildRouter({
	user: User,
});

const App = () => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				// httpBatchLink({
				// 	url: 'http://localhost:3000/trpc',
				// }),
				wsLink({
					client: createWSClient({
						url: 'ws://localhost:3000/trpc',
					}),
				}),
			],
		})
	);
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router}></RouterProvider>
			</QueryClientProvider>
		</trpc.Provider>
	);
};

export default App;
