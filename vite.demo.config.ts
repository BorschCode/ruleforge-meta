import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/ruleforge-meta/',

    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        tailwindcss(),
    ],

    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
        },
    },

    publicDir: false,

    build: {
        outDir: 'demo',
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, 'demo.html'),
        },
    },
});
