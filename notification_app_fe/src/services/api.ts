import axios from 'axios';
import { Notification } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token after login (from registration)
export function setAuthToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function fetchNotifications(
  limit?: number,
  page?: number,
  type?: string
): Promise<Notification[]> {
  const params: any = {};
  if (limit) params.limit = limit;
  if (page) params.page = page;
  if (type && type !== 'all') params.notification_type = type;

  const response = await api.get('/notifications', { params });
  return response.data.notifications;
}

export async function fetchPriorityNotifications(
  n: number,
  type?: string
): Promise<{ notifications: Notification[]; total: number; returned: number }> {
  const params: any = {};
  if (type && type !== 'all') params.notification_type = type;

  const response = await api.get(`/notifications/priority/${n}`, { params });
  return response.data;
}