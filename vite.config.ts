import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, existsSync } from 'fs';

export default defineConfig(({ mode }) => {
    // Load environment variables from .env files and docker.env
    const env = loadEnv(mode, '.', '');
    // Also try to load docker.env if it exists
    try {
        const dockerEnvPath = path.resolve(__dirname, 'docker.env');
        if (existsSync(dockerEnvPath)) {
            const dockerEnv = readFileSync(dockerEnvPath, 'utf-8');
            dockerEnv.split('\n').forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                    const [key, ...valueParts] = trimmedLine.split('=');
                    if (key && valueParts.length > 0) {
                        const value = valueParts.join('=').trim();
                        if (!env[key.trim()] && value) {
                            env[key.trim()] = value;
                        }
                    }
                }
            });
        }
    } catch (e) {
        // Ignore if docker.env doesn't exist or can't be read
    }
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
