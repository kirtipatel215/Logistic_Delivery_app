
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Package, Search, Phone, Star, Shield, Box, Home, Clock, User as UserIcon, PlusCircle, CreditCard, Settings, LogOut, ChevronRight, Bell, Sparkles, ExternalLink } from 'lucide-react';
import { Button, Input, Card, StatusBadge, Modal } from '../components/UI';
import { User, VehicleType, Order, OrderStatus, PackageSize, PaymentMethod, PackageDetails } from '../types';
import { orderService } from '../services/mockSupabase';
import { aiService } from '../services/aiService';
import { TrackingMap } from '../components/TrackingMap';

interface CustomerProps {
  user: User;
}

const VEHICLES = [
  { type: VehicleType.BIKE, label: 'Swift Bike', icon: '🏍️', desc: 'Fastest for small items', basePrice: 5 },
  { type: VehicleType.AUTO, label: 'Auto', icon: '🛺', desc: 'Good for groceries', basePrice: 10 },
  { type: VehicleType.CAR_PREMIUM, label: 'Sedan', icon: '🚗', desc: 'Comfy ride or fragile', basePrice: 20 },
  { type: VehicleType.LOGISTICS_VAN, label: 'Cargo Van', icon: '🚐', desc: 'Moving heavy furniture', basePrice: 35 },
];

type Tab = 'home' | 'book' | 'history' | 'profile';

