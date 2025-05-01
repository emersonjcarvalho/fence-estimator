"use client";

import React, { useEffect, useState } from 'react';
import { Database } from '@/lib/db';

export function DatabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [info, setInfo] = useState<any>(null);
  const [isPrismaConfigured, setIsPrismaConfigured] = useState<boolean>(false);
  const [dbConfig, setDbConfig] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Check if Prisma is configured
        const isConfigured = Database.isDatabaseConfigured();
        setIsPrismaConfigured(isConfigured);
        
        // Get configuration info
        setDbConfig(Database.getDatabaseConfig());
        
        // Test connection
        const isConnected = await Database.testConnection();
        setStatus(isConnected ? 'connected' : 'error');
        
        // Get database info if connected
        if (isConnected) {
          const dbInfo = await Database.getDatabaseInfo();
          if (dbInfo.success && dbInfo.data) {
            setInfo(dbInfo.data);
          }
        }
      } catch (error) {
        console.error('Error checking database:', error);
        setStatus('error');
      }
    };
    
    // Only run in development
    if (process.env.NODE_ENV === 'development') {
      checkDatabase();
    }
  }, []);
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-20 right-4 z-50 w-72 rounded-lg bg-slate-900 p-4 text-xs text-white shadow-lg">
      <h3 className="mb-2 font-bold">Database Status</h3>
      
      <div className="mb-2">
        <span className="mr-2">Prisma:</span>
        {isPrismaConfigured ? (
          <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
            Configured
          </span>
        ) : (
          <span className="rounded-full bg-yellow-500 px-2 py-1 text-xs font-semibold text-white">
            Not Configured
          </span>
        )}
      </div>
      
      <div className="mb-2">
        <span className="mr-2">Connection:</span>
        {status === 'loading' && (
          <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
            Testing...
          </span>
        )}
        {status === 'connected' && (
          <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
            Connected
          </span>
        )}
        {status === 'error' && (
          <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            Error
          </span>
        )}
      </div>
      
      {/* Configuration summary */}
      <div className="mt-2 space-y-1 overflow-hidden rounded border border-slate-700 bg-slate-800 p-2 text-[10px]">
        <div><strong>Host:</strong> {dbConfig.host}</div>
        <div><strong>Database:</strong> {dbConfig.database}</div>
        <div><strong>Username:</strong> {dbConfig.username}</div>
        <div><strong>Password:</strong> {dbConfig.password}</div>
      </div>
      
      {info && (
        <div className="mt-2 overflow-hidden rounded border border-slate-700 bg-slate-800 p-2 text-[10px]">
          <div><strong>DB:</strong> {info[0]?.database}</div>
          <div><strong>Schema:</strong> {info[0]?.schema}</div>
          <div className="truncate"><strong>Version:</strong> {info[0]?.version}</div>
        </div>
      )}
      
      {status === 'error' && !isPrismaConfigured && (
        <div className="mt-2 rounded border border-yellow-500 bg-yellow-900 p-2 text-[10px]">
          <p>Missing required database configuration. Please check DB_HOST and DB_PASSWORD in .env.local.</p>
        </div>
      )}
      
      {status === 'error' && isPrismaConfigured && (
        <div className="mt-2 rounded border border-red-500 bg-red-900 p-2 text-[10px]">
          <p>Configuration looks correct but couldn't connect to the database. Check your network and credentials.</p>
        </div>
      )}
    </div>
  );
}
