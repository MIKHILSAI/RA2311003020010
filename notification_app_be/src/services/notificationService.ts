import { logInfo, logError, logDebug } from 'logging-middleware';
import type { Notification } from '../types/notification';

interface NotificationsResponse {
  notifications: Notification[];
}

let authToken: string | null = null;

export function setServiceAuthToken(token: string) {
  authToken = token;
}

export async function fetchNotifications(
  limit?: number, 
  page?: number, 
  notificationType?: string
): Promise<Notification[]> {
  await logInfo('backend', 'service', `Fetching notifications with limit: ${limit}, page: ${page}, type: ${notificationType}`);

  if (!authToken) {
    await logError('backend', 'service', 'Auth token not configured');
    throw new Error('Auth token not configured');
  }

  const url = new URL('http://20.207.122.201/evaluation-service/notifications');
  if (limit) url.searchParams.append('limit', limit.toString());
  if (page) url.searchParams.append('page', page.toString());
  if (notificationType) url.searchParams.append('notification_type', notificationType);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      await logError('backend', 'service', `Failed to fetch notifications: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NotificationsResponse = await response.json();
    await logDebug('backend', 'service', `Successfully fetched ${data.notifications.length} notifications`);
    return data.notifications;
  } catch (error) {
    await logError('backend', 'service', `Error fetching notifications: ${error}`);
    throw error;
  }
}

export async function getFilteredNotifications(
  type?: string,
  limit?: number,
  page?: number
): Promise<Notification[]> {
  await logDebug('backend', 'service', `Getting filtered notifications for type: ${type}`);
  return fetchNotifications(limit, page, type);
}