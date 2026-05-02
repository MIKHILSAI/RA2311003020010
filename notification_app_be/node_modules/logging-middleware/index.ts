// Allowed values for validation
const ALLOWED_STACKS = ['backend', 'frontend'] as const;
const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const;
const ALLOWED_PACKAGES = {
  backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
  frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
  both: ['auth', 'config', 'middleware', 'utils']
};

type Stack = typeof ALLOWED_STACKS[number];
type Level = typeof ALLOWED_LEVELS[number];
type Package = string;

interface LogResponse {
  logID: string;
  message: string;
}

// Configuration - to be set by the consuming application
let authToken: string | null = null;
let logAPIUrl = 'http://20.207.122.201/evaluation-service/logs';

export function configureLogger(token: string, apiUrl?: string) {
  authToken = token;
  if (apiUrl) logAPIUrl = apiUrl;
}

export async function log(stack: Stack, level: Level, pkg: Package, message: string): Promise<LogResponse | null> {
  // Validate inputs
  if (!ALLOWED_STACKS.includes(stack)) {
    console.error(`Invalid stack: ${stack}`);
    return null;
  }

  if (!ALLOWED_LEVELS.includes(level)) {
    console.error(`Invalid level: ${level}`);
    return null;
  }

  // Validate package based on stack
  const validPackages = [...ALLOWED_PACKAGES[stack as keyof typeof ALLOWED_PACKAGES], ...ALLOWED_PACKAGES.both];
  if (!validPackages.includes(pkg)) {
    console.error(`Invalid package: ${pkg} for stack: ${stack}`);
    return null;
  }

  if (!authToken) {
    console.error('Logger not configured. Call configureLogger() first');
    return null;
  }

  try {
    const response = await fetch(logAPIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });

    if (!response.ok) {
      console.error(`Logging failed with status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to send log:', error);
    return null;
  }
}

// Convenience methods
export const logDebug = (stack: Stack, pkg: Package, message: string) => log(stack, 'debug', pkg, message);
export const logInfo = (stack: Stack, pkg: Package, message: string) => log(stack, 'info', pkg, message);
export const logWarn = (stack: Stack, pkg: Package, message: string) => log(stack, 'warn', pkg, message);
export const logError = (stack: Stack, pkg: Package, message: string) => log(stack, 'error', pkg, message);
export const logFatal = (stack: Stack, pkg: Package, message: string) => log(stack, 'fatal', pkg, message);