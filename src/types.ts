// Auth
export interface LoginRequest {
  username: string;
  password: string;
}
export interface AuthResponse {
  token: string;
  username: string;
  fullName: string;
  role: string;
}
export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
}

// Product
export interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  img?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
export interface ProductRequest {
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  img?: string;
  status: string;
}

// Sale
export interface Sale {
  id: number;
  subtotal: number;
  tax: number;
  total: number;
  method: string;
  cashierId: number;
  cashierName?: string;
  items: SaleItem[];
  createdAt: string;
}
export interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}
export interface SaleRequest {
  method: string;
  items: { productId: number; quantity: number }[];
}

// Service (custom orders)
export interface ServiceOrder {
  id: number;
  title: string;
  clientName: string;
  phone: string;
  status: string;
  budget: number;
  advance: number;
  type: string;
  payments: ServicePayment[];
  createdAt: string;
}
export interface ServicePayment {
  id: number;
  amount: number;
  method: string;
  description: string;
  createdAt: string;
}
export interface ServiceRequest {
  title: string;
  clientName: string;
  phone: string;
  type: string;
  budget: number;
  advance: number;
  method?: string;
}
export interface PaymentRequest {
  amount: number;
  method: string;
  description: string;
}

// Affiliate
export interface Affiliate {
  id: number;
  name: string;
  idDocument: string;
  phone: string;
  email: string;
  level: string;
  points: number;
  createdAt: string;
}
export interface AffiliateRequest {
  name: string;
  idDocument: string;
  phone: string;
  email: string;
  level: string;
  points: number;
}

// Cash
export interface CashSession {
  id: number;
  openedAt: string;
  closedAt?: string;
  openedBy: string;
  closedBy?: string;
  initialBase: number;
  status: string;
  expectedTotal?: number;
  actualTotal?: number;
}
export interface CashTransaction {
  id: number;
  sessionId: number;
  type: string;
  amount: number;
  description: string;
  method: string;
  referenceId?: string;
  createdAt: string;
}
export interface OpenSessionRequest {
  initialBase: number;
}
export interface CloseSessionRequest {
  actualTotal: number;
  description?: string;
}
export interface TransactionRequest {
  type: string;
  amount: number;
  description: string;
  method: string;
}

// Dashboard
export interface DashboardKPIs {
  todaySales: number;
  todayTransactions: number;
  cashSessionStatus: string;
  estimatedNetProfit: number;
}
export interface WeeklyPerformance {
  day: string;
  total: number;
  transactions: number;
}
export interface TopProduct {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}
export interface CriticalStock {
  id: number;
  name: string;
  stock: number;
  status: string;
}
