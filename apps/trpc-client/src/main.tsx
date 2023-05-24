import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'zod-metadata/register';
import App from './app/app';
import AuthProvider from './app/context/authContext';
import './index.css';

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
