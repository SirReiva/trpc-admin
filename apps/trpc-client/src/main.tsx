import 'zod-metadata/register';
import { createRoot } from 'react-dom/client';
import React from 'react';
import './index.css';
import App from './app/app';
import AuthProvider from './app/context/authContext';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</AuthProvider>
	</React.StrictMode>
);
