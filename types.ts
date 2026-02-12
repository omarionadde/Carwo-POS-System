
export type ProductStatus = 'In Stock' | 'Out of Stock' | 'Low Stock';

export interface Product {
  id: string;
  name: string;
  category: string;
  size: string;
  color: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  image: string;
  unit: 'Piece' | 'Yard';
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount?: number;
  date: string; // ISO string
  paymentMethod: 'Cash' | 'Card' | 'Mobile Money';
  status?: 'Completed' | 'Refunded';
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Staff';
  email: string;
  avatar: string;
  password?: string; // Optional for security but needed for this flow
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface DashboardStats {
  salesToday: number;
  totalRevenue: number;
  productsInStock: number;
  lowStockAlerts: number;
}

export interface AuditLog {
  id: string;
  action: string; // e.g., 'CREATE_PRODUCT', 'REFUND_SALE'
  details: string;
  userId: string;
  userName: string;
  timestamp: string;
}
