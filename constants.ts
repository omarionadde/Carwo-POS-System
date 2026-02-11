import { Product, Category, User, Sale } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Slim Fit Chino Trousers',
    category: 'Men',
    size: '32',
    color: 'Beige',
    buyPrice: 15,
    sellPrice: 35,
    quantity: 45,
    image: 'https://picsum.photos/200/200?random=1',
    unit: 'Piece'
  },
  {
    id: '2',
    name: 'Floral Summer Dress',
    category: 'Women',
    size: 'M',
    color: 'Red Pattern',
    buyPrice: 20,
    sellPrice: 55,
    quantity: 12,
    image: 'https://picsum.photos/200/200?random=2',
    unit: 'Piece'
  },
  {
    id: '3',
    name: 'Classic White Tee',
    category: 'Unisex',
    size: 'L',
    color: 'White',
    buyPrice: 5,
    sellPrice: 15,
    quantity: 120,
    image: 'https://picsum.photos/200/200?random=3',
    unit: 'Piece'
  },
  {
    id: '4',
    name: 'Denim Jacket',
    category: 'Men',
    size: 'XL',
    color: 'Blue',
    buyPrice: 30,
    sellPrice: 75,
    quantity: 5,
    image: 'https://picsum.photos/200/200?random=4',
    unit: 'Piece'
  },
  {
    id: '5',
    name: 'Silk Scarf',
    category: 'Accessories',
    size: 'One Size',
    color: 'Gold',
    buyPrice: 8,
    sellPrice: 25,
    quantity: 3,
    image: 'https://picsum.photos/200/200?random=5',
    unit: 'Piece'
  },
  {
    id: '6',
    name: 'Leather Belt',
    category: 'Accessories',
    size: '34',
    color: 'Brown',
    buyPrice: 10,
    sellPrice: 30,
    quantity: 22,
    image: 'https://picsum.photos/200/200?random=6',
    unit: 'Piece'
  },
  {
    id: '7',
    name: 'Premium Silk Fabric',
    category: 'Fabrics',
    size: 'Roll',
    color: 'Emerald',
    buyPrice: 12,
    sellPrice: 25,
    quantity: 150,
    image: 'https://picsum.photos/200/200?random=7',
    unit: 'Yard'
  }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Men', count: 120 },
  { id: '2', name: 'Women', count: 85 },
  { id: '3', name: 'Kids', count: 40 },
  { id: '4', name: 'Accessories', count: 35 },
  { id: '5', name: 'Fabrics', count: 15 },
];

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ahmed Nur',
    role: 'Admin',
    email: 'admin@carwodhar.com',
    avatar: 'https://picsum.photos/100/100?random=10'
  },
  {
    id: '2',
    name: 'Sara Ali',
    role: 'Staff',
    email: 'sara@carwodhar.com',
    avatar: 'https://picsum.photos/100/100?random=11'
  }
];

export const MOCK_SALES_HISTORY: Sale[] = [
  {
    id: 'INV-1001',
    items: [],
    totalAmount: 120,
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    paymentMethod: 'Cash'
  },
  {
    id: 'INV-1002',
    items: [],
    totalAmount: 340,
    date: new Date().toISOString(), // Today
    paymentMethod: 'Mobile Money'
  }
];