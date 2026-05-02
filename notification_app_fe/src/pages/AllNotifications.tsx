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
  Pagination,
  SelectChangeEvent
} from '@mui/material';
import NotificationCard from '../components/NotificationCard';
import { Notification, ReadStatusMap } from '../types';
import { fetchNotifications } from '../services/api';
import { frontendInfo, frontendError } from '../utils/logger';

const AllNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [readStatus, setReadStatus] = useState<ReadStatusMap>(() => {
    const saved = localStorage.getItem('readNotifications');
    return saved ? JSON.parse(saved) : {};
  });
  const itemsPerPage = 10;

  useEffect(() => {
    loadNotifications();
  }, [filterType]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      await frontendInfo('frontend', 'page', 'Loading all notifications');
      const data = await fetchNotifications(undefined, undefined, filterType);
      setNotifications(data);
      await frontendInfo('frontend', 'page', `Loaded ${data.length} notifications`);
    } catch (error) {
      await frontendError('frontend', 'page', `Error loading notifications: ${error}`);
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (id: string) => {
    const newReadStatus = { ...readStatus, [id]: true };
    setReadStatus(newReadStatus);
    localStorage.setItem('readNotifications', JSON.stringify(newReadStatus));
  };

  const handleTypeFilter = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
    setPage(1);
  };

  const paginatedNotifications = notifications.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
        All Notifications
      </Typography>
      
      <Box mb={3}>
        <FormControl fullWidth>
          <InputLabel>Filter by Type</InputLabel>
          <Select value={filterType} label="Filter by Type" onChange={handleTypeFilter}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {paginatedNotifications.length === 0 ? (
        <Typography color="textSecondary" align="center">
          No notifications found
        </Typography>
      ) : (
        <>
          {paginatedNotifications.map((notification) => (
            <NotificationCard
              key={notification.ID}
              notification={notification}
              isRead={readStatus[notification.ID] || false}
              onRead={handleMarkAsRead}
            />
          ))}
          
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={Math.ceil(notifications.length / itemsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default AllNotifications;
