// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  server: {
    port: 3002,   // Issue App runs here
  },

  plugins: [
    react(),

    federation({
      name: 'issueApp',                  // 🔥 Unique name for Issue Microfrontend
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App',            // Expose main microfrontend entrypoint
      },
      shared: [
        'react',
        'react-dom',
        '@apollo/client',
        'graphql'
      ],
    }),
  ],

  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
