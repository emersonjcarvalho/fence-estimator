/**
 * Type definitions for Google Analytics gtag
 */
interface Window {
  /**
   * Google Analytics tag function for sending events and configurations
   */
  gtag: (
    command: 'event' | 'config' | 'set' | 'consent',
    actionOrTarget: string,
    params?: Record<string, any>
  ) => void;

  /**
   * Google Analytics data layer array
   */
  dataLayer: any[];
}
