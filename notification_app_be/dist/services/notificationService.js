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
// Mock notifications for demonstration
const mockNotifications = [
    {
        ID: '1',
        Type: 'Placement',
        Message: 'Google is visiting campus for placements next week',
        Timestamp: '2024-01-15T10:00:00Z'
    },
    {
        ID: '2',
        Type: 'Result',
        Message: 'Mid-semester results have been announced',
        Timestamp: '2024-01-14T15:30:00Z'
    },
    {
        ID: '3',
        Type: 'Event',
        Message: 'Tech fest 2024 - Register now!',
        Timestamp: '2024-01-13T09:00:00Z'
    },
    {
        ID: '4',
        Type: 'Placement',
        Message: 'Microsoft online assessment scheduled for tomorrow',
        Timestamp: '2024-01-12T14:00:00Z'
    },
    {
        ID: '5',
        Type: 'Event',
        Message: 'Guest lecture on AI by Dr. Smith',
        Timestamp: '2024-01-11T11:00:00Z'
    },
    {
        ID: '6',
        Type: 'Result',
        Message: 'Lab examination results declared',
        Timestamp: '2024-01-10T16:00:00Z'
    },
    {
        ID: '7',
        Type: 'Placement',
        Message: 'Amazon pool placement drive registration open',
        Timestamp: '2024-01-09T10:30:00Z'
    },
    {
        ID: '8',
        Type: 'Event',
        Message: 'Annual sports day celebration',
        Timestamp: '2024-01-08T13:00:00Z'
    }
];
async function fetchNotifications(limit, page, notificationType) {
    await (0, logging_middleware_1.logInfo)('backend', 'service', `Fetching notifications with limit: ${limit}, page: ${page}, type: ${notificationType}`);
    // Use mock data for demonstration
    // In production, this would fetch from the external API
    let filtered = [...mockNotifications];
    if (notificationType) {
        filtered = filtered.filter(n => n.Type === notificationType);
    }
    if (page && limit) {
        const start = (page - 1) * limit;
        filtered = filtered.slice(start, start + limit);
    }
    else if (limit) {
        filtered = filtered.slice(0, limit);
    }
    await (0, logging_middleware_1.logDebug)('backend', 'service', `Returning ${filtered.length} notifications`);
    return filtered;
}
async function getFilteredNotifications(type, limit, page) {
    await (0, logging_middleware_1.logDebug)('backend', 'service', `Getting filtered notifications for type: ${type}`);
    return fetchNotifications(limit, page, type);
}
