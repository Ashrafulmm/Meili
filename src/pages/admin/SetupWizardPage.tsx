import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Card, Button, Input } from '../../components/ui';
import { CheckCircle, XCircle, AlertCircle, Loader2, Copy, ExternalLink } from 'lucide-react';

interface CheckResult {
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  fix?: string;
  sql?: string;
}

export function SetupWizardPage() {
  const [checks, setChecks] = useState<Record<string, CheckResult>>({
    env: { status: 'pending', message: 'Checking...' },
    connection: { status: 'pending', message: 'Checking...' },
    tables: { status: 'pending', message: 'Checking...' },
    sections: { status: 'pending', message: 'Checking...' },
    storage: { status: 'pending', message: 'Checking...' },
    auth: { status: 'pending', message: 'Checking...' },
  });
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const runAllChecks = async () => {
    setRunning(true);
    const newChecks: Record<string, CheckResult> = {};

    // ===== CHECK 1: Environment Variables =====
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (url && key && key.length > 50) {
      newChecks.env = {
        status: 'success',
        message: `✅ Connected with URL: ${url}`,
      };
    } else {
      newChecks.env = {
        status: 'error',
        message: `❌ Environment variables missing or invalid. URL: ${url ? 'set' : 'MISSING'}, Key: ${key ? `set (length ${key.length})` : 'MISSING'}`,
        fix: 'Add these to Vercel → Settings → Environment Variables (check ALL environments: Production, Preview, Development), then REDEPLOY:',
        sql: `VITE_SUPABASE_URL=https://ktfxnbtmuwsqdszciwvg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZnhuYnRtdXdzcWRzemNpd3ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNDQ3ODEsImV4cCI6MjEwNzcyMDc4MX0.UREkrwlR8-PAl6FunVqIlBXDatgtsMq1KBx_IKSqS68`,
      };
    }

    // ===== CHECK 2: Connection =====
    try {
      const { error } = await supabase.from('store_settings').select('id').limit(1);
      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          newChecks.connection = {
            status: 'error',
            message: `❌ Database tables don't exist yet. Error: ${error.message}`,
            fix: 'Run the SQL schema in Supabase SQL Editor:',
            sql: 'Go to: https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/sql/new\nThen paste and run the SQL from reset-database.sql file.',
          };
        } else {
          newChecks.connection = {
            status: 'error',
            message: `❌ Connection error: ${error.message}`,
            fix: 'Check your Supabase URL and key are correct.',
          };
        }
      } else {
        newChecks.connection = {
          status: 'success',
          message: '✅ Connected to Supabase database successfully!',
        };
      }
    } catch (err: any) {
      newChecks.connection = {
        status: 'error',
        message: `❌ Exception: ${err.message}`,
      };
    }

    // ===== CHECK 3: Tables =====
    const requiredTables = ['products', 'profiles', 'categories', 'sections', 'orders', 'banners', 'store_settings', 'product_images', 'product_sections', 'order_items'];
    const missingTables: string[] = [];

    for (const table of requiredTables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error && error.message.includes('does not exist')) {
          missingTables.push(table);
        }
      } catch (err) {
        missingTables.push(table);
      }
    }

    if (missingTables.length === 0) {
      newChecks.tables = {
        status: 'success',
        message: `✅ All ${requiredTables.length} required tables exist!`,
      };
    } else {
      newChecks.tables = {
        status: 'error',
        message: `❌ Missing tables: ${missingTables.join(', ')}`,
        fix: 'Run the SQL schema to create all tables:',
        sql: 'Go to: https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/sql/new\nThen paste and run the SQL from reset-database.sql file.',
      };
    }

    // ===== CHECK 4: Sections =====
    try {
      const { data, error } = await supabase.from('sections').select('name');
      if (error) {
        newChecks.sections = {
          status: 'error',
          message: `❌ Can't read sections: ${error.message}`,
        };
      } else {
        const requiredSections = ['best-deals', 'k-beauty', 'your-pick', 'for-you'];
        const existingSections = data?.map((s: any) => s.name) || [];
        const missing = requiredSections.filter(s => !existingSections.includes(s));

        if (missing.length === 0) {
          newChecks.sections = {
            status: 'success',
            message: `✅ All 4 homepage sections exist!`,
          };
        } else {
          newChecks.sections = {
            status: 'error',
            message: `❌ Missing sections: ${missing.join(', ')}`,
            fix: 'Run this SQL to add missing sections:',
            sql: `insert into public.sections (name, label, description) values
  ('best-deals', 'Best deals', 'Products with discounts'),
  ('k-beauty', 'K-Beauty', 'Korean beauty products'),
  ('your-pick', 'Your pick', 'Handpicked by our team'),
  ('for-you', 'For you', 'Recommended products')
on conflict (name) do nothing;`,
          };
        }
      }
    } catch (err: any) {
      newChecks.sections = {
        status: 'error',
        message: `❌ Exception: ${err.message}`,
      };
    }

    // ===== CHECK 5: Vercel Blob API =====
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'initiate-upload' }),
      });
      
      // We expect a 400 error because we're not sending a real upload
      // But if we get any response, the API route exists
      if (response.status === 404) {
        newChecks.storage = {
          status: 'error',
          message: '❌ Vercel Blob API route not found at /api/upload',
          fix: 'Make sure api/upload.ts file exists in your project and has been deployed to Vercel.',
        };
      } else {
        newChecks.storage = {
          status: 'success',
          message: '✅ Vercel Blob API route is working!',
        };
      }
    } catch (err: any) {
      newChecks.storage = {
        status: 'error',
        message: `❌ Exception: ${err.message}`,
        fix: 'Make sure the api/upload.ts file is deployed to Vercel.',
      };
    }

    // ===== CHECK 6: Auth / Admin Role =====
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        newChecks.auth = {
          status: 'warning',
          message: '⚠️ Not logged in. Login at /admin/login to check admin role.',
          fix: 'After logging in, come back here to re-run checks.',
        };
      } else {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        const profile = profileData;

        if (error) {
          newChecks.auth = {
            status: 'error',
            message: `❌ Can't read profile: ${error.message}`,
            fix: 'Your profile may not exist. Run this SQL:',
            sql: `insert into public.profiles (id, email, role)
values ('${user.id}', '${user.email}', 'admin')
on conflict (id) do update set role = 'admin';`,
          };
        } else if (profile?.role === 'admin') {
          newChecks.auth = {
            status: 'success',
            message: `✅ Logged in as admin: ${user.email}`,
          };
        } else {
          newChecks.auth = {
            status: 'error',
            message: `❌ Logged in as "${profile?.role}" but need "admin" role. Email: ${user.email}`,
            fix: 'Run this SQL to make yourself admin:',
            sql: `update public.profiles set role = 'admin' where email = '${user.email}';`,
          };
        }
      }
    } catch (err: any) {
      newChecks.auth = {
        status: 'error',
        message: `❌ Exception: ${err.message}`,
      };
    }

    setChecks(newChecks);
    setRunning(false);
  };

  useEffect(() => {
    runAllChecks();
  }, []);

  const allPassed = Object.values(checks).every(c => c.status === 'success');
  const errorCount = Object.values(checks).filter(c => c.status === 'error').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />;
      default: return <Loader2 className="w-5 h-5 text-color-2 animate-spin shrink-0" />;
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-300 bg-green-50';
      case 'error': return 'border-red-300 bg-red-50';
      case 'warning': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-color-6 bg-color-7';
    }
  };

  const checkLabels: Record<string, string> = {
    env: '1. Environment Variables',
    connection: '2. Database Connection',
    tables: '3. Database Tables',
    sections: '4. Homepage Sections',
    storage: '5. Vercel Blob (Image Upload)',
    auth: '6. Admin Authentication',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-color-1 mb-2">Setup Wizard</h1>
        <p className="text-color-2">
          This page checks everything needed for your store to work. Fix any errors below in order.
        </p>
      </div>

      {/* Status Summary */}
      <Card className={`p-6 mb-6 border-2 ${allPassed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-color-1">
              {allPassed ? '✅ All checks passed!' : `❌ ${errorCount} issue${errorCount !== 1 ? 's' : ''} found`}
            </h2>
            <p className="text-sm text-color-2 mt-1">
              {allPassed
                ? 'Your store is fully connected to Supabase. You can now add products!'
                : 'Follow the instructions below to fix each issue in order.'}
            </p>
          </div>
          <Button onClick={runAllChecks} loading={running} variant="outline">
            Re-run checks
          </Button>
        </div>
      </Card>

      {/* Checks */}
      <div className="space-y-4">
        {Object.entries(checks).map(([key, check]) => (
          <Card key={key} className={`p-6 border-2 ${getBorderColor(check.status)}`}>
            <div className="flex items-start gap-3">
              {getStatusIcon(check.status)}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-color-1 mb-1">{checkLabels[key]}</h3>
                <p className="text-sm text-color-2 mb-2 break-words">{check.message}</p>

                {check.fix && (
                  <div className="mt-3 p-3 bg-white rounded-sm border border-color-6">
                    <p className="text-xs font-medium text-color-1 mb-2">💡 How to fix:</p>
                    <p className="text-xs text-color-2 mb-2">{check.fix}</p>
                    {check.sql && (
                      <div className="relative">
                        <pre className="bg-gray-900 text-green-400 p-3 rounded-sm text-xs overflow-x-auto whitespace-pre-wrap break-all">
                          {check.sql}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(check.sql!, key)}
                          className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded-sm text-white text-xs flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedIndex === key ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {key === 'env' && check.status === 'error' && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-sm">
                    <p className="text-xs font-medium text-yellow-800 mb-2">⚠️ Important notes:</p>
                    <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Variable names MUST start with <code className="bg-yellow-100 px-1 rounded">VITE_</code> (not <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_</code>)</li>
                      <li>After adding env vars, you MUST click "Redeploy" in Vercel</li>
                      <li>Check all 3 environments: Production, Preview, Development</li>
                    </ul>
                  </div>
                )}

                {key === 'connection' && check.status === 'error' && (
                  <div className="mt-3">
                    <a
                      href="https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/sql/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-color-4 text-color-8 rounded-sm text-sm font-medium hover:bg-color-5 transition-colors duration-150"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Supabase SQL Editor
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Next Steps */}
      {allPassed && (
        <Card className="p-6 mt-6 border-2 border-green-300 bg-green-50">
          <h2 className="text-lg font-bold text-color-1 mb-3">🎉 You're all set!</h2>
          <p className="text-sm text-color-2 mb-4">Everything is working. You can now:</p>
          <div className="flex flex-wrap gap-3">
            <a href="/admin/products" className="inline-flex items-center gap-2 px-4 py-2 bg-color-4 text-color-8 rounded-sm text-sm font-medium hover:bg-color-5 transition-colors duration-150">
              Add products
            </a>
            <a href="/admin/orders" className="inline-flex items-center gap-2 px-4 py-2 bg-color-8 text-color-2 border border-color-6 rounded-sm text-sm font-medium hover:border-color-4 transition-colors duration-150">
              View orders
            </a>
            <a href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-color-8 text-color-2 border border-color-6 rounded-sm text-sm font-medium hover:border-color-4 transition-colors duration-150">
              View storefront
            </a>
          </div>
        </Card>
      )}

      {/* Help */}
      <Card className="p-6 mt-6 bg-color-7 border border-color-6">
        <h3 className="font-semibold text-color-1 mb-2">📚 Need more help?</h3>
        <ul className="text-sm text-color-2 space-y-1">
          <li>• Read <code className="bg-color-8 px-1 rounded">COMPLETE_RESET_GUIDE.md</code> for detailed instructions</li>
          <li>• Check Supabase logs: <a href="https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/logs" target="_blank" rel="noopener noreferrer" className="text-color-4 hover:underline">Dashboard → Logs</a></li>
          <li>• Check Vercel logs: Dashboard → Deployments → Latest → Functions</li>
          <li>• Open browser console (F12) to see detailed errors</li>
        </ul>
      </Card>
    </div>
  );
}
