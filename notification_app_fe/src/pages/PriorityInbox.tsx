import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  TextField,
  Grid,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import NotificationCard from '../components/NotificationCard';
import { Notification, ReadStatusMap } from '../types';
import { fetchPriorityNotifications } from '../services/api';
import { frontendInfo, frontendError } from '../utils/logger';

const PriorityInbox: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [topN, setTopN] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [readStatus, setReadStatus] = useState<ReadStatusMap>(() => {
    const saved = localStorage.getItem('readNotifications');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    loadPriorityNotifications();
  }, [topN, filterType]);

  const loadPriorityNotifications = async () => {
    try {
      setLoading(true);
await frontendInfo('frontend', 'page', `Loading top ${topN} priority notifications`);
      const result = await fetchPriorityNotifications(topN, filterType);
      setNotifications(result.notifications);
      setTotalCount(result.total);
await frontendInfo('frontend', 'page', `Loaded ${result.notifications.length} priority notifications out of ${result.total}`);
    } catch (error) {
await frontendError('frontend', 'page', `Error loading priority notifications: ${error}`);
      console.error('Error loading priority notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (id: string) => {
    const newReadStatus = { ...readStatus, [id]: true };
    setReadStatus(newReadStatus);
    localStorage.setItem('readNotifications', JSON.stringify(newReadStatus));
  };

  const handleTopNChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= 50) {
      setTopN(value);
    }
  };

  const handleTypeFilter = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Priority Inbox
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Highest priority notifications based on type (Placement → Result → Event) and recency
      </Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Number of top notifications"
            value={topN}
            onChange={handleTopNChange}
            inputProps={{ min: 1, max: 50 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Filter by Type</InputLabel>
            <Select value={filterType} label="Filter by Type" onChange={handleTypeFilter}>
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="Placement">Placement Only</MenuItem>
              <MenuItem value="Result">Result Only</MenuItem>
              <MenuItem value="Event">Event Only</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {totalCount > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Showing top {notifications.length} notifications out of {totalCount} total {filterType !== 'all' ? filterType : ''} notifications
        </Alert>
      )}

      {notifications.length === 0 ? (
        <Typography color="textSecondary" align="center">
          No priority notifications found
        </Typography>
      ) : (
        notifications.map((notification) => (
          <NotificationCard
            key={notification.ID}
            notification={notification}
            isRead={readStatus[notification.ID] || false}
            onRead={handleMarkAsRead}
          />
        ))
      )}
    </Container>
  );
};

export default PriorityInbox;