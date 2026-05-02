import { configureLogger, log, logInfo, logError, logDebug, logWarn } from 'logging-middleware';

let isConfigured = false;

export function initLogger(token: string) {
  configureLogger(token);
  isConfigured = true;
}

export async function frontendLog(level: 'debug' | 'info' | 'warn' | 'error' | 'fatal', pkg: string, message: string) {
  if (!isConfigured) {
    console.warn('Logger not configured');
    return;
  }
  return log('frontend', level, pkg, message);
}

// Convenience exports
export { logInfo as frontendInfo, logError as frontendError, logDebug as frontendDebug, logWarn as frontendWarn };