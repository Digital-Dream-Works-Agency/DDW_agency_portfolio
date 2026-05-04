import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { createRequire } from 'module';
import path from 'path';

// Use createRequire to load the CJS version of the prerender plugin
// (the ESM dist uses bare require() calls which fail in ES module scope)
const _require = createRequire(import.meta.url);
const vitePrerender = _require('vite-plugin-prerender');
const PuppeteerRenderer = _require('@prerenderer/renderer-puppeteer');

const ROUTES = ['/', '/services', '/case-studies', '/projects', '/about', '/contact'];

export default defineConfig({
    plugins: [
        react(),
        vitePrerender({
            staticDir: path.join(process.cwd(), 'dist'),
            routes: ROUTES,
            renderer: new PuppeteerRenderer({
                renderAfterTime: 4500,
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            }),
        }),
    ],

    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
            },
        },
    },
});
