import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import proxyOptions from './proxyOptions';
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			srcDir: path.resolve(__dirname, 'src/'),
			filename: 'serviceWorker.js',
			strategies: 'injectManifest',
			devOptions: {
				enabled: true
			}
		})
	],
	server: {
		port: 8080,
		proxy: proxyOptions
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	build: {
		outDir: '../raven/public/raven',
		emptyOutDir: true,
		target: 'es2015',
	},
});
