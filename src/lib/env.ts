/**
 * Safely access environment variables with proper TypeScript typing.
 * 
 * @param key - The environment variable key to access
 * @param defaultValue - Default value to return if the environment variable is not defined
 * @returns The environment variable value or the default value
 */
export function getEnvVariable(key: string, defaultValue: string = ''): string {
  if (typeof process === 'undefined' || typeof process.env === 'undefined') {
    return defaultValue;
  }
  
  return process.env[key] || defaultValue;
}
