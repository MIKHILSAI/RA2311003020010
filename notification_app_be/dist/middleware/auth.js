"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthToken = setAuthToken;
exports.verifyAuth = verifyAuth;
const logging_middleware_1 = require("logging-middleware");
// Store token globally (from registration)
let globalAuthToken = null;
function setAuthToken(token) {
    globalAuthToken = token;
}
async function verifyAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        await (0, logging_middleware_1.logError)('backend', 'middleware', 'Missing or invalid authorization header');
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!globalAuthToken || token !== globalAuthToken) {
        await (0, logging_middleware_1.logError)('backend', 'middleware', 'Invalid token provided');
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
}
