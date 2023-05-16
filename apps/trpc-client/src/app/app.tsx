import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { httpBatchLink } from '@trpc/client';
import { User } from '@trpc-shared/models/User';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createClient } from '../client';
import { buildRouter } from '../router';
import { trpc } from '../trpc';

const router = buildRouter({
	user: User,
});

const App = () => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		createClient('//localhost:3000/trpc', {
			user: true,
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
