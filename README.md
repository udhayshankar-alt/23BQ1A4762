# Med Tek Logging Middleware

A TypeScript logging middleware for sending application logs to a centralized logging service.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Then update `.env` with your logging API tokens:

```
LOG_TOKEN=your-api-token-here
VITE_LOG_TOKEN=your-api-token-here
```

## Usage

### Basic Logging

```typescript
import { Log } from './logging_middleware/logger';

// Send a log entry
await Log('backend', 'info', 'my-service', 'User login successful');
```

### Log Levels

- `debug` - Detailed debugging information
- `info` - General informational messages
- `warn` - Warning messages for potential issues
- `error` - Error messages for failures
- `fatal` - Fatal errors that stop execution

### Examples

```typescript
// Info level
await Log('backend', 'info', 'auth-service', 'User logged in');

// Error level
await Log('backend', 'error', 'database', 'Connection timeout');

// Frontend logging
await Log('frontend', 'warn', 'ui-components', 'Form validation failed');

// Mobile logging
await Log('mobile', 'debug', 'api-client', 'Request interceptor activated');
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Specific Test

```bash
npm test logger.test.ts
```

## Build

### Compile TypeScript

```bash
npm run build
```

This generates compiled JavaScript in the `dist/` directory.

## Project Structure

```
Med Tek/
├── src/
│   └── logging_middleware/
│       ├── logger.ts           # Main logger implementation
│       └── logger.test.ts      # Logger tests
├── dist/                        # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env
├── .env.example
└── README.md
```

## API Specification

The logger sends POST requests to: `http://4.224.186.213/evaluation-service/logs`

### Request Headers

- `Content-Type: application/json`
- `Authorization: Bearer {LOG_TOKEN}`

### Request Body

```json
{
  "stack": "backend",
  "level": "info",
  "package": "my-service",
  "message": "Log message"
}
```

## Features

✅ Async logging with error handling  
✅ Support for multiple log levels  
✅ Stack-based organization (backend, frontend, mobile, api)  
✅ Package/service identification  
✅ Environment-based token configuration  
✅ Comprehensive test coverage  
✅ TypeScript support with strict type checking  

## Error Handling

The logger gracefully handles errors:
- Network failures are caught and logged to console
- Missing or invalid tokens don't crash the application
- Long messages and special characters are properly handled

## Testing Coverage

The test suite includes:
- Basic functionality tests
- Log level validation
- Stack name validation
- Error handling
- Environment variable handling
- API endpoint validation
- Special character handling
- Timeout handling
- Async behavior verification
