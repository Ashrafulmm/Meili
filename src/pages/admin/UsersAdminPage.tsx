import { useState } from 'react';
import { Search, MoreVertical, Shield, User, Ban } from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  status: 'active' | 'blocked';
  orders: number;
  joined: string;
}

const mockUsers: UserItem[] = [
  { id: '1', name: 'Ayesha Rahman', email: 'ayesha@email.com', role: 'customer', status: 'active', orders: 5, joined: '2024-01-15' },
  { id: '2', name: 'Fatima Khan', email: 'fatima@email.com', role: 'customer', status: 'active', orders: 3, joined: '2024-02-01' },
  { id: '3', name: 'Nadia Islam', email: 'nadia@email.com', role: 'customer', status: 'active', orders: 8, joined: '2024-01-20' },
  { id: '4', name: 'Admin User', email: 'admin@meilibeauty.com', role: 'admin', status: 'active', orders: 0, joined: '2023-12-01' },
  { id: '5', name: 'Sara Ahmed', email: 'sara@email.com', role: 'customer', status: 'blocked', orders: 1, joined: '2024-02-10' },
  { id: '6', name: 'Rina Akter', email: 'rina@email.com', role: 'customer', status: 'active', orders: 12, joined: '2024-01-05' },
];

export function UsersAdminPage() {
  const [users, setUsers] = useState<UserItem[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-color-1">Users</h1>
        <p className="text-sm text-color-2 mt-1">{users.length} registered users</p>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-color-2" />
          <input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-color-7 border border-color-6 rounded-sm focus:border-color-3 focus:ring-2 focus:ring-color-3/20 transition-all duration-150 text-color-1"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-color-7 border-b border-color-6">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-color-2">User</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Role</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Orders</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Status</th>
                <th className="text-right px-4 py-3 font-medium text-color-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-color-6">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-color-7/50 transition-colors duration-150">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${user.role === 'admin' ? 'bg-color-3' : 'bg-color-4'}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-color-1">{user.name}</p>
                        <p className="text-xs text-color-2">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === 'admin' ? 'info' : 'default'}>
                      {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-color-2">{user.orders}</td>
                  <td className="px-4 py-3 text-color-2">{user.joined}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.status === 'active' ? 'success' : 'danger'}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant={user.status === 'active' ? 'danger' : 'secondary'}
                      onClick={() => toggleStatus(user.id)}
                    >
                      <Ban className="w-3 h-3" />
                      {user.status === 'active' ? 'Block' : 'Unblock'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
