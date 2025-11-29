export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN'
}

export enum VehicleType {
  BIKE = 'BIKE',
  AUTO = 'AUTO',
  CAR_PREMIUM = 'CAR_PREMIUM',
  LOGISTICS_VAN = 'LOGISTICS_VAN'
}

export enum OrderStatus {
  PENDING = 'PENDING',         // Created, waiting for driver search
  SEARCHING = 'SEARCHING',     // System finding driver
  ACCEPTED = 'ACCEPTED',       // Driver assigned
  DRIVER_ARRIVED = 'DRIVER_ARRIVED', 
  PICKED_UP = 'PICKED_UP',     // Package with driver
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PackageSize {
  SMALL = 'SMALL',   // Documents, Keys
  MEDIUM = 'MEDIUM', // Groceries, Laptop
  LARGE = 'LARGE'    // Furniture, Boxes
}

export interface PackageDetails {
  size: PackageSize;
  weight: number; // in kg
  isFragile: boolean;
  description?: string;
  imageUrl?: string;
}

export enum PaymentMethod {
  CASH = 'CASH',
  WALLET = 'WALLET',
  UPI = 'UPI',
  CARD = 'CARD'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  walletBalance?: number;
}

export interface Driver extends User {
  isOnline: boolean;
  vehicleType: VehicleType;
  vehicleNumber: string;
  rating: number;
  totalTrips: number;
  todayEarnings: number;
  documentsVerified: boolean;
  currentLocation?: { lat: number; lng: number };
}

export interface Order {
  id: string;
  customerId: string;
  driverId?: string;
  pickupAddress: string;
  dropAddress: string;
  pickupCoords: { lat: number; lng: number };
  dropCoords: { lat: number; lng: number };
  
  // Package Details
  packageDetails: PackageDetails;
  
  // Vehicle & Fare
  vehicleType: VehicleType;
  fare: number;
  distance: number; // in km
  
  // Status & Workflow
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryOtp: string; // 4 digit code
  
  // Proofs
  pickupPhotoUrl?: string;
  deliveryPhotoUrl?: string;
  
  createdAt: string;
  completedAt?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}