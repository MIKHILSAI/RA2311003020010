import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { Notification } from '../types';

interface NotificationCardProps {
  notification: Notification;
  isRead: boolean;
  onRead: (id: string) => void;
}

const getTypeColor = (type: string): 'primary' | 'success' | 'warning' | 'default' => {
  switch (type) {
    case 'Placement': return 'primary';
    case 'Result': return 'success';
    case 'Event': return 'warning';
    default: return 'default';
  }
};

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, isRead, onRead }) => {
  const handleClick = () => {
    if (!isRead) {
      onRead(notification.ID);
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        backgroundColor: isRead ? '#f5f5f5' : '#ffffff',
        borderLeft: `4px solid ${getTypeColor(notification.Type) === 'primary' ? '#1976d2' : 
                       getTypeColor(notification.Type) === 'success' ? '#2e7d32' : 
                       getTypeColor(notification.Type) === 'warning' ? '#ed6c02' : '#9e9e9e'}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(5px)',
          boxShadow: 3
        }
      }}
      onClick={handleClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip 
            label={notification.Type} 
            color={getTypeColor(notification.Type)} 
            size="small"
          />
          <Typography variant="caption" color="textSecondary">
            {new Date(notification.Timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: isRead ? 'normal' : 'bold' }}>
          {notification.Message}
        </Typography>
        {!isRead && (
          <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
            ● New
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;