import React from 'react';
import { motion, Variants } from 'framer-motion';
import { MapPin, Shield, Zap, Truck, ArrowRight, Smartphone, Clock, Globe, CheckCircle } from 'lucide-react';
import { Button } from '../components/UI';
import { UserRole } from '../types';

interface LandingProps {
  onLogin: (role: UserRole) => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const stagger: Variants = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-900 overflow-x-hidden">
      
      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              <span className="text-xl">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">SwiftDispatch</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#driver" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">For Drivers</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onLogin(UserRole.DRIVER)} className="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
              Partner Login
            </button>
            <Button onClick={() => onLogin(UserRole.CUSTOMER)} size="sm" className="shadow-lg shadow-indigo-200">
              Book Now
            </Button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-pulse"></div>
          <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-cyan-100/40 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                Now Live in 50+ Cities
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                Deliver faster <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">than instant.</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                The enterprise-grade logistics platform for everyone. Send packages, track in real-time, and manage deliveries with precision.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={() => onLogin(UserRole.CUSTOMER)} 
                  size="lg" 
                  className="px-8 h-14 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all hover:scale-105"
                >
                  Start Delivery
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  onClick={() => onLogin(UserRole.DRIVER)} 
                  variant="outline" 
                  size="lg"
                  className="px-8 h-14 text-lg border-2 hover:bg-gray-50 transition-all hover:scale-105"
                >
                  Become a Driver
                </Button>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-gray-400">
                 <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                    <Globe className="w-5 h-5" /> <span>Global Scale</span>
                 </div>
                 <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                    <Shield className="w-5 h-5" /> <span>Insured</span>
                 </div>
                 <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                    <Zap className="w-5 h-5" /> <span>Instant</span>
                 </div>
              </motion.div>
            </motion.div>
            
            {/* Right Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10">
                 <img 
                   src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1000" 
                   alt="App Dashboard" 
                   className="rounded-3xl shadow-2xl border-[8px] border-white"
                 />
                 
                 {/* Floating Cards */}
                 <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                   className="absolute -bottom-8 -left-8 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 max-w-xs"
                 >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                       <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="text-sm text-gray-500">Status</p>
                       <p className="font-bold text-gray-900">Package Delivered</p>
                    </div>
                 </motion.div>

                 <motion.div 
                   animate={{ y: [0, 10, 0] }}
                   transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                   className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden sm:block"
                 >
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                       <p className="text-xs font-bold text-gray-500 uppercase">Live Tracking</p>
                    </div>
                    <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="w-2/3 h-full bg-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-right text-xs font-bold text-indigo-600 mt-1">8 mins away</p>
                 </motion.div>
              </div>
              
              {/* Decorative Blob Behind Image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-200 to-cyan-200 rounded-full blur-3xl opacity-30 -z-10"></div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section className="bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 py-12">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
              {[
                { label: 'Active Users', value: '2M+' },
                { label: 'Cities Covered', value: '50+' },
                { label: 'Daily Trips', value: '150k' },
                { label: 'Avg Delivery Time', value: '24m' },
              ].map((stat, i) => (
                <div key={i} className="px-4">
                   <h3 className="text-3xl lg:text-4xl font-extrabold text-indigo-600 mb-1">{stat.value}</h3>
                   <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- Features Section (Bento Grid) --- */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to move things.</h2>
            <p className="text-gray-600 text-lg">Powerful features built for speed, reliability, and scale.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Feature 1: Large */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-2 row-span-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group"
            >
               <div className="relative z-10 max-w-md">
                 <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <MapPin className="w-6 h-6" />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Precision Tracking</h3>
                 <p className="text-gray-600">Watch your delivery move on the map pixel-by-pixel. Share live links with recipients for seamless coordination.</p>
               </div>
               <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-indigo-50 to-transparent opacity-50"></div>
               {/* Abstract Map Lines */}
               <svg className="absolute top-0 right-0 h-full w-1/2 opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 Q 50 50 100 0" stroke="currentColor" strokeWidth="2" fill="none" />
               </svg>
            </motion.div>

            {/* Feature 2: Tall */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-1 row-span-2 bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden"
            >
               <div className="relative z-10 h-full flex flex-col">
                 <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-white" />
                 </div>
                 <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
                 <p className="text-indigo-200 mb-auto">Our AI routing algorithm predicts traffic patterns to find the absolute fastest route.</p>
                 
                 <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-3xl font-bold">12<span className="text-sm font-normal text-indigo-200 ml-1">mins</span></span>
                       <span className="text-xs text-indigo-300">Avg Pickup</span>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-cyan-400 w-[80%] h-full rounded-full"></div>
                    </div>
                 </div>
               </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 group"
            >
                 <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-600 mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                    <Truck className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Fleet Diversity</h3>
                 <p className="text-gray-600 text-sm">Bikes for documents, autos for groceries, and vans for furniture.</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
               whileHover={{ y: -5 }}
               className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 group"
            >
                 <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Shield className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Fully Insured</h3>
                 <p className="text-gray-600 text-sm">Every package is insured up to $5,000. Peace of mind included.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- How it works --- */}
      <section id="how-it-works" className="py-24 bg-white border-t border-gray-100">
         <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16 items-center">
               <div className="md:w-1/2">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Simple. Transparent. Reliable.</h2>
                  <div className="space-y-8">
                     {[
                        { title: "Book in seconds", desc: "Set pickup & drop location. Choose your vehicle. Done.", icon: Smartphone },
                        { title: "We assign the best", desc: "Nearest top-rated driver is assigned instantly.", icon: UserRole },
                        { title: "Track & Relax", desc: "Live updates until the package is safely delivered.", icon: Clock },
                     ].map((step, i) => (
                        <div key={i} className="flex gap-4">
                           <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                              {i + 1}
                           </div>
                           <div>
                              <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
                              <p className="text-gray-600 mt-1">{step.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="md:w-1/2">
                  <div className="bg-gray-100 rounded-[3rem] p-8 relative">
                     <img 
                        src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000" 
                        className="rounded-[2rem] shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500" 
                        alt="Mobile App"
                     />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20">
         <div className="container mx-auto px-6">
            <div className="bg-indigo-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
               {/* Background Glows */}
               <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 blur-[100px] opacity-50 rounded-full"></div>
                  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600 blur-[100px] opacity-50 rounded-full"></div>
               </div>

               <div className="relative z-10 max-w-3xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to move faster?</h2>
                  <p className="text-indigo-200 text-lg mb-10">Join millions who trust SwiftDispatch for their daily logistics. Sign up today and get your first delivery free.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <Button onClick={() => onLogin(UserRole.CUSTOMER)} size="lg" className="h-14 px-8 text-lg bg-white text-indigo-900 hover:bg-gray-100">
                        Get Started Now
                     </Button>
                     <Button onClick={() => onLogin(UserRole.DRIVER)} variant="outline" size="lg" className="h-14 px-8 text-lg text-white border-white hover:bg-white/10">
                        Partner with us
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold text-gray-900">SwiftDispatch</span>
          </div>
          <div className="text-sm text-gray-500">
             © 2024 SwiftDispatch Logistics Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
             <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">Privacy</a>
             <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">Terms</a>
             <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;