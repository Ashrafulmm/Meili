import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, Users, Image, Tag, Link2, LogOut, Menu, X } from 'lucide-react';
import { getCurrentUser, signOut } from '../../lib/api';
import { isSupabaseConfigured } from '../../lib/supabase';

const adminLinks = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { label: 'Categories', path: '/admin/categories', icon: Tag },
  { label: 'Banners', path: '/admin/banners', icon: Image },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Import', path: '/admin/import', icon: Link2 },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-color-7 flex items-center justify-center">
        <p className="text-color-2">Loading...</p>
      </div>
    );
  }

  // If Supabase is configured and user is not logged in, redirect to login
  if (isSupabaseConfigured() && !user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-color-7 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-color-8 border-r border-color-6 shadow-md">
        <div className="p-6 border-b border-color-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="text-lg font-bold text-color-1">Meili Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1" aria-label="Admin navigation">
          {adminLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-color-4 text-color-8 shadow-md'
                    : 'text-color-2 hover:bg-color-6 hover:text-color-1'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-color-6 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-color-2 hover:text-color-4 transition-colors duration-150">
            <span>🏪</span>
            Back to store
          </Link>
          {user && (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-color-2 hover:text-red-600 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Sign out
            </button>
          )}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-color-1/40" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-color-8 shadow-sm">
            <div className="p-6 border-b border-color-6 flex items-center justify-between">
              <span className="text-lg font-bold text-color-1">Meili Admin</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-color-2" aria-label="Close sidebar">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1" aria-label="Admin navigation">
              {adminLinks.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-sm transition-all duration-150 ${
                      isActive ? 'bg-color-4 text-color-8' : 'text-color-2 hover:bg-color-6'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-color-8 border-b border-color-6 px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            className="lg:hidden p-2 text-color-2 hover:text-color-1 transition-colors duration-150"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="w-8 h-8 bg-color-3 rounded-full flex items-center justify-center text-color-8 text-sm font-bold">
                  {user.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-color-1">{user.email}</p>
                  <p className="text-xs text-color-2">Administrator</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-color-3 rounded-full flex items-center justify-center text-color-8 text-sm font-bold">
                  A
                </div>
                <span className="text-sm font-medium text-color-1">Admin</span>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
