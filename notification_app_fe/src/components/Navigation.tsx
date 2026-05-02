import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InboxIcon from '@mui/icons-material/Inbox';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Campus Notifications
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            startIcon={<NotificationsIcon />}
            sx={{ 
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              borderBottom: location.pathname === '/' ? '2px solid white' : 'none'
            }}
          >
            All Notifications
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/priority"
            startIcon={<InboxIcon />}
            sx={{ 
              fontWeight: location.pathname === '/priority' ? 'bold' : 'normal',
              borderBottom: location.pathname === '/priority' ? '2px solid white' : 'none'
            }}
          >
            Priority Inbox
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;