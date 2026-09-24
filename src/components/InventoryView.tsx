import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  Package,
  Plus,
  Minus,
  Edit2,
  Trash2,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowUpDown,
  ShoppingCart,
  TrendingUp,
  XCircle,
  Tag
} from 'lucide-react';
import { StationeryItem, StationeryCategory } from '../types';
import { CATEGORIES } from '../data/initialInventory';

interface InventoryViewProps {
  items: StationeryItem[];
  onSellOne: (item: StationeryItem) => void;
  onRestock: (itemId: string, amount: number) => void;
  onEditItem: (item: StationeryItem) => void;
  onDeleteItem: (itemId: string) => void;
  onAddToCart: (item: StationeryItem) => void;
  onOpenAddItem: () => void;
  onNavigateToBilling: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  onSellOne,
  onRestock,
  onEditItem,
  onDeleteItem,
  onAddToCart,
  onOpenAddItem,
  onNavigateToBilling,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [restockAmountInput, setRestockAmountInput] = useState<{ [id: string]: number }>({});
  const [activeRestockId, setActiveRestockId] = useState<string | null>(null);

  // Statistics
  const totalItemsCount = items.length;
  const totalStockUnits = items.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockItems = items.filter((i) => i.stock > 0 && i.stock <= i.minThreshold);
  const outOfStockItems = items.filter((i) => i.stock === 0);
  const totalRetailValue = items.reduce((acc, curr) => acc + curr.stock * curr.sellingPrice, 0);

  // Filtering
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'low'
        ? item.stock > 0 && item.stock <= item.minThreshold
        : item.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleCustomRestock = (itemId: string) => {
    const amount = restockAmountInput[itemId] || 5;
    if (amount > 0) {
      onRestock(itemId, amount);
      setActiveRestockId(null);
      setRestockAmountInput((prev) => ({ ...prev, [itemId]: 5 }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Shopkeeper Dashboard Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Stock Units */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Stock on Shelves</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-white">{totalStockUnits}</span>
            <span className="text-xs text-slate-400">units total</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across {totalItemsCount} stationery catalog items</div>
        </div>

        {/* Low Stock Alert Card */}
        <button
          onClick={() => setStockFilter(stockFilter === 'low' ? 'all' : 'low')}
          className={`text-left rounded-xl p-4 transition-all border cursor-pointer ${
            stockFilter === 'low'
              ? 'bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/40'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Low Stock Warnings</span>
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-300">{lowStockItems.length}</span>
            <span className="text-xs text-amber-400/80">items</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {lowStockItems.length > 0 ? 'Click to filter items needing restock' : 'All stock levels healthy'}
          </div>
        </button>

        {/* Out of Stock Card */}
        <button
          onClick={() => setStockFilter(stockFilter === 'out' ? 'all' : 'out')}
          className={`text-left rounded-xl p-4 transition-all border cursor-pointer ${
            stockFilter === 'out'
              ? 'bg-rose-500/15 border-rose-500/60 ring-1 ring-rose-500/40'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Out of Stock</span>
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-rose-400">{outOfStockItems.length}</span>
            <span className="text-xs text-rose-400/80">items</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {outOfStockItems.length > 0 ? 'Urgent supplier order required' : 'No zero-stock items'}
          </div>
        </button>

        {/* Total Inventory Retail Value */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Est. Retail Inventory</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400">
              ₹{totalRetailValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Current shelf retail potential</div>
        </div>
      </div>

      {/* Control Bar: Search, Category Chips, Stock Filter & Quick POS Jump */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="inventory-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by stationery item name, SKU (e.g. PILOT-G2), or category..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick POS & Add Item Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              id="jump-to-billing-btn"
              onClick={onNavigateToBilling}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Customer Checkout Desk</span>
            </button>
            <button
              id="inv-add-item-btn"
              onClick={onOpenAddItem}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-medium shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Stationery Item</span>
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <span className="text-slate-500 font-medium pl-1 flex items-center space-x-1 shrink-0">
            <Tag className="w-3 h-3" />
            <span>Category:</span>
          </span>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Categories ({items.length})
          </button>
          {CATEGORIES.map((cat) => {
            const catCount = items.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg shrink-0 font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat} ({catCount})
              </button>
            );
          })}
        </div>

        {/* Active Filter Indicators */}
        {(stockFilter !== 'all' || selectedCategory !== 'All' || searchTerm) && (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>
              Showing {filteredItems.length} of {items.length} items
              {stockFilter === 'low' && ' (Filtered by: Low Stock)'}
              {stockFilter === 'out' && ' (Filtered by: Out of Stock)'}
              {selectedCategory !== 'All' && ` (Category: ${selectedCategory})`}
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setStockFilter('all');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">SKU / Item</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold text-right">Cost Price</th>
                <th className="py-3.5 px-4 font-semibold text-right">Selling Price</th>
                <th className="py-3.5 px-4 font-semibold text-center">Available Stock</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-center">Quick Stock Operations</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-base font-medium text-slate-400">No stationery items match your query</p>
                    <p className="text-xs text-slate-600 mt-1">Try resetting the search or category filters</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isOutOfStock = item.stock === 0;
                  const isLowStock = item.stock > 0 && item.stock <= item.minThreshold;
                  const isRestocking = activeRestockId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isOutOfStock
                          ? 'bg-rose-950/10'
                          : isLowStock
                          ? 'bg-amber-950/10'
                          : ''
                      }`}
                    >
                      {/* Item Details with Image Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center relative shadow-sm">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <Package className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{item.name}</div>
                            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                              <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-slate-300 border border-slate-800">
                                {item.sku}
                              </span>
                              <span>•</span>
                              <span>Unit: {item.unit}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
                          {item.category}
                        </span>
                      </td>

                      {/* Cost Price */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-xs sm:text-sm">
                        ₹{item.costPrice.toFixed(2)}
                      </td>

                      {/* Selling Price */}
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-400 text-sm">
                        ₹{item.sellingPrice.toFixed(2)}
                      </td>

                      {/* Current Stock Count */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span
                            className={`font-mono text-base font-bold ${
                              isOutOfStock
                                ? 'text-rose-400'
                                : isLowStock
                                ? 'text-amber-400'
                                : 'text-slate-100'
                            }`}
                          >
                            {item.stock} {item.unit}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Min Alert: {item.minThreshold}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                            <XCircle className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low Stock ({item.stock} left)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>In Stock</span>
                          </span>
                        )}
                      </td>

                      {/* Direct Stock Operations for Shopkeeper */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* QUICK SELL 1 (Immediately decrements stock by 1) */}
                          <button
                            id={`sell-one-${item.id}`}
                            onClick={() => onSellOne(item)}
                            disabled={isOutOfStock}
                            title={isOutOfStock ? 'Cannot sell, stock is 0' : `Instantly sell 1 ${item.name} and reduce stock`}
                            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                              isOutOfStock
                                ? 'bg-slate-800 text-slate-600 border border-slate-700/40 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white'
                            }`}
                          >
                            <Minus className="w-3 h-3" />
                            <span>Sell 1</span>
                          </button>

                          {/* Quick Restock Menu */}
                          {isRestocking ? (
                            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-indigo-500/50">
                              <input
                                type="number"
                                min="1"
                                value={restockAmountInput[item.id] || 10}
                                onChange={(e) =>
                                  setRestockAmountInput({
                                    ...restockAmountInput,
                                    [item.id]: parseInt(e.target.value) || 1,
                                  })
                                }
                                className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-center text-white"
                              />
                              <button
                                onClick={() => handleCustomRestock(item.id)}
                                className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium rounded"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => setActiveRestockId(null)}
                                className="px-1.5 text-slate-400 hover:text-slate-200 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => onRestock(item.id, 5)}
                                title="Add 5 units of stock"
                                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                              >
                                +5
                              </button>
                              <button
                                onClick={() => onRestock(item.id, 10)}
                                title="Add 10 units of stock"
                                className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                              >
                                +10
                              </button>
                              <button
                                onClick={() => {
                                  setActiveRestockId(item.id);
                                  setRestockAmountInput((prev) => ({ ...prev, [item.id]: 20 }));
                                }}
                                title="Add custom restock amount"
                                className="px-2 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-800/50 rounded-lg text-xs font-medium transition-colors"
                              >
                                +Custom
                              </button>
                            </div>
                          )}

                          {/* Add to Customer Cart (POS) */}
                          <button
                            onClick={() => onAddToCart(item)}
                            disabled={isOutOfStock}
                            title="Add to Customer Checkout Cart"
                            className={`p-1.5 rounded-lg border text-xs transition-colors ${
                              isOutOfStock
                                ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white cursor-pointer'
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Edit / Delete Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            id={`edit-item-${item.id}`}
                            onClick={() => onEditItem(item)}
                            title="Edit stationery item details & stock"
                            className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-item-${item.id}`}
                            onClick={() => onDeleteItem(item.id)}
                            title="Delete stationery item"
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
