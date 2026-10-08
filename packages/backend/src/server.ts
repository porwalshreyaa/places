import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { config } from './config/env';
import { db } from './db';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import authRoutes from './routes/auth';
import destinationRoutes from './routes/destinations';
import userSettingsRoutes from './routes/userSettings';
import publicRoutes from './routes/public';
import uploadRoutes from './routes/upload';
import themeRoutes from './routes/themes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = config.port;

// Enable CORS for cross-origin frontend requests
app.use(cors({
  origin: true,
  credentials: true
}));

// Increase payload limits for base64 photo uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Ensure upload directory exists
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically at /uploads
app.use("/uploads", express.static(UPLOADS_DIR));

// ----------------------------------------
// API ENDPOINTS
// ----------------------------------------

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/user-settings', userSettingsRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/admin', adminRoutes);

// Fallback for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} not found` });
});

// Global Express error handling middleware (never returns 500 status to frontend)
app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(`❌ [SERVER ERROR] ${req.method} ${req.originalUrl}:`, err);
  res.status(400).json({ error: 'We are currently experiencing high traffic. Please try again shortly.' });
});

// Health check endpoint for Render / cloud deployment platforms
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ----------------------------------------
// SERVE FRONTEND (PRODUCTION / MONOLITH)
// ----------------------------------------

const FRONTEND_DIST = path.resolve(process.cwd(), "../frontend/dist");
const LOCAL_FRONTEND_DIST = path.resolve(process.cwd(), "packages/frontend/dist");

const staticDir = fs.existsSync(FRONTEND_DIST) 
  ? FRONTEND_DIST 
  : fs.existsSync(LOCAL_FRONTEND_DIST) 
    ? LOCAL_FRONTEND_DIST 
    : null;

if (staticDir) {
  app.use(express.static(staticDir));
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.status(200).json({ status: "ok", service: "ghoomi-backend" });
  });
}

// ----------------------------------------
// START SERVER
// ----------------------------------------

async function start() {
  try {
    const migrationsFolder = path.resolve(process.cwd(), 'src/db/migrations');
    const localMigrationsFolder = path.resolve(process.cwd(), 'packages/backend/src/db/migrations');
    const folder = fs.existsSync(migrationsFolder) 
      ? migrationsFolder 
      : fs.existsSync(localMigrationsFolder) 
        ? localMigrationsFolder 
        : null;

    if (folder) {
      console.log('🔄 Checking database migrations...');
      await migrate(db, { migrationsFolder: folder });
      console.log('✅ Database schema up to date.');
    }
  } catch (migErr) {
    console.warn('⚠️ Auto-migration check warning (database schema may already be managed):', migErr);
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend API server running on http://localhost:${PORT}`);
  });

  server.on('error', (err: unknown) => {
    const errorObj = err as { code?: string };
    if (errorObj.code === 'EADDRINUSE') {
      console.error(`\n❌ ERROR: Port ${PORT} is already in use.`);
      console.error(`👉 Please kill the existing process using port ${PORT} and try again.\n`);
      process.exit(1);
    } else {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
