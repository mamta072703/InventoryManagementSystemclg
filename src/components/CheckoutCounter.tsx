import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  QrCode,
  CreditCard,
  Banknote,
  Package,
  Receipt,
  User,
  ArrowRight
} from 'lucide-react';
import { StationeryItem, CartItem, SaleTransaction } from '../types';
import { CATEGORIES } from '../data/initialInventory';

interface CheckoutCounterProps {
  items: StationeryItem[];
  cart: CartItem[];
  onAddToCart: (item: StationeryItem) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onClearCart: () => void;
  onCheckoutComplete: (transaction: SaleTransaction) => void;
}

export const CheckoutCounter: React.FC<CheckoutCounterProps> = ({
  items,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCheckoutComplete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI / QR' | 'Card'>('Cash');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string>('');

  // Catalog items filtered
  const filteredCatalog = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Subtotal & Totals
  const rawSubtotal = cart.reduce(
    (sum, ci) => sum + ci.item.sellingPrice * ci.quantity,
    0
  );
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const grandTotal = Math.max(0, rawSubtotal - discountAmount);
  const totalItemsCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  // Handle Checkout Execution
  const handleProcessCheckout = () => {
    setCheckoutError('');

    if (cart.length === 0) {
      setCheckoutError('Bill is empty. Select items from the catalog on the left to add.');
      return;
    }

    // Verify all cart items have enough stock in real-time
    for (const cartItem of cart) {
      const currentItemInStore = items.find((i) => i.id === cartItem.item.id);
      if (!currentItemInStore || currentItemInStore.stock < cartItem.quantity) {
        setCheckoutError(
          `Insufficient stock for "${cartItem.item.name}". Available: ${
            currentItemInStore?.stock ?? 0
          }, in cart: ${cartItem.quantity}`
        );
        return;
      }
    }

    // Generate Invoice / Transaction
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    const transaction: SaleTransaction = {
      id: `sale-${Date.now()}`,
      invoiceNumber,
      timestamp: new Date().toISOString(),
      customerName: customerName.trim() || 'Walk-in Customer',
      items: cart.map((ci) => ({
        itemId: ci.item.id,
        name: ci.item.name,
        category: ci.item.category,
        unitPrice: ci.item.sellingPrice,
        quantity: ci.quantity,
        subtotal: ci.item.sellingPrice * ci.quantity,
        imageUrl: ci.item.imageUrl,
      })),
      totalQuantity: totalItemsCount,
      totalAmount: grandTotal,
      paymentMethod,
    };

    onCheckoutComplete(transaction);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: Fast Stationery Catalog Picker (7 cols on lg) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Catalog Header & Search */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Package className="w-4 h-4 text-indigo-400" />
              <span>Stationery Catalog - Select to Add</span>
            </h2>
            <span className="text-xs text-slate-400">Click item card to ring up</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              id="billing-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pens, notebooks, stapler, files..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Chips */}
          <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stationery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[640px] overflow-y-auto pr-1">
          {filteredCatalog.map((item) => {
            const inCart = cart.find((ci) => ci.item.id === item.id);
            const isOutOfStock = item.stock <= 0;
            const remainingStock = inCart ? item.stock - inCart.quantity : item.stock;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (remainingStock > 0) {
                    onAddToCart(item);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isOutOfStock || remainingStock <= 0
                    ? 'bg-slate-950/60 border-slate-800/80 opacity-60 cursor-not-allowed'
                    : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/70 hover:shadow-lg hover:shadow-indigo-950/30 cursor-pointer active:scale-[0.98]'
                }`}
              >
                {/* Image & Top Info */}
                <div>
                  <div className="w-full h-28 mb-2.5 rounded-lg bg-slate-950 border border-slate-800/80 overflow-hidden relative flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Package className="w-8 h-8 text-slate-600" />
                    )}
                    <span className="absolute top-1.5 left-1.5 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-900/85 text-slate-300 border border-slate-800/80 backdrop-blur-xs">
                      {item.sku}
                    </span>
                    <span className="absolute top-1.5 right-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-950/85 text-indigo-300 border border-indigo-800/80">
                      {item.unit}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white text-xs sm:text-sm line-clamp-2 leading-tight mb-2">
                    {item.name}
                  </h3>
                </div>

                {/* Bottom: Price in Rupees & Stock Status */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    ₹{item.sellingPrice.toFixed(2)}
                  </div>

                  {/* Stock counter */}
                  <div>
                    {item.stock <= 0 ? (
                      <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                        Out of stock
                      </span>
                    ) : remainingStock <= 0 ? (
                      <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Max in cart
                      </span>
                    ) : (
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          remainingStock <= item.minThreshold
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Stock: {remainingStock}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cart indicator badge */}
                {inCart && (
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md border-2 border-slate-900">
                    {inCart.quantity}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Current Customer Bill / Cart Counter (5 cols on lg) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl sticky top-24">
          {/* Bill Top Heading */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-white">
              <ShoppingCart className="w-5 h-5 text-indigo-400" />
              <h2 className="font-bold text-base">Customer Bill</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {totalItemsCount} items
              </span>
            </div>
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Bill</span>
              </button>
            )}
          </div>

          {/* Customer Name input */}
          <div className="mb-4">
            <label className="block text-[11px] uppercase font-semibold text-slate-400 mb-1">
              Customer Reference
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                id="customer-name-input"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer / Student / Phone"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Error Notice */}
          {checkoutError && (
            <div className="mb-3 p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{checkoutError}</span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="divide-y divide-slate-800/80 max-h-64 overflow-y-auto pr-1 mb-4">
            {cart.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium text-slate-400">Bill is empty</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click stationery items on the left to add to bill
                </p>
              </div>
            ) : (
              cart.map((ci) => {
                const maxAvailable = ci.item.stock;
                const isAtStockLimit = ci.quantity >= maxAvailable;

                return (
                  <div key={ci.item.id} className="py-2.5 flex items-center justify-between gap-2.5">
                    {/* Item thumbnail */}
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                      {ci.item.imageUrl ? (
                        <img
                          src={ci.item.imageUrl}
                          alt={ci.item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Package className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    {/* Item title & unit price */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-white truncate">{ci.item.name}</h4>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span className="font-mono">₹{ci.item.sellingPrice.toFixed(2)} each</span>
                        <span>•</span>
                        <span className="text-slate-500">Avail: {maxAvailable}</span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-1 bg-slate-950 rounded-lg border border-slate-800 p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(ci.item.id, ci.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-mono font-semibold text-xs text-white">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => {
                          if (!isAtStockLimit) {
                            onUpdateQuantity(ci.item.id, ci.quantity + 1);
                          }
                        }}
                        disabled={isAtStockLimit}
                        title={isAtStockLimit ? 'Reached maximum available stock in store' : 'Add 1 more'}
                        className={`w-6 h-6 flex items-center justify-center rounded ${
                          isAtStockLimit
                            ? 'text-slate-600 cursor-not-allowed'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line Item Total */}
                    <div className="text-right min-w-[60px]">
                      <div className="font-mono font-bold text-xs text-slate-200">
                        ₹{(ci.item.sellingPrice * ci.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveFromCart(ci.item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400">Payment Mode</label>
              {paymentMethod === 'UPI / QR' && (
                <button
                  type="button"
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
                >
                  {showQrModal ? 'Hide Shop QR' : 'Show Shop QR'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  paymentMethod === 'Cash'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI / QR')}
                className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  paymentMethod === 'UPI / QR'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  paymentMethod === 'Card'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>
            </div>

            {/* Optional QR Code Preview for UPI counter */}
            {paymentMethod === 'UPI / QR' && showQrModal && (
              <div className="p-3 bg-slate-950 border border-indigo-500/30 rounded-xl text-center">
                <div className="w-28 h-28 mx-auto bg-white p-2 rounded-lg flex items-center justify-center mb-1">
                  <div className="w-full h-full border-2 border-dashed border-slate-900 flex flex-col items-center justify-center">
                    <QrCode className="w-16 h-16 text-slate-900" />
                    <span className="text-[9px] font-bold text-slate-800">SCAN TO PAY</span>
                  </div>
                </div>
                <p className="text-[11px] text-indigo-300 font-medium">UPI ID: shreestationery@upi</p>
                <p className="text-[10px] text-slate-500">Show to customer for mobile scanning</p>
              </div>
            )}
          </div>

          {/* Discount & Totals Breakdown */}
          <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono text-slate-200">₹{rawSubtotal.toFixed(2)}</span>
            </div>

            {/* Quick Discount Selector */}
            <div className="flex items-center justify-between text-slate-400">
              <span>Discount (%):</span>
              <div className="flex space-x-1">
                {[0, 5, 10].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiscountPercent(d)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                      discountPercent === d
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {d === 0 ? '0%' : `${d}%`}
                  </button>
                ))}
              </div>
            </div>

            {discountPercent > 0 && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>Discount saved:</span>
                <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
              <span>Grand Total:</span>
              <span className="font-mono text-xl text-emerald-400">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Complete Checkout & Reduce Stock Button */}
          <button
            id="complete-checkout-btn"
            type="button"
            onClick={handleProcessCheckout}
            disabled={cart.length === 0}
            className={`w-full mt-5 py-3 px-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              cart.length === 0
                ? 'bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-950/40 active:scale-[0.99]'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>Complete Sale & Deduct Stock (₹{grandTotal.toFixed(2)})</span>
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-2">
            Stock for all purchased items will be deducted immediately from inventory
          </p>
        </div>
      </div>
    </div>
  );
};
