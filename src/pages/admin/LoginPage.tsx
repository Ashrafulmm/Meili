import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';
import { signIn, getCurrentUser } from '../../lib/api';
import { isSupabaseConfigured } from '../../lib/supabase';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        navigate('/admin');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please set environment variables in Vercel.');
      setLoading(false);
      return;
    }

    const result = await signIn(email, password);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Failed to sign in. Please check your credentials.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-color-7 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <span className="text-3xl">✨</span>
          <h1 className="text-2xl font-bold text-color-1 mt-3">Admin login</h1>
          <p className="text-sm text-color-2 mt-1">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@meilibeauty.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-sm p-3">
              <p className="text-xs text-red-800">{error}</p>
            </div>
          )}
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Sign in
          </Button>
        </form>

        {!isSupabaseConfigured() && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-sm p-4">
            <p className="text-xs text-yellow-800 font-medium mb-2">⚠️ Setup Required</p>
            <p className="text-xs text-yellow-700">
              Supabase environment variables are not configured. Please set{' '}
              <code className="bg-yellow-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
              <code className="bg-yellow-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in your Vercel environment variables.
            </p>
          </div>
        )}

        <p className="text-xs text-color-2 text-center mt-6">
          Protected area. Only authorized administrators can access this panel.
        </p>
      </Card>
    </div>
  );
}
