"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const notificationController_1 = __importDefault(require("./controllers/notificationController"));
const logging_middleware_1 = require("logging-middleware");
const notificationService_1 = require("./services/notificationService");
// Load environment variables manually
const envPath = path_1.default.join(__dirname, '..', '.env');
if (fs_1.default.existsSync(envPath)) {
    let envContent = fs_1.default.readFileSync(envPath, 'utf8');
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
dotenv_1.default.config({ path: envPath }); // Try dotenv as well
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
// Configure logger with auth token
if (AUTH_TOKEN) {
    (0, logging_middleware_1.configureLogger)(AUTH_TOKEN);
    (0, notificationService_1.setServiceAuthToken)(AUTH_TOKEN);
    (0, logging_middleware_1.logInfo)('backend', 'config', 'Logger and service auth token configured');
}
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/notifications', notificationController_1.default);
// Root endpoint
app.get('/', (req, res) => {
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
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
// Start server
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
