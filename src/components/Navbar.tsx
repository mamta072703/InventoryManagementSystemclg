import React from 'react';
import {
  Boxes,
  ShoppingCart,
  Receipt,
  PlusCircle,
  AlertTriangle,
  LogOut,
  Store,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import { ShopkeeperUser } from '../types';

interface NavbarProps {
  user: ShopkeeperUser;
  activeTab: 'inventory' | 'billing' | 'sales';
  setActiveTab: (tab: 'inventory' | 'billing' | 'sales') => void;
  lowStockCount: number;
  cartCount: number;
  onOpenAddItem: () => void;
  onLogout: () => void;
  onResetStock: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  lowStockCount,
  cartCount,
  onOpenAddItem,
  onLogout,
  onResetStock,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Bar: Store Information & User Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Store Name */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-base sm:text-lg text-slate-100 tracking-tight leading-none">
                  {user.shopName}
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  Shopkeeper
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                Stationery Inventory & Customer Stock Counter
              </p>
            </div>
          </div>

          {/* Quick Actions & Shopkeeper Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Reset Sample Stock button */}
            <button
              id="reset-stock-btn"
              onClick={onResetStock}
              title="Reset inventory to initial default stationery stock"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg text-xs flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">Reset Stock</span>
            </button>

            {/* Add New Item Button */}
            <button
              id="nav-add-item-btn"
              onClick={onOpenAddItem}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-medium shadow-sm transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Item</span>
            </button>

            {/* Shopkeeper Tag */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-200 font-medium">{user.ownerName}</span>
              <span className="text-slate-400">({user.role})</span>
            </div>

            {/* Logout Button */}
            <button
              id="nav-logout-btn"
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs transition-colors flex items-center space-x-1 cursor-pointer"
              title="Sign out of Shopkeeper system"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-t border-slate-800/80 pt-2 pb-2">
          {/* Inventory Tab */}
          <button
            id="tab-inventory-btn"
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Stock Inventory</span>
            {lowStockCount > 0 && (
              <span
                title={`${lowStockCount} items need restocking`}
                className="flex items-center space-x-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold animate-pulse"
              >
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>{lowStockCount}</span>
              </span>
            )}
          </button>

          {/* Customer Billing / POS Tab */}
          <button
            id="tab-billing-btn"
            onClick={() => setActiveTab('billing')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'billing'
                ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Customer Billing / Quick Sell</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Sales & Receipts Tab */}
          <button
            id="tab-sales-btn"
            onClick={() => setActiveTab('sales')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Sales History & Receipts</span>
          </button>
        </div>
      </div>
    </header>
  );
};
