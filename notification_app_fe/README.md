# Campus Notifications Frontend

React frontend for the Campus Notifications System.

## Overview

The frontend provides a user-friendly interface for viewing campus notifications with features like:
- All Notifications page with filtering and pagination
- Priority Inbox for important notifications
- Responsive design for all devices
- Read status tracking

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installation

```bash
npm install
```

## Running the Frontend

```bash
npm start
```

The frontend will open on http://localhost:3000

## Features

### All Notifications Page
View all campus notifications with:
- Filter by notification type (Placement, Result, Event)
- Pagination for easy navigation
- Mark as read functionality

![All Notifications Dashboard](../notification_app_be/screenshots/all_notifications_dashboard.png)

### Priority Inbox
View priority notifications sorted by importance:
- Top priority notifications displayed first
- Filter by type
- Quick access to important updates

![Priority Inbox All Notifications](../notification_app_be/screenshots/priority_inbox_all_notifications.png)

![Priority Inbox Filtered Results](../notification_app_be/screenshots/priority_inbox_filtered_results.png)

### Filtering
Filter notifications by type:
- **All**: Show all notifications
- **Placement**: Campus placement notifications
- **Result**: Exam/Interview results
- **Event**: Campus events

![Notifications Filtered by Placement](../notification_app_be/screenshots/notifications_filtered_placement.png)

### Responsive Design
The interface adapts to different screen sizes:
- Desktop
- Tablet
- Mobile

![Responsive for All Devices](../notification_app_be/screenshots/responsive_for_all_devices.png)

## Connecting to Backend

The frontend connects to the backend API running on http://localhost:3001. The proxy is configured in package.json:

```json
"proxy": "http://localhost:3001"
```

## Project Structure

```
src/
├── App.tsx              # Main application component
├── index.tsx           # Application entry point
├── components/
│   ├── Navigation.tsx  # Navigation bar
│   └── NotificationCard.tsx  # Notification display card
├── pages/
│   ├── AllNotifications.tsx  # All notifications page
│   └── PriorityInbox.tsx    # Priority inbox page
├── services/
│   └── api.ts         # API service for backend communication
├── types/
│   └── index.ts       # TypeScript type definitions
└── utils/
    └── logger.ts      # Logging utility
```

## Technology Stack

- **React** - UI framework
- **Material-UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TypeScript** - Type safety

## Notification Interface

Each notification displays:
- Title
- Description
- Type (Placement, Result, Event)
- Priority level
- Date

Users can:
- Filter by type
- Mark as read
- Navigate between pages

## Screenshots Reference

All screenshots are stored in the backend screenshots folder:
- `../notification_app_be/screenshots/all_notifications_dashboard.png`
- `../notification_app_be/screenshots/notifications_filtered_placement.png`
- `../notification_app_be/screenshots/priority_inbox_all_notifications.png`
- `../notification_app_be/screenshots/priority_inbox_filtered_results.png`
- `../notification_app_be/screenshots/responsive_for_all_devices.png`

## Running with Backend

For full functionality, run both frontend and backend:

**Terminal 1 - Backend:**
```bash
cd notification_app_be
npm start
```

**Terminal 2 - Frontend:**
```bash
cd notification_app_fe
npm start
```

The frontend will be available at http://localhost:3000 and will communicate with the backend API at http://localhost:3001.
