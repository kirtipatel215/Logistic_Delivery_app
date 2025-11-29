import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { OrderStatus, VehicleType } from '../types';

interface TrackingMapProps {
  status: OrderStatus;
  vehicleType: VehicleType;
  className?: string;
  showEta?: boolean;
}

export const TrackingMap: React.FC<TrackingMapProps> = ({ status, vehicleType, className = '', showEta = true }) => {
  // Coordinates in percentage (0-100)
  const COORDS = {
    DRIVER_START: { x: 10, y: 10 },
    PICKUP: { x: 30, y: 50 },
    DROP: { x: 80, y: 70 },
  };

  const getDriverPosition = () => {
    switch (status) {
      case OrderStatus.DRIVER_ARRIVED:
        return COORDS.PICKUP;
      case OrderStatus.PICKED_UP:
        return COORDS.PICKUP;
      case OrderStatus.IN_TRANSIT:
        return { x: 55, y: 60 }; // Midway
      case OrderStatus.COMPLETED:
        return COORDS.DROP;
      default:
        return COORDS.DRIVER_START;
    }
  };

  const getTransitionDuration = () => {
    switch (status) {
      case OrderStatus.ACCEPTED: return 5; 
      case OrderStatus.IN_TRANSIT: return 8; 
      default: return 2;
    }
  };

  const targetPos = getDriverPosition();

  // Helper to determine vehicle icon
  const getVehicleIcon = () => {
     if (vehicleType === VehicleType.BIKE) return '🏍️';
     if (vehicleType === VehicleType.AUTO) return '🛺';
     if (vehicleType === VehicleType.LOGISTICS_VAN) return '🚐';
     return '🚗';
  };

  return (
    <div className={`w-full h-full relative bg-indigo-50 overflow-hidden rounded-xl border border-indigo-100 ${className}`}>
      {/* Abstract Map Background (Roads) */}
      <svg className="absolute inset-0 w-full h-full text-indigo-200/50" preserveAspectRatio="none">
        <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Decorative Roads */}
        <path d="M -10 20 Q 50 20 50 50 T 110 80" stroke="white" strokeWidth="20" fill="none" />
        <path d="M 30 110 L 30 -10" stroke="white" strokeWidth="15" fill="none" />
        <path d="M 0 70 L 100 70" stroke="white" strokeWidth="12" fill="none" />
      </svg>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
         <line 
            x1={`${COORDS.DRIVER_START.x}%`} y1={`${COORDS.DRIVER_START.y}%`}
            x2={`${COORDS.PICKUP.x}%`} y2={`${COORDS.PICKUP.y}%`}
            stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4"
            className="opacity-50"
         />
         <line 
            x1={`${COORDS.PICKUP.x}%`} y1={`${COORDS.PICKUP.y}%`}
            x2={`${COORDS.DROP.x}%`} y2={`${COORDS.DROP.y}%`}
            stroke="#4F46E5" strokeWidth="3" strokeDasharray="6" 
            strokeLinecap="round"
         />
      </svg>

      {/* Locations */}
      <div 
        className="absolute w-8 h-8 -ml-4 -mt-8 flex flex-col items-center z-10"
        style={{ left: `${COORDS.PICKUP.x}%`, top: `${COORDS.PICKUP.y}%` }}
      >
        <div className="bg-white p-1 rounded-full shadow-md">
           <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="bg-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm mt-1 whitespace-nowrap">Pickup</div>
      </div>

      <div 
        className="absolute w-8 h-8 -ml-4 -mt-8 flex flex-col items-center z-10"
        style={{ left: `${COORDS.DROP.x}%`, top: `${COORDS.DROP.y}%` }}
      >
         <MapPin className="w-6 h-6 text-red-500 drop-shadow-md" fill="currentColor" />
         <div className="bg-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm mt-1 whitespace-nowrap">Drop</div>
      </div>

      {/* Moving Driver */}
      <AnimatePresence>
        {status !== OrderStatus.SEARCHING && (
           <motion.div
             initial={{ left: `${COORDS.DRIVER_START.x}%`, top: `${COORDS.DRIVER_START.y}%` }}
             animate={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
             transition={{ duration: getTransitionDuration(), ease: "easeInOut" }}
             className="absolute w-12 h-12 -ml-6 -mt-6 z-20 flex flex-col items-center justify-center"
           >
              <div className="relative">
                 <div className="text-3xl filter drop-shadow-lg transform -scale-x-100">
                    {getVehicleIcon()}
                 </div>
                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-black/20 blur-sm rounded-full"></div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* ETA Card Overlay */}
      {showEta && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-lg rounded-lg p-3 z-30 max-w-[150px]">
           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
           <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${status === OrderStatus.SEARCHING ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
              <span className="text-sm font-bold text-gray-800">{status.replace('_', ' ')}</span>
           </div>
        </div>
      )}
    </div>
  );
};