import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Card, Button } from '../../components/ui';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';

export function DiagnosticPage() {
  const [checks, setChecks] = useState({
    envVars: { status: 'pending', message: '' },
    connection: { status: 'pending', message: '' },
    tables: { status: 'pending', message: '' },
    storage: { status: 'pending', message: '' },
    auth: { status: 'pending', message: '' },
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    // Check 1: Environment Variables
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (url && key) {
      setChecks(prev => ({
        ...prev,
        envVars: { 
          status: 'success', 
          message: `URL: ${url.substring(0, 30)}... | Key: ${key.substring(0, 20)}...` 
        }
      }));
    } else {
      setChecks(prev => ({
        ...prev,
        envVars: { 
          status: 'error', 
          message: `Missing: ${!url ? 'VITE_SUPABASE_URL ' : ''}${!key ? 'VITE_SUPABASE_ANON_KEY' : ''}` 
        }
      }));
      return;
    }

    // Check 2: Connection
    try {
      const { error } = await supabase.from('store_settings').select('id').limit(1);
      if (error) {
        setChecks(prev => ({
          ...prev,
          connection: { status: 'error', message: error.message }
        }));
      } else {
        setChecks(prev => ({
          ...prev,
          connection: { status: 'success', message: 'Connected to Supabase' }
        }));
      }
    } catch (err: any) {
      setChecks(prev => ({
        ...prev,
        connection: { status: 'error', message: err.message }
      }));
    }

    // Check 3: Tables
    try {
      const { data, error } = await supabase.from('products').select('id').limit(1);
      if (error) {
        setChecks(prev => ({
          ...prev,
          tables: { status: 'error', message: `Products table: ${error.message}` }
        }));
      } else {
        setChecks(prev => ({
          ...prev,
          tables: { status: 'success', message: 'All tables exist and accessible' }
        }));
      }
    } catch (err: any) {
      setChecks(prev => ({
        ...prev,
        tables: { status: 'error', message: err.message }
      }));
    }

    // Check 4: Storage
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        setChecks(prev => ({
          ...prev,
          storage: { status: 'error', message: error.message }
        }));
      } else {
        const hasBucket = data?.some(b => b.name === 'product-images');
        if (hasBucket) {
          setChecks(prev => ({
            ...prev,
            storage: { status: 'success', message: 'Storage bucket "product-images" exists' }
          }));
        } else {
          setChecks(prev => ({
            ...prev,
            storage: { status: 'error', message: 'Storage bucket "product-images" not found. Run SQL schema.' }
          }));
        }
      }
    } catch (err: any) {
      setChecks(prev => ({
        ...prev,
        storage: { status: 'error', message: err.message }
      }));
    }

    // Check 5: Auth
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        setChecks(prev => ({
          ...prev,
          auth: { status: 'error', message: error.message }
        }));
      } else if (user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile?.role === 'admin') {
          setChecks(prev => ({
            ...prev,
            auth: { status: 'success', message: `Logged in as admin: ${user.email}` }
          }));
        } else {
          setChecks(prev => ({
            ...prev,
            auth: { status: 'error', message: `Logged in but not admin. Run: update public.profiles set role='admin' where email='${user.email}'` }
          }));
        }
      } else {
        setChecks(prev => ({
          ...prev,
          auth: { status: 'warning', message: 'Not logged in (this is OK for diagnostic page)' }
        }));
      }
    } catch (err: any) {
      setChecks(prev => ({
        ...prev,
        auth: { status: 'error', message: err.message }
      }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <Loader2 className="w-5 h-5 text-color-2 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-color-6 bg-color-7';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-color-1 mb-2">System Diagnostic</h1>
      <p className="text-color-2 mb-8">This page checks if your Supabase integration is working correctly.</p>

      <div className="space-y-4">
        {/* Environment Variables */}
        <Card className={`p-6 border-2 ${getStatusColor(checks.envVars.status)}`}>
          <div className="flex items-start gap-4">
            {getStatusIcon(checks.envVars.status)}
            <div className="flex-1">
              <h3 className="font-semibold text-color-1 mb-1">1. Environment Variables</h3>
              <p className="text-sm text-color-2">{checks.envVars.message}</p>
              {checks.envVars.status === 'error' && (
                <div className="mt-3 p-3 bg-white rounded-sm border border-red-200">
                  <p className="text-xs text-red-800 font-medium mb-2">Fix: Add these to Vercel Environment Variables:</p>
                  <code className="text-xs block bg-gray-100 p-2 rounded">
                    VITE_SUPABASE_URL = https://ktfxnbtmuwsqdszciwvg.supabase.co<br/>
                    VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  </code>
                  <p className="text-xs text-red-700 mt-2">⚠️ Variable names MUST start with VITE_ (not NEXT_PUBLIC_)</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Connection */}
        <Card className={`p-6 border-2 ${getStatusColor(checks.connection.status)}`}>
          <div className="flex items-start gap-4">
            {getStatusIcon(checks.connection.status)}
            <div className="flex-1">
              <h3 className="font-semibold text-color-1 mb-1">2. Supabase Connection</h3>
              <p className="text-sm text-color-2">{checks.connection.message}</p>
            </div>
          </div>
        </Card>

        {/* Tables */}
        <Card className={`p-6 border-2 ${getStatusColor(checks.tables.status)}`}>
          <div className="flex items-start gap-4">
            {getStatusIcon(checks.tables.status)}
            <div className="flex-1">
              <h3 className="font-semibold text-color-1 mb-1">3. Database Tables</h3>
              <p className="text-sm text-color-2">{checks.tables.message}</p>
              {checks.tables.status === 'error' && (
                <div className="mt-3 p-3 bg-white rounded-sm border border-red-200">
                  <p className="text-xs text-red-800 font-medium mb-2">Fix: Run supabase-schema-clean.sql in Supabase SQL Editor</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Storage */}
        <Card className={`p-6 border-2 ${getStatusColor(checks.storage.status)}`}>
          <div className="flex items-start gap-4">
            {getStatusIcon(checks.storage.status)}
            <div className="flex-1">
              <h3 className="font-semibold text-color-1 mb-1">4. Storage Bucket</h3>
              <p className="text-sm text-color-2">{checks.storage.message}</p>
              {checks.storage.status === 'error' && (
                <div className="mt-3 p-3 bg-white rounded-sm border border-red-200">
                  <p className="text-xs text-red-800 font-medium mb-2">Fix: Run supabase-schema-clean.sql (includes storage bucket creation)</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Auth */}
        <Card className={`p-6 border-2 ${getStatusColor(checks.auth.status)}`}>
          <div className="flex items-start gap-4">
            {getStatusIcon(checks.auth.status)}
            <div className="flex-1">
              <h3 className="font-semibold text-color-1 mb-1">5. Authentication</h3>
              <p className="text-sm text-color-2">{checks.auth.message}</p>
              {checks.auth.status === 'error' && checks.auth.message.includes('not admin') && (
                <div className="mt-3 p-3 bg-white rounded-sm border border-red-200">
                  <p className="text-xs text-red-800 font-medium mb-2">Fix: Run this SQL in Supabase:</p>
                  <code className="text-xs block bg-gray-100 p-2 rounded">
                    update public.profiles set role = 'admin' where email = 'YOUR_EMAIL';
                  </code>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 flex gap-4">
        <Button onClick={runDiagnostics}>Run diagnostics again</Button>
        <a href="/admin" className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-color-8 text-color-2 border-2 border-color-6 rounded-md hover:border-color-4 hover:text-color-1 transition-all duration-150">
          Go to admin dashboard
        </a>
      </div>

      <div className="mt-8 p-6 bg-color-7 rounded-sm border border-color-6">
        <h3 className="font-semibold text-color-1 mb-3">📋 Quick Checklist</h3>
        <ul className="space-y-2 text-sm text-color-2">
          <li>✅ Run <code className="bg-color-8 px-2 py-1 rounded">supabase-schema-clean.sql</code> in Supabase SQL Editor</li>
          <li>✅ Create admin user in Authentication → Users</li>
          <li>✅ Set <code className="bg-color-8 px-2 py-1 rounded">VITE_SUPABASE_URL</code> in Vercel (not NEXT_PUBLIC_)</li>
          <li>✅ Set <code className="bg-color-8 px-2 py-1 rounded">VITE_SUPABASE_ANON_KEY</code> in Vercel (not NEXT_PUBLIC_)</li>
          <li>✅ Redeploy after adding environment variables</li>
          <li>✅ Make sure <code className="bg-color-8 px-2 py-1 rounded">vercel.json</code> is in your repo (fixes 404 errors)</li>
        </ul>
      </div>
    </div>
  );
}
