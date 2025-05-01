"use client";

import React, { useEffect, useState } from 'react';
import { EstimatorRepository } from '@/features/estimator/repositories/estimatorRepository';
import { Database } from '@/lib/db';

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Check database connection
        const isConnected = await Database.testConnection();
        
        if (isConnected) {
          // Get database info
          const info = await Database.getDatabaseInfo();
          if (info.success && info.data) {
            setDbInfo(info.data);
          }
        }
        
        // Fetch submissions using the repository
        setLoading(true);
        const result = await EstimatorRepository.getAllSubmissions();
        
        if (result.success && result.data) {
          setSubmissions(result.data);
        } else {
          setError(result.message || 'Failed to fetch submissions');
          // Set usingFallback to false since it's not included in the response
          setUsingFallback(false);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Home Service Estimator Admin</h1>
      
      {/* Database Status */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Database Status</h2>
        
        {dbInfo ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-3">
              <div className="font-medium text-blue-800">Database</div>
              <div>{dbInfo[0]?.database}</div>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <div className="font-medium text-green-800">Schema</div>
              <div>{dbInfo[0]?.schema}</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <div className="font-medium text-purple-800">Version</div>
              <div className="text-sm">{dbInfo[0]?.version}</div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
            <p className="font-medium">
              {usingFallback 
                ? '⚠️ Using Supabase fallback (Prisma not configured)' 
                : '⚠️ Database information not available'}
            </p>
          </div>
        )}
      </div>
      
      {/* Submissions Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Form Submissions</h2>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <span className="ml-2">Loading submissions...</span>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            <p className="font-medium">Error: {error}</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
            <p>No submissions found. Try seeding the database using the provided seed script.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Property Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Service Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ZIP Code</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">{submission.id}</td>
                    <td className="whitespace-nowrap px-6 py-4">{submission.full_name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{submission.email}</td>
                    <td className="whitespace-nowrap px-6 py-4">{submission.phone}</td>
                    <td className="whitespace-nowrap px-6 py-4">{submission.property_type}</td>
                    <td className="whitespace-nowrap px-6 py-4">{submission.service_type}</td>
                    <td className="whitespace-nowrap px-6 py-4">{submission.zip_code}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {new Date(submission.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Admin Instructions</h2>
        
        <div className="space-y-4">
          <p>
            This admin panel allows you to view form submissions from the Home Service Estimator.
          </p>
          
          <div className="rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-medium text-blue-800">Prisma Database Setup</h3>
            <p className="mb-2">Make sure your database is properly configured:</p>
            <ol className="list-inside list-decimal space-y-1 pl-4">
              <li>Set <code>DATABASE_URL</code> in <code>.env</code></li>
              <li>Run <code>npm run setup</code> to configure the database</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
