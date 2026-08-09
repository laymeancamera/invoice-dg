import React, { useState } from 'react';
import { 
  UserAccount, 
  StudioProfile 
} from '../types';
import { 
  getUsers, 
  getInvoices 
} from '../lib/storage';
import { 
  Camera, 
  Sparkles, 
  Users, 
  UserCheck, 
  UserX, 
  FileText, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  ArrowRight, 
  QrCode, 
  Send, 
  Download, 
  BarChart3, 
  Package, 
  HeartHandshake,
  LogOut,
  User,
  LayoutDashboard,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Smartphone
} from 'lucide-react';
import { InstallPwaModal } from './InstallPwaModal';
import { Globe } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

interface WelcomePageProps {
  studio: StudioProfile;
  currentUser: UserAccount | null;
  onOpenAuth: (tab: 'login' | 'register' | 'forgot') => void;
  onNavigateToApp: () => void;
  onNavigateToAdmin: () => void;
  onLogout: () => void;
}

export function WelcomePage({
  studio,
  currentUser,
  onOpenAuth,
  onNavigateToApp,
  onNavigateToAdmin,
  onLogout
}: WelcomePageProps) {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  
  const users = getUsers();
  const invoices = getInvoices();

  // Statistics
  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status === 'active').length;
  const inactiveUsersCount = users.filter((u) => u.status === 'inactive').length;
  const totalInvoicesCount = invoices.length;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLaunchApp = () => {
    if (!currentUser) {
      onOpenAuth('register');
    } else {
      onNavigateToApp();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. STANDALONE PUBLIC LANDING NAVBAR */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 pt-safe">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[3.5rem] sm:h-20 py-2 sm:py-0">
            
            {/* Logo & Brand */}
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img 
                src={studio.logoUrl || '/digital_pro_logo.svg'} 
                alt="Digital Pro Logo" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/digital_pro_logo.svg';
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-blue-500/50 shrink-0" 
              />
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm sm:text-lg font-black tracking-tight text-white truncate max-w-[140px] sm:max-w-none">
                    វិក្កយបត្រ <span className="text-blue-400">Digital Pro</span>
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full shrink-0">
                    Public Portal
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[150px] sm:max-w-none">
                  {studio.khmerName || studio.name || 'ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រជាងថតរូប'}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-300">
              <button 
                onClick={() => scrollToSection('about')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                អំពីប្រព័ន្ធ
              </button>
              <button 
                onClick={() => scrollToSection('stats')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                ស្ថិតិប្រើប្រាស់
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                សេវាកម្មប្រព័ន្ធ
              </button>
              <button 
                onClick={() => scrollToSection('cta')} 
                className="hover:text-white transition-colors cursor-pointer"
              >
                ចាប់ផ្តើមប្រើប្រាស់
              </button>
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'km' ? 'en' : 'km')}
                className="px-3 py-2 text-xs font-bold text-amber-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
                title={lang === 'km' ? 'Switch to English' : 'ប្តូរទៅភាសាខ្មែរ'}
              >
                <Globe className="w-4 h-4 text-amber-400" />
                <span>{lang === 'km' ? '🇰🇭 ខ្មែរ' : '🇬🇧 EN'}</span>
              </button>

              <button
                onClick={() => setIsPwaModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/30 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 active:scale-95"
                title="ដំឡើង App ទៅលើ Home Screen"
              >
                <Smartphone className="w-4 h-4 text-emerald-200 animate-pulse" />
                <span>{t.installApp}</span>
              </button>
              {currentUser ? (
                <div className="flex items-center space-x-3 bg-slate-800 border border-slate-700/80 px-3.5 py-1.5 rounded-xl">
                  <div className="p-1 bg-blue-500/20 text-blue-400 rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left text-xs">
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
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-blue-400" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}

            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-xs font-bold text-slate-300 hover:text-white"
            >
              អំពីប្រព័ន្ធ
            </button>
            <button
              onClick={() => scrollToSection('stats')}
              className="block w-full text-left py-2 text-xs font-bold text-slate-300 hover:text-white"
            >
              ស្ថិតិប្រើប្រាស់
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="block w-full text-left py-2 text-xs font-bold text-slate-300 hover:text-white"
            >
              សេវាកម្មប្រព័ន្ធ
            </button>
            <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
              {!currentUser ? (
                <>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
                    className="w-full py-2.5 text-xs font-bold bg-slate-800 text-white rounded-lg text-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}
                    className="w-full py-2.5 text-xs font-bold bg-emerald-600 text-white rounded-lg text-center"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="w-full py-2.5 text-xs font-bold bg-rose-600/80 text-white rounded-lg text-center"
                >
                  ចាកចេញ (Logout)
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. MAIN HERO SECTION */}
      <section className="relative overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full text-xs font-bold text-blue-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រ និងសេវាកម្មថតរូបអាជីព</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              វិក្កយបត្រ <span className="text-blue-400">Digital Pro</span> <br />
              <span className="text-2xl sm:text-4xl text-slate-200 font-extrabold mt-2 block">
                ផ្ទាំង Portal ផ្លូវការសម្រាប់ជាងថតរូប
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              ដំណោះស្រាយឌីជីថលឆ្លាតវៃ រចនាឡើងយ៉ាងពិសេសសម្រាប់ ជាងថតរូប (Photographers), 
              អ្នកថតវីដេអូ, និង ហាងថតរូបមង្គលការ (Wedding Photo Studios) ក្នុងប្រទេសកម្ពុជា។ 
              បង្កើតវិក្កយបត្រស្អាត, បញ្ចូល KHQR ទូទាត់, ផ្ញើទៅ Telegram រហ័ស, និងតាមដានចំណូលបានយ៉ាងងាយស្រួល។
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              
              <button
                onClick={handleLaunchApp}
                className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black px-7 py-3.5 rounded-2xl shadow-xl shadow-blue-600/30 transition-all text-sm cursor-pointer border border-blue-400/40"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>{currentUser ? 'ចូលទៅកាន់ App ថតរូប (Launch App)' : 'ចុះឈ្មោះចូលប្រើប្រាស់ App (Sign Up)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!currentUser ? null : currentUser.role === 'admin' ? (
                <button
                  onClick={onNavigateToAdmin}
                  className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg transition-all text-sm cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>គ្រប់គ្រង Admin Console</span>
                </button>
              ) : null}

            </div>



          </div>

          {/* Right Visual Box */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl w-full max-w-sm space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">ប្រព័ន្ធដំណើរការធម្មតា</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 bg-blue-500/20 text-blue-400 font-extrabold rounded-full border border-blue-500/30">
                  v2.5 Release
                </span>
              </div>

              {/* Feature Cards Preview */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <QrCode className="w-4 h-4 text-rose-400" />
                    <span className="text-slate-200 font-bold">Bakong KHQR Code</span>
                  </div>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">រួចរាល់</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <Send className="w-4 h-4 text-sky-400" />
                    <span className="text-slate-200 font-bold">Telegram Direct Share</span>
                  </div>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">1-Click</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-200 font-bold">PNG HD Invoice Export</span>
                  </div>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">HD 100%</span>
                </div>
              </div>

              <div className="pt-2 text-center text-[11px] text-slate-400 italic border-t border-slate-800">
                "រៀបចំវិក្កយបត្រឱ្យមានរបៀបរៀបរយ ស្អាត និងគួរឱ្យជឿជាក់"
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. PLATFORM USAGE STATS SECTION */}
      <section id="stats" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30 uppercase">
              Live Platform Metrics
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              ស្ថិតិអ្នកប្រើប្រាស់ និងការប្រើប្រាស់ប្រព័ន្ធ
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              ទិន្នន័យជាក់ស្តែងនៃចំនួនអ្នកប្រើប្រាស់សរុប អ្នកកំពុងប្រើប្រាស់ និងវិក្កយបត្រក្នុងប្រព័ន្ធ
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: Total Users */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold">អ្នកប្រើប្រាស់សរុប</span>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {totalUsersCount} <span className="text-xs font-normal text-slate-400">គណនី</span>
              </div>
              <p className="text-[11px] text-slate-500">
                បានចុះឈ្មោះក្នុងប្រព័ន្ធ
              </p>
            </div>

            {/* Card 2: Active Users */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold text-emerald-400">កំពុងប្រើប្រាស់ (Active)</span>
                <UserCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">
                {activeUsersCount} <span className="text-xs font-normal text-slate-400">គណនី</span>
              </div>
              <p className="text-[11px] text-emerald-500/80 font-medium">
                សកម្មភាពធម្មតា
              </p>
            </div>

            {/* Card 3: Inactive Users */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold text-amber-400">ផ្អាកប្រើប្រាស់ (Inactive)</span>
                <UserX className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400">
                {inactiveUsersCount} <span className="text-xs font-normal text-slate-400">គណនី</span>
              </div>
              <p className="text-[11px] text-amber-500/80 font-medium">
                ផ្អាកជាបណ្តោះអាសន្ន
              </p>
            </div>

            {/* Card 4: Invoices Created */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold">វិក្កយបត្របានបង្កើត</span>
                <FileText className="w-5 h-5 text-sky-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {totalInvoicesCount} <span className="text-xs font-normal text-slate-400">វិក្កយបត្រ</span>
              </div>
              <p className="text-[11px] text-slate-500">
                សរុបទូទាំងប្រព័ន្ធ
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. ABOUT SYSTEM SECTION (អំពីប្រព័ន្ធ) */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold">
              <HeartHandshake className="w-4 h-4" />
              <span>អំពីប្រព័ន្ធ (About PhotoStudio Pro)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រដែលយល់ច្បាស់ពីតម្រូវការជាងថតរូប
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              ជាងថតរូប និងម្ចាស់ Studio ជាច្រើនតែងតែជួបការលំបាកក្នុងការកត់ត្រាប្រាក់កក់ថ្ងៃការ, 
              ការរៀបចំបញ្ជីអាវ/អាល់ប៊ុមក្នុងកញ្ចប់ Pre-wedding, និងការផ្ញើវិក្កយបត្រអោយអតិថិជន។ 
              <strong className="text-blue-400 font-bold">PhotoStudio Pro</strong> ត្រូវបានបង្កើតឡើងដើម្បីដោះស្រាយបញ្ហាទាំងនេះដោយផ្ទាល់!
            </p>
          </div>

          {/* 3 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="p-3 bg-blue-600 text-white rounded-2xl w-fit">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">
                រចនាសម្រាប់ Photography Standard
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                មានមុខងារជ្រើសរើសកញ្ចប់ Pre-wedding, Wedding Day, Combo និងការបន្ថែមជម្រើសអាវ ៣ឈុត, អាល់ប៊ុម VIP 30x40cm ដោយស្វ័យប្រវត្តិ។
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="p-3 bg-rose-600 text-white rounded-2xl w-fit">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">
                ទូទាត់ Bakong KHQR ងាយស្រួល
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                អតិថិជនអាច Scan បង់ប្រាក់កក់ ឬប្រាក់នៅសល់តាម Bakong KHQR ដោយផ្ទាល់នៅលើផ្ទាំងវិក្កយបត្រយ៉ាងរហ័ស។
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="p-3 bg-sky-600 text-white rounded-2xl w-fit">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">
                Telegram Instant Direct Share
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ផ្ញើសារសង្ខេបវិក្កយបត្រ និង Link/រូបភាព ទៅកាន់ Telegram អតិថិជនបានត្រឹមតែចុច ១ដង មិនបាច់វាយអក្សរឡើងវិញ។
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SERVICES & FEATURES GRID (សេវាកម្មប្រព័ន្ធ) */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 uppercase">
              Services & Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              សេវាកម្ម និងសមត្ថភាពរបស់ប្រព័ន្ធ (Platform Services)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              រៀបចំឡើងយ៉ាងពេញលេញ ដើម្បីជួយអោយការងារថតរូបរបស់អ្នកកាន់តែមានអាជីព
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Service 1 */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                ១. បង្កើតវិក្កយបត្រឌីជីថល (Digital Invoices)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                បញ្ចូលឈ្មោះកូនកំលោះ កូនក្រមុំ, លេខទូរស័ព្ទ, ថ្ងៃរៀបការ, ទីតាំង, គណនាប្រាក់កក់ និងប្រាក់នៅខ្វះស្វ័យប្រវត្តិ។
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl w-fit">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                ២. កញ្ចប់សេវាកម្ម (Package Templates)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                កំណត់កញ្ចប់តម្លៃរហ័ស Pre-wedding, Wedding Day, Combo Special ជាមួយបញ្ជីសម្ភារក្នុងកញ្ចប់យ៉ាងលម្អិត។
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                ៣. Export PNG HD & Print
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ទាញយកវិក្កយបត្រជារូបភាព PNG HD កម្រិតច្បាស់ខ្ពស់សម្រាប់ផ្ញើតាម Chat ឬបោះពុម្ព (Print) ជាក្រដាស។
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="p-3 bg-sky-500/20 text-sky-400 rounded-xl w-fit">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                ៤. ផ្ញើតាម Telegram 1-Click
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ចែករំលែកព័ត៌មានវិក្កយបត្រទៅ Telegram អតិថិជនដោយស្វ័យប្រវត្តិ រួមទាំងអត្ថបទសង្ខេបភាសាខ្មែរ។
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl w-fit">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                ៥. របាយការណ៍ចំណូល & អតិថិជន
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                តាមដានចំណូលប្រចាំខែ, ប្រាក់ដែលអតិថិជននៅខ្វះ (Balance Due), និងប្រវត្តិការកត់ត្រាប្រាក់កក់។
              </p>
            </div>

            {/* Service 6 */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                ៦. ប្រព័ន្ធគ្រប់គ្រងសមាជិក (Admin Console)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                គ្រប់គ្រងគណនីសមាជិក, ស្ថានភាពប្រើប្រាស់ Active/Inactive, និងការកំណត់ប្រព័ន្ធទាំងមូល។
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION & LAUNCH APP BANNER */}
      <section id="cta" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-8 sm:p-14 rounded-3xl border border-blue-500/30 shadow-2xl text-center space-y-8 relative overflow-hidden">
          
          <div className="space-y-3 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              ចាប់ផ្តើមរៀបចំវិក្កយបត្រ និងសេវាកម្មថតរូបរបស់អ្នកឥឡូវនេះ
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              គ្មានការស្មុគស្មាញ បង្កើតវិក្កយបត្រដំបូងរបស់អ្នកបានត្រឹមតែ 1 នាទីប៉ុណ្ណោះ!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              onClick={handleLaunchApp}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-600/40 transition-all cursor-pointer flex items-center space-x-2 border border-blue-400/40"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>{currentUser ? 'ចូលទៅកាន់ App ថតរូបឥឡូវនេះ (Launch App)' : 'ចុះឈ្មោះជាសមាជិកដើម្បីប្រើប្រាស់ App'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!currentUser && (
              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl border border-slate-700 transition-all cursor-pointer flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>ចុះឈ្មោះជាសមាជិក (Sign Up)</span>
              </button>
            )}
          </div>

        </div>
      </section>

      {/* 7. STANDALONE PUBLIC FOOTER */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-800 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <Camera className="w-5 h-5 text-blue-400" />
            <div>
              <span className="font-bold text-white">វិក្កយបត្រ Digital Pro</span>
              <p className="text-[11px] text-slate-500">© 2026 LAY MEAN . All rights reserved.</p>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-500 space-y-1">
            <p>ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រជាងថតរូបអាជីព • គាំទ្រទូទាត់ Bakong KHQR & Telegram Export</p>
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer text-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>ដំឡើង App ទៅលើ Home Screen</span>
            </button>
          </div>

        </div>
      </footer>

      {/* Install PWA Modal */}
      <InstallPwaModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />

    </div>
  );
}
