import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import notificationRoutes from './controllers/notificationController';
import { configureLogger, logInfo } from 'logging-middleware';
import { setServiceAuthToken } from './services/notificationService';

// Load environment variables manually
const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Remove BOM if present
  if (envContent.charCodeAt(0) === 0xFEFF) {
    envContent = envContent.slice(1);
  }
  
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=');
        process.env[key] = value;
      }
    }
  }
}

dotenv.config({ path: envPath }); // Try dotenv as well

const app = express();
const PORT = process.env.PORT || 3001;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

// Configure logger with auth token
if (AUTH_TOKEN) {
  configureLogger(AUTH_TOKEN);
  setServiceAuthToken(AUTH_TOKEN);
  logInfo('backend', 'config', 'Logger and service auth token configured');
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notifications', notificationRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Campus Notifications API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      notifications: '/api/notifications',
      priorityNotifications: '/api/notifications/priority/:n'
    }
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});