import express from "express";
import path from "path";
import fs from "fs";
import { config } from './config/env';

import authRoutes from './routes/auth';
import destinationRoutes from './routes/destinations';
import userSettingsRoutes from './routes/userSettings';
import publicRoutes from './routes/public';
import uploadRoutes from './routes/upload';
import themeRoutes from './routes/themes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = config.port;

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

// ----------------------------------------
// START SERVER
// ----------------------------------------

async function start() {
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend API server running on http://localhost:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
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
