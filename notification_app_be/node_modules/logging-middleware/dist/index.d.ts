declare const ALLOWED_STACKS: readonly ["backend", "frontend"];
declare const ALLOWED_LEVELS: readonly ["debug", "info", "warn", "error", "fatal"];
type Stack = typeof ALLOWED_STACKS[number];
type Level = typeof ALLOWED_LEVELS[number];
type Package = string;
interface LogResponse {
    logID: string;
    message: string;
}
export declare function configureLogger(token: string, apiUrl?: string): void;
export declare function log(stack: Stack, level: Level, pkg: Package, message: string): Promise<LogResponse | null>;
export declare const logDebug: (stack: Stack, pkg: Package, message: string) => Promise<LogResponse | null>;
export declare const logInfo: (stack: Stack, pkg: Package, message: string) => Promise<LogResponse | null>;
export declare const logWarn: (stack: Stack, pkg: Package, message: string) => Promise<LogResponse | null>;
export declare const logError: (stack: Stack, pkg: Package, message: string) => Promise<LogResponse | null>;
export declare const logFatal: (stack: Stack, pkg: Package, message: string) => Promise<LogResponse | null>;
export {};
