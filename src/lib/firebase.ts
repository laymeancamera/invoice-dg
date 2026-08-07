import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  Invoice, 
  StudioProfile, 
  PackageItem, 
  UserAccount, 
  SystemConfig 
} from '../types';
import { 
  DEFAULT_STUDIO_PROFILE, 
  DEFAULT_PACKAGES 
} from './constants';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Collection References
const COLLECTION_STUDIO = 'studio_profile';
const COLLECTION_CONFIG = 'system_config';
const COLLECTION_INVOICES = 'invoices';
const COLLECTION_PACKAGES = 'packages';
const COLLECTION_USERS = 'users';

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    name: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin)',
    emailPhone: '012345678',
    password: 'admin',
    studioName: 'Digital Pro HQ',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01T08:00:00.000Z',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'usr-member-1',
    username: 'chanda',
    name: 'ចាន់ដារ៉ា ថតរូប',
    emailPhone: '098765432',
    password: '123456',
    studioName: 'Dara Wedding Studio',
    role: 'member',
    status: 'active',
    createdAt: '2026-02-10T09:30:00.000Z',
    lastLoginAt: '2026-08-06T10:30:00.000Z'
  }
];

const DEFAULT_SYS_CONFIG: SystemConfig = {
  allowPublicRegistration: true,
  maintenanceMode: false,
  systemTitle: 'វិក្កយបត្រ Digital Pro',
  defaultCurrency: 'USD'
};

// 1. Studio Profile (Cloud Real-time)
export function subscribeStudioProfile(onUpdate: (profile: StudioProfile) => void) {
  const docRef = doc(db, COLLECTION_STUDIO, 'default');
  
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data() as StudioProfile;
      onUpdate(data);
    } else {
      // Seed default to Cloud Firestore
      setDoc(docRef, DEFAULT_STUDIO_PROFILE).catch((err) =>
        console.error('Error seeding default studio profile to Cloud Firestore:', err)
      );
      onUpdate(DEFAULT_STUDIO_PROFILE);
    }
  }, (err) => {
    console.error('Error subscribing to studio profile:', err);
  });
}

export async function saveStudioProfileToCloud(profile: StudioProfile): Promise<void> {
  const docRef = doc(db, COLLECTION_STUDIO, 'default');
  await setDoc(docRef, profile, { merge: true });
}

// 2. System Config (Cloud Real-time)
export function subscribeSystemConfig(onUpdate: (config: SystemConfig) => void) {
  const docRef = doc(db, COLLECTION_CONFIG, 'default');
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.data() as SystemConfig);
    } else {
      setDoc(docRef, DEFAULT_SYS_CONFIG).catch((err) =>
        console.error('Error seeding default sys config to Cloud Firestore:', err)
      );
      onUpdate(DEFAULT_SYS_CONFIG);
    }
  }, (err) => {
    console.error('Error subscribing to system config:', err);
  });
}

export async function saveSystemConfigToCloud(config: SystemConfig): Promise<void> {
  const docRef = doc(db, COLLECTION_CONFIG, 'default');
  await setDoc(docRef, config, { merge: true });
}

// 3. Invoices (Cloud Real-time)
export function subscribeInvoices(onUpdate: (invoices: Invoice[]) => void) {
  const colRef = collection(db, COLLECTION_INVOICES);
  return onSnapshot(colRef, (snapshot) => {
    const invoicesList: Invoice[] = [];
    snapshot.forEach((docSnap) => {
      invoicesList.push(docSnap.data() as Invoice);
    });
    // Sort descending by createdAt or issueDate
    invoicesList.sort((a, b) => new Date(b.createdAt || b.issueDate).getTime() - new Date(a.createdAt || a.issueDate).getTime());
    onUpdate(invoicesList);
  }, (err) => {
    console.error('Error subscribing to invoices from Cloud Firestore:', err);
  });
}

export async function saveInvoiceToCloud(invoice: Invoice): Promise<Invoice> {
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

  const docRef = doc(db, COLLECTION_INVOICES, updatedInvoice.id);
  await setDoc(docRef, updatedInvoice, { merge: true });
  return updatedInvoice;
}

export async function deleteInvoiceFromCloud(invoiceId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_INVOICES, invoiceId);
  await deleteDoc(docRef);
}

// 4. Packages (Cloud Real-time)
export function subscribePackages(onUpdate: (packages: PackageItem[]) => void) {
  const colRef = collection(db, COLLECTION_PACKAGES);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      // Seed default packages if empty
      DEFAULT_PACKAGES.forEach((pkg) => {
        setDoc(doc(db, COLLECTION_PACKAGES, pkg.id), pkg).catch(console.error);
      });
      onUpdate(DEFAULT_PACKAGES);
    } else {
      const pkgs: PackageItem[] = [];
      snapshot.forEach((docSnap) => {
        pkgs.push(docSnap.data() as PackageItem);
      });
      onUpdate(pkgs);
    }
  }, (err) => {
    console.error('Error subscribing to packages:', err);
  });
}

export async function savePackageToCloud(pkg: PackageItem): Promise<void> {
  const docRef = doc(db, COLLECTION_PACKAGES, pkg.id);
  await setDoc(docRef, pkg, { merge: true });
}

export async function deletePackageFromCloud(packageId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_PACKAGES, packageId);
  await deleteDoc(docRef);
}

// 5. Users (Cloud Real-time)
export function subscribeUsers(onUpdate: (users: UserAccount[]) => void) {
  const colRef = collection(db, COLLECTION_USERS);
  return onSnapshot(colRef, (snapshot) => {
    if (snapshot.empty) {
      DEFAULT_USERS.forEach((usr) => {
        setDoc(doc(db, COLLECTION_USERS, usr.id), usr).catch(console.error);
      });
      onUpdate(DEFAULT_USERS);
    } else {
      const usersList: UserAccount[] = [];
      snapshot.forEach((docSnap) => {
        usersList.push(docSnap.data() as UserAccount);
      });
      onUpdate(usersList);
    }
  }, (err) => {
    console.error('Error subscribing to users:', err);
  });
}

export async function saveUserToCloud(user: UserAccount): Promise<UserAccount> {
  const docRef = doc(db, COLLECTION_USERS, user.id);
  await setDoc(docRef, user, { merge: true });
  return user;
}

export async function deleteUserFromCloud(userId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_USERS, userId);
  await deleteDoc(docRef);
}