const CustomerDashboard: React.FC<CustomerProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  
  // Booking State
  const [step, setStep] = useState(1); 
  // 1: Location, 2: Package Details, 3: Vehicle, 4: Loading, 5: Tracking
  
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [pickupMapLink, setPickupMapLink] = useState<string | undefined>(undefined);
  const [dropMapLink, setDropMapLink] = useState<string | undefined>(undefined);
  const [isSearchingPickup, setIsSearchingPickup] = useState(false);
  const [isSearchingDrop, setIsSearchingDrop] = useState(false);
  
  const [pkgDetails, setPkgDetails] = useState<PackageDetails>({
    size: PackageSize.SMALL,
    weight: 1,
    isFragile: false
  });
  
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PaymentMethod.CASH);
  
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [fare, setFare] = useState(0);
  const [history, setHistory] = useState<Order[]>([]);
  
  // Modals
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (activeTab === 'history') {
      orderService.getOrders().then(setHistory);
    }
  }, [activeTab]);

  // --- Live Tracking Simulation Effect ---
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    // Auto-advance logic for demo purposes (Driver Actions)
    if (activeOrder?.status === OrderStatus.ACCEPTED) {
      timer = setTimeout(() => {
        setActiveOrder(prev => prev ? { ...prev, status: OrderStatus.DRIVER_ARRIVED } : null);
      }, 5000);
    } 
    else if (activeOrder?.status === OrderStatus.PICKED_UP) {
      timer = setTimeout(() => {
        setActiveOrder(prev => prev ? { ...prev, status: OrderStatus.IN_TRANSIT } : null);
      }, 3000);
    }
    
    if (activeOrder?.status === OrderStatus.COMPLETED && !showRating) {
      setShowRating(true);
    }

    return () => clearTimeout(timer);
  }, [activeOrder?.status]);

  const handleNextStep1 = () => {
    if (!pickup || !drop) return;
    setStep(2);
  };

  const handleNextStep2 = async () => {
    setStep(3);
  };

  // AI Maps Grounding Handler
  const handleLocationSearch = async (type: 'pickup' | 'drop', query: string) => {
    if (!query.trim()) return;
    
    if (type === 'pickup') setIsSearchingPickup(true);
    else setIsSearchingDrop(true);

    const result = await aiService.findPlace(query);

    if (type === 'pickup') {
      setPickup(result.address);
      setPickupMapLink(result.mapLink);
      setIsSearchingPickup(false);
    } else {
      setDrop(result.address);
      setDropMapLink(result.mapLink);
      setIsSearchingDrop(false);
    }
  };

  const handleVehicleSelect = async (v: VehicleType) => {
    setSelectedVehicle(v);
    const estimatedFare = await orderService.calculateFare(8.5, v); // Mock distance
    setFare(estimatedFare);
  };

  const handleBook = async () => {
    if (!selectedVehicle) return;
    
    setIsConfirmModalOpen(false);
    setStep(4); // Loading state
    
    const order = await orderService.createOrder({
      pickupAddress: pickup,
      dropAddress: drop,
      vehicleType: selectedVehicle,
      packageDetails: pkgDetails,
      paymentMethod: selectedPayment,
      fare: fare,
      distance: 8.5
    });
    
    setActiveOrder(order);
    setStep(5); // Tracking state
    setActiveTab('book'); // Ensure we are on the booking tab
    
    // Simulate finding driver
    setTimeout(async () => {
      await orderService.assignDriver(order.id);
      setActiveOrder(prev => prev ? { ...prev, status: OrderStatus.ACCEPTED, driverId: 'driver-456' } : null);
    }, 4000);
  };

  const resetBooking = () => {
    setStep(1);
    setPickup('');
    setDrop('');
    setPickupMapLink(undefined);
    setDropMapLink(undefined);
    setActiveOrder(null);
    setSelectedVehicle(null);
    setIsConfirmModalOpen(false);
    setShowRating(false);
    setPkgDetails({ size: PackageSize.SMALL, weight: 1, isFragile: false });
    setActiveTab('home');
  };

  // Helper to determine if we show the side map
  const showSideMap = activeTab === 'book' || (activeTab === 'home' && activeOrder);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 flex flex-col">
      {/* --- Desktop Header --- */}
      <div className="bg-white shadow-sm sticky top-0 z-20 hidden md:block">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-gray-900">SwiftDispatch</span>
          </div>
          <div className="flex gap-8">
             {['home', 'book', 'history', 'profile'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t as Tab)}
                  className={`text-sm font-medium capitalize ${activeTab === t ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {t}
                </button>
             ))}
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Bell className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </div>
             <div className="flex items-center gap-2 pl-4 border-l">
                <div className="text-right">
                   <p className="text-xs text-gray-500">Wallet</p>
                   <p className="font-bold text-gray-900">${user.walletBalance}</p>
                </div>
                <img src={user.avatarUrl} alt="User" className="w-8 h-8 rounded-full border border-gray-200" />
             </div>
          </div>
        </div>
      </div>

      {/* --- Main Content Layout --- */}
      <div className="container mx-auto px-4 py-4 md:py-8 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Left/Main Panel */}
        <div className={`flex-1 transition-all ${showSideMap ? 'lg:w-1/3' : 'w-full'}`}>
          <AnimatePresence mode="wait">
            
            {/* TAB: HOME */}
            {activeTab === 'home' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                 {/* Greeting */}
                 <div className="flex justify-between items-center">
                    <div>
                       <h1 className="text-2xl font-bold text-gray-900">Hi, {user.name.split(' ')[0]} 👋</h1>
                       <p className="text-gray-500 text-sm">Where are you sending today?</p>
                    </div>
                    {/* Mobile Profile Icon */}
                    <div className="md:hidden w-10 h-10 rounded-full overflow-hidden border border-gray-200" onClick={() => setActiveTab('profile')}>
                       <img src={user.avatarUrl} className="w-full h-full object-cover"/>
                    </div>
                 </div>

                 {/* Active Order Card */}
                 {activeOrder && (
                    <Card className="p-0 overflow-hidden border-indigo-100 shadow-md">
                       <div className="bg-indigo-600 px-4 py-2 flex justify-between items-center text-white">
                          <span className="text-sm font-bold flex items-center gap-2">
                             <span className="animate-pulse w-2 h-2 rounded-full bg-white"></span>
                             Live Delivery
                          </span>
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white">{activeOrder.status.replace('_',' ')}</span>
                       </div>
                       <div className="p-4">
                          <div className="h-32 rounded-lg overflow-hidden relative mb-4">
                             <TrackingMap status={activeOrder.status} vehicleType={activeOrder.vehicleType} showEta={false} />
                          </div>
                          <div className="flex justify-between items-center">
                             <div>
                                <p className="text-xs text-gray-500">Arriving in</p>
                                <p className="text-lg font-bold text-gray-900">12 mins</p>
                             </div>
                             <Button size="sm" onClick={() => setActiveTab('book')}>Track Full Screen</Button>
                          </div>
                       </div>
                    </Card>
                 )}

                 {/* Quick Actions */}
                 <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => { setStep(1); setActiveTab('book'); }}>
                       <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                          <Package className="w-6 h-6" />
                       </div>
                       <span className="font-bold text-gray-900">Send Package</span>
                    </Card>
                    <Card className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setActiveTab('history')}>
                       <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                          <Clock className="w-6 h-6" />
                       </div>
                       <span className="font-bold text-gray-900">Recent Trips</span>
                    </Card>
                 </div>

                 {/* Wallet Preview */}
                 <Card className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-gray-400 text-sm">Swift Wallet</span>
                       <CreditCard className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-3xl font-bold mb-4">${user.walletBalance}</div>
                    <div className="flex gap-3">
                       <Button size="sm" className="flex-1 bg-white/10 hover:bg-white/20 border-none text-white">Top Up</Button>
                       <Button size="sm" className="flex-1 bg-white text-gray-900 hover:bg-gray-100 border-none">History</Button>
                    </div>
                 </Card>

                 {/* Promo Banner */}
                 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white relative overflow-hidden">
                    <div className="relative z-10">
                       <h3 className="font-bold text-lg mb-1">50% OFF First Delivery</h3>
                       <p className="text-indigo-100 text-sm mb-3">Use code: SWIFTNEW</p>
                       <button className="text-xs bg-white text-indigo-600 px-3 py-1.5 rounded-full font-bold">Apply Now</button>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                 </div>
              </motion.div>
            )}

            {/* TAB: BOOK (Using existing structure) */}
            {activeTab === 'book' && (
               <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col h-full"
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Delivery</h2>
                    <div className="space-y-4">
                      {/* Pickup Input with AI Search */}
                      <div className="space-y-1">
                        <Input 
                          icon={<MapPin className="w-4 h-4 text-green-600" />}
                          placeholder="e.g. Central Park West Entrance" 
                          value={pickup} 
                          onChange={(e) => setPickup(e.target.value)}
                          label="Pickup Point"
                          rightAction={{
                            icon: <Sparkles className="w-4 h-4" />,
                            onClick: () => handleLocationSearch('pickup', pickup),
                            isLoading: isSearchingPickup,
                            tooltip: "Verify address with Google Maps AI"
                          }}
                        />
                        {pickupMapLink && (
                          <div className="flex items-center gap-1 text-xs text-indigo-600 ml-1">
                             <ExternalLink className="w-3 h-3" />
                             <a href={pickupMapLink} target="_blank" rel="noopener noreferrer" className="hover:underline">Verified on Google Maps</a>
                          </div>
                        )}
                      </div>

                      {/* Drop Input with AI Search */}
                      <div className="space-y-1">
                        <Input 
                          icon={<Navigation className="w-4 h-4 text-red-600" />}
                          placeholder="e.g. Empire State Building Lobby" 
                          value={drop} 
                          onChange={(e) => setDrop(e.target.value)}
                          label="Destination"
                          rightAction={{
                            icon: <Sparkles className="w-4 h-4" />,
                            onClick: () => handleLocationSearch('drop', drop),
                            isLoading: isSearchingDrop,
                            tooltip: "Verify address with Google Maps AI"
                          }}
                        />
                         {dropMapLink && (
                          <div className="flex items-center gap-1 text-xs text-indigo-600 ml-1">
                             <ExternalLink className="w-3 h-3" />
                             <a href={dropMapLink} target="_blank" rel="noopener noreferrer" className="hover:underline">Verified on Google Maps</a>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      size="lg" 
                      onClick={handleNextStep1}
                      disabled={!pickup || !drop}
                    >
                      Next: Package Details
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-indigo-600 mb-2">← Back</button>
                    <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Package Size</label>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.values(PackageSize).map(size => (
                          <div 
                            key={size}
                            onClick={() => setPkgDetails({...pkgDetails, size})}
                            className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${pkgDetails.size === size ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-200'}`}
                          >
                             <div className="text-lg mb-1">{size === 'SMALL' ? '✉️' : size === 'MEDIUM' ? '📦' : '🛋️'}</div>
                             <div className="text-xs font-bold">{size}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input 
                          label="Weight (kg)" 
                          type="number"
                          value={pkgDetails.weight}
                          onChange={(e) => setPkgDetails({...pkgDetails, weight: Number(e.target.value)})}
                        />
                      </div>
                      <div className="flex-1 flex items-end">
                         <div 
                           onClick={() => setPkgDetails({...pkgDetails, isFragile: !pkgDetails.isFragile})}
                           className={`w-full p-2.5 rounded-lg border cursor-pointer flex items-center justify-center gap-2 ${pkgDetails.isFragile ? 'bg-red-50 border-red-500 text-red-600' : 'border-gray-300 text-gray-500'}`}
                         >
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">Fragile?</span>
                         </div>
                      </div>
                    </div>

                    <Button className="w-full mt-4" size="lg" onClick={handleNextStep2}>
                      Next: Select Vehicle
                    </Button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-indigo-600 mb-2">← Back</button>
                    <h2 className="text-xl font-bold text-gray-900">Select Vehicle</h2>
                    <div className="space-y-3 overflow-y-auto max-h-[40vh] pr-2">
                      {VEHICLES.map(v => (
                        <div 
                          key={v.type}
                          onClick={() => handleVehicleSelect(v.type)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${selectedVehicle === v.type ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">{v.icon}</span>
                            <div>
                              <p className="font-bold text-gray-900">{v.label}</p>
                              <p className="text-xs text-gray-500">{v.desc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-indigo-600">
                               ${Math.round(8.5 * v.basePrice + 20)}
                            </p>
                            <p className="text-xs text-gray-400">8 mins</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedVehicle && (
                      <div className="pt-4 border-t">
                        <div className="flex justify-between mb-4">
                          <span className="text-gray-600">Total Estimate</span>
                          <span className="text-xl font-bold text-gray-900">${fare}</span>
                        </div>
                        <Button className="w-full" size="lg" onClick={() => setIsConfirmModalOpen(true)}>Proceed to Pay</Button>
                      </div>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div className="flex flex-col items-center justify-center py-12">
                     <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                     <p className="text-gray-500 font-medium">Processing booking...</p>
                  </div>
                )}

                {step === 5 && activeOrder && (
                  <div className="flex flex-col h-full">
                    <div className="mb-6 text-center">
                       {activeOrder.status === OrderStatus.SEARCHING ? (
                         <div className="flex flex-col items-center">
                            <div className="relative w-20 h-20 mb-4">
                               <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping"></div>
                               <div className="absolute inset-0 border-4 border-indigo-500 rounded-full flex items-center justify-center bg-white">
                                  <Search className="w-8 h-8 text-indigo-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold">Finding nearby driver...</h3>
                            <p className="text-gray-500 text-sm">Connecting to nearest partner</p>
                         </div>
                       ) : (
                         <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 shadow-md">
                               <Package className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold">
                               {activeOrder.status === OrderStatus.ACCEPTED && "Driver Assigned!"}
                               {activeOrder.status === OrderStatus.DRIVER_ARRIVED && "Driver Arrived!"}
                               {activeOrder.status === OrderStatus.PICKED_UP && "Package Picked Up!"}
                               {activeOrder.status === OrderStatus.IN_TRANSIT && "In Transit"}
                               {activeOrder.status === OrderStatus.COMPLETED && "Delivered!"}
                            </h3>
                            <div className="mt-4 p-4 bg-gray-50 rounded-xl w-full flex items-center gap-4 border border-gray-100 relative">
                               <img src="https://picsum.photos/seed/driver1/50" className="w-12 h-12 rounded-full border border-white shadow-sm" />
                               <div className="text-left">
                                  <p className="font-bold">Mike Smith</p>
                                  <p className="text-xs text-gray-500">Swift Bike • KA-01-AB-1234</p>
                                  <div className="flex items-center gap-1 text-yellow-500 text-xs mt-1">
                                     <span>★</span> 4.8
                                  </div>
                               </div>
                               <div className="ml-auto flex gap-2">
                                  <Button size="sm" variant="outline" className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-indigo-600 border-indigo-200 hover:bg-indigo-50"><Phone className="w-4 h-4" /></Button>
                               </div>
                            </div>
                            
                            {/* OTP Display */}
                            {activeOrder.status !== OrderStatus.COMPLETED && (
                              <div className="mt-4 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg flex items-center gap-2">
                                <span className="text-xs font-bold text-indigo-600 uppercase">Delivery OTP</span>
                                <span className="text-xl font-mono font-bold text-gray-900 tracking-widest">{activeOrder.deliveryOtp}</span>
                              </div>
                            )}
                         </div>
                       )}
                    </div>

                    <div className="space-y-4 mt-auto">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm border border-white"></div>
                         <p className="text-sm text-gray-600">Pickup: <span className="font-medium text-gray-900">{activeOrder.pickupAddress}</span></p>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm border border-white"></div>
                         <p className="text-sm text-gray-600">Drop: <span className="font-medium text-gray-900">{activeOrder.dropAddress}</span></p>
                      </div>
                      
                      {activeOrder.status === OrderStatus.COMPLETED ? (
                         <Button variant="primary" className="w-full bg-green-600 hover:bg-green-700" onClick={resetBooking}>
                            Book New Order
                         </Button>
                      ) : (
                         <Button variant="ghost" className="w-full text-red-500 hover:bg-red-50" onClick={resetBooking}>Cancel Order</Button>
                      )}
                    </div>
                  </div>
                )}
               </motion.div>
            )}

            {/* TAB: HISTORY */}
            {activeTab === 'history' && (
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-4"
               >
                 <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                 {history.length === 0 && <p className="text-gray-500 text-center py-8">No past orders</p>}
                 {history.map(order => (
                   <Card 
                     key={order.id} 
                     className="p-4 cursor-pointer hover:border-indigo-300 transition-colors"
                     onClick={() => setViewOrder(order)}
                   >
                     <div className="flex justify-between items-start mb-2">
                       <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                       <StatusBadge status={order.status} />
                     </div>
                     <div className="flex flex-col gap-2 relative pl-4 border-l-2 border-indigo-100 mb-3">
                       <div>
                         <p className="text-xs text-gray-400">Pickup</p>
                         <p className="text-sm font-medium truncate">{order.pickupAddress}</p>
                       </div>
                       <div>
                         <p className="text-xs text-gray-400">Drop</p>
                         <p className="text-sm font-medium truncate">{order.dropAddress}</p>
                       </div>
                     </div>
                     <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                       <span className="text-sm font-medium flex items-center gap-1">
                         <Box className="w-3 h-3"/> {order.packageDetails?.size || 'SMALL'}
                       </span>
                       <span className="font-bold text-indigo-600">${order.fare}</span>
                     </div>
                   </Card>
                 ))}
               </motion.div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="space-y-6"
               >
                  <div className="flex flex-col items-center pt-4">
                     <div className="w-24 h-24 rounded-full p-1 border-2 border-indigo-100 mb-4">
                        <img src={user.avatarUrl} className="w-full h-full rounded-full object-cover shadow-sm"/>
                     </div>
                     <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                     <p className="text-gray-500">{user.email}</p>
                     <p className="text-gray-400 text-sm mt-1">{user.phone}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <Card className="p-4 flex flex-col items-center">
                        <p className="text-gray-400 text-xs mb-1">Total Spent</p>
                        <p className="text-xl font-bold text-gray-900">$1,240</p>
                     </Card>
                     <Card className="p-4 flex flex-col items-center">
                        <p className="text-gray-400 text-xs mb-1">Deliveries</p>
                        <p className="text-xl font-bold text-gray-900">42</p>
                     </Card>
                  </div>

                  <div className="space-y-3">
                     <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider pl-1">Saved Addresses</h3>
                     <Card className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
                        <div className="bg-indigo-50 p-2 rounded-full text-indigo-600"><Home className="w-4 h-4"/></div>
                        <div className="flex-1">
                           <p className="font-bold text-sm">Home</p>
                           <p className="text-xs text-gray-500">123, Green Valley, Tech Park</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                     </Card>
                     <Card className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
                        <div className="bg-blue-50 p-2 rounded-full text-blue-600"><BriefcaseIcon className="w-4 h-4"/></div>
                        <div className="flex-1">
                           <p className="font-bold text-sm">Office</p>
                           <p className="text-xs text-gray-500">Building 4, Cyber City</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                     </Card>
                  </div>

                  <div className="space-y-2 pt-4">
                     <Button variant="outline" className="w-full justify-start gap-2 border-gray-200 text-gray-600">
                        <Settings className="w-4 h-4" /> Settings
                     </Button>
                     <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:bg-red-50 hover:text-red-600">
                        <LogOut className="w-4 h-4" /> Log Out
                     </Button>
                  </div>
               </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Panel: Map (Visible only when relevant) */}
        {showSideMap && (
           <div className="hidden lg:block lg:w-2/3 h-[600px] rounded-xl overflow-hidden shadow-md relative bg-gray-100 border border-gray-200 sticky top-24">
             {activeOrder ? (
               <TrackingMap 
                  status={activeOrder.status} 
                  vehicleType={activeOrder.vehicleType} 
               />
             ) : (
               <>
                  <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
                  className="w-full h-full object-cover opacity-80" 
                  alt="Map Background"
                  />
                  <div className="absolute inset-0 bg-indigo-900/10 pointer-events-none"></div>
                  {/* Default Pulsing Dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                     <div className="relative">
                        <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-lg"></div>
                        <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-600 rounded-full animate-ping opacity-50"></div>
                     </div>
                  </div>
               </>
             )}
           </div>
        )}
      </div>

      {/* --- Bottom Navigation (Mobile) --- */}
      <div className="bg-white border-t border-gray-200 fixed bottom-0 w-full z-30 pb-safe md:hidden">
         <div className="flex justify-around items-center h-16">
            <button 
               onClick={() => setActiveTab('home')}
               className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <Home className="w-6 h-6" />
               <span className="text-[10px] font-medium">Home</span>
            </button>
            <button 
               onClick={() => { setActiveTab('book'); setStep(1); }}
               className="flex flex-col items-center justify-center w-full h-full -mt-6"
            >
               <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${activeTab === 'book' ? 'bg-indigo-600 text-white scale-110' : 'bg-indigo-500 text-white'}`}>
                  <PlusCircle className="w-8 h-8" />
               </div>
               <span className="text-[10px] font-medium mt-1 text-gray-600">Send</span>
            </button>
            <button 
               onClick={() => setActiveTab('history')}
               className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'history' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <Clock className="w-6 h-6" />
               <span className="text-[10px] font-medium">Activity</span>
            </button>
            <button 
               onClick={() => setActiveTab('profile')}
               className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
               <UserIcon className="w-6 h-6" />
               <span className="text-[10px] font-medium">Profile</span>
            </button>
         </div>
      </div>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)} 
        title="Confirm Your Order"
      >
        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-xl flex items-center gap-4">
             <div className="text-4xl">
                {VEHICLES.find(v => v.type === selectedVehicle)?.icon}
             </div>
             <div>
                <h4 className="font-bold text-indigo-900">{VEHICLES.find(v => v.type === selectedVehicle)?.label}</h4>
                <p className="text-xs text-indigo-700">{pkgDetails.size} Package • {pkgDetails.weight}kg</p>
             </div>
             <div className="ml-auto text-xl font-bold text-indigo-700">
                ${fare}
             </div>
          </div>

          <div className="space-y-3">
             <h4 className="font-semibold text-sm text-gray-700">Payment Method</h4>
             <div className="grid grid-cols-2 gap-3">
                {[
                  { id: PaymentMethod.CASH, label: 'Cash / COD', icon: '💵' },
                  { id: PaymentMethod.WALLET, label: 'Wallet', icon: '💳' },
                  { id: PaymentMethod.UPI, label: 'UPI', icon: '📱' },
                  { id: PaymentMethod.CARD, label: 'Card', icon: '💳' },
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setSelectedPayment(pm.id)}
                    className={`p-3 rounded-lg border text-sm font-medium cursor-pointer flex items-center gap-2 ${selectedPayment === pm.id ? 'border-indigo-600 bg-indigo-50 text-indigo-800' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                     <span>{pm.icon}</span> {pm.label}
                  </div>
                ))}
             </div>
          </div>

          <div className="flex gap-3 pt-4">
             <Button variant="ghost" className="flex-1" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
             <Button className="flex-1 shadow-lg" onClick={handleBook}>Confirm & Book</Button>
          </div>
        </div>
      </Modal>

      {/* Rating Modal */}
      <Modal
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        title="Rate Your Delivery"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
             <img src="https://picsum.photos/seed/driver1/100" className="w-14 h-14 rounded-full" />
          </div>
          <h3 className="font-bold text-lg mb-1">How was Mike Smith?</h3>
          <p className="text-gray-500 text-sm mb-6">Your feedback helps us improve.</p>
          
          <div className="flex justify-center gap-2 mb-6">
            {[1,2,3,4,5].map(star => (
              <Star key={star} className="w-8 h-8 text-yellow-400 fill-current cursor-pointer hover:scale-110 transition-transform" />
            ))}
          </div>
          
          <Button className="w-full" onClick={() => { setShowRating(false); resetBooking(); }}>Submit Review</Button>
        </div>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!viewOrder}
        onClose={() => setViewOrder(null)}
        title="Order Details"
      >
        {viewOrder && (
            <div className="space-y-4">
                {/* Header: ID and Status */}
                <div className="flex justify-between items-start border-b pb-3">
                    <div>
                        <p className="text-xs text-gray-500">Order ID</p>
                        <p className="font-mono font-bold text-gray-900">#{viewOrder.id}</p>
                    </div>
                    <StatusBadge status={viewOrder.status} />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-medium">{new Date(viewOrder.createdAt).toLocaleDateString()}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="text-sm font-medium">{new Date(viewOrder.createdAt).toLocaleTimeString()}</p>
                     </div>
                </div>

                {/* Locations */}
                <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    <div className="flex gap-2">
                        <div className="mt-1 min-w-[12px]"><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                        <div>
                            <p className="text-xs text-gray-500">Pickup</p>
                            <p className="text-sm text-gray-900 font-medium">{viewOrder.pickupAddress}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="mt-1 min-w-[12px]"><div className="w-3 h-3 rounded-full bg-red-500"></div></div>
                        <div>
                            <p className="text-xs text-gray-500">Drop Off</p>
                            <p className="text-sm text-gray-900 font-medium">{viewOrder.dropAddress}</p>
                        </div>
                    </div>
                </div>

                {/* Package Info */}
                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Package Details</h4>
                    <div className="flex justify-between text-sm text-gray-600 border rounded-lg p-3">
                        <div className="flex flex-col items-center">
                            <span className="text-lg">📦</span>
                            <span>{viewOrder.packageDetails.size}</span>
                        </div>
                        <div className="flex flex-col items-center border-l pl-4">
                            <span className="text-lg">⚖️</span>
                            <span>{viewOrder.packageDetails.weight} kg</span>
                        </div>
                        <div className="flex flex-col items-center border-l pl-4">
                            <span className="text-lg">{viewOrder.packageDetails.isFragile ? '🛡️' : '🗿'}</span>
                            <span>{viewOrder.packageDetails.isFragile ? 'Fragile' : 'Standard'}</span>
                        </div>
                    </div>
                </div>

                {/* Payment & OTP */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-indigo-50 p-3 rounded-lg">
                        <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Total Fare</p>
                        <p className="text-xl font-bold text-indigo-900">${viewOrder.fare}</p>
                        <p className="text-xs text-indigo-500">{viewOrder.paymentMethod}</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg flex flex-col justify-center items-center">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Delivery OTP</p>
                        <p className="text-xl font-mono font-bold text-gray-900 tracking-widest">{viewOrder.deliveryOtp}</p>
                    </div>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

// Simple briefcase icon helper for profile
const BriefcaseIcon = ({ className }: { className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

export default CustomerDashboard;
