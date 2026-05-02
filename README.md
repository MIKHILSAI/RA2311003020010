# Campus Notifications Backend

Express.js backend API for the Campus Notifications System.

## Overview

The backend provides a RESTful API for managing and retrieving campus notifications. It supports:
- Getting all notifications with pagination and filtering
- Getting priority notifications sorted by importance
- Health check endpoint

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installation

```bash
npm install
```

## Running the Backend

```bash
npm start
```

The backend will start on http://localhost:3001

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3001
AUTH_TOKEN=my-secret-auth-token-for-campus-notifications-2024
NODE_ENV=development
```

## API Endpoints

### Health Check

```
GET /health
```

Returns the health status of the API.

![Health Check](./screenshots/health-check.png)

### Get All Notifications

```
GET /api/notifications
```

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Number of notifications to return |
| page | number | Page number for pagination |
| notification_type | string | Filter by type (Placement, Result, Event) |

Example Response:
![Notifications API Response](./screenshots/notifications_api_response.png)

### Get Priority Notifications

```
GET /api/notifications/priority/:n
```

Get the top N priority notifications sorted by importance.

Path Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| n | number | Number of priority notifications to return |

Query Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| notification_type | string | Filter by type (Placement, Result, Event) |

## Notification Types

- **Placement** - Campus placement notifications
- **Result** - Exam/Interview result notifications  
- **Event** - Campus event notifications

## Features

- **Pagination**: Handle large datasets with limit and page parameters
- **Filtering**: Filter notifications by type (Placement, Result, Event)
- **Priority Queue**: Efficiently retrieve top priority notifications
- **CORS Enabled**: Cross-origin resource sharing enabled
- **Environment Configuration**: Easy configuration via .env file

## Project Structure

```
src/
├── index.ts              # Main application entry point
├── controllers/
│   └── notificationController.ts  # API route handlers
├── middleware/
│   └── auth.ts          # Authentication middleware
├── services/
│   └── notificationService.ts  # Business logic
├── types/
│   └── notification.ts # TypeScript type definitions
└── utils/
    └── priorityQueue.ts # Priority queue implementation
```

## Screenshots

### All Notifications Dashboard
![All Notifications Dashboard](./screenshots/all_notifications_dashboard.png)

### Filtered by Placement
![Filtered Placement](./screenshots/notifications_filtered_placement.png)

### Priority Inbox - All Notifications
![Priority Inbox All](./screenshots/priority_inbox_all_notifications.png)

### Priority Inbox - Filtered Results
![Priority Inbox Filtered](./screenshots/priority_inbox_filtered_results.png)

### Responsive Design
![Responsive](./screenshots/responsive_for_all_devices.png)

## API Response Format

```json
{
  "notifications": [
    {
      "ID": "1",
      "Title": "Placement Drive - Google",
      "Description": "Google is visiting campus for software engineer positions",
      "Type": "Placement",
      "Priority": 1,
      "Date": "2024-01-15"
    }
  ]
}
```

## Connecting to Frontend

The frontend is configured to connect to this backend. See [notification_app_fe](../notification_app_fe/README.md) for frontend setup instructions.
