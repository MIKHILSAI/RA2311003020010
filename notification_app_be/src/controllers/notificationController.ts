import { Router, Request, Response } from 'express';
import { getFilteredNotifications } from '../services/notificationService';
import { getTopPriorityNotifications } from '../utils/priorityQueue';
import { logInfo, logError, logDebug } from 'logging-middleware';

const router = Router();

// Get all notifications with pagination and filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    await logInfo('backend', 'controller', 'Received request for notifications');
    
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : undefined;
    const type = req.query.notification_type as string | undefined;

    const notifications = await getFilteredNotifications(type, limit, page);
    
    await logInfo('backend', 'controller', `Returning ${notifications.length} notifications`);
    res.json({ notifications });
  } catch (error) {
    await logError('backend', 'controller', `Error in notifications endpoint: ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get top N priority notifications
router.get('/priority/:n', async (req: Request, res: Response) => {
  try {
    const n = parseInt(req.params.n);
    const type = req.query.notification_type as string | undefined;
    
    await logInfo('backend', 'controller', `Getting top ${n} priority notifications${type ? ` for type ${type}` : ''}`);

    if (isNaN(n) || n <= 0) {
      await logError('backend', 'controller', `Invalid n value: ${req.params.n}`);
      res.status(400).json({ error: 'Invalid n value' });
      return;
    }

    let notifications = await getFilteredNotifications(type);
    
    // Apply type filter if specified
    if (type && type !== 'all') {
      notifications = notifications.filter((notification) => notification.Type === type);
      await logDebug('backend', 'controller', `Filtered to ${notifications.length} notifications of type ${type}`);
    }

    const topNotifications = getTopPriorityNotifications(notifications, n);
    
    await logInfo('backend', 'controller', `Returning top ${topNotifications.length} priority notifications`);
    res.json({ 
      notifications: topNotifications,
      total: notifications.length,
      returned: topNotifications.length
    });
  } catch (error) {
    await logError('backend', 'controller', `Error in priority endpoint: ${error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;