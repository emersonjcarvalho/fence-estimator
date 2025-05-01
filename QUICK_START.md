# Quick Start Guide: Home Service Estimator

This guide provides the essential steps to set up the Home Service Estimator application with the Prisma ORM integration.

## 1. Clone and Install

```bash
git clone [your-repository-url]
cd [repository-folder]
npm install
```

## 2. Configure Database

Create a `.env` file in the root directory with your database connection string:

```
# Form step order configuration
NEXT_PUBLIC_FORM_STEP_ORDER=existingBathtub,projectType,showerIssues,waterHeater,plumbingCondition,userInfo

# Database Connection (replace with your actual Supabase connection string)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres"
```

For Supabase, the connection string typically follows this format:
```
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@[HOST]:[PORT]/postgres"
```

## 3. Set Up the Database

We've provided a simple one-step setup command:

```bash
# Automatic database setup (generate client and push schema)
npm run setup
```

This command will:
1. Read your DATABASE_URL from the `.env` file
2. Generate the Prisma client
3. Push your schema to the database

## 4. Start the Application

```bash
# Development mode
npm run dev

# OR production build
npm run build
npm run start
```

## 5. Access the Application

- Main Form: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin

## Troubleshooting

If you encounter issues during setup:

1. Make sure your DATABASE_URL is correctly formatted in the .env file
2. Try running Prisma commands directly:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
3. Check that your database connection is working
4. In development mode, use the "Show Debug" button to view database status

## Additional Configuration

For more detailed setup and configuration options, refer to:
- [PRISMA_SETUP.md](PRISMA_SETUP.md) - Detailed Prisma ORM setup
- [FORM_CONFIGURATION.md](FORM_CONFIGURATION.md) - Form step configuration
- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Supabase database setup
