# Prisma ORM Setup for Home Service Estimator

This guide explains how to set up and use Prisma ORM with Supabase in the Home Service Estimator application.

## Overview

The application now uses Prisma ORM as a database access layer, which provides:

- Type-safe database queries
- Schema management and migrations
- Simplified database operations
- Improved developer experience
- Automatic query optimization

## Setting Up Prisma with Supabase

### Component-Based Configuration (Recommended)

The easiest way to configure the database connection is using the component-based approach:

1. Open your `.env.local` file and add the following lines:

```
# Database Configuration
DB_HOST=db.your-project-ref.supabase.co  # Replace with your Supabase project reference
DB_USERNAME=postgres                      # Usually "postgres" for Supabase
DB_PASSWORD=your-database-password        # Your Supabase database password
DB_NAME=postgres                          # Usually "postgres" for Supabase
DB_PORT=5432                              # Standard PostgreSQL port
```

This approach makes it easier to configure and troubleshoot database connection issues.

### Full URL Configuration (Alternative)

Alternatively, you can use the traditional full DATABASE_URL:

```
DATABASE_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"
```

### Interactive Setup Helper

For an easier setup experience, you can use the included interactive helper script:

```bash
npx ts-node prisma/setup-db.ts
```

This script will guide you through setting up your database configuration step by step.

## Generating the Prisma Client

After configuring the database connection, generate the Prisma client:

```bash
npm run prisma:generate
```

## Pushing the Schema to Your Database

If you're using an existing database (which is likely with Supabase), you can:

1. Pull the existing schema first:
   ```bash
   npm run prisma:pull
   ```

2. Then modify the `schema.prisma` file as needed

3. Then push your schema changes:
   ```bash
   npm run prisma:push
   ```

## Using Prisma in the Application

### Repository Pattern

We've implemented a repository pattern to abstract database operations:

- `EstimatorRepository` handles all operations related to form submissions
- The repository automatically falls back to direct Supabase API calls if Prisma is not configured

### Fallback Mechanism

For better resilience, the system includes a fallback mechanism:

- If Prisma is not properly configured, it will automatically fall back to the legacy Supabase direct API
- If a Prisma database connection error occurs, it will also use the fallback
- The system logs warnings when using fallbacks

## Prisma CLI Commands

The following NPM scripts are available for working with Prisma:

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema changes to the database
- `npm run prisma:pull` - Pull the database schema into Prisma
- `npm run prisma:studio` - Open Prisma Studio, a visual database explorer
- `npm run prisma:migrate` - Create and run migrations (for development)
- `npm run prisma:seed` - Seed the database with test data

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Check that both `DB_HOST` and `DB_PASSWORD` are set correctly
2. For Supabase, make sure the host format is `db.[YOUR-PROJECT-REF].supabase.co`
3. Verify that your Supabase database is active and not paused
4. Check that your IP address is allowed in Supabase network restrictions
5. Try using the Database Status debug panel in development mode to diagnose issues

### Schema Sync Issues

If you have issues with schema synchronization:

1. Try using `prisma:pull` to get the latest schema from the database
2. Check for conflicts between your Prisma schema and existing database tables
3. Consider using `prisma migrate dev` to create proper migrations instead of `prisma db push`

### Fallback Mode

If the application is using fallback mode (direct Supabase API):

1. Check the browser console for warnings about Prisma configuration
2. Verify that your database configuration is set correctly in `.env.local`
3. Make sure Prisma client has been generated (`npm run prisma:generate`)
4. Check the Database Status panel in development mode

## Best Practices

### Working with the Repository Pattern

- Always use the repository methods instead of direct Prisma client calls
- Add new repository methods as needed for specific operations
- Keep business logic out of the repository (use services for that)

### Schema Evolution

- Make small, incremental changes to the schema
- Document schema changes in your version control system
- Use migrations for production deployments

### Performance

- Use Prisma's built-in filtering, sorting, and pagination
- Consider adding database indexes for frequently queried fields
- Use Prisma's `select` to only fetch the data you need

## Admin Dashboard

The application includes a simple admin dashboard at `/admin` that allows you to:

1. View form submissions
2. Check database connection status
3. See database configuration information

To access the admin dashboard in development, go to:
```
http://localhost:3000/admin
```

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase + Prisma Guide](https://supabase.com/docs/guides/database/prisma)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
