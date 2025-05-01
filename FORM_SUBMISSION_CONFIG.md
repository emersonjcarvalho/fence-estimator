# Form Submission Configuration

This document explains how to configure the form submission behavior in the Home Service Estimator application.

## Configuration Options

There are two main configuration options for form submission behavior:

1. `NEXT_PUBLIC_FORM_RESET_TIMEOUT`: Controls how long the application waits before automatically resetting the form after a successful submission.
2. `NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED`: Controls whether the form should automatically reset at all.

## Configuration Methods

### 1. Using Environment Variables (Recommended)

Create or edit the `.env.local` file in the root directory and add the following variables:

```
# Reset timeout in milliseconds (default: 10000 = 10 seconds)
NEXT_PUBLIC_FORM_RESET_TIMEOUT=10000

# Enable/disable automatic reset after submission (true/false)
NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED=true
```

### 2. Using the Default Values

If you don't configure these settings explicitly:

- The default reset timeout is 10 seconds (10000 milliseconds)
- Auto-reset is enabled by default (for backward compatibility)

## Behavior Modes

### Auto-reset Enabled (NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED=true)

When auto-reset is enabled:

1. User completes the form and submits it
2. Success message appears
3. After the configured timeout (e.g., 10 seconds), the form automatically resets to the beginning
4. The user can also click "Start a New Estimate" to reset immediately

### Auto-reset Disabled (NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED=false)

When auto-reset is disabled:

1. User completes the form and submits it
2. Success message appears
3. The form stays on the success screen indefinitely
4. The form only resets when the user explicitly clicks the "Start a New Estimate" button

## Important Notes

- After changing environment variables, you must restart the development server for the changes to take effect
- In development mode, you can use the "Show Debug" button in the bottom-right corner to verify the current configuration
- If using the production build, ensure environment variables are properly set in your hosting environment

## Examples

### Configuration for Kiosk Mode

For a kiosk where you want the form to automatically reset quickly:

```
NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED=true
NEXT_PUBLIC_FORM_RESET_TIMEOUT=5000
```

### Configuration for Website Mode

For a website where users should explicitly choose to start a new form:

```
NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED=false
```
