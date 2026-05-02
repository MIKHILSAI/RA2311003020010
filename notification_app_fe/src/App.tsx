import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';
import { initLogger } from './utils/logger';
import { setAuthToken } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize logger and auth token
    // For development, use the token from backend .env
    const token = 'QkbpxH'; // Same token as backend
    localStorage.setItem('authToken', token);
    initLogger(token);
    setAuthToken(token);
    setInitialized(true);
  }, []);

  if (!initialized) {
    return <div>Initializing...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityInbox />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;