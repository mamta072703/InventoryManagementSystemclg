export type StationeryCategory =
  | 'Writing & Pens'
  | 'Notebooks & Paper'
  | 'Art & Craft'
  | 'Desk & Office'
  | 'Files & Folders'
  | 'Math & Instruments'
  | 'Adhesives & Tapes';

export interface StationeryItem {
  id: string;
  sku: string;
  name: string;
  category: StationeryCategory;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minThreshold: number; // Alert when stock <= minThreshold
  unit: string; // 'pcs', 'pack', 'box', 'ream', 'set'
  imageUrl?: string;
  description?: string;
  lastUpdated?: string;
}

export interface CartItem {
  item: StationeryItem;
  quantity: number;
}

export interface SaleTransaction {
  id: string;
  invoiceNumber: string;
  timestamp: string;
  items: {
    itemId: string;
    name: string;
    category: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    imageUrl?: string;
  }[];
  totalQuantity: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'UPI / QR' | 'Card';
  customerName?: string;
}

export interface ShopkeeperUser {
  username: string;
  shopName: string;
  ownerName: string;
  role: 'Store Owner' | 'Manager' | 'Cashier';
  isLoggedIn: boolean;
}
