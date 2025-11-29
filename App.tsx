import React, { useState } from 'react';
import Landing from './pages/Landing';
import CustomerDashboard from './pages/Customer';
import DriverDashboard from './pages/Driver';
import AdminDashboard from './pages/Admin';
import { UserRole, User, Driver } from './types';
import { authService } from './services/mockSupabase';
import { Modal, Input, Button } from './components/UI';

const App: React.FC = () => {
  const [user, setUser] = useState<User | Driver | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [targetRole, setTargetRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginStart = (role: UserRole) => {
    setTargetRole(role);
    setAuthStep('phone');
    setPhone('');
    setOtp('');
    setIsAuthModalOpen(true);
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    const isValid = await authService.verifyOtp(phone, otp);
    
    if (isValid) {
      const userData = await authService.login(phone, targetRole);
      setUser(userData);
      setIsAuthModalOpen(false);
    } else {
      alert('Invalid OTP (Try 1234)');
    }
    setIsLoading(false);
  };

  if (!user) {
    return (
      <>
        <Landing onLogin={handleLoginStart} />
        <Modal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          title={`Login as ${targetRole === UserRole.DRIVER ? 'Driver' : 'Customer'}`}
        >
          <div className="space-y-4">
            {authStep === 'phone' ? (
              <>
                <Input 
                  label="Phone Number" 
                  placeholder="+1 (555) 000-0000" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Button className="w-full" onClick={handleSendOtp} isLoading={isLoading}>
                  Send OTP
                </Button>
                <div className="text-xs text-gray-500 text-center mt-2">
                   For demo: Enter any number
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">Enter code sent to {phone}</p>
                </div>
                <Input 
                  label="OTP Code" 
                  placeholder="1234" 
                  className="text-center text-2xl tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                />
                <Button className="w-full" onClick={handleVerifyOtp} isLoading={isLoading}>
                  Verify & Login
                </Button>
                <div className="text-xs text-gray-500 text-center mt-2">
                   Demo Code: 1234
                </div>
              </>
            )}
          </div>
        </Modal>
      </>
    );
  }

  // Routing based on Role
  switch (user.role) {
    case UserRole.DRIVER:
      return <DriverDashboard user={user as Driver} />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    case UserRole.CUSTOMER:
    default:
      return <CustomerDashboard user={user} />;
  }
};

export default App;