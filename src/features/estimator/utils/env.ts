/**
 * Helper functions to handle environment variables
 */

/**
 * Get the form step order from environment variables
 * This is used on the server-side to pass the step order to the client
 */
export function getFormStepOrderFromEnv(): string | undefined {
  return process.env.NEXT_PUBLIC_FORM_STEP_ORDER;
}
