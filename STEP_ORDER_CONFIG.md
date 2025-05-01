# Step Order Configuration

This document explains how to configure the order of steps in the HomeBuddy estimator form.

## Overview

The form steps can be reordered by setting the `NEXT_PUBLIC_FORM_STEP_ORDER` environment variable. This variable should contain a comma-separated list of step keys.

## Available Steps

The following step keys are available:

- `projectType` - Description of the project (tub to shower, etc.)
- `showerIssues` - Issues with the current shower/tub
- `waterHeater` - Type of water heating system
- `plumbingCondition` - Condition of existing plumbing
- `existingBathtub` - Whether there's an existing bathtub
- `zipCode` - ZIP code for location-based pricing
- `contactInfo` - User contact information

## Configuration Examples

### Default Order (Project Type First, Contact Info Last)

```
NEXT_PUBLIC_FORM_STEP_ORDER=projectType,showerIssues,waterHeater,plumbingCondition,existingBathtub,zipCode,contactInfo
```

### Contact Info First, ZIP Code Last

```
NEXT_PUBLIC_FORM_STEP_ORDER=contactInfo,projectType,showerIssues,waterHeater,plumbingCondition,existingBathtub,zipCode
```

### ZIP Code First, Project Type Last

```
NEXT_PUBLIC_FORM_STEP_ORDER=zipCode,showerIssues,waterHeater,plumbingCondition,existingBathtub,contactInfo,projectType
```

## How to Configure

1. Create or edit the `.env.local` file in the root directory of the project
2. Add the `NEXT_PUBLIC_FORM_STEP_ORDER` variable with your desired step order
3. Restart the development server (`npm run dev`) for the changes to take effect

## Validation

The system performs validation to ensure that:

1. All step keys are valid
2. All required steps are included

If the configuration is invalid, the system will fall back to the default order.
