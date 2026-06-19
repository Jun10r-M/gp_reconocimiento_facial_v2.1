import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  plugins: [
    {
      name: 'html-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const url = req.url.split('?')[0];
            if (url === '/login') {
              req.url = '/login.html';
            } else if (url.startsWith('/admin') && !url.includes('.')) {
              req.url = '/admin.html';
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true, // Limpia el directorio static en cada compilación para evitar archivos residuales
    rollupOptions: {
      input: {
        admin: resolve(__dirname, 'src/admin.html'),
        login: resolve(__dirname, 'src/login.html'),
        index: resolve(__dirname, 'src/index.html')
      }
    }
  },
  server: {
    port: 5173,
    // Proxy: redirige todas las llamadas a la API hacia FastAPI (puerto 8080)
    // Así el frontend en dev puede hablar con el backend sin problemas de CORS
    proxy: {
      '/auth': 'http://127.0.0.1:8080',
      '/employees': 'http://127.0.0.1:8080',
      '/contracts': 'http://127.0.0.1:8080',
      '/attendance': 'http://127.0.0.1:8080',
      '/justifications': 'http://127.0.0.1:8080',
      '/shifts': 'http://127.0.0.1:8080',
      '/terminals': 'http://127.0.0.1:8080',
      '/payroll': 'http://127.0.0.1:8080',
      '/security': 'http://127.0.0.1:8080',
      '/audit': 'http://127.0.0.1:8080',
      '/system': 'http://127.0.0.1:8080',
      '/chatbot': 'http://127.0.0.1:8080',
      '/predict': 'http://127.0.0.1:8080',
      '/prediction': 'http://127.0.0.1:8080',
      '/knowledge': 'http://127.0.0.1:8080',
      '/data': 'http://127.0.0.1:8080',
      '/recognize': 'http://127.0.0.1:8080',
      '/docs': 'http://127.0.0.1:8080',
      '/openapi.json': 'http://127.0.0.1:8080',
    }
  }
});
