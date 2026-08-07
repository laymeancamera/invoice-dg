export type PackageCategory = 'pre_wedding' | 'wedding_day' | 'combo' | 'custom';

export type PaymentStatus = 'unpaid' | 'deposit' | 'paid' | 'overdue';

export type PaymentMethod = 'khqr' | 'cash' | 'bank_transfer' | 'other';

export interface PackageItem {
  id: string;
  nameKhmer: string;
  nameEnglish: string;
  category: PackageCategory;
  price: number;
  description: string;
  includedItems: string[];
  recommendedCount?: string; // e.g. "អាវ ៣ឈុត, អាល់ប៊ុម ១"
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  note?: string;
  receivedBy?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-001
  customerName: string;
  customerPhone: string;
  weddingDate: string; // YYYY-MM-DD
  eventLocation: string; // ទីតាំង / អាសយដ្ឋានមង្គលការ
  packageCategory: PackageCategory;
  selectedPackageId?: string;
  packageName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number; // in USD
  deposit: number; // ប្រាក់កក់ដំបូង
  total: number;
  paidAmount: number; // សរុបទឹកប្រាក់បានទូទាត់រួច
  balanceDue: number; // ប្រាក់នៅសល់ត្រូវទូទាត់
  status: PaymentStatus;
  issueDate: string;
  dueDate?: string;
  payments: PaymentRecord[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  weddingDate?: string;
  location?: string;
  totalInvoices: number;
  totalSpent: number;
  totalPending: number;
  firstInvoiceDate: string;
  lastInvoiceDate: string;
  invoiceIds: string[];
  notes?: string;
}

export interface StudioProfile {
  name: string;
  khmerName: string;
  tagline: string;
  phone: string;
  secondaryPhone?: string;
  telegramUsername?: string; // e.g. @laymeancamera or phone
  address: string;
  email?: string;
  facebookPage?: string;
  logoUrl?: string;
  khqrImageUrl?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  termsAndConditions: string[];
  exchangeRateKHR: number; // default 4100 KHR = 1 USD
}

export type UserRole = 'admin' | 'member';
export type UserStatus = 'active' | 'inactive';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  emailPhone: string;
  password: string;
  studioName?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
}

export interface SystemConfig {
  allowPublicRegistration: boolean;
  maintenanceMode: boolean;
  systemTitle: string;
  defaultCurrency: string;
}
