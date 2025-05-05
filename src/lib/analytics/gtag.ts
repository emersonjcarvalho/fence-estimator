/**
 * Google Analytics utilities for tracking events and page views
 */

// Get measurement ID from environment variables
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Track a custom event in Google Analytics
 * 
 * @param action - The event action name
 * @param params - Additional parameters to include with the event
 */
export const trackEvent = (action: string, params?: Record<string, any>): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    // Skip tracking if running on server or gtag isn't available
    return;
  }

  try {
    window.gtag('event', action, params);
  } catch (error) {
    // Log error but don't break the application
    console.error('Error tracking event:', error);
  }
};

/**
 * Track a form step view in Google Analytics
 * 
 * @param stepId - Identifier for the step (e.g., 'propertyType')
 * @param stepNumber - The numerical position of the step
 * @param stepTitle - Human-readable title of the step
 */
export const trackFormStep = (
  stepId: string, 
  stepNumber: number, 
  stepTitle?: string
): void => {
  trackEvent('form_step_view', {
    form_name: 'fence_estimator',
    step_id: stepId,
    step_number: stepNumber,
    step_title: stepTitle || stepId, // Use stepId as fallback if title not provided
  });
};

/**
 * Track a virtual page view in Google Analytics
 * This is useful for SPA navigation where the URL doesn't change
 * 
 * @param pagePath - The virtual path for the page (e.g., '/form/step2')
 * @param pageTitle - The title for the page
 */
export const trackVirtualPageView = (pagePath: string, pageTitle?: string): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  try {
    window.gtag('config', GA_MEASUREMENT_ID as string, {
      page_path: pagePath,
      page_title: pageTitle,
    });
  } catch (error) {
    console.error('Error tracking virtual page view:', error);
  }
};

/**
 * Track form submission events
 * 
 * @param success - Whether the submission was successful
 * @param data - Additional data about the submission
 */
export const trackFormSubmission = (
  success: boolean, 
  data?: Record<string, any>
): void => {
  const eventName = success ? 'form_submission_success' : 'form_submission_failure';
  
  trackEvent(eventName, {
    form_name: 'fence_estimator',
    ...data,
  });
};
