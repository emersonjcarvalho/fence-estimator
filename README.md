# Home Service Estimator - Walk-in Shower Form

A multi-step interactive web form for home services estimation, specifically for walk-in shower installations, built with Next.js 15, Tailwind CSS, and Prisma ORM.

## 🚀 Features

- **Multi-step Form**: Guided user experience with a step-by-step approach
- **Mobile Responsive**: Optimized for all screen sizes
- **Configurable Step Order**: Easily change the order of form steps via environment variables
- **Interactive UI**: Visual icons, progress indicator, and friendly character
- **Form State Management**: Complete state management with back/forward navigation
- **Prisma ORM Integration**: Type-safe database access with Prisma ORM
- **Admin Dashboard**: Simple dashboard to view form submissions
- **Vercel Deployment Ready**: Configured for seamless deployment to Vercel

## 🏁 Getting Started

### Prerequisites

- **Node.js**: Version 20.18.0 or higher

### Running the Application

1. **Navigate to the Project Directory**:
    ```bash
    cd C:\PROJECTS\Home Service Estimator\with-claude-desktop
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Configure Database**:
    - Copy `.env.example` to `.env.local` and set up your environment variables
    - Configure your database connection string in `DATABASE_URL` (see [Prisma Setup](PRISMA_SETUP.md))
    - Generate the Prisma client: `npm run prisma:generate`
    - Push the schema to your database: `npm run prisma:push`

4. **Start the Development Server**:
    ```bash
    npm run dev
    ```

5. **Open in Browser**:
   Navigate to `http://localhost:3000` to see the form in action.
   For the admin dashboard, go to `http://localhost:3000/admin`.

## 🛠️ Configuring Form Step Order

This app features a configurable form step order that can be modified in multiple ways:

### 1. Using In-App Configuration Switcher (Easiest)

In development mode, a "Test Configs" button appears in the bottom-left corner of the screen. Click it to reveal configuration options that can be changed without restarting the server.

### 2. Editing Hardcoded Configuration

If environment variables aren't working, you can directly modify the hardcoded configuration:

1. Open `src/features/estimator/config/hardcodedConfig.ts`
2. Change the `ACTIVE_CONFIG` line to use a different preset:
   ```typescript
   // Change this to switch configurations
   export const ACTIVE_CONFIG = CONFIGS.USER_INFO_FIRST;
   ```
3. Restart the development server with `npm run dev`

### 3. Using Environment Variables

For persistent configuration, you can use environment variables:

#### Using the Configuration Switcher Script

```bash
# Windows
switch-config.bat userinfo-first

# Mac/Linux
./switch-config.sh userinfo-first
```

#### Manual Configuration

Edit the `.env.local` file:
```
NEXT_PUBLIC_FORM_STEP_ORDER=userInfo,projectType,showerIssues,waterHeater,plumbingCondition,existingBathtub,zipCode
```

#### Form Submission Behavior Configuration

You can configure the form submission behavior using the following environment variables:

```
# Reset timeout in milliseconds (default: 10000 = 10 seconds)
NEXT_PUBLIC_FORM_RESET_TIMEOUT=10000

# Enable/disable automatic reset after submission (true/false)
NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED=true
```

- When `NEXT_PUBLIC_FORM_AUTO_RESET_ENABLED` is set to `true`, the form will automatically reset after the specified timeout.
- When set to `false`, the form will only reset when the user clicks the "Start a New Estimate" button.

**Important**: After changing environment variables, you must restart the development server:
```bash
# Stop the server with Ctrl+C, then restart
npm run dev
```

## 🗄️ Database Setup with Prisma

This project uses Prisma ORM for database access. See [PRISMA_SETUP.md](PRISMA_SETUP.md) for detailed setup instructions.

### Quick Database Setup

1. Set your database connection string in `.env.local`:
   ```
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

2. Generate the Prisma client:
   ```bash
   npm run prisma:generate
   ```

3. Push the schema to your database:
   ```bash
   npm run prisma:push
   ```

4. (Optional) Seed your database with test data:
   ```bash
   npm run prisma:seed
   ```

### Database Setup Helper

You can also use the interactive setup helper:
```bash
npx ts-node prisma/setup-db.ts
```

## Debugging

Development mode includes several debugging tools:

- **Show Debug** (bottom-right): Displays current environment variables and configuration
- **Test Configs** (bottom-left): Allows testing different configurations without server restart
- **Database Status**: Shows the current database connection status when debug is enabled

## 📚 Project Structure

```
src/
├── features/
│   └── estimator/
│       ├── components/       # Form step components
│       ├── config/           # Step configuration
│       ├── context/          # Form state management
│       ├── repositories/     # Database repositories
│       ├── schemas/          # Validation schemas
│       └── services/         # Business logic services
├── app/
│   ├── admin/                # Admin dashboard
│   └── page.tsx              # Main estimator page
├── lib/
│   ├── db/                   # Database utilities
│   ├── prisma/               # Prisma client setup
│   └── supabase/             # Legacy Supabase client (fallback)
├── prisma/
│   ├── schema.prisma         # Prisma schema
│   ├── seed.ts               # Database seeding script
│   └── setup-db.ts           # Interactive setup helper
└── registry/                 # UI components registry
```

## Troubleshooting

### Form Configuration Issues

If you encounter issues with the step order configuration:

1. **Environment Variables Not Applied**:
   - Use the in-app "Test Configs" button to change configurations without restarting
   - Edit the hardcoded configuration in `src/features/estimator/config/hardcodedConfig.ts`

2. **Form Steps Display in Wrong Order**:
   - Check the debug panel to verify the current configuration
   - Look for console errors that might indicate configuration problems

### Database Connection Issues

If you're having problems with the database connection:

1. **Prisma Client Generation**:
   - Ensure you've run `npm run prisma:generate` after setting up the connection string

2. **Connection String**:
   - Verify that your `DATABASE_URL` in `.env.local` is correct
   - Use the database status debug panel to check the connection status

3. **Fallback Mode**:
   - The application will automatically fall back to direct Supabase API calls if Prisma is not configured
   - Check the browser console for warnings about fallback mode

### Deployment Issues on Vercel

If you encounter issues with Prisma on Vercel deployment:

1. **Prisma Not Generated Error**:
   - This project is configured to generate Prisma during build using the `postinstall` and `vercel-build` scripts
   - Make sure your `vercel.json` file is properly set with the `buildCommand` set to `npm run vercel-build`
   - Ensure you've set the `DATABASE_URL` environment variable in your Vercel project settings

2. **Database Connection Issues**:
   - For Supabase, make sure to include both `DATABASE_URL` and `DIRECT_URL` in your Vercel environment variables
   - Verify that your database allows connections from Vercel's IP range

---

Built on top of [nextjs-15-starter-shadcn](https://github.com/siddharthamaity/nextjs-15-starter-shadcn).
