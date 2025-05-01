# Supabase Setup for Home Service Estimator

This guide explains how to set up Supabase to work with the Home Service Estimator application.

## 1. Create a Supabase Project

1. Sign up or log in to [Supabase](https://supabase.com/)
2. Create a new project by clicking "New Project"
3. Enter a name for your project and set a strong database password
4. Select the region closest to your users
5. Click "Create new project"

## 2. Configure Database Schema

1. Navigate to the SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of the `supabase-schema.sql` file
4. Run the query to create the necessary tables and policies

## 3. Get API Keys

1. In your Supabase project dashboard, go to Project Settings > API
2. Copy the "URL" value - this is your `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the "anon" key - this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Configure Your Application

1. In your project, open the `.env.local` file
2. Update the following values with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Restart your development server

## 5. Test Form Submissions

1. Fill out the entire form and submit
2. Check your Supabase dashboard > Table Editor > fence_estimator
3. You should see your submission data stored in the table

## 6. Permissions and Security

By default, the schema sets up Row Level Security (RLS) so that:

- Only authenticated users (admins) can view all submissions
- Anonymous users can insert new submissions
- You may need to modify these policies based on your specific security requirements

### Fixing Row-Level Security (RLS) Issues

If you encounter an error like "new row violates row-level security policy for table fence_estimator", you need to grant insert permission to anonymous users:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL query:

```sql
-- Create policy to allow anonymous users to insert data
CREATE POLICY anon_insert ON fence_estimator
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

4. Alternatively, run the `supabase-fix-rls.sql` script included in this project

For testing purposes only, you can temporarily disable RLS completely (not recommended for production):

```sql
ALTER TABLE fence_estimator DISABLE ROW LEVEL SECURITY;
```

## 7. Queries and Analysis

The schema includes a view called `estimator_submissions_summary` that provides basic analytics on form submissions. You can query this view from the SQL Editor to get insights about your submissions.

Example query:
```sql
SELECT * FROM estimator_submissions_summary
WHERE submission_date >= CURRENT_DATE - INTERVAL '30 days';
```

## Troubleshooting

If you encounter any issues:

1. Check the browser console for errors
2. Verify your environment variables match the Supabase credentials
3. Ensure the database schema was properly applied
4. Check that your Supabase project is active and not paused
