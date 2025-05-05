# Analytics Setup Guide

This document explains how analytics are set up in the Fence Estimator application to track multi-step form interactions.

## Overview

The application uses Google Analytics 4 (GA4) to track user interactions with the multi-step form. We've implemented custom event tracking to monitor each step of the form without changing the URL structure, ensuring accurate tracking in the single-page application (SPA) context.

## Environment Variables

Analytics configuration uses environment variables for security and flexibility:

```
# Google Analytics Configuration
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Make sure to add your Google Analytics Measurement ID to the `.env` file. The example file `.env.example` shows the expected format.

## Analytics Implementation

The analytics implementation consists of several components:

### 1. Analytics Utilities (`src/lib/analytics/`)

- **gtag.ts**: Core functions for tracking events and page views
- **analytics-provider.tsx**: React context provider that initializes analytics and handles virtual page views
- **types.d.ts**: TypeScript definitions for Google Analytics

### 2. Form Step Tracking

The application tracks each form step as:

- **Custom Events**: `form_step_view` events with step information
- **Virtual Page Views**: Simulated page views for each step

This dual approach ensures compatibility with different GA4 reporting methods.

### 3. Form Submission Tracking

Form submissions are tracked as:
- **Success Events**: `form_submission_success` 
- **Failure Events**: `form_submission_failure`

These events include relevant metadata like form type and error messages if applicable.

## Google Analytics Setup

To get the most out of this implementation:

1. **Create a GA4 Funnel Report**:
   - Navigate to Explore > New Exploration > Funnel
   - Add `form_step_view` as your primary event
   - Use `step_number` or `step_id` as the breakdown dimension
   - Add `form_submission_success` as the final step

2. **Configure Enhanced Measurement**:
   - In GA4, make sure "Enhanced Measurement" is enabled to track page changes
   - This helps capture virtual page views

3. **Create Custom Dimensions**:
   - For advanced analysis, create custom dimensions in GA4 for:
     - `step_id`
     - `step_number`
     - `form_name`

## How It Works

1. When a user navigates to a form step, the `EstimatorContext` tracks:
   - A custom event (`form_step_view`)
   - A virtual page view for that step

2. When a user submits the form, the application tracks:
   - A success event if submission worked
   - A failure event with error details if it failed

3. All events include consistent parameters for correlation in reports

## Debugging Analytics

To debug analytics events:

1. Enable GA4 Debug View in the Google Analytics interface
2. Check your browser console for tracking events (look for `gtag` calls)
3. Use the Google Analytics Debugger browser extension for detailed insights

## Important Notes

- This implementation tracks form steps without changing URLs, addressing the SPA tracking challenge
- The analytics code is separate from business logic for maintainability
- Environment variables are used to keep measurement IDs secure
- No personal data is included in analytics events
