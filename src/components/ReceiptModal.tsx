import React from 'react';
import { Printer, CheckCircle2, X, Store, ArrowRight, ShieldCheck } from 'lucide-react';
import { SaleTransaction, ShopkeeperUser } from '../types';

interface ReceiptModalProps {
  transaction: SaleTransaction | null;
  user: ShopkeeperUser;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  user,
  onClose,
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(transaction.timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Notification */}
        <div className="bg-emerald-950/60 border-b border-emerald-800/40 p-3.5 flex items-center justify-between text-emerald-300 text-xs">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Stock Successfully Reduced! Sale Recorded</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Printable Content */}
        <div id="printable-receipt" className="p-6 bg-slate-950 text-slate-200 overflow-y-auto font-mono text-xs space-y-4">
          {/* Shop Header */}
          <div className="text-center border-b border-dashed border-slate-800 pb-4">
            <div className="flex items-center justify-center space-x-1 text-slate-100 font-bold text-sm mb-0.5">
              <Store className="w-4 h-4 text-indigo-400" />
              <span>{user.shopName}</span>
            </div>
            <p className="text-[11px] text-slate-400">All kinds of Books, Pens & Office Stationery</p>
            <p className="text-[10px] text-slate-500 mt-1">Cashier: {user.ownerName} ({user.role})</p>
          </div>

          {/* Invoice Info */}
          <div className="flex justify-between text-[11px] text-slate-400 border-b border-dashed border-slate-800 pb-2">
            <div>
              <div>Inv: <span className="text-white font-bold">{transaction.invoiceNumber}</span></div>
              <div>Customer: <span className="text-slate-300">{transaction.customerName}</span></div>
            </div>
            <div className="text-right">
              <div>Date: {formattedDate}</div>
              <div>Pay: <span className="text-indigo-300 font-bold">{transaction.paymentMethod}</span></div>
            </div>
          </div>

          {/* Item Table */}
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-1">Item</th>
                <th className="pb-1 text-center">Qty</th>
                <th className="pb-1 text-right">Rate</th>
                <th className="pb-1 text-right">Amt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {transaction.items.map((it, idx) => (
                <tr key={idx} className="py-1">
                  <td className="py-1.5 pr-2 font-sans font-medium text-white flex items-center space-x-1.5">
                    {it.imageUrl && (
                      <img
                        src={it.imageUrl}
                        alt={it.name}
                        className="w-5 h-5 rounded object-cover shrink-0 border border-slate-800"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}
                    <span className="truncate">{it.name}</span>
                  </td>
                  <td className="py-1.5 text-center text-slate-300">{it.quantity}</td>
                  <td className="py-1.5 text-right text-slate-400">₹{it.unitPrice.toFixed(2)}</td>
                  <td className="py-1.5 text-right font-bold text-slate-200">
                    ₹{it.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Breakdown */}
          <div className="border-t-2 border-dashed border-slate-800 pt-3 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Total Units Deducted:</span>
              <span className="text-white font-bold">{transaction.totalQuantity} units</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-1">
              <span>Grand Total Paid:</span>
              <span className="text-emerald-400 font-mono text-lg">₹{transaction.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center pt-3 border-t border-dashed border-slate-800 text-[10px] text-slate-500">
            <p>Thank you for shopping with us!</p>
            <p className="text-[9px] text-slate-600">Goods once sold cannot be returned without receipt</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
          <button
            id="close-receipt-btn"
            onClick={onClose}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <span>Next Customer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
