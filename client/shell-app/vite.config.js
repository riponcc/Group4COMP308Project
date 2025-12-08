// // shell-app/vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import federation from '@originjs/vite-plugin-federation';

// export default defineConfig({
//   plugins: [
//     react(),
//     federation({
//       name: 'shellApp',
//       remotes: {
//         userApp: 'http://localhost:3001/assets/remoteEntry.js',
        
//       },
//       shared: {
//         react: { singleton: true },
//         'react-dom': { singleton: true },
//         '@apollo/client': { singleton: true, version: '3.10.0' },
//         graphql: { singleton: true, version: '16.8.1' },
//       },
//     }),
//   ],
//   server: {
//     port: 3000, // ✅ shell runs on 3000 (or 5173 if default vite)
//   },
// });
// shell-app/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),

    federation({
      name: 'shellApp',

      remotes: {
        userApp: 'http://localhost:3001/assets/remoteEntry.js',
        issueApp: 'http://localhost:3002/assets/remoteEntry.js',   // ✅ Added Issue App
      },

      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        '@apollo/client': { singleton: true, version: '3.10.0' },
        graphql: { singleton: true, version: '16.8.1' },
      },
    }),
  ],

  server: {
    port: 3000, // Shell app
  },
});
