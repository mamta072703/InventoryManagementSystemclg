import React, { useState } from 'react';
import {
  Receipt,
  Calendar,
  IndianRupee,
  TrendingUp,
  Package,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  User
} from 'lucide-react';
import { SaleTransaction, StationeryItem } from '../types';

interface SalesLedgerViewProps {
  transactions: SaleTransaction[];
  onRefundTransaction: (transaction: SaleTransaction) => void;
  onViewReceipt: (transaction: SaleTransaction) => void;
}

export const SalesLedgerView: React.FC<SalesLedgerViewProps> = ({
  transactions,
  onRefundTransaction,
  onViewReceipt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [refundConfirmId, setRefundConfirmId] = useState<string | null>(null);

  // Stats
  const totalSalesRevenue = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalUnitsSold = transactions.reduce((acc, t) => acc + t.totalQuantity, 0);
  const totalBillsCount = transactions.length;

  const filteredTransactions = transactions.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      t.invoiceNumber.toLowerCase().includes(q) ||
      (t.customerName && t.customerName.toLowerCase().includes(q)) ||
      t.items.some((i) => i.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Recorded Sales Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-400">
              ₹{totalSalesRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Total revenue collected from customer sales</div>
        </div>

        {/* Total Units Sold & Deducted */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Stock Units Sold</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-bold text-indigo-300">{totalUnitsSold}</span>
            <span className="text-xs text-slate-400">units deducted</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Deducted directly from shopkeeper shelves</div>
        </div>

        {/* Customer Bills / Invoices */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Invoices Issued</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-bold text-white">{totalBillsCount}</span>
            <span className="text-xs text-slate-400">transactions</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Customer checkouts recorded</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice number, customer, item..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Showing {filteredTransactions.length} of {transactions.length} sales records
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium text-slate-400">No sales transactions found</p>
            <p className="text-xs text-slate-500 mt-1">
              Complete customer purchases from the "Customer Billing" tab or click "Sell 1" on items in inventory.
            </p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const formattedDate = new Date(tx.timestamp).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            });
            const isConfirmingRefund = refundConfirmId === tx.id;

            return (
              <div
                key={tx.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                  {/* Left: Invoice & Customer */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 text-indigo-400">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-white">
                          {tx.invoiceNumber}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {tx.paymentMethod}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center space-x-1">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{tx.customerName || 'Walk-in'}</span>
                        </span>
                        <span>•</span>
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Total Amount & Units */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold text-emerald-400">
                        ₹{tx.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-400">{tx.totalQuantity} items deducted</div>
                    </div>

                    {/* Actions: View Receipt / Return */}
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => onViewReceipt(tx)}
                        title="View printable invoice"
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isConfirmingRefund ? (
                        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-amber-500/50">
                          <span className="text-[11px] text-amber-300 px-1">Restock items?</span>
                          <button
                            onClick={() => {
                              onRefundTransaction(tx);
                              setRefundConfirmId(null);
                            }}
                            className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded cursor-pointer"
                          >
                            Yes, Restock
                          </button>
                          <button
                            onClick={() => setRefundConfirmId(null)}
                            className="px-1.5 py-1 text-slate-400 hover:text-white text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setRefundConfirmId(tx.id)}
                          title="Customer Return: Restores deducted stock back into inventory"
                          className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs rounded-lg transition-colors cursor-pointer border border-slate-700/60"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Return/Restock</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items Purchased List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {tx.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Package className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </div>
                        <div className="truncate">
                          <span className="text-white font-medium truncate block">{item.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            ₹{item.unitPrice.toFixed(2)} each
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-slate-200">×{item.quantity}</span>
                        <div className="font-mono text-emerald-400 text-[11px]">
                          ₹{item.subtotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
