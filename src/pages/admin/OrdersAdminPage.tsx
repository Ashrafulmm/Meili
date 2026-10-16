import { useState } from 'react';
import { Search, Eye, ChevronDown } from 'lucide-react';
import { orders as initialOrders, Order } from '../../data/mockData';
import { Card, Badge, Button, Modal, Select } from '../../components/ui';

export function OrdersAdminPage() {
  const [ordersList, setOrdersList] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredOrders = ordersList.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    pending: 'warning', confirmed: 'info', processing: 'info',
    shipped: 'info', delivered: 'success', cancelled: 'danger',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-color-1">Orders</h1>
        <p className="text-sm text-color-2 mt-1">{ordersList.length} total orders</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-color-2" />
            <input
              type="search"
              placeholder="Search by name or order ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-color-7 border border-color-6 rounded-sm focus:border-color-3 focus:ring-2 focus:ring-color-3/20 transition-all duration-150 text-color-1"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'processing', label: 'Processing' },
              { value: 'shipped', label: 'Shipped' },
              { value: 'delivered', label: 'Delivered' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
        </div>
      </Card>

      {/* Orders table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-color-7 border-b border-color-6">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-color-2">Order ID</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Date</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Total</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Status</th>
                <th className="text-right px-4 py-3 font-medium text-color-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-color-6">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-color-7/50 transition-colors duration-150">
                  <td className="px-4 py-3 font-medium text-color-1">{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-color-1">{order.customerName}</p>
                    <p className="text-xs text-color-2">{order.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-color-2">{order.createdAt}</td>
                  <td className="px-4 py-3 font-medium text-color-1">৳{order.total}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                        className="p-2 text-color-2 hover:text-color-3 transition-colors duration-150"
                        aria-label={`View order ${order.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-color-2">No orders found</p>
        </div>
      )}

      {/* Order detail modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Order ${selectedOrder?.id}`}>
        {selectedOrder && (
          <div className="space-y-6">
            {/* Customer info */}
            <div className="bg-color-7 rounded-sm p-4">
              <h3 className="text-sm font-medium text-color-1 mb-2">Customer details</h3>
              <div className="space-y-1 text-sm text-color-2">
                <p><span className="font-medium text-color-1">Name:</span> {selectedOrder.customerName}</p>
                <p><span className="font-medium text-color-1">Email:</span> {selectedOrder.customerEmail}</p>
                <p><span className="font-medium text-color-1">Phone:</span> {selectedOrder.customerPhone}</p>
                <p><span className="font-medium text-color-1">Address:</span> {selectedOrder.address}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-sm font-medium text-color-1 mb-2">Order items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-color-6 last:border-0">
                    <span className="text-color-2">{item.title} × {item.quantity}</span>
                    <span className="font-medium text-color-1">৳{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-color-1 pt-2">
                  <span>Total</span>
                  <span>৳{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Status update */}
            <div>
              <h3 className="text-sm font-medium text-color-1 mb-2">Update status</h3>
              <div className="flex items-center gap-3">
                <Select
                  value={selectedOrder.status}
                  onChange={e => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'shipped', label: 'Shipped' },
                    { value: 'delivered', label: 'Delivered' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                />
                <Button size="sm" variant="secondary">Update</Button>
              </div>
            </div>

            <div className="text-xs text-color-2">
              <p>Payment: {selectedOrder.paymentMethod}</p>
              <p>Placed: {selectedOrder.createdAt}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
