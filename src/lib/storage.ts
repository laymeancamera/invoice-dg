import { Invoice, PackageItem, StudioProfile, CustomerProfile, UserAccount, SystemConfig } from '../types';
import { DEFAULT_STUDIO_PROFILE, DEFAULT_PACKAGES } from './constants';
import { 
  subscribeStudioProfile, 
  saveStudioProfileToCloud,
  subscribeSystemConfig,
  saveSystemConfigToCloud,
  subscribeInvoices,
  saveInvoiceToCloud,
  deleteInvoiceFromCloud,
  subscribePackages,
  savePackageToCloud,
  deletePackageFromCloud,
  subscribeUsers,
  saveUserToCloud,
  deleteUserFromCloud
} from './firebase';

export const STORAGE_EVENT = 'laymean_photo_storage_change';

// In-Memory Cloud Data Cache
let cloudInvoicesCache: Invoice[] = [];
let cloudStudioCache: StudioProfile = DEFAULT_STUDIO_PROFILE;
let cloudPackagesCache: PackageItem[] = DEFAULT_PACKAGES;
let cloudUsersCache: UserAccount[] = [];
let cloudConfigCache: SystemConfig = {
  allowPublicRegistration: true,
  maintenanceMode: false,
  systemTitle: 'វិក្កយបត្រ Digital Pro',
  defaultCurrency: 'USD'
};

// Internal broadcast notify helper
function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }
}

// Subscribe to Cloud Firestore Real-time Updates automatically
if (typeof window !== 'undefined') {
  subscribeStudioProfile((updated) => {
    cloudStudioCache = updated;
    notifyChange();
  });

  subscribeSystemConfig((updated) => {
    cloudConfigCache = updated;
    notifyChange();
  });

  subscribeInvoices((updated) => {
    cloudInvoicesCache = updated;
    notifyChange();
  });

  subscribePackages((updated) => {
    cloudPackagesCache = updated;
    notifyChange();
  });

  subscribeUsers((updated) => {
    cloudUsersCache = updated;
    notifyChange();
  });
}

// 1. Studio Profile (Cloud Firestore)
export function getStudioProfile(): StudioProfile {
  return cloudStudioCache || DEFAULT_STUDIO_PROFILE;
}

export function saveStudioProfile(profile: StudioProfile): void {
  cloudStudioCache = profile;
  saveStudioProfileToCloud(profile).catch((err) => {
    console.error('Failed to save studio profile to Cloud Firestore:', err);
  });
  notifyChange();
}

// 2. System Config (Cloud Firestore)
export function getSystemConfig(): SystemConfig {
  return cloudConfigCache;
}

export function saveSystemConfig(config: SystemConfig): void {
  cloudConfigCache = config;
  saveSystemConfigToCloud(config).catch((err) => {
    console.error('Failed to save system config to Cloud Firestore:', err);
  });
  notifyChange();
}

// 3. Invoices (Cloud Firestore)
export function getInvoices(): Invoice[] {
  return cloudInvoicesCache || [];
}

export function saveInvoices(invoices: Invoice[]): void {
  cloudInvoicesCache = invoices;
  invoices.forEach((inv) => saveInvoiceToCloud(inv));
  notifyChange();
}

export function saveSingleInvoice(invoice: Invoice): Invoice {
  const paid = (invoice.payments || []).reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const updatedInvoice: Invoice = {
    ...invoice,
    paidAmount: paid,
    balanceDue: Math.max(0, invoice.total - paid),
    status:
      paid >= invoice.total
        ? 'paid'
        : paid > 0
        ? 'deposit'
        : 'unpaid',
    updatedAt: new Date().toISOString()
  };

  const idx = cloudInvoicesCache.findIndex((i) => i.id === updatedInvoice.id);
  if (idx >= 0) {
    cloudInvoicesCache[idx] = updatedInvoice;
  } else {
    cloudInvoicesCache.unshift(updatedInvoice);
  }

  saveInvoiceToCloud(updatedInvoice).catch((err) => {
    console.error('Failed to save invoice to Cloud Firestore:', err);
  });

  notifyChange();
  return updatedInvoice;
}

export function deleteInvoice(id: string): void {
  cloudInvoicesCache = cloudInvoicesCache.filter((i) => i.id !== id);
  deleteInvoiceFromCloud(id).catch((err) => {
    console.error('Failed to delete invoice from Cloud Firestore:', err);
  });
  notifyChange();
}

// 4. Packages (Cloud Firestore)
export function getPackages(): PackageItem[] {
  return cloudPackagesCache || DEFAULT_PACKAGES;
}

export function savePackages(packages: PackageItem[]): void {
  cloudPackagesCache = packages;
  packages.forEach((p) => savePackageToCloud(p));
  notifyChange();
}

