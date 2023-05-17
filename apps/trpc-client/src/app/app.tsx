import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { User } from '@trpc-shared/models/User';
import { Post } from '@trpc-shared/models/Post';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createClient } from '../client';
import { buildRouter } from '../router';
import { trpc } from '../trpc';

const router = buildRouter({
	auth: User,
	post: Post,
});

const App = () => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		createClient('//localhost:3000/trpc', {
			post: false,
			auth: false,
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
