import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig(configEnv => {
	const isDevelopment = configEnv.mode === 'development';

	return {
		plugins: [react()],
		build: {
			outDir: resolve(__dirname, '../../dist/apps/trpc-client'),
			emptyOutDir: true,
		},
		resolve: {
			alias: {
				'@trpc-shared': resolve(__dirname, '../../libs/trpc-shared/src'),
				'@trpc-client': resolve(__dirname, './src'),
			},
		},
		css: {
			modules: {
				generateScopedName: isDevelopment
					? '[name]__[local]__[hash:base64:5]'
					: '[hash:base64:5]',
			},
		},
	};
});
