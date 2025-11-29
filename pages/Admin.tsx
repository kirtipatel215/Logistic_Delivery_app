import React, { useState } from 'react';
import { Card, Button, Input, StatusBadge } from '../components/UI';
import { Users, Package, TrendingUp, AlertCircle, Check, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers'>('overview');

  const stats = [
    { title: 'Total Orders', value: '1,245', icon: Package, color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Drivers', value: '48', icon: Users, color: 'bg-green-100 text-green-600' },
    { title: 'Revenue (Today)', value: '$3,850', icon: TrendingUp, color: 'bg-indigo-100 text-indigo-600' },
    { title: 'Pending Approval', value: '12', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-600' },
  ];

  const chartData = [
    { name: '10am', orders: 12 }, { name: '11am', orders: 19 }, { name: '12pm', orders: 25 },
    { name: '1pm', orders: 32 }, { name: '2pm', orders: 28 }, { name: '3pm', orders: 15 },
  ];

  const drivers = [
    { id: 1, name: 'Alice Walker', vehicle: 'Sedan', status: 'Pending' },
    { id: 2, name: 'Bob Martin', vehicle: 'Bike', status: 'Verified' },
    { id: 3, name: 'Charlie Day', vehicle: 'Van', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-indigo-600">Admin</h1>
        </div>
        <nav className="p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('drivers')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeTab === 'drivers' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Driver Approvals
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <Card key={idx} className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <Card className="p-6">
                  <h3 className="text-lg font-bold mb-6">Orders Today</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#F3F4F6'}} />
                        <Bar dataKey="orders" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </Card>

               <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200" />
                              <div>
                                 <p className="text-sm font-medium">Order #102{i}</p>
                                 <p className="text-xs text-gray-500">2 mins ago</p>
                              </div>
                           </div>
                           <StatusBadge status="COMPLETED" />
                        </div>
                     ))}
                  </div>
               </Card>
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-gray-900">Driver Verification</h2>
             <Card className="overflow-hidden">
                <table className="w-full text-left">
                   <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Driver Name</th>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Vehicle</th>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {drivers.map(driver => (
                         <tr key={driver.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-medium text-gray-900">{driver.name}</td>
                            <td className="px-6 py-4 text-gray-500">{driver.vehicle}</td>
                            <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded-full text-xs ${driver.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {driver.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               {driver.status === 'Pending' && (
                                  <div className="flex justify-end gap-2">
                                     <Button size="sm" variant="danger" className="p-1 px-2"><X className="w-4 h-4" /></Button>
                                     <Button size="sm" className="p-1 px-2 bg-green-600 hover:bg-green-700"><Check className="w-4 h-4" /></Button>
                                  </div>
                               )}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;