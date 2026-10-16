import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2, Wrench } from 'lucide-react';
import { Card, Button } from '../../components/ui';
import { products as mockProducts, orders as mockOrders } from '../../data/mockData';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export function DashboardPage() {
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);

  useEffect(() => {
    // Check database connection
    const checkConnection = async () => {
      if (!isSupabaseConfigured()) {
        setDbConnected(false);
        return;
      }
      try {
        const { error } = await supabase.from('products').select('id').limit(1);
        setDbConnected(!error);
        
        // If connected, load real data
        if (!error) {
          const { data: productsData } = await supabase
            .from('products')
            .select('*, product_images(image_url, sort_order), product_sections(section_id, sections(name))')
            .order('created_at', { ascending: false });
          
          if (productsData && productsData.length > 0) {
            setProducts(productsData.map((p: any) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              price: p.price,
              originalPrice: p.original_price,
              description: p.description,
              shortDescription: p.short_description,
              images: p.product_images?.map((img: any) => img.image_url) || [],
              category: p.category,
              stock: p.stock,
              rating: p.rating || 0,
              reviewCount: p.review_count || 0,
              isFeatured: p.is_featured,
              sections: p.product_sections?.map((ps: any) => ps.sections?.name) || [],
              seoTitle: p.seo_title,
              seoDescription: p.seo_description,
              createdAt: p.created_at,
            })));
          }
        }
      } catch {
        setDbConnected(false);
      }
    };
    checkConnection();
  }, []);

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.total, 0);
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
  const totalProducts = products.length;

  const stats = [
    { label: 'Total revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, change: '+12%', up: true, color: 'bg-color-3' },
    { label: 'Orders', value: orders.length.toString(), icon: ShoppingCart, change: '+8%', up: true, color: 'bg-color-4' },
    { label: 'Products', value: totalProducts.toString(), icon: Package, change: '+3', up: true, color: 'bg-blue-500' },
    { label: 'Customers', value: '234', icon: Users, change: '+18%', up: true, color: 'bg-purple-500' },
  ];

  const recentOrders = (orders as any[]).slice(0, 5);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-color-1">Dashboard</h1>
        <p className="text-sm text-color-2 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Database Connection Status */}
      {dbConnected === false && (
        <div className="bg-red-50 border-2 border-red-300 rounded-sm p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-red-800 mb-2">⚠️ Database not connected</h2>
              <p className="text-sm text-red-700 mb-3">
                Your store is currently showing demo data. To save products, orders, and other changes, you need to connect to Supabase.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/admin/setup">
                  <Button variant="danger" size="md">
                    <Wrench className="w-4 h-4" /> Run Setup Wizard
                  </Button>
                </Link>
                <a
                  href="https://supabase.com/dashboard/project/ktfxnbtmuwsqdszciwvg/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-red-300 text-red-700 rounded-sm hover:bg-red-100 transition-colors duration-150"
                >
                  Open Supabase SQL Editor
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {dbConnected === true && (
        <div className="bg-green-50 border border-green-300 rounded-sm p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-800">
            ✅ Connected to Supabase database. Changes are being saved!
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-sm flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-color-1">{stat.value}</p>
              <p className="text-xs text-color-2 mt-1">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Recent orders & low stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-color-1">Recent orders</h2>
            <span className="text-xs text-color-4 font-medium cursor-pointer hover:underline">View all</span>
          </div>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-color-6 last:border-0">
                <div>
                  <p className="text-sm font-medium text-color-1">{order.customerName}</p>
                  <p className="text-xs text-color-2">{order.id} • {order.createdAt}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-color-1">৳{order.total}</p>
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-sm ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Low stock alert */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-color-1">Low stock alert</h2>
            <TrendingUp className="w-4 h-4 text-color-4" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            {products.filter(p => p.stock < 40).map(product => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-color-6 last:border-0">
                <div className="flex items-center gap-3">
                  <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded-sm object-cover" />
                  <div>
                    <p className="text-sm font-medium text-color-1">{product.title}</p>
                    <p className="text-xs text-color-2">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${product.stock < 20 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {product.stock} left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-color-1 mb-4">Quick actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add product', icon: Package },
            { label: 'View orders', icon: ShoppingCart },
            { label: 'Manage banners', icon: DollarSign },
            { label: 'Store settings', icon: TrendingUp },
          ].map(action => {
            const Icon = action.icon;
            return (
              <button key={action.label} className="flex flex-col items-center gap-2 p-4 bg-color-7 rounded-sm hover:bg-color-6 transition-colors duration-150">
                <Icon className="w-5 h-5 text-color-3" aria-hidden="true" />
                <span className="text-xs font-medium text-color-1">{action.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Pending orders notification */}
      {pendingOrders > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
            <span className="text-sm">⚠️</span>
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800">{pendingOrders} pending orders need your attention</p>
            <p className="text-xs text-yellow-700">Review and confirm orders to keep customers happy.</p>
          </div>
        </div>
      )}
    </div>
  );
}
