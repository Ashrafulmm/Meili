import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, Button, Input } from '../../components/ui';

export function TestConnectionPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${type.toUpperCase()}: ${message}`]);
  };

  const testConnection = async () => {
    setLogs([]);
    addLog('Starting connection test...', 'info');

    // Test 1: Check environment variables
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    addLog(`VITE_SUPABASE_URL: ${url ? 'SET' : 'NOT SET'}`, url ? 'success' : 'error');
    addLog(`VITE_SUPABASE_ANON_KEY: ${key ? 'SET (length: ' + key.length + ')' : 'NOT SET'}`, key ? 'success' : 'error');

    if (!url || !key) {
      addLog('❌ Environment variables not set! Check Vercel settings.', 'error');
      return;
    }

    // Test 2: Try to connect
    try {
      addLog('Testing Supabase connection...', 'info');
      const { data, error } = await supabase.from('store_settings').select('id').limit(1);
      
      if (error) {
        addLog(`❌ Connection failed: ${error.message}`, 'error');
        addLog(`Error details: ${JSON.stringify(error)}`, 'error');
      } else {
        addLog('✅ Connected to Supabase successfully!', 'success');
        addLog(`Store settings found: ${data?.length || 0} rows`, 'success');
      }
    } catch (err: any) {
      addLog(`❌ Exception: ${err.message}`, 'error');
    }

    // Test 3: Check if products table exists
    try {
      addLog('Checking products table...', 'info');
      const { data, error } = await supabase.from('products').select('id').limit(1);
      
      if (error) {
        addLog(`❌ Products table error: ${error.message}`, 'error');
        if (error.message.includes('does not exist')) {
          addLog('💡 Solution: Run supabase-schema-clean.sql in Supabase SQL Editor', 'info');
        }
      } else {
        addLog(`✅ Products table exists! Found ${data?.length || 0} products`, 'success');
      }
    } catch (err: any) {
      addLog(`❌ Products table exception: ${err.message}`, 'error');
    }

    // Test 4: Try to insert a test product
    try {
      addLog('Testing product insertion...', 'info');
      const testProduct = {
        title: 'Test Product ' + Date.now(),
        slug: 'test-product-' + Date.now(),
        price: 999,
        category: 'Test',
        stock: 10,
        description: 'This is a test product',
        short_description: 'Test',
        is_featured: false,
        sections: []
      };

      const { data, error } = await supabase.from('products').insert(testProduct).select();
      
      if (error) {
        addLog(`❌ Insert failed: ${error.message}`, 'error');
        if (error.message.includes('row-level security')) {
          addLog('💡 Solution: Make sure your user has admin role in profiles table', 'info');
          addLog('💡 Run: update public.profiles set role = \'admin\' where email = \'YOUR_EMAIL\';', 'info');
        }
      } else {
        addLog(`✅ Product inserted successfully! ID: ${data?.[0]?.id}`, 'success');
        
        // Clean up - delete the test product
        if (data?.[0]?.id) {
          await supabase.from('products').delete().eq('id', data[0].id);
          addLog('🧹 Test product cleaned up', 'info');
        }
      }
    } catch (err: any) {
      addLog(`❌ Insert exception: ${err.message}`, 'error');
    }

    // Test 5: Check storage
    try {
      addLog('Checking storage bucket...', 'info');
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        addLog(`❌ Storage error: ${error.message}`, 'error');
      } else {
        const hasBucket = data?.some(b => b.name === 'product-images');
        if (hasBucket) {
          addLog('✅ Storage bucket "product-images" exists', 'success');
        } else {
          addLog('❌ Storage bucket "product-images" not found', 'error');
          addLog('💡 Solution: Run supabase-schema-clean.sql', 'info');
        }
      }
    } catch (err: any) {
      addLog(`❌ Storage exception: ${err.message}`, 'error');
    }

    addLog('---', 'info');
    addLog('Test complete!', 'success');
  };

  const testLogin = async () => {
    if (!testEmail || !testPassword) {
      addLog('❌ Please enter email and password', 'error');
      return;
    }

    addLog(`Testing login for ${testEmail}...`, 'info');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (error) {
      addLog(`❌ Login failed: ${error.message}`, 'error');
    } else {
      addLog(`✅ Login successful! User ID: ${data.user?.id}`, 'success');
      
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();
      
      if (profile?.role === 'admin') {
        addLog('✅ User has admin role', 'success');
      } else {
        addLog(`❌ User role is: ${profile?.role || 'not found'}`, 'error');
        addLog('💡 Run: update public.profiles set role = \'admin\' where email = \'' + testEmail + '\';', 'info');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-color-1 mb-2">Database Connection Test</h1>
      <p className="text-color-2 mb-8">This page tests your Supabase connection and shows detailed logs.</p>

      <div className="space-y-6">
        {/* Test Connection Button */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-color-1 mb-4">Test Database Connection</h2>
          <Button onClick={testConnection} className="w-full">
            Run Connection Test
          </Button>
        </Card>

        {/* Test Login */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-color-1 mb-4">Test Admin Login</h2>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={testEmail}
              onChange={e => setTestEmail(e.target.value)}
              placeholder="your-email@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={testPassword}
              onChange={e => setTestPassword(e.target.value)}
              placeholder="Your password"
            />
            <Button onClick={testLogin} className="w-full">
              Test Login
            </Button>
          </div>
        </Card>

        {/* Logs */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-color-1 mb-4">Test Logs</h2>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-sm font-mono text-xs max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">Click "Run Connection Test" to start...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`mb-1 ${
                  log.includes('SUCCESS') ? 'text-green-400' :
                  log.includes('ERROR') ? 'text-red-400' :
                  log.includes('INFO') ? 'text-blue-400' :
                  'text-gray-400'
                }`}>
                  {log}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Fix Guide */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h2 className="text-lg font-bold text-color-1 mb-4">🔧 Quick Fix Guide</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-color-1">If environment variables not set:</p>
              <ol className="list-decimal list-inside text-color-2 mt-1 space-y-1">
                <li>Go to Vercel → Settings → Environment Variables</li>
                <li>Add <code className="bg-white px-2 py-1 rounded">VITE_SUPABASE_URL</code> = <code className="bg-white px-2 py-1 rounded text-xs">https://ktfxnbtmuwsqdszciwvg.supabase.co</code></li>
                <li>Add <code className="bg-white px-2 py-1 rounded">VITE_SUPABASE_ANON_KEY</code> = (your full JWT key)</li>
                <li>Redeploy your site</li>
              </ol>
            </div>
            <div>
              <p className="font-semibold text-color-1">If tables don't exist:</p>
              <ol className="list-decimal list-inside text-color-2 mt-1 space-y-1">
                <li>Go to Supabase Dashboard → SQL Editor</li>
                <li>Run <code className="bg-white px-2 py-1 rounded">supabase-schema-clean.sql</code></li>
              </ol>
            </div>
            <div>
              <p className="font-semibold text-color-1">If RLS policy blocks:</p>
              <ol className="list-decimal list-inside text-color-2 mt-1 space-y-1">
                <li>Go to Supabase Dashboard → SQL Editor</li>
                <li>Run: <code className="bg-white px-2 py-1 rounded text-xs">update public.profiles set role = 'admin' where email = 'YOUR_EMAIL';</code></li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
