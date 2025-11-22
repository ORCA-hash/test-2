
import React, { useState } from 'react';
import { Hexagon, Lock, Mail, ArrowRight, Loader2, Building, User } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthLoginProps {
  onLogin: (user: UserProfile) => void;
}

const AuthLogin: React.FC<AuthLoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<'agency' | 'client'>('agency');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate Backend Delay
    setTimeout(() => {
      if (persona === 'agency') {
        onLogin({
            id: 'u1',
            agencyName: 'Nexus Agency',
            userName: 'Alex Mitchell',
            email: 'alex@nexusagency.com',
            avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Mitchell&background=6366f1&color=fff',
            role: 'agency_admin'
        });
      } else {
        onLogin({
            id: 'u2',
            agencyName: 'Acme Corp',
            userName: 'Sarah Miller',
            email: 'sarah@acme.com',
            avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Miller&background=10b981&color=fff',
            role: 'client',
            companyName: 'Acme Corp'
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="flex items-center space-x-3 mb-8">
            <Hexagon className="w-12 h-12 fill-current" />
            <span className="text-4xl font-bold tracking-tight">NEXUS</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">The Operating System for Modern Agencies.</h2>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Streamline collaboration, automate reporting, and give your clients the transparency they deserve.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome to Portal</h2>
            <p className="text-slate-500 mt-2">Sign in to access your dashboard.</p>
          </div>

          {/* Persona Switcher for Demo */}
          <div className="bg-slate-100 p-1 rounded-lg flex mb-6">
             <button 
                onClick={() => setPersona('agency')}
                className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${persona === 'agency' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <Building className="w-4 h-4" /> Agency Admin
             </button>
             <button 
                onClick={() => setPersona('client')}
                className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${persona === 'client' ? 'bg-white shadow text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <User className="w-4 h-4" /> Client View
             </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email"
                  value={persona === 'agency' ? 'alex@nexusagency.com' : 'sarah@acme.com'}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password"
                  value="password123"
                  readOnly
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <span className="flex items-center gap-2">Sign in as {persona === 'agency' ? 'Admin' : 'Client'} <ArrowRight className="w-4 h-4" /></span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
            Protected by Enterprise SSO. <a href="#" className="font-bold text-indigo-600 hover:text-indigo-500">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