export function saveSinglePackage(pkg: PackageItem): void {
  const idx = cloudPackagesCache.findIndex((p) => p.id === pkg.id);
  if (idx >= 0) {
    cloudPackagesCache[idx] = pkg;
  } else {
    cloudPackagesCache.push(pkg);
  }
  savePackageToCloud(pkg).catch((err) => {
    console.error('Failed to save package to Cloud Firestore:', err);
  });
  notifyChange();
}

export function deletePackage(id: string): void {
  cloudPackagesCache = cloudPackagesCache.filter((p) => p.id !== id);
  deletePackageFromCloud(id).catch((err) => {
    console.error('Failed to delete package from Cloud Firestore:', err);
  });
  notifyChange();
}

// 5. Customer Directory (Compiled in real-time from Cloud Invoices)
export function getCustomers(): CustomerProfile[] {
  const invoices = getInvoices();
  const map = new Map<string, CustomerProfile>();

  invoices.forEach((inv) => {
    const key = ((inv.customerPhone || '').trim() || (inv.customerName || '').trim()).toLowerCase();
    if (!key) return;

    if (!map.has(key)) {
      map.set(key, {
        id: `cust-${key.replace(/[^a-z0-9]/g, '')}`,
        name: inv.customerName,
        phone: inv.customerPhone,
        weddingDate: inv.weddingDate,
        location: inv.eventLocation,
        totalInvoices: 1,
        totalSpent: inv.total,
        totalPending: inv.balanceDue,
        firstInvoiceDate: inv.issueDate,
        lastInvoiceDate: inv.issueDate,
        invoiceIds: [inv.id]
      });
    } else {
      const existing = map.get(key)!;
      existing.totalInvoices += 1;
      existing.totalSpent += inv.total;
      existing.totalPending += inv.balanceDue;
      existing.invoiceIds.push(inv.id);
      if (inv.weddingDate) existing.weddingDate = inv.weddingDate;
      if (inv.eventLocation) existing.location = inv.eventLocation;
      if (new Date(inv.issueDate) < new Date(existing.firstInvoiceDate)) {
        existing.firstInvoiceDate = inv.issueDate;
      }
      if (new Date(inv.issueDate) > new Date(existing.lastInvoiceDate)) {
        existing.lastInvoiceDate = inv.issueDate;
      }
    }
  });

  return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

// 6. User Accounts (Cloud Firestore)
export function getUsers(): UserAccount[] {
  return cloudUsersCache || [];
}

export function saveUsers(users: UserAccount[]): void {
  cloudUsersCache = users;
  users.forEach((u) => saveUserToCloud(u));
  notifyChange();
}

export function saveSingleUser(user: UserAccount): UserAccount {
  const idx = cloudUsersCache.findIndex((u) => u.id === user.id || u.username.toLowerCase() === user.username.toLowerCase());
  if (idx >= 0) {
    cloudUsersCache[idx] = { ...cloudUsersCache[idx], ...user };
  } else {
    cloudUsersCache.unshift(user);
  }
  saveUserToCloud(user).catch((err) => {
    console.error('Failed to save user account to Cloud Firestore:', err);
  });
  notifyChange();
  return user;
}

export function deleteUser(id: string): void {
  cloudUsersCache = cloudUsersCache.filter((u) => u.id !== id);
  deleteUserFromCloud(id).catch((err) => {
    console.error('Failed to delete user account from Cloud Firestore:', err);
  });
  notifyChange();
}

// Session persistence (for browser tab refresh)
const SESSION_KEY = 'laymean_photo_active_session_v1';

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const sessionUser: UserAccount = JSON.parse(raw);
    // Find latest matching user in cloud cache if available
    const freshUser = cloudUsersCache.find((u) => u.id === sessionUser.id || u.username === sessionUser.username);
    return freshUser || sessionUser;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  if (!user) {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  } else {
    const updated = { ...user, lastLoginAt: new Date().toISOString() };
    saveSingleUser(updated);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  }
  notifyChange();
}

// JSON Backup & Restore
export function exportAllDataJSON(): string {
  const data = {
    studio: getStudioProfile(),
    config: getSystemConfig(),
    packages: getPackages(),
    invoices: getInvoices(),
    users: getUsers(),
    exportedAt: new Date().toISOString(),
    version: '2.0-cloud'
  };
  return JSON.stringify(data, null, 2);
}

export function importAllDataJSON(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.studio) saveStudioProfile(data.studio);
    if (data.config) saveSystemConfig(data.config);
    if (data.packages) savePackages(data.packages);
    if (data.invoices) saveInvoices(data.invoices);
    if (data.users) saveUsers(data.users);
    notifyChange();
    return true;
  } catch (e) {
    console.error('Failed to import JSON data to Cloud', e);
    return false;
  }
}
