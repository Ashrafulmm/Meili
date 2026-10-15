import { Package, ShoppingCart, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../../components/ui';
import { products, orders } from '../../data/mockData';

export function DashboardPage() {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalProducts = products.length;

  const stats = [
    { label: 'Total revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, change: '+12%', up: true, color: 'bg-color-3' },
    { label: 'Orders', value: orders.length.toString(), icon: ShoppingCart, change: '+8%', up: true, color: 'bg-color-4' },
    { label: 'Products', value: totalProducts.toString(), icon: Package, change: '+3', up: true, color: 'bg-blue-500' },
    { label: 'Customers', value: '234', icon: Users, change: '+18%', up: true, color: 'bg-purple-500' },
  ];

  const recentOrders = orders.slice(0, 5);

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
