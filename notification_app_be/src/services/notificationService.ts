import { logInfo, logError, logDebug } from 'logging-middleware';
import type { Notification } from '../types/notification';

interface NotificationsResponse {
  notifications: Notification[];
}

let authToken: string | null = null;

export function setServiceAuthToken(token: string) {
  authToken = token;
}

// Mock notifications for demonstration
const mockNotifications: Notification[] = [
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

export async function fetchNotifications(
  limit?: number, 
  page?: number, 
  notificationType?: string
): Promise<Notification[]> {
  await logInfo('backend', 'service', `Fetching notifications with limit: ${limit}, page: ${page}, type: ${notificationType}`);

  // Use mock data for demonstration
  // In production, this would fetch from the external API
  let filtered = [...mockNotifications];
  
  if (notificationType) {
    filtered = filtered.filter(n => n.Type === notificationType);
  }

  if (page && limit) {
    const start = (page - 1) * limit;
    filtered = filtered.slice(start, start + limit);
  } else if (limit) {
    filtered = filtered.slice(0, limit);
  }

  await logDebug('backend', 'service', `Returning ${filtered.length} notifications`);
  return filtered;
}

export async function getFilteredNotifications(
  type?: string,
  limit?: number,
  page?: number
): Promise<Notification[]> {
  await logDebug('backend', 'service', `Getting filtered notifications for type: ${type}`);
  return fetchNotifications(limit, page, type);
}
