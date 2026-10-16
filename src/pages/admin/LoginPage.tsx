import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock login - in production this would use Supabase Auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      navigate('/admin');
    } else {
      setError('Please enter email and password');
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
          {error && <p className="text-xs text-color-4" role="alert">{error}</p>}
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Sign in
          </Button>
        </form>

        <p className="text-xs text-color-2 text-center mt-6">
          Protected area. Only authorized administrators can access this panel.
        </p>
      </Card>
    </div>
  );
}
