import React, { useState, useEffect } from 'react';
import {
  StationeryItem,
  CartItem,
  SaleTransaction,
  ShopkeeperUser,
} from './types';
import { INITIAL_INVENTORY } from './data/initialInventory';
import { LoginView } from './components/LoginView';
import { Navbar } from './components/Navbar';
import { InventoryView } from './components/InventoryView';
import { CheckoutCounter } from './components/CheckoutCounter';
import { SalesLedgerView } from './components/SalesLedgerView';
import { AddItemModal } from './components/AddItemModal';
import { EditItemModal } from './components/EditItemModal';
import { ReceiptModal } from './components/ReceiptModal';
import { CheckCircle2, AlertTriangle, X, ShoppingCart } from 'lucide-react';

const STORAGE_KEYS = {
  USER: 'stationery_shop_user_v2',
  INVENTORY: 'stationery_shop_inventory_v2',
  TRANSACTIONS: 'stationery_shop_transactions_v2',
};

export default function App() {
  // Shopkeeper User State
  const [user, setUser] = useState<ShopkeeperUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER) || localStorage.getItem('stationery_shop_user_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Inventory State
  const [inventory, setInventory] = useState<StationeryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      if (saved) {
        const parsed: StationeryItem[] = JSON.parse(saved);
        return parsed.map((item) => {
          const defaultMatch = INITIAL_INVENTORY.find((init) => init.id === item.id);
          return {
            ...item,
            imageUrl: item.imageUrl || defaultMatch?.imageUrl,
            costPrice: item.costPrice < 15 && defaultMatch ? defaultMatch.costPrice : item.costPrice,
            sellingPrice: item.sellingPrice < 15 && defaultMatch ? defaultMatch.sellingPrice : item.sellingPrice,
          };
        });
      }
      return INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  // Sales Transactions State
  const [transactions, setTransactions] = useState<SaleTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) return JSON.parse(saved);
      // Pre-seed with one recent demo sale in Rupees for realistic ledger view
      return [
        {
          id: 'sale-demo-01',
          invoiceNumber: 'INV-839210',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          customerName: 'Aarav - St. Xavier High School',
          items: [
            {
              itemId: 'stat-01',
              name: 'Pilot G2 Gel Pen (0.7mm Blue)',
              category: 'Writing & Pens',
              unitPrice: 75,
              quantity: 2,
              subtotal: 150,
              imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80',
            },
            {
              itemId: 'stat-04',
              name: 'A4 Spiral Notebook (200 Pages, Ruled)',
              category: 'Notebooks & Paper',
              unitPrice: 120,
              quantity: 1,
              subtotal: 120,
              imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=80',
            },
          ],
          totalQuantity: 3,
          totalAmount: 270,
          paymentMethod: 'UPI / QR',
        },
      ];
    } catch {
      return [];
    }
  });

  // Customer Cart (for billing/checkout)
  const [cart, setCart] = useState<CartItem[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'inventory' | 'billing' | 'sales'>('inventory');

  // Modals & Active Receipt
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<StationeryItem | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<SaleTransaction | null>(null);

  // Shopkeeper Notification Toast
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error('Failed to save user session', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    } catch (e) {
      console.error('Failed to save inventory', e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions', e);
    }
  }, [transactions]);

  // Trigger Toast Notification helper
  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Low stock counter
  const lowStockCount = inventory.filter((i) => i.stock <= i.minThreshold).length;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 1. Quick Sell 1 Unit Directly from Inventory
  const handleSellOne = (item: StationeryItem) => {
    if (item.stock <= 0) {
      showToast(`Cannot sell: "${item.name}" is completely out of stock!`, 'warning');
      return;
    }

    const newStock = item.stock - 1;

    // Deduct stock from inventory
    setInventory((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, stock: newStock } : i))
    );

    // Record individual quick transaction
    const quickSale: SaleTransaction = {
      id: `sale-${Date.now()}`,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      customerName: 'Quick Counter Sale',
      items: [
        {
          itemId: item.id,
          name: item.name,
          category: item.category,
          unitPrice: item.sellingPrice,
          quantity: 1,
          subtotal: item.sellingPrice,
          imageUrl: item.imageUrl,
        },
      ],
      totalQuantity: 1,
      totalAmount: item.sellingPrice,
      paymentMethod: 'Cash',
    };

    setTransactions((prev) => [quickSale, ...prev]);

    if (newStock === 0) {
      showToast(
        `Sold 1x ${item.name}! Item is now OUT OF STOCK. Please restock soon.`,
        'warning'
      );
    } else if (newStock <= item.minThreshold) {
      showToast(
        `Sold 1x ${item.name}! Stock reduced to ${newStock} (${item.unit}). LOW STOCK WARNING!`,
        'warning'
      );
    } else {
      showToast(
        `Sold 1x ${item.name}! Stock reduced: ${newStock} left on shelves.`,
        'success'
      );
    }
  };

  // 2. Restock Inventory Item
  const handleRestock = (itemId: string, amount: number) => {
    setInventory((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const updatedStock = i.stock + amount;
          showToast(
            `Restocked +${amount} ${i.unit} for "${i.name}". New stock: ${updatedStock}.`,
            'success'
          );
          return { ...i, stock: updatedStock, lastUpdated: new Date().toISOString() };
        }
        return i;
      })
    );
  };

  // 3. Add to Customer Cart
  const handleAddToCart = (item: StationeryItem) => {
    if (item.stock <= 0) {
      showToast(`Cannot add "${item.name}" - out of stock!`, 'warning');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          showToast(
            `Maximum available stock (${item.stock}) already in customer bill!`,
            'warning'
          );
          return prev;
        }
        showToast(`Added 1 more "${item.name}" to customer bill.`, 'info');
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      showToast(`Added "${item.name}" to customer bill.`, 'info');
      return [...prev, { item, quantity: 1 }];
    });
  };

  // 4. Update Quantity in Cart
  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    const itemInStore = inventory.find((i) => i.id === itemId);
    if (!itemInStore) return;

    if (quantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }

    if (quantity > itemInStore.stock) {
      showToast(
        `Only ${itemInStore.stock} units available in shop inventory!`,
        'warning'
      );
      return;
    }

    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  // 5. Remove from Cart
  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  // 6. Complete Customer Checkout -> REDUCE STOCK
  const handleCheckoutComplete = (transaction: SaleTransaction) => {
    // Deduct stock for every item purchased
    setInventory((prevInventory) => {
      return prevInventory.map((invItem) => {
        const purchasedItem = transaction.items.find((pi) => pi.itemId === invItem.id);
        if (purchasedItem) {
          const newStock = Math.max(0, invItem.stock - purchasedItem.quantity);
          return {
            ...invItem,
            stock: newStock,
            lastUpdated: new Date().toISOString(),
          };
        }
        return invItem;
      });
    });

    // Record sale
    setTransactions((prev) => [transaction, ...prev]);

    // Clear cart
    setCart([]);

    // Show Printable Receipt Modal
    setActiveReceipt(transaction);

    showToast(
      `Sale completed! Deducted ${transaction.totalQuantity} items from stock. Bill ${transaction.invoiceNumber} recorded.`,
      'success'
    );
  };

  // 7. Refund / Return Transaction (Restores stock)
  const handleRefundTransaction = (transaction: SaleTransaction) => {
    // Restock all items back into inventory
    setInventory((prevInventory) => {
      return prevInventory.map((invItem) => {
        const refundedItem = transaction.items.find((ri) => ri.itemId === invItem.id);
        if (refundedItem) {
          return {
            ...invItem,
            stock: invItem.stock + refundedItem.quantity,
            lastUpdated: new Date().toISOString(),
          };
        }
        return invItem;
      });
    });

    // Remove from active transactions list
    setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));

    showToast(
      `Invoice ${transaction.invoiceNumber} refunded. Restocked ${transaction.totalQuantity} items to inventory.`,
      'info'
    );
  };

  // 8. Add New Item
  const handleAddNewItem = (newItemData: Omit<StationeryItem, 'id'>) => {
    const newItem: StationeryItem = {
      ...newItemData,
      id: `stat-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
    };
    setInventory((prev) => [newItem, ...prev]);
    showToast(`Added new stationery item "${newItem.name}" to inventory.`, 'success');
  };

  // 9. Save Edited Item
  const handleSaveEditedItem = (updatedItem: StationeryItem) => {
    setInventory((prev) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
    );
    showToast(`Updated details for "${updatedItem.name}".`, 'success');
  };

  // 10. Delete Item
  const handleDeleteItem = (itemId: string) => {
    const target = inventory.find((i) => i.id === itemId);
    if (!target) return;
    if (
      window.confirm(
        `Are you sure you want to remove "${target.name}" from the stationery inventory?`
      )
    ) {
      setInventory((prev) => prev.filter((i) => i.id !== itemId));
      setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
      showToast(`Removed "${target.name}" from inventory.`, 'info');
    }
  };

  // 11. Reset Inventory to Initial Data
  const handleResetStock = () => {
    if (
      window.confirm(
        'Reset inventory to original sample stationery items and stock quantities?'
      )
    ) {
      setInventory(INITIAL_INVENTORY);
      setCart([]);
      showToast('Inventory reset to default stationery stock levels.', 'info');
    }
  };

  // 12. Authentication Handlers
  const handleLogin = (loggedUser: ShopkeeperUser) => {
    setUser(loggedUser);
    showToast(`Welcome back, ${loggedUser.ownerName}! Store inventory loaded.`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
  };

  // If not logged in, render the Shopkeeper Login View
  if (!user || !user.isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      {/* Navbar with Store Info & View Switcher */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowStockCount={lowStockCount}
        cartCount={cartItemCount}
        onOpenAddItem={() => setIsAddItemOpen(true)}
        onLogout={handleLogout}
        onResetStock={handleResetStock}
      />

      {/* Persistent Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 fade-in duration-200">
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-2xl border text-sm max-w-md ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-300'
                : toastMessage.type === 'warning'
                ? 'bg-slate-900 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-indigo-500/50 text-indigo-300'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toastMessage.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <ShoppingCart className="w-5 h-5 text-indigo-400 shrink-0" />
            )}
            <span className="flex-1 font-medium">{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Stock Inventory */}
        {activeTab === 'inventory' && (
          <InventoryView
            items={inventory}
            onSellOne={handleSellOne}
            onRestock={handleRestock}
            onEditItem={(item) => setEditingItem(item)}
            onDeleteItem={handleDeleteItem}
            onAddToCart={handleAddToCart}
            onOpenAddItem={() => setIsAddItemOpen(true)}
            onNavigateToBilling={() => setActiveTab('billing')}
          />
        )}

        {/* Tab 2: Customer Billing / POS Counter */}
        {activeTab === 'billing' && (
          <CheckoutCounter
            items={inventory}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={() => setCart([])}
            onCheckoutComplete={handleCheckoutComplete}
          />
        )}

        {/* Tab 3: Sales History & Invoices */}
        {activeTab === 'sales' && (
          <SalesLedgerView
            transactions={transactions}
            onRefundTransaction={handleRefundTransaction}
            onViewReceipt={(tx) => setActiveReceipt(tx)}
          />
        )}
      </main>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAdd={handleAddNewItem}
      />

      <EditItemModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEditedItem}
      />

      <ReceiptModal
        transaction={activeReceipt}
        user={user}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
}
