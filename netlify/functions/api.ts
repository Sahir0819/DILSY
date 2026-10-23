import serverless from 'serverless-http';
import express, { Request, Response, NextFunction } from 'express';
import { apiRouter } from '../../src/server/routes';
import { initAuth } from '../../src/server/auth';
import { getDb, getUploadsDirPath } from '../../src/server/db';

const app = express();

// Initialize backend systems safely
try {
  initAuth();
  getDb();
} catch (err) {
  console.error('[Netlify Function Init Error]:', err);
}

// Support large payloads for image uploads & catalog sync
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// CORS & Security headers on all Netlify serverless responses
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

// Static uploaded files support in serverless if needed
try {
  const uploadsDir = getUploadsDirPath();
  app.use('/api/uploads', express.static(uploadsDir));
  app.use('/.netlify/functions/api/uploads', express.static(uploadsDir));
} catch {
  // Non-fatal in serverless
}

// Normalize request path so that Netlify rewrite variations match our Express router
app.use((req: Request, _res: Response, next: NextFunction) => {
  const originalUrl = req.url;
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '') || '/';
  } else if (req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '') || '/';
  }
  next();
});

// Mount the API Router at both root and /api for total compatibility
app.use('/', apiRouter);
app.use('/api', apiRouter);

// Graceful 404 handler that ALWAYS returns valid JSON (never empty or HTML)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: `API route not found: ${req.method} ${req.originalUrl || req.url}`,
    message: 'Please verify the requested API path.',
  });
});

// Centralized error handler returning clean JSON
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('[Netlify Function Server Error]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error in DILSY API function',
  });
});

export const handler = serverless(app);
