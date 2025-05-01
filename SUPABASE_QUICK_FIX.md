# Supabase Quick Fix Guide

If you're experiencing issues with Row Level Security (RLS) when submitting forms, follow these steps:

## Option 1: Run the Complete Fix Script (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to the "SQL Editor" section
4. Create a new query
5. Copy and paste the entire content of `supabase-fix-rls-complete.sql` into the editor
6. Run the script by clicking the "Run" button
7. Refresh your app and try submitting the form again

## Option 2: Manual Table Setup with RLS Policies

If the quick fix doesn't work, follow these detailed steps:

1. Go to your Supabase Dashboard
2. Navigate to "Table Editor"
3. Check if the `fence_estimator` table exists
   - If not, create it with these columns:
     - `id` (uuid, primary key)
     - `full_name` (text, not null)
     - `email` (text, not null)
     - `shower_issues` (text array)
     - `existing_water_heater` (text)
     - `plumbing_condition` (text)
     - `has_existing_bathtub` (boolean)
     - `project_type` (text)
     - `zip_code` (text)
     - `created_at` (timestamp with time zone)
     - `updated_at` (timestamp with time zone)

4. Configure RLS Policies:
   - Go to "Authentication" > "Policies"
   - Find the `fence_estimator` table
   - Click "New Policy"
   - For anonymous users (anon):
     - Create a policy named "anon_insert"
     - Choose "INSERT" as the operation
     - For the USING expression, enter: `true`
     - For the WITH CHECK expression, enter: `true`
   - For authenticated users:
     - Create a policy named "admin_all"
     - Choose "ALL" as the operation
     - For the USING expression, enter: `true`
     - For the WITH CHECK expression, enter: `true`

5. Grant Permissions:
   - Navigate to "SQL Editor"
   - Run the following commands:
     ```sql
     GRANT INSERT ON fence_estimator TO anon;
     ```

## Option 3: Temporarily Disable RLS (For Testing Only)

⚠️ **Warning**: This option is only recommended for local development and testing. Do not use in production.

1. Go to your Supabase Dashboard
2. Navigate to "Table Editor"
3. Find the `fence_estimator` table
4. Click the three dots menu (...) on the right
5. Go to "Edit Table"
6. In the "Row Level Security" section, toggle it to "Disabled"
7. Save your changes

Remember to re-enable RLS before deploying to production.

## Common Errors and Solutions

### Error: "relation estimator_submissions_id_seq does not exist"

This error occurs because the table is using UUID as the primary key, not a sequence. The fixed script addresses this issue by:
- Ensuring the UUID extension is enabled
- Not attempting to grant permissions on a non-existent sequence

### Error: "permission denied for table fence_estimator"

This typically means the RLS policies aren't correctly applied. Follow these steps:

1. Make sure you run the ENTIRE script in `supabase-fix-rls-complete.sql`
2. Verify the policies were created by checking the "Policies" tab in the Supabase Dashboard
3. Try restarting your application after applying the changes

### Error: "new row violates row-level security policy"

This means the RLS policy exists but isn't correctly configured to allow the operation:

1. In the Supabase Dashboard, go to Authentication → Policies
2. Find any policies for the `fence_estimator` table
3. Make sure they have `WITH CHECK (true)` expression for the `INSERT` operation
4. Try running the complete fix script again

## Still Having Issues?

If you're still experiencing problems, try these troubleshooting steps:

1. Check the browser console for detailed error messages
2. Verify that your `.env.local` file has the correct Supabase URL and key
3. Check if your Supabase project is on the free tier and has reached usage limits
4. Try creating a new database table with a different name and updating the code accordingly
5. As a last resort, you can temporarily disable RLS for testing purposes
