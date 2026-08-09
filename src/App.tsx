import React, { useState, useEffect } from 'react';
import { 
  Invoice, 
  StudioProfile, 
  PackageItem, 
  CustomerProfile,
  UserAccount
} from './types';
import { 
  getInvoices, 
  saveSingleInvoice, 
  deleteInvoice, 
  getStudioProfile, 
  saveStudioProfile, 
  getPackages, 
  saveSinglePackage, 
  deletePackage, 
  getCustomers,
  getCurrentUser,
  setCurrentUser,
  saveSingleUser,
  getUserTodayInvoiceCount,
  STORAGE_EVENT 
} from './lib/storage';
import { Navbar, TabType } from './components/Navbar';
import { WelcomePage } from './components/WelcomePage';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreviewModal } from './components/InvoicePreviewModal';
import { PaymentModal } from './components/PaymentModal';
import { CustomerDirectory } from './components/CustomerDirectory';
import { PackageManager } from './components/PackageManager';
import { RevenueAnalytics } from './components/RevenueAnalytics';
import { StudioSettings } from './components/StudioSettings';
import { InvoiceTemplateSelector } from './components/InvoiceTemplateSelector';
import { UpgradeModal } from './components/UpgradeModal';

export default function App() {
  const initialUser = getCurrentUser();
  const [currentUser, setCurrentUserLocal] = useState<UserAccount | null>(initialUser);
  const [activeTab, setActiveTab] = useState<TabType>(
    initialUser ? (initialUser.role === 'admin' ? 'admin' : 'invoices') : 'welcome'
  );

  // Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Storage State
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [studio, setStudio] = useState<StudioProfile>(getStudioProfile());
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);

  // Modals & Editing State
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const todayInvoiceCount = currentUser ? getUserTodayInvoiceCount(currentUser.id) : 0;

  // Check 20 daily invoice limit for member users
  const checkInvoiceLimit = (): boolean => {
    if (!currentUser) return true;
    const isUnlimited = currentUser.role === 'admin' || currentUser.isUnlimited || currentUser.plan === 'unlimited';
    if (isUnlimited) return true;

    if (todayInvoiceCount >= 20) {
      alert('⚠️ អ្នកបានប្រើប្រាស់អស់កំណត់ 20 វិក្កយបត្រសម្រាប់ថ្ងៃនេះហើយ! សូម Upgrade ទៅកាន់គម្រោង No Limit ($10) ដើម្បីបង្កើតបន្ថែម!');
      setIsUpgradeModalOpen(true);
      return false;
    }
    return true;
  };

  // Load state from localStorage on mount & on storage change event
  const refreshData = () => {
    setInvoices(getInvoices());
    setStudio(getStudioProfile());
    setPackages(getPackages());
    setCustomers(getCustomers());
    setCurrentUserLocal(getCurrentUser());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener(STORAGE_EVENT, refreshData);
    return () => window.removeEventListener(STORAGE_EVENT, refreshData);
  }, []);

  // Open Auth Modal helper
  const handleOpenAuth = (tab: 'login' | 'register' | 'forgot') => {
    setAuthDefaultTab(tab);
    setIsAuthModalOpen(true);
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserLocal(null);
    setActiveTab('welcome');
  };

  // Login Success Callback
  const handleSuccessLogin = (user: UserAccount) => {
    setCurrentUserLocal(user);
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('invoices');
    }
  };

  // Invoice Handlers
  const handleSaveInvoice = (inv: Invoice) => {
    const saved = saveSingleInvoice(inv);
    setInvoiceToEdit(null);
    setSelectedInvoiceForView(saved); // Open view modal upon save for immediate feedback & PNG export!
    setActiveTab('invoices');
  };

  const handleDeleteInvoice = (id: string) => {
    deleteInvoice(id);
    if (selectedInvoiceForView?.id === id) setSelectedInvoiceForView(null);
  };

  const handleEditInvoice = (inv: Invoice) => {
    setInvoiceToEdit(inv);
    setActiveTab('create_invoice');
  };

  const handleCreateNewClick = () => {
    if (!checkInvoiceLimit()) return;
    setInvoiceToEdit(null);
    setActiveTab('create_invoice');
  };

  // Package Handlers
  const handleSavePackage = (pkg: PackageItem) => {
    saveSinglePackage(pkg);
  };

  const handleDeletePackage = (id: string) => {
    deletePackage(id);
  };

  // Tab Change Handler enforcing login/signup and role boundaries
  const handleTabChange = (tab: TabType) => {
    // If NOT logged in, only welcome is active. Selecting anything else opens auth.
    if (!currentUser) {
      if (tab === 'welcome') {
        setActiveTab('welcome');
      } else {
        handleOpenAuth('login');
      }
      return;
    }

    // If logged in as ADMIN:
    if (currentUser.role === 'admin') {
      if (tab === 'settings' || tab === 'admin') {
        setActiveTab(tab);
      } else {
        setActiveTab('admin');
      }
      return;
    }

    // If logged in as MEMBER:
    // Disallow switching back to welcome page while logged in
    if (tab === 'welcome') {
      setActiveTab('invoices');
      return;
    }

    // Member cannot access admin tab
    if (tab === 'admin') {
      handleOpenAuth('login');
      return;
    }

    if (tab === 'create_invoice' && !invoiceToEdit) {
      if (!checkInvoiceLimit()) return;
    }

    setActiveTab(tab);
  };

  // Effective Studio Profile for current user view & invoices
  const effectiveStudio: StudioProfile = {
    ...studio,
    logoUrl: currentUser?.role === 'admin' 
      ? (studio.logoUrl || '/digital_pro_logo.svg')
      : (currentUser?.logoUrl || '/digital_pro_logo.svg')
  };

  // Studio Settings Handler
  const handleSaveStudio = (prof: StudioProfile) => {
    if (currentUser && currentUser.role !== 'admin') {
      // Non-admin Member user:
      // Preserve system studio logoUrl unchanged
      const currentSystemStudio = getStudioProfile();
      const userCustomLogo = prof.logoUrl;

      // 1. Keep system studio logoUrl intact
      const systemStudioToSave: StudioProfile = {
        ...prof,
        logoUrl: currentSystemStudio.logoUrl || '/digital_pro_logo.svg'
      };
      setStudio(systemStudioToSave);
      saveStudioProfile(systemStudioToSave);

      // 2. Save custom logoUrl on currentUser account
      const updatedUser: UserAccount = {
        ...currentUser,
        logoUrl: userCustomLogo
      };
      saveSingleUser(updatedUser);
      setCurrentUser(updatedUser);
      setCurrentUserLocal(updatedUser);
    } else {
      // Admin: updates system studio profile
      setStudio(prof);
      saveStudioProfile(prof);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      
      {/* 1. STANDALONE WELCOME PAGE (SEPARATE FROM INTERNAL APP SYSTEM) */}
      {activeTab === 'welcome' ? (
        <WelcomePage
          studio={studio}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onNavigateToApp={() => {
            if (!currentUser) {
              handleOpenAuth('register');
            } else if (currentUser.role === 'admin') {
              setActiveTab('admin');
            } else {
              setActiveTab('invoices');
            }
          }}
          onNavigateToAdmin={() => {
            if (!currentUser || currentUser.role !== 'admin') {
              handleOpenAuth('login');
            } else {
              setActiveTab('admin');
            }
          }}
          onLogout={handleLogout}
        />
      ) : (
        /* 2. INTERNAL APPLICATION DASHBOARD SYSTEM LAYOUT */
        <div className="flex-1 flex flex-col min-h-screen">
          
          {/* Internal Application Header & Tabs */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            studio={studio}
            currentUser={currentUser}
            onNewInvoiceClick={handleCreateNewClick}
            onOpenAuth={(tab) => handleOpenAuth(tab)}
            onLogout={handleLogout}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            todayInvoiceCount={todayInvoiceCount}
          />

          {/* Main App Workspace */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
            
            {/* Tab Admin: Admin Dashboard */}
            {activeTab === 'admin' && (
              <AdminDashboard
                currentUser={currentUser}
              />
            )}

            {/* Tab 1: Invoice List */}
            {activeTab === 'invoices' && (
              <InvoiceList
                invoices={invoices}
                studio={effectiveStudio}
                onView={(inv) => setSelectedInvoiceForView(inv)}
                onEdit={handleEditInvoice}
                onPayment={(inv) => setSelectedInvoiceForPayment(inv)}
                onDelete={handleDeleteInvoice}
                onCreateNew={handleCreateNewClick}
              />
            )}

            {/* Tab 2: Create / Edit Invoice */}
            {activeTab === 'create_invoice' && (
              <InvoiceForm
                initialInvoice={invoiceToEdit}
                packages={packages}
                studio={effectiveStudio}
                onSave={handleSaveInvoice}
                onCancel={() => {
                  setInvoiceToEdit(null);
                  setActiveTab('invoices');
                }}
              />
            )}

            {/* Tab 3: Preset Packages Manager */}
            {activeTab === 'packages' && (
              <PackageManager
                packages={packages}
                onSavePackage={handleSavePackage}
                onDeletePackage={handleDeletePackage}
              />
            )}

            {/* Tab 4: Customer Directory */}
            {activeTab === 'customers' && (
              <CustomerDirectory
                customers={customers}
                invoices={invoices}
                onViewInvoice={(inv) => setSelectedInvoiceForView(inv)}
              />
            )}

            {/* Tab 5: Revenue Analytics */}
            {activeTab === 'revenue' && (
              <RevenueAnalytics
                invoices={invoices}
                studio={effectiveStudio}
              />
            )}

            {/* Tab 6: Studio & KHQR Settings */}
            {activeTab === 'settings' && (
              <StudioSettings
                studio={effectiveStudio}
                currentUser={currentUser}
                onSaveStudio={handleSaveStudio}
              />
            )}

            {/* Tab 7: Invoice Templates Manager */}
            {activeTab === 'invoice_templates' && (
              <InvoiceTemplateSelector
                studio={effectiveStudio}
                onSaveStudio={handleSaveStudio}
              />
            )}

          </main>

          {/* Internal Dashboard Footer */}
          <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-center text-xs mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>© {new Date().getFullYear()} {studio.khmerName || studio.name}. All rights reserved.</p>
              <p className="text-slate-500">
                ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រជាងថតរូប • គាំទ្រទូទាត់ Bakong KHQR & ផ្ញើតាម Telegram
              </p>
            </div>
          </footer>

        </div>
      )}

      {/* Auth Modal (Sign In / Sign Up / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authDefaultTab}
        onSuccessLogin={handleSuccessLogin}
      />

      {/* Invoice Preview & PNG Export Modal */}
      {selectedInvoiceForView && (
        <InvoicePreviewModal
          invoice={selectedInvoiceForView}
          studio={effectiveStudio}
          currentUser={currentUser}
          onClose={() => setSelectedInvoiceForView(null)}
          onEdit={(inv) => {
            setSelectedInvoiceForView(null);
            handleEditInvoice(inv);
          }}
          onPayment={(inv) => {
            setSelectedInvoiceForView(null);
            setSelectedInvoiceForPayment(inv);
          }}
        />
      )}

      {/* Payment Record Modal */}
      {selectedInvoiceForPayment && (
        <PaymentModal
          invoice={selectedInvoiceForPayment}
          onSavePayment={(updated) => {
            saveSingleInvoice(updated);
            setSelectedInvoiceForPayment(null);
            setSelectedInvoiceForView(updated);
          }}
          onClose={() => setSelectedInvoiceForPayment(null)}
        />
      )}

      {/* Upgrade Modal ($10 No Limit) */}
      {isUpgradeModalOpen && currentUser && (
        <UpgradeModal
          currentUser={currentUser}
          adminStudio={studio}
          onClose={() => setIsUpgradeModalOpen(false)}
          onSuccess={() => {
            refreshData();
          }}
        />
      )}

    </div>
  );
}
