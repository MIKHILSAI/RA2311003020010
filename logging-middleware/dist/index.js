"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logFatal = exports.logError = exports.logWarn = exports.logInfo = exports.logDebug = void 0;
exports.configureLogger = configureLogger;
exports.log = log;
// Allowed values for validation
const ALLOWED_STACKS = ['backend', 'frontend'];
const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const ALLOWED_PACKAGES = {
    backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
    frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
    both: ['auth', 'config', 'middleware', 'utils']
};
// Configuration - to be set by the consuming application
let authToken = null;
let logAPIUrl = 'http://20.207.122.201/evaluation-service/logs';
function configureLogger(token, apiUrl) {
    authToken = token;
    if (apiUrl)
        logAPIUrl = apiUrl;
}
async function log(stack, level, pkg, message) {
    // Validate inputs
    if (!ALLOWED_STACKS.includes(stack)) {
        console.error(`Invalid stack: ${stack}`);
        return null;
    }
    if (!ALLOWED_LEVELS.includes(level)) {
        console.error(`Invalid level: ${level}`);
        return null;
    }
    // Validate package based on stack
    const validPackages = [...ALLOWED_PACKAGES[stack], ...ALLOWED_PACKAGES.both];
    if (!validPackages.includes(pkg)) {
        console.error(`Invalid package: ${pkg} for stack: ${stack}`);
        return null;
    }
    if (!authToken) {
        console.error('Logger not configured. Call configureLogger() first');
        return null;
    }
    try {
        const response = await fetch(logAPIUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                stack,
                level,
                package: pkg,
                message
            })
        });
        if (!response.ok) {
            console.error(`Logging failed with status: ${response.status}`);
            return null;
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Failed to send log:', error);
        return null;
    }
}
// Convenience methods
const logDebug = (stack, pkg, message) => log(stack, 'debug', pkg, message);
exports.logDebug = logDebug;
const logInfo = (stack, pkg, message) => log(stack, 'info', pkg, message);
exports.logInfo = logInfo;
const logWarn = (stack, pkg, message) => log(stack, 'warn', pkg, message);
exports.logWarn = logWarn;
const logError = (stack, pkg, message) => log(stack, 'error', pkg, message);
exports.logError = logError;
const logFatal = (stack, pkg, message) => log(stack, 'fatal', pkg, message);
exports.logFatal = logFatal;
