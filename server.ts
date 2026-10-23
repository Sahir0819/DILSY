import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/server/routes';
import { initAuth } from './src/server/auth';
import { getDb } from './src/server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB and Auth seeds safely on startup
  initAuth();
  getDb();

  // Support base64 image uploads and JSON requests up to 25MB
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Static directory for uploaded product/addon assets
  const uploadsDir = path.resolve(__dirname, 'data', 'uploads');
  app.use('/api/uploads', express.static(uploadsDir));

  // Mount API Router
  app.use('/api', apiRouter);

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Dynamic import of vite in dev mode to avoid bundling overhead in prod
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('✨ Vite middleware mounted in development mode');
  } else {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('✨ Serving production build from dist');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 DILSY Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
