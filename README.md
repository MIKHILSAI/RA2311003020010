# Campus Notifications API

A backend service for managing and retrieving campus notifications with priority-based filtering.

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Core Functionalality](#core-functionality)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Installation](#installation)
7. [Configuration](#configuration)
8. [Running the Application](#running-the-application)
9. [API Usage Examples](#api-usage-examples)
10. [Screenshots](#screenshots)

---

## Overview

The **Campus Notifications API** is a RESTful backend service built with Express.js that provides:
- Fetching notifications from an external notifications service
- Filtering notifications by type (Placement, Result, Event)
- Retrieving top N priority notifications based on type and recency
- Comprehensive logging to an external logging service
- Authentication via Bearer tokens

**Version:** 1.0.0  
**Port:** 3001 (default)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and available endpoints |
| GET | `/health` | Health check endpoint |
| GET | `/api/notifications` | Get all notifications with optional filtering and pagination |
| GET | `/api/notifications/priority/:n` | Get top N priority notifications |

### Endpoint Details

#### 1. Root Endpoint - `GET /`
Returns API metadata including version and available endpoints.

```json
{
  "message": "Campus Notifications API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "notifications": "/api/notifications",
    "priorityNotifications": "/api/notifications/priority/:n"
  }
}
```

#### 2. Health Check - `GET /health`
Returns the health status of the API.

```json
{
  "status": "OK"
}
```

#### 3. Get Notifications - `GET /api/notifications`
Fetches notifications with optional filtering and pagination.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number | Maximum number of notifications to return |
| `page` | number | Page number for pagination |
| `notification_type` | string | Filter by type: `Placement`, `Result`, or `Event` |

**Example Request:**
```
GET /api/notifications?limit=10&page=1&notification_type=Placement
```

**Example Response:**
```json
{
  "notifications": [
    {
      "ID": "string",
      "Type": "Placement",
      "Message": "string",
      "Timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 4. Get Priority Notifications - `GET /api/notifications/priority/:n`
Returns the top N priority notifications based on:
- **Type Weight:** Placement (3) > Result (2) > Event (1)
- **Recency:** More recent notifications have higher priority

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `n` | number | Number of top priority notifications to return |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `notification_type` | string | Filter by type before applying priority |

**Example Request:**
```
GET /api/notifications/priority/5?notification_type=Placement
```

**Example Response:**
```json
{
  "notifications": [...],
  "total": 20,
  "returned": 5
}
```

---

## Core Functionality

### 1. Notification Service (`notificationService.ts`)
- Fetches notifications from an external API (`http://20.207.122.201/evaluation-service/notifications`)
- Supports pagination via `limit` and `page` parameters
- Filters notifications by type (Placement, Result, Event)
- Requires authentication via Bearer token

### 2. Priority Queue (`priorityQueue.ts`)
- Implements a **Min-Heap** data structure for efficient top-N selection
- Calculates priority score based on:
  - **Type Weight:** Placement (3), Result (2), Event (1)
  - **Recency Score:** Time since notification was created
- Returns notifications sorted by priority (highest first)

### 3. Authentication Middleware (`auth.ts`)
- Validates Bearer tokens in the `Authorization` header
- Stores auth token globally for validation
- Returns 401 Unauthorized for missing or invalid tokens

### 4. Logging Middleware (`logging-middleware`)
- Configurable logging service that sends logs to an external API
- Supports logging levels: debug, info, warn, error, fatal
- Validates log parameters (stack, level, package)
- Provides convenience methods: `logDebug`, `logInfo`, `logWarn`, `logError`, `logFatal`

### 5. Environment Configuration
- Loads configuration from `.env` file
- Configures PORT and AUTH_TOKEN
- Sets up logger with auth token for external logging service

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ^20.0.0 | JavaScript runtime |
| Express | ^4.18.2 | Web framework |
| TypeScript | ^5.0.0 | Type-safe JavaScript |
| Cors | ^2.8.5 | CORS middleware |
| Dotenv | ^16.3.1 | Environment configuration |
| ts-node-dev | ^2.0.0 | Development server with hot reload |

---

## Project Structure

```
notification_app_be/
├── .env                    # Environment variables
├── package.json            # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── dist/                  # Compiled JavaScript (build output)
└── src/
    ├── index.ts            # Main application entry point
    ├── controllers/
    │   └── notificationController.ts   # API route handlers
    ├── middleware/
    │   └── auth.ts              # Authentication middleware
    ├── services/
    │   └── notificationService.ts  # Notification fetching service
    ├── types/
    │   └── notification.ts     # TypeScript interfaces
    └── utils/
        └── priorityQueue.ts    # Priority queue implementation
```

---

## Installation

### Prerequisites
- Node.js (v20.0.0 or higher)
- npm or yarn

### Steps

1. **Navigate to the project directory:**
   ```bash
   cd notification_app_be
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create the `.env` file:**
   ```bash
   cp .env.example .env
   ```
   
   Or create a new `.env` file with the following content:
   ```
   PORT=3001
   AUTH_TOKEN=your_auth_token_here
   ```

4. **Build the project** (optional for development):
   ```bash
   npm run build
   ```

---

## Configuration

The application requires the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `3001` |
| `AUTH_TOKEN` | Bearer token for external API authentication | (required) |

### Example `.env` File

```
PORT=3001
AUTH_TOKEN=your_secure_auth_token_here
```

---

## Running the Application

### Development Mode
Run the server with hot reload:
```bash
npm run dev
```

### Production Mode
Build and run:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001`.

---

## API Usage Examples

### 1. Check API Information
```bash
curl http://localhost:3001/
```

### 2. Check Health
```bash
curl http://localhost:3001/health
```

### 3. Get All Notifications (First 10)
```bash
curl "http://localhost:3001/api/notifications?limit=10"
```

### 4. Filter by Notification Type
```bash
curl "http://localhost:3001/api/notifications?notification_type=Placement"
```

### 5. Get Top 5 Priority Notifications
```bash
curl http://localhost:3001/api/notifications/priority/5
```

### 6. Get Top 3 Priority Placement Notifications
```bash
curl "http://localhost:3001/api/notifications/priority/3?notification_type=Placement"
```

---

## Screenshots

### How to Add Screenshots

To add screenshots to this documentation:

1. Run the server: `npm run dev`
2. Open your browser and navigate to `http://localhost:3001`
3. Use tools like Snipping Tool (Windows) or screenshot extensions to capture images
4. Save the images in PNG format to the `screenshots/` folder
5. Update the references below with your actual screenshot filenames

### Screenshot 1: API Root Endpoint
![Root Endpoint](./screenshots/root-endpoint.png)

*(Shows API metadata with version and available endpoints)*

**Expected Output:**
```json
{
  "message": "Campus Notifications API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "notifications": "/api/notifications",
    "priorityNotifications": "/api/notifications/priority/:n"
  }
}
```

### Screenshot 2: Health Check
![Health Check](./screenshots/health-check.png)

*(Returns OK status)*

**Expected Output:**
```json
{
  "status": "OK"
}
```

### Screenshot 3: Notifications List
![Notifications List](./screenshots/notification.png)

*(Shows filtered notifications with pagination)*

**Example Request:**
```
GET /api/notifications?limit=5&notification_type=Placement
```

### Screenshot 4: Priority Notifications
![Priority Notifications](./screenshots/priority-notifications.png)

*(Shows top N priority notifications sorted by type weight and recency)*

**Example Request:**
```
GET /api/notifications/priority/3?notification_type=Placement
```

### Screenshot 5: API in Browser (Root)
![API in Browser](./screenshots/api-browser.png)

*(Browser view of the root endpoint showing API information)*

---

## Adding Your Own Screenshots

### Using Windows Snipping Tool

1. Press `Win + Shift + S` to open the snipping tool
2. Select the area you want to capture
3. Save the image to `notification_app_be/screenshots/`
4. Name it appropriately (e.g., `root-endpoint.png`)

### Recommended Screenshot Names

| Filename | Description |
|----------|-------------|
| `root-endpoint.png` | Root endpoint response in browser |
| `health-check.png` | Health check endpoint response |
| `notifications-list.png` | List of notifications with query params |
| `priority-notifications.png` | Priority notifications endpoint |
| `api-browser.png` | Any browser-based API view |

---

## External Services

The application integrates with the following external services:

| Service | URL | Purpose |
|----------|-----|---------|
| Notifications API | `http://20.207.122.201/evaluation-service/notifications` | Fetch campus notifications |
| Logging API | `http://20.207.122.201/evaluation-service/logs` | Centralized logging |

---

## Error Handling

The API returns appropriate HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `400` | Bad Request (invalid parameters) |
| `401` | Unauthorized (missing/invalid token) |
| `500` | Internal Server Error |

---

## License

This project is for educational purposes.

---

## Author

Developed for campus notifications management system.
