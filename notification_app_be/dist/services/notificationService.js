"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setServiceAuthToken = setServiceAuthToken;
exports.fetchNotifications = fetchNotifications;
exports.getFilteredNotifications = getFilteredNotifications;
const logging_middleware_1 = require("logging-middleware");
let authToken = null;
function setServiceAuthToken(token) {
    authToken = token;
}
async function fetchNotifications(limit, page, notificationType) {
    await (0, logging_middleware_1.logInfo)('backend', 'service', `Fetching notifications with limit: ${limit}, page: ${page}, type: ${notificationType}`);
    if (!authToken) {
        await (0, logging_middleware_1.logError)('backend', 'service', 'Auth token not configured');
        throw new Error('Auth token not configured');
    }
    const url = new URL('http://20.207.122.201/evaluation-service/notifications');
    if (limit)
        url.searchParams.append('limit', limit.toString());
    if (page)
        url.searchParams.append('page', page.toString());
    if (notificationType)
        url.searchParams.append('notification_type', notificationType);
    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            await (0, logging_middleware_1.logError)('backend', 'service', `Failed to fetch notifications: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        await (0, logging_middleware_1.logDebug)('backend', 'service', `Successfully fetched ${data.notifications.length} notifications`);
        return data.notifications;
    }
    catch (error) {
        await (0, logging_middleware_1.logError)('backend', 'service', `Error fetching notifications: ${error}`);
        throw error;
    }
}
async function getFilteredNotifications(type, limit, page) {
    await (0, logging_middleware_1.logDebug)('backend', 'service', `Getting filtered notifications for type: ${type}`);
    return fetchNotifications(limit, page, type);
}
