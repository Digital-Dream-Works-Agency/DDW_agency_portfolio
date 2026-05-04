import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { createRequire } from 'module';
import path from 'path';

// createRequire is needed to load CJS packages from an ES module config
const _require = createRequire(import.meta.url);

const ROUTES = ['/', '/services', '/case-studies', '/projects', '/about', '/contact'];

// Vercel's build sandbox cannot run Chromium binaries — skip prerendering there.
// The SPA works perfectly for live preview on Vercel.
// Run `npm run build` locally for the fully-prerendered production build.
const isVercel = !!process.env.VERCEL;

const getPlugins = () => {
    const plugins = [react()];

    if (!isVercel) {
        try {
            // Use createRequire to load the CJS version of the prerender plugin
            // (the ESM dist uses bare require() calls which fail in ES module scope)
            const vitePrerender = _require('vite-plugin-prerender');
            const PuppeteerRenderer = _require('@prerenderer/renderer-puppeteer');

            // ─── Prerendering ────────────────────────────────────────────────────────
            // Converts the CSR-only build into prerendered static HTML per route.
            // Without this, search engines see an empty <div id="root" />.
            // The app has a LoadingScreen (~3s GSAP animation) before content renders,
            // so we wait 4500ms for puppeteer to capture fully-rendered content.
            plugins.push(
                vitePrerender({
                    staticDir: path.join(process.cwd(), 'dist'),
                    routes: ROUTES,
                    renderer: new PuppeteerRenderer({
                        renderAfterTime: 4500,
                        headless: true,
                        args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    }),
                })
            );
        } catch (e) {
            console.warn('[vite.config] Prerender unavailable — building as pure SPA:', e.message);
        }
    } else {
        console.log('[vite.config] Vercel CI detected — skipping Puppeteer prerender. Pure SPA build.');
    }

    return plugins;
};

export default defineConfig({
    plugins: getPlugins(),

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
