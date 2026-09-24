import React, { useState } from 'react';
import { Lock, User, Store, ShieldCheck, KeyRound, ArrowRight, BookOpen } from 'lucide-react';
import { ShopkeeperUser } from '../types';

interface LoginViewProps {
  onLogin: (user: ShopkeeperUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('shopkeeper');
  const [password, setPassword] = useState('stationery123');
  const [shopName, setShopName] = useState('Crown Stationery & Book Mart');
  const [role, setRole] = useState<'Store Owner' | 'Manager' | 'Cashier'>('Store Owner');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your shopkeeper username');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    onLogin({
      username: username.trim(),
      shopName: shopName.trim() || 'Stationery Shop',
      ownerName: username.charAt(0).toUpperCase() + username.slice(1),
      role,
      isLoggedIn: true,
    });
  };

  const handleQuickDemo = () => {
    setUsername('rajesh_owner');
    setPassword('stationery123');
    setShopName('Crown Stationery & Book Mart');
    setRole('Store Owner');
    onLogin({
      username: 'rajesh_owner',
      shopName: 'Crown Stationery & Book Mart',
      ownerName: 'Rajesh Sharma',
      role: 'Store Owner',
      isLoggedIn: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Background ambient gradient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-950/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-950/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/20 mb-4 border border-indigo-400/30">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            Stationery Shopkeeper Portal
          </h1>
          <p className="text-sm text-slate-400">
            Internal inventory & stock management system for store managers
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center space-x-2 text-indigo-400 text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Shopkeeper Sign-In</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-mono">
              Staff Portal
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Stationery Store Name
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="login-shop-name"
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Crown Stationery & Book Mart"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Shopkeeper Username / ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="shopkeeper"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password / Store PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Staff Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Store Owner', 'Manager', 'Cashier'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all ${
                      role === r
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full mt-2 flex items-center justify-center space-x-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <span>Access Store Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <button
              id="quick-demo-login-btn"
              type="button"
              onClick={handleQuickDemo}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Shopkeeper Demo Login</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Default credentials prefilled for testing: <span className="text-slate-400 font-mono">shopkeeper</span> / <span className="text-slate-400 font-mono">stationery123</span>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Stationery Shop Internal Point-of-Sale & Stock Management
        </p>
      </div>
    </div>
  );
};
