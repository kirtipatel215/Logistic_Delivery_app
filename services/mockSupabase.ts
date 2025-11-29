import { User, UserRole, Driver, Order, OrderStatus, VehicleType, PackageDetails, PackageSize, PaymentMethod } from '../types';

// --- Mock Data ---

const MOCK_USER: User = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  role: UserRole.CUSTOMER,
  avatarUrl: 'https://picsum.photos/seed/user1/200',
  walletBalance: 150.00
};

const MOCK_DRIVER: Driver = {
  id: 'driver-456',
  name: 'Mike Smith',
  email: 'mike@driver.com',
  phone: '+0987654321',
  role: UserRole.DRIVER,
  vehicleType: VehicleType.BIKE,
  vehicleNumber: 'KA-01-AB-1234',
  isOnline: false,
  rating: 4.8,
  totalTrips: 1542,
  todayEarnings: 85.50,
  documentsVerified: true,
  avatarUrl: 'https://picsum.photos/seed/driver1/200'
};

const MOCK_ADMIN: User = {
  id: 'admin-000',
  name: 'Admin User',
  email: 'admin@swift.com',
  phone: '0000',
  role: UserRole.ADMIN
};

// --- Service Logic ---

export const authService = {
  login: async (email: string, role: UserRole = UserRole.CUSTOMER): Promise<User | Driver> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (role === UserRole.DRIVER) resolve(MOCK_DRIVER);
        else if (role === UserRole.ADMIN) resolve(MOCK_ADMIN);
        else resolve(MOCK_USER);
      }, 1000);
    });
  },
  
  verifyOtp: async (phone: string, otp: string): Promise<boolean> => {
    return new Promise((resolve) => setTimeout(() => resolve(otp === '1234'), 800));
  }
};

export const orderService = {
  calculateFare: async (distKm: number, vehicle: VehicleType): Promise<number> => {
    // Mock fare logic
    const rates = {
      [VehicleType.BIKE]: 5,
      [VehicleType.AUTO]: 10,
      [VehicleType.CAR_PREMIUM]: 20,
      [VehicleType.LOGISTICS_VAN]: 35
    };
    return Math.round(distKm * rates[vehicle] + 20); // Base fare 20
  },

  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder: Order = {
          id: `ord-${Math.floor(Math.random() * 10000)}`,
          customerId: MOCK_USER.id,
          pickupAddress: orderData.pickupAddress || '',
          dropAddress: orderData.dropAddress || '',
          pickupCoords: orderData.pickupCoords || { lat: 0, lng: 0 },
          dropCoords: orderData.dropCoords || { lat: 0, lng: 0 },
          vehicleType: orderData.vehicleType || VehicleType.BIKE,
          packageDetails: orderData.packageDetails || {
            size: PackageSize.SMALL,
            weight: 1,
            isFragile: false
          },
          fare: orderData.fare || 0,
          distance: orderData.distance || 5,
          status: OrderStatus.SEARCHING,
          paymentMethod: orderData.paymentMethod || PaymentMethod.CASH,
          deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
          createdAt: new Date().toISOString()
        };
        resolve(newOrder);
      }, 1500);
    });
  },

  assignDriver: async (orderId: string): Promise<Driver> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_DRIVER);
      }, 3000); // Simulate searching time
    });
  },

  getOrders: async (): Promise<Order[]> => {
    // Returns dummy history
    return [
      {
        id: 'ord-888',
        customerId: 'user-123',
        pickupAddress: 'Central Station',
        dropAddress: 'Tech Park, Gate 4',
        pickupCoords: { lat: 0, lng: 0 },
        dropCoords: { lat: 0, lng: 0 },
        vehicleType: VehicleType.AUTO,
        packageDetails: { size: PackageSize.MEDIUM, weight: 5, isFragile: false },
        fare: 150,
        distance: 12.5,
        status: OrderStatus.COMPLETED,
        paymentMethod: PaymentMethod.UPI,
        deliveryOtp: '1234',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'ord-777',
        customerId: 'user-123',
        pickupAddress: 'Home',
        dropAddress: 'Downtown Mall',
        pickupCoords: { lat: 0, lng: 0 },
        dropCoords: { lat: 0, lng: 0 },
        vehicleType: VehicleType.BIKE,
        packageDetails: { size: PackageSize.SMALL, weight: 1, isFragile: false },
        fare: 45,
        distance: 4.2,
        status: OrderStatus.COMPLETED,
        paymentMethod: PaymentMethod.CASH,
        deliveryOtp: '5678',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  }
};

export const driverService = {
  getHistory: async (driverId: string): Promise<Order[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 'ord-101',
                    customerId: 'cust-55',
                    pickupAddress: 'Tech Park, Gate 1',
                    dropAddress: 'City Mall',
                    pickupCoords: { lat: 0, lng: 0 },
                    dropCoords: { lat: 0, lng: 0 },
                    vehicleType: VehicleType.BIKE,
                    packageDetails: { size: PackageSize.SMALL, weight: 1, isFragile: false },
                    fare: 45,
                    distance: 5.5,
                    status: OrderStatus.COMPLETED,
                    paymentMethod: PaymentMethod.CASH,
                    deliveryOtp: '0000',
                    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
                    completedAt: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: 'ord-98',
                    customerId: 'cust-32',
                    pickupAddress: 'Central Station',
                    dropAddress: 'Residency Road',
                    pickupCoords: { lat: 0, lng: 0 },
                    dropCoords: { lat: 0, lng: 0 },
                    vehicleType: VehicleType.BIKE,
                    packageDetails: { size: PackageSize.MEDIUM, weight: 3, isFragile: true },
                    fare: 80,
                    distance: 8.2,
                    status: OrderStatus.COMPLETED,
                    paymentMethod: PaymentMethod.UPI,
                    deliveryOtp: '0000',
                    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                    completedAt: new Date(Date.now() - 86400000 + 1800000).toISOString()
                }
            ]);
        }, 800);
    })
  }
};