import React, { useState } from 'react';
import { 
  FileText, 
  PlusCircle, 
  Package, 
  Users, 
  TrendingUp, 
  Settings, 
  Camera,
  Home,
  ShieldCheck,
  LogIn,
  LogOut,
  User,
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import { StudioProfile, UserAccount } from '../types';
import { InstallPwaModal } from './InstallPwaModal';

export type TabType = 'welcome' | 'invoices' | 'create_invoice' | 'packages' | 'customers' | 'revenue' | 'settings' | 'admin';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  studio: StudioProfile;
  currentUser: UserAccount | null;
  onNewInvoiceClick: () => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  studio,
  currentUser,
  onNewInvoiceClick,
  onOpenAuth,
  onLogout
}) => {
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  return (
    <>
      <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-40 pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Studio Name - Click to return to Welcome Portal */}
            <div 
              onClick={() => setActiveTab('welcome')}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group min-w-0"
              title="ត្រឡប់ទៅកាន់ផ្ទាំងទំព័រដើម (Welcome Portal)"
            >
              {studio.logoUrl ? (
                <img 
                  src={studio.logoUrl} 
                  alt="Studio Logo" 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover ring-2 ring-blue-500/40 group-hover:scale-105 transition-transform shrink-0" 
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-blue-400/20 group-hover:scale-105 transition-transform shrink-0">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h1 className="text-xs sm:text-base font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors truncate max-w-[110px] sm:max-w-xs">
                    {studio.khmerName || studio.name}
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    Dashboard App
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-slate-400 truncate max-w-xs">
                  {studio.tagline || 'ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រជាងថតរូប'}
                </p>
              </div>
            </div>

            {/* User Profile & Quick Action Buttons */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
              
              {/* Add to Home Screen / Install App Button */}
              <button
                onClick={() => setIsPwaModalOpen(true)}
                className="inline-flex items-center space-x-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-sm border border-emerald-400/30 text-[11px] sm:text-xs transition-all active:scale-95 cursor-pointer"
                title="ដំឡើង App ទៅលើ Home Screen ដូច App Original"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                <span>ដំឡើង App</span>
              </button>

              {/* Return to Public Portal Button (Only if not logged in) */}
              {!currentUser && (
                <button
                  onClick={() => setActiveTab('welcome')}
                  className="hidden sm:inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold px-3 py-1.5 rounded-lg border border-slate-700 text-xs transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>ទំព័រដើម Welcome</span>
                </button>
              )}

            {/* Quick Create Invoice (Only for non-admin members, desktop only) */}
            {currentUser?.role !== 'admin' && (
              <button
                onClick={onNewInvoiceClick}
                className="hidden md:inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all text-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>បង្កើតវិក្កយបត្រថ្មី</span>
              </button>
            )}

            {/* User Logged In Profile Badge */}
            {currentUser ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-800/90 border border-slate-700/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl">
                <div className="p-1 bg-blue-600/30 text-blue-400 rounded-lg">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-bold text-white flex items-center space-x-1">
                    <span>{currentUser.name}</span>
                    {currentUser.role === 'admin' && (
                      <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1 rounded">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">@{currentUser.username}</div>
                </div>
                <button
                  onClick={onLogout}
                  title="ចាកចេញ (Logout)"
                  className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded transition-colors cursor-pointer ml-0.5"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs shadow-sm cursor-pointer transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Navigation Tabs (Desktop view only, since mobile uses fixed bottom navbar) */}
        <div className="hidden md:flex space-x-1.5 overflow-x-auto no-scrollbar border-t border-slate-800/90 py-2">
          
          {/* Welcome Tab (Only if NOT logged in) */}
          {!currentUser && (
            <button
              onClick={() => setActiveTab('welcome')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'welcome'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'text-amber-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>ទំព័រដើម Welcome</span>
            </button>
          )}

          {/* If user is Admin, show Admin Console & Settings tabs */}
          {currentUser?.role === 'admin' ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all cursor-pointer border ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                    : 'border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>គ្រប់គ្រងសមាជិក (Admin Console)</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all cursor-pointer border ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white border-blue-400 font-extrabold shadow-sm'
                    : 'border-blue-500/40 text-blue-300 hover:bg-blue-500/20'
                }`}
              >
                <Settings className="w-4 h-4 text-blue-400" />
                <span>កំណត់ Logo & ប្រព័ន្ធ</span>
              </button>
            </div>
          ) : (
            <>
              {/* Invoices */}
              <button
                onClick={() => setActiveTab('invoices')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'invoices'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>បញ្ជីវិក្កយបត្រ</span>
              </button>

              {/* Create Invoice */}
              <button
                onClick={onNewInvoiceClick}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'create_invoice'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>បង្កើតវិក្កយបត្រ</span>
              </button>

              {/* Packages */}
              <button
                onClick={() => setActiveTab('packages')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'packages'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>កញ្ចប់សេវាកម្ម</span>
              </button>

              {/* Customers */}
              <button
                onClick={() => setActiveTab('customers')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'customers'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>ប្រវត្តិអតិថិជន</span>
              </button>

              {/* Revenue */}
              <button
                onClick={() => setActiveTab('revenue')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'revenue'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>បូកសរុបចំណូល</span>
              </button>
            </>
          )}

        </div>
      </div>

      {/* MOBILE APP BOTTOM NAVIGATION BAR (FIXED BOTTOM) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 pb-safe flex items-center justify-around shadow-2xl">
        
        {currentUser?.role === 'admin' ? (
          <>
            {/* Admin Mobile Tab 1: Admin Dashboard */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-6 h-6 mb-0.5 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-300">Admin Console</span>
            </button>

            {/* Admin Mobile Tab 2: Logout */}
            <button
              onClick={onLogout}
              className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">ចាកចេញ</span>
            </button>
          </>
        ) : (
          <>
            {/* Tab 1: Invoices */}
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'invoices'
                  ? 'text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">វិក្កយបត្រ</span>
            </button>

            {/* Tab 2: Packages */}
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'packages'
                  ? 'text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">កញ្ចប់</span>
            </button>

            {/* Tab 3: CENTER FLOATING ACTION - CREATE INVOICE */}
            <button
              onClick={onNewInvoiceClick}
              className="flex flex-col items-center justify-center -mt-5 mx-1 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/50 ring-4 ring-slate-900 group-active:scale-95 transition-all">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-blue-400 mt-0.5">បង្កើតថ្មី</span>
            </button>

            {/* Tab 4: Customers */}
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">អតិថិជន</span>
            </button>

            {/* Tab 5: Settings / Admin */}
            <button
              onClick={() => {
                if (currentUser?.role === 'admin') {
                  setActiveTab('admin');
                } else {
                  setActiveTab('settings');
                }
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'admin' || activeTab === 'settings'
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {currentUser?.role === 'admin' ? (
                <ShieldCheck className="w-5 h-5 mb-0.5 text-amber-400" />
              ) : (
                <Settings className="w-5 h-5 mb-0.5" />
              )}
              <span className="text-[10px]">
                {currentUser?.role === 'admin' ? 'Admin' : 'កំណត់'}
              </span>
            </button>
          </>
        )}

      </div>
    </header>

    {/* Install PWA Modal */}
    <InstallPwaModal
      isOpen={isPwaModalOpen}
      onClose={() => setIsPwaModalOpen(false)}
    />
  </>
);
};
