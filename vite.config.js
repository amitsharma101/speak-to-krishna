import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: ['082b-117-245-250-113.ngrok-free.app'],
    host: true,
    port: 5173
  }
});