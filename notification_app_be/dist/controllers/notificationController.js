"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationService_1 = require("../services/notificationService");
const priorityQueue_1 = require("../utils/priorityQueue");
const logging_middleware_1 = require("logging-middleware");
const router = (0, express_1.Router)();
// Get all notifications with pagination and filtering
router.get('/', async (req, res) => {
    try {
        await (0, logging_middleware_1.logInfo)('backend', 'controller', 'Received request for notifications');
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const page = req.query.page ? parseInt(req.query.page) : undefined;
        const type = req.query.notification_type;
        const notifications = await (0, notificationService_1.getFilteredNotifications)(type, limit, page);
        await (0, logging_middleware_1.logInfo)('backend', 'controller', `Returning ${notifications.length} notifications`);
        res.json({ notifications });
    }
    catch (error) {
        await (0, logging_middleware_1.logError)('backend', 'controller', `Error in notifications endpoint: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get top N priority notifications
router.get('/priority/:n', async (req, res) => {
    try {
        const n = parseInt(req.params.n);
        const type = req.query.notification_type;
        await (0, logging_middleware_1.logInfo)('backend', 'controller', `Getting top ${n} priority notifications${type ? ` for type ${type}` : ''}`);
        if (isNaN(n) || n <= 0) {
            await (0, logging_middleware_1.logError)('backend', 'controller', `Invalid n value: ${req.params.n}`);
            res.status(400).json({ error: 'Invalid n value' });
            return;
        }
        let notifications = await (0, notificationService_1.getFilteredNotifications)(type);
        // Apply type filter if specified
        if (type && type !== 'all') {
            notifications = notifications.filter((notification) => notification.Type === type);
            await (0, logging_middleware_1.logDebug)('backend', 'controller', `Filtered to ${notifications.length} notifications of type ${type}`);
        }
        const topNotifications = (0, priorityQueue_1.getTopPriorityNotifications)(notifications, n);
        await (0, logging_middleware_1.logInfo)('backend', 'controller', `Returning top ${topNotifications.length} priority notifications`);
        res.json({
            notifications: topNotifications,
            total: notifications.length,
            returned: topNotifications.length
        });
    }
    catch (error) {
        await (0, logging_middleware_1.logError)('backend', 'controller', `Error in priority endpoint: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
