import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, MapPin, Navigation, LayoutDashboard, History, UserCircle, Map as MapIcon, CreditCard, Clock, Star, Box, FileText, ChevronRight } from 'lucide-react';
import { Button, Card, StatusBadge, Input } from '../components/UI';
import { Driver, Order, OrderStatus, VehicleType } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { driverService } from '../services/mockSupabase';
import { TrackingMap } from '../components/TrackingMap';

interface DriverProps {
  user: Driver;
}

const EARNINGS_DATA = [
  { name: 'Mon', value: 45 },
  { name: 'Tue', value: 52 },
  { name: 'Wed', value: 38 },
  { name: 'Thu', value: 65 },
  { name: 'Fri', value: 48 },
  { name: 'Sat', value: 85 },
  { name: 'Sun', value: 20 },
];

const DriverDashboard: React.FC<DriverProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'history' | 'profile'>('home');
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState<Order | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<Order[]>([]);
  
  // Delivery Flow States
  const [otpInput, setOtpInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [hasPickupPhoto, setHasPickupPhoto] = useState(false);
  const [hasDeliveryPhoto, setHasDeliveryPhoto] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      driverService.getHistory(user.id).then(setHistory);
    }
  }, [activeTab, user.id]);

  // Simulation: Trigger incoming request
  const simulateRequest = () => {
    if (!isOnline) return;
    setIncomingRequest({
      id: 'req-123',
      customerId: 'cust-1',
      pickupAddress: '123 Main St, Tech District',
      dropAddress: '456 Park Ave, Suburbia',
      pickupCoords: { lat: 0, lng: 0 },
      dropCoords: { lat: 0, lng: 0 },
      vehicleType: VehicleType.BIKE,
      packageDetails: { size: 'SMALL', weight: 2, isFragile: false } as any,
      fare: 24.50,
      distance: 5.2,
      status: OrderStatus.PENDING,
      paymentMethod: 'CASH',
      deliveryOtp: '1234',
      createdAt: new Date().toISOString()
    } as Order);
  };

  const acceptOrder = () => {
    if (incomingRequest) {
      setActiveOrder({ ...incomingRequest, status: OrderStatus.ACCEPTED });
      setIncomingRequest(null);
    }
  };

  // Workflow transitions
  const handleArrived = () => updateOrderStatus(OrderStatus.DRIVER_ARRIVED);

  const handlePickup = () => {
    if (!hasPickupPhoto) {
      alert("Please upload pickup proof first (Simulated)");
      return;
    }
    updateOrderStatus(OrderStatus.PICKED_UP);
  };
  
  const handleTransit = () => updateOrderStatus(OrderStatus.IN_TRANSIT);

  const handleComplete = () => {
    if (otpInput !== activeOrder?.deliveryOtp) {
      alert("Invalid OTP! Check with customer.");
      return;
    }
    if (!hasDeliveryPhoto) {
        alert("Please upload delivery proof.");
        return;
    }
    updateOrderStatus(OrderStatus.COMPLETED);
  };

  const updateOrderStatus = (status: OrderStatus) => {
    if (!activeOrder) return;
    setActiveOrder({ ...activeOrder, status });
    
    if (status === OrderStatus.COMPLETED) {
      setTimeout(() => {
        setActiveOrder(null);
        setOtpInput('');
        setHasPickupPhoto(false);
        setHasDeliveryPhoto(false);
      }, 3000); // Show success message for 3s
    }
  };
  
  const simulateUpload = (type: 'pickup' | 'drop') => {
    setIsUploading(true);
    setTimeout(() => {
        setIsUploading(false);
        if(type === 'pickup') setHasPickupPhoto(true);
        else setHasDeliveryPhoto(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      
      {/* Top Bar - Hidden on map view if needed, but keeping for consistency */}
      <div className="bg-white px-4 py-3 shadow-sm flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <img src={user.avatarUrl} className="w-10 h-10 rounded-full border-2 border-indigo-100" />
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-sm">{user.name}</span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
               <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
               {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2"><div className="relative"><Clock className="w-5 h-5 text-gray-600"/></div></Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-y-auto pb-20">
        
        {/* --- TAB: HOME (MAP & ACTIVE ORDERS) --- */}
        {activeTab === 'home' && (
          <div className="h-full flex flex-col relative">
             <div className="flex-1 relative bg-slate-200">
                {activeOrder ? (
                   <TrackingMap status={activeOrder.status} vehicleType={user.vehicleType} className="rounded-none border-none" />
                ) : (
                   <>
                     <img 
                        src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=2000" 
                        className="w-full h-full object-cover opacity-60 grayscale" 
                        alt="Driver Map"
                      />
                     {/* Online/Offline Toggle Overlay */}
                     <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 w-full px-12 text-center">
                        <button
                           onClick={() => { setIsOnline(!isOnline); if(isOnline) setIncomingRequest(null); }}
                           className={`flex items-center justify-center w-full gap-2 px-6 py-4 rounded-full shadow-xl font-bold transition-all transform hover:scale-105 ${isOnline ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'}`}
                        >
                           <Power className="w-5 h-5" />
                           {isOnline ? 'YOU ARE ONLINE' : 'GO ONLINE'}
                        </button>
                        {!isOnline && <p className="mt-2 text-xs font-medium text-gray-600 bg-white/80 inline-block px-2 py-1 rounded">Go online to receive jobs</p>}
                     </div>
                     {/* Simulation Controls (Dev Only) */}
                     {isOnline && !incomingRequest && (
                        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10">
                           <Button size="sm" variant="secondary" onClick={simulateRequest}>Simulate Job</Button>
                        </div>
                     )}
                   </>
                )}
             </div>

             {/* Bottom Sheet / Interaction Area */}
             <div className={`bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-6 z-20 relative transition-all duration-300 ${activeOrder ? 'min-h-[300px]' : 'min-h-[100px]'}`}>
                {/* Incoming Request */}
                <AnimatePresence>
                    {isOnline && incomingRequest && (
                       <motion.div
                         initial={{ y: 100, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         exit={{ y: 100, opacity: 0 }}
                         className="absolute inset-x-0 bottom-0 bg-white p-6 rounded-t-3xl shadow-2xl border-t border-indigo-100 pb-24"
                       >
                          <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold text-gray-900">New Request!</h2>
                             <div className="bg-green-100 px-3 py-1 rounded-full text-green-700 font-bold text-lg">${incomingRequest.fare}</div>
                          </div>
                          <div className="space-y-4 mb-6">
                             <div className="flex gap-3">
                                <div className="mt-1"><MapPin className="w-5 h-5 text-green-500" /></div>
                                <div>
                                   <p className="text-xs text-gray-500">Pickup</p>
                                   <p className="font-medium text-gray-900">{incomingRequest.pickupAddress}</p>
                                   <p className="text-xs text-gray-400">2.1 km away</p>
                                </div>
                             </div>
                             <div className="flex gap-3">
                                <div className="mt-1"><Navigation className="w-5 h-5 text-red-500" /></div>
                                <div>
                                   <p className="text-xs text-gray-500">Drop off</p>
                                   <p className="font-medium text-gray-900">{incomingRequest.dropAddress}</p>
                                   <p className="text-xs text-gray-400">{incomingRequest.distance} km trip</p>
                                </div>
                             </div>
                          </div>
                          <div className="flex gap-4">
                             <Button variant="ghost" className="flex-1 border" onClick={() => setIncomingRequest(null)}>Reject</Button>
                             <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={acceptOrder}>Accept Order</Button>
                          </div>
                       </motion.div>
                    )}
                </AnimatePresence>

                {/* Active Order Actions */}
                {activeOrder ? (
                    <div className="space-y-4 pb-16">
                       <div className="flex justify-between items-center border-b pb-4">
                          <div className="flex items-center gap-2">
                             <StatusBadge status={activeOrder.status} />
                             <span className="text-xs text-gray-400">#{activeOrder.id.slice(-4)}</span>
                          </div>
                          <div className="flex gap-2">
                             <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 flex items-center justify-center">📞</Button>
                             <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 flex items-center justify-center">💬</Button>
                          </div>
                       </div>

                       {activeOrder.status === OrderStatus.ACCEPTED && (
                          <Button className="w-full py-4 text-lg" onClick={handleArrived}>Slide to Confirm Arrival</Button>
                       )}
                       
                       {activeOrder.status === OrderStatus.DRIVER_ARRIVED && (
                          <div className="space-y-3">
                             <p className="text-sm font-medium text-gray-600">You are at pickup. Verify package.</p>
                             <Button 
                               variant="outline" 
                               className={`w-full ${hasPickupPhoto ? 'border-green-500 text-green-600 bg-green-50' : ''}`}
                               onClick={() => simulateUpload('pickup')}
                               disabled={isUploading || hasPickupPhoto}
                             >
                               {isUploading ? 'Uploading...' : hasPickupPhoto ? 'Photo Uploaded ✓' : '📷 Upload Pickup Photo'}
                             </Button>
                             <Button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700" onClick={handlePickup} disabled={!hasPickupPhoto}>
                                Confirm Pickup
                             </Button>
                          </div>
                       )}

                       {activeOrder.status === OrderStatus.PICKED_UP && (
                          <Button className="w-full py-4 text-lg bg-indigo-600" onClick={handleTransit}>Start Journey</Button>
                       )}
                       
                       {activeOrder.status === OrderStatus.IN_TRANSIT && (
                           <>
                            <Button className="w-full py-4 text-lg bg-green-600" onClick={() => updateOrderStatus(OrderStatus.IN_TRANSIT)}>Navigating...</Button>
                            <div className="text-center text-xs text-gray-400 cursor-pointer underline" onClick={() => updateOrderStatus(OrderStatus.COMPLETED)}>(Dev: Complete)</div>
                           </>
                       )}

                       {activeOrder.status === OrderStatus.COMPLETED && (
                          <div className="space-y-4">
                             {!hasDeliveryPhoto ? (
                               <div className="space-y-3">
                                 <h4 className="font-bold">Delivery Steps</h4>
                                 <Button variant="outline" className="w-full" onClick={() => simulateUpload('drop')} disabled={isUploading}>
                                   {isUploading ? 'Uploading...' : '📷 Upload Delivery Proof'}
                                 </Button>
                               </div>
                             ) : (
                                <div className="space-y-3">
                                   <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                     <p className="text-sm font-bold text-yellow-800 mb-2">Ask customer for OTP</p>
                                     <Input placeholder="Enter 4-digit OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} maxLength={4} className="text-center tracking-widest font-mono text-lg" />
                                   </div>
                                   <Button className="w-full py-3 bg-green-600 hover:bg-green-700" onClick={handleComplete}>Verify & Complete Job</Button>
                                </div>
                             )}
                          </div>
                       )}
                    </div>
                ) : (
                   !incomingRequest && (
                       <div className="flex items-center gap-4 text-gray-500">
                           <div className="p-3 bg-indigo-50 rounded-full text-indigo-600"><MapPin className="w-6 h-6"/></div>
                           <div>
                               <p className="text-sm font-bold text-gray-900">High Demand Area</p>
                               <p className="text-xs">Head to Tech Park for more orders.</p>
                           </div>
                       </div>
                   )
                )}
             </div>
          </div>
        )}

        {/* --- TAB: DASHBOARD (EARNINGS) --- */}
        {activeTab === 'dashboard' && (
          <div className="p-6 space-y-6">
             <h2 className="text-2xl font-bold text-gray-900">Performance</h2>
             
             <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-indigo-600 text-white border-none">
                   <p className="text-indigo-200 text-xs mb-1">Today's Earnings</p>
                   <p className="text-3xl font-bold">${user.todayEarnings}</p>
                </Card>
                <Card className="p-4">
                   <p className="text-gray-400 text-xs mb-1">Completed Trips</p>
                   <p className="text-3xl font-bold text-gray-900">12</p>
                </Card>
                <Card className="p-4">
                   <p className="text-gray-400 text-xs mb-1">Login Hours</p>
                   <p className="text-3xl font-bold text-gray-900">6.5h</p>
                </Card>
                <Card className="p-4">
                   <p className="text-gray-400 text-xs mb-1">Rating</p>
                   <p className="text-3xl font-bold text-gray-900 flex items-center gap-1">{user.rating} <span className="text-yellow-400 text-lg">★</span></p>
                </Card>
             </div>

             <Card className="p-4">
                <h3 className="font-bold text-gray-900 mb-4">Weekly Earnings</h3>
                <div className="h-48 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={EARNINGS_DATA}>
                         <defs>
                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                         <Tooltip />
                         <Area type="monotone" dataKey="value" stroke="#4F46E5" fillOpacity={1} fill="url(#colorVal)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </Card>
             
             <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-full text-green-600"><Star className="w-5 h-5"/></div>
                 <div>
                    <h4 className="font-bold text-green-800">Excellent Work!</h4>
                    <p className="text-xs text-green-600">You are in the top 5% of drivers this week.</p>
                 </div>
             </div>
          </div>
        )}

        {/* --- TAB: HISTORY --- */}
        {activeTab === 'history' && (
          <div className="p-6 space-y-4">
             <h2 className="text-2xl font-bold text-gray-900">Trip History</h2>
             {history.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No past trips found.</p>
             ) : (
                history.map(order => (
                   <Card key={order.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <div className="font-bold text-green-600">+ ${order.fare}</div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                         <StatusBadge status={order.status} />
                         <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{order.paymentMethod}</span>
                      </div>
                      <div className="space-y-2 pl-4 border-l-2 border-indigo-100">
                         <div>
                            <p className="text-xs text-gray-400">Pickup</p>
                            <p className="text-sm font-medium truncate">{order.pickupAddress}</p>
                         </div>
                         <div>
                            <p className="text-xs text-gray-400">Drop</p>
                            <p className="text-sm font-medium truncate">{order.dropAddress}</p>
                         </div>
                      </div>
                   </Card>
                ))
             )}
          </div>
        )}

        {/* --- TAB: PROFILE --- */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6">
             <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                   <img src={user.avatarUrl} className="w-full h-full rounded-full border-4 border-white shadow-lg" />
                   <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
             </div>

             <div className="space-y-4">
                <Card className="p-0 overflow-hidden">
                   <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 font-bold text-xs text-gray-500 uppercase tracking-wider">Vehicle Details</div>
                   <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="text-2xl">
                            {user.vehicleType === VehicleType.BIKE ? '🏍️' : '🚗'}
                         </div>
                         <div>
                            <p className="font-bold text-gray-900">{user.vehicleNumber}</p>
                            <p className="text-xs text-gray-500">Black Pulsar 150</p>
                         </div>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                   </div>
                </Card>

                <Card className="p-0 overflow-hidden">
                   <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 font-bold text-xs text-gray-500 uppercase tracking-wider">Documents</div>
                   <div className="divide-y divide-gray-100">
                      {['Driving License', 'Vehicle Insurance', 'Registration Certificate'].map((doc) => (
                         <div key={doc} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <FileText className="w-4 h-4 text-indigo-500"/>
                               <span className="text-sm font-medium">{doc}</span>
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Verified</span>
                         </div>
                      ))}
                   </div>
                </Card>
             </div>
             
             <Button variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50">Log Out</Button>
          </div>
        )}

      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 absolute bottom-0 w-full z-30 pb-safe">
         <div className="flex justify-around items-center h-16">
            <button 
               onClick={() => setActiveTab('home')}
               className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <MapIcon className="w-6 h-6" />
               <span className="text-[10px] font-medium">Home</span>
            </button>
            <button 
               onClick={() => setActiveTab('dashboard')}
               className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <LayoutDashboard className="w-6 h-6" />
               <span className="text-[10px] font-medium">Earnings</span>
            </button>
            <button 
               onClick={() => setActiveTab('history')}
               className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'history' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <History className="w-6 h-6" />
               <span className="text-[10px] font-medium">Trips</span>
            </button>
            <button 
               onClick={() => setActiveTab('profile')}
               className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <UserCircle className="w-6 h-6" />
               <span className="text-[10px] font-medium">Profile</span>
            </button>
         </div>
      </div>

    </div>
  );
};

export default DriverDashboard;