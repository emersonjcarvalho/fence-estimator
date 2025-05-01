# HomeBuddy Estimator Form Configuration Guide

This guide explains how to configure the order of steps in the HomeBuddy estimator form using environment variables.

## Available Steps

The form consists of the following steps, each identified by a unique ID:

- `userInfo` - User contact information (name and email)
- `showerIssues` - Issues with the current shower/tub
- `waterHeater` - Type of water heating system
- `plumbingCondition` - Condition of existing plumbing
- `existingBathtub` - Whether there's an existing bathtub to be replaced
- `projectType` - Type of conversion project
- `zipCode` - User's ZIP code for localized pricing

## Configuring Step Order

### Using Environment Variables

To configure the order of steps:

1. Create or modify the `.env.local` file in the root directory of the project.
2. Add or update the following line:

```
NEXT_PUBLIC_FORM_STEP_ORDER=step1,step2,step3,step4,step5,step6,step7
```

Replace `step1,step2,` etc. with the step IDs in the desired order.

### Important Note for Next.js 15

In Next.js 15, environment variables are loaded at build time for client components. After changing the environment variables:

1. Save the `.env.local` file
2. **Stop the development server** (Ctrl+C)
3. Restart the server with `npm run dev`
4. Refresh your browser

The changes will not take effect without restarting the server.

## Example Configuration Files

We've included several example configuration files:

- `.env.local` - Default configuration (Project Type first, Contact Info last)
- `.env.example-userinfo-first` - Contact Info first configuration
- `.env.example-technical-first` - Technical questions first configuration

To use one of these examples:

```bash
# First, stop the development server (Ctrl+C)

# Copy the example configuration
cp .env.example-userinfo-first .env.local

# Restart the server
npm run dev
```

## Debugging

In development mode, a debug panel is available in the bottom-right corner of the screen. Click "Show Debug" to see the current environment configuration.

## Validation Rules

The configuration system enforces the following rules:

1. All step IDs must be valid (match one of the available steps)
2. Each step must appear exactly once
3. The order must include exactly 7 steps

If the configuration is invalid, the system will fall back to the default order.

## Troubleshooting

If the step order configuration doesn't seem to take effect:

1. Make sure you've restarted the development server after changing `.env.local`
2. Check the browser console for any configuration warnings
3. Use the debug panel to verify the environment variables are loaded correctly
4. Verify that your step order includes all required steps exactly once
