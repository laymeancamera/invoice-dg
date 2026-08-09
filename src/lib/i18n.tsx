import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'km' | 'en';

export const translations = {
  km: {
    // Navigation
    welcome: 'ទំព័រដើម',
    invoices: 'បញ្ជីវិក្កយបត្រ',
    createInvoice: 'បង្កើតវិក្កយបត្រ',
    packages: 'កញ្ចប់សេវាកម្ម',
    customers: 'អតិថិជន',
    revenue: 'របាយការណ៍',
    invoiceTemplates: 'ម៉ូតវិក្កយបត្រ',
    settings: 'ការកំណត់ Studio',
    adminConsole: 'ផ្ទាំង Admin',
    login: 'ចូលប្រើ',
    register: 'ចុះឈ្មោះ',
    logout: 'ចាកចេញ',
    upgrade: 'Upgrade ($10)',
    noLimit: 'No Limit',
    todayInvoices: 'ថ្ងៃនេះ',
    installApp: 'ដំឡើង App',

    // Buttons & Common
    save: 'រក្សាទុក',
    cancel: 'បោះបង់',
    delete: 'លុប',
    edit: 'កែប្រែ',
    search: 'ស្វែងរក',
    filter: 'តម្រង',
    export: 'ទាញយក',
    print: 'បោះពុម្ព',
    share: 'ចែករំលែក',
    view: 'មើល',
    approve: 'អនុម័ត',
    reject: 'បដិសេធ',
    status: 'ស្ថានភាព',
    action: 'សកម្មភាព',
    pending: 'រង់ចាំពិនិត្យ',
    active: 'កំពុងប្រើ',
    inactive: 'ផ្អាកប្រើ',
    all: 'ទាំងអស់',
    close: 'បិទ',
    confirm: 'បញ្ជាក់',
    back: 'ត្រឡប់ក្រោយ',
    loading: 'កំពុងដំណើរការ...',

    // Welcome Page
    welcomeTitle: 'ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រ Studio រូបថត',
    welcomeSub: 'បង្កើត និងគ្រប់គ្រងវិក្កយបត្រថតរូប វីដេអូ និងអាពាហ៍ពិពាហ៍យ៉ាងរហ័ស ងាយស្រួល និងមានអាជីព',
    quickStart: 'ចាប់ផ្តើមបង្កើតវិក្កយបត្រ',
    viewAllInvoices: 'មើលវិក្កយបត្រទាំងអស់',
    totalInvoicesCount: 'វិក្កយបត្រសរុប',
    totalRevenueCount: 'ចំណូលសរុប',
    paidInvoicesCount: 'បានទូទាត់រួច',
    unpaidInvoicesCount: 'នៅខ្វះប្រាក់',

    // Invoice List
    invoiceListTitle: 'គ្រប់គ្រងបញ្ជីវិក្កយបត្រ',
    searchInvoicePlaceholder: 'ស្វែងរកតាមលេខវិក្កយបត្រ ឈ្មោះអតិថិជន ឬលេខទូរស័ព្ទ...',
    filterAll: 'ទាំងអស់',
    filterPaid: 'ទូទាត់រួច',
    filterPartial: 'បង់ប្រាក់ខ្លះ',
    filterUnpaid: 'មិនទាន់បង់',
    noInvoicesFound: 'មិនទាន់មានវិក្កយបត្រនៅឡើយទេ',
    createNewInvoiceBtn: '+ បង្កើតវិក្កយបត្រថ្មី',
    paymentStatusPaid: 'ទូទាត់រួច',
    paymentStatusPartial: 'បង់ប្រាក់ខ្លះ',
    paymentStatusUnpaid: 'មិនទាន់បង់',

    // Invoice Form & Details
    invoiceNumber: 'លេខវិក្កយបត្រ',
    invoiceDate: 'កាលបរិច្ឆេទវិក្កយបត្រ',
    eventDate: 'កាលបរិច្ឆេទកម្មវិធី',
    customerInfo: 'ព័ត៌មានអតិថិជន',
    customerName: 'ឈ្មោះអតិថិជន',
    phoneNumber: 'លេខទូរស័ព្ទ',
    addressLocation: 'ទីតាំងកម្មវិធី',
    itemsServices: 'មុខទំនិញ / សេវាកម្ម',
    addItem: '+ បន្ថែមមុខទំនិញ',
    qty: 'ចំនួន',
    rate: 'តម្លៃ ($)',
    total: 'សរុប ($)',
    subtotal: 'សរុបបឋម',
    depositPaid: 'បានកក់រួច',
    balanceDue: 'ប្រាក់នៅខ្វះ',
    notesTerms: 'កំណត់ចំណាំ & លក្ខខណ្ឌ',
    paymentInstruction: 'ព័ត៌មានទូទាត់ប្រាក់ (Payment Instruction)',
    scanToPay: 'សូមស្កេន KHQR ដើម្បីធ្វើការទូទាត់ប្រាក់',
    saveInvoiceBtn: 'រក្សាទុកវិក្កយបត្រ',

    // Upgrade & Limits
    upgradeTitle: 'ដំឡេីងគម្រោងប្រើប្រាស់ No Limit ($10)',
    upgradeDesc: 'ទិញតែមួយដងគត់ ប្រើប្រាស់បានរហូត គ្មានដែនកំណត់បង្កើតវិក្កយបត្រ!',
    dailyLimitReached: 'អ្នកបានប្រើប្រាស់អស់កំណត់ 20 វិក្កយបត្រសម្រាប់ថ្ងៃនេះហើយ!',
    uploadPaymentSlip: 'Upload រូបភាពវិក្កយបត្រទូទាត់ប្រាក់ (Payment Slip)',
    submitUpgradeReq: 'ផ្ញើភស្តុតាងសម្រាប់អនុម័ត ($10)',
    upgradeSuccess: 'សំណើ Upgrade ($10) ត្រូវបានផ្ញើរួចរាល់!',

    // Settings
    studioProfile: 'ព័ត៌មាន Studio',
    studioName: 'ឈ្មោះ Studio / ហាង',
    studioPhone: 'លេខទូរស័ព្ទ Studio',
    studioAddress: 'អាសយដ្ឋាន Studio',
    bankInfo: 'ព័ត៌មានធនាគារ (Bakong KHQR)',
    bankAccountName: 'ឈ្មោះគណនីធនាគារ',
    bankAccountNumber: 'លេខគណនីធនាគារ',
    uploadKhqr: 'Upload រូបភាព Bakong KHQR',
    userLogoNotice: 'ℹ️ រូបភាព Logo នេះនឹងបង្ហាញតែនៅលើវិក្កយបត្រក្នុងគណនីរបស់អ្នកប៉ុណ្ណោះ',
    adminLogoNotice: 'រូបភាព Logo នេះនឹងបង្ហាញលើ Header ប្រព័ន្ធ និងវិក្កយបត្រទាំងអស់ (System Wide)',

    // Packages
    packagesTitle: 'គ្រប់គ្រងកញ្ចប់សេវាកម្ម (Packages List)',
    addPackageBtn: '+ បន្ថែមកញ្ចប់ថ្មី',
    packageName: 'ឈ្មោះកញ្ចប់សេវាកម្ម',
    packagePrice: 'តម្លៃ ($)',
    packageDescription: 'ពិពណ៌នាកញ្ចប់សេវាកម្ម',

    // Customers
    customersTitle: 'ប្រវត្តិ និងបញ្ជីអតិថិជន',
    totalSpent: 'ចំណាយសរុប',

    // Revenue
    revenueTitle: 'របាយការណ៍ និងវិភាគចំណូល',
    totalRevenue: 'ប្រាក់ចំណូលសរុប',
    totalDeposit: 'ប្រាក់បានកក់សរុប',
    totalBalance: 'ប្រាក់នៅខ្វះសរុប',

    // Admin
    adminManageUsers: 'គ្រប់គ្រងសមាជិក',
    adminUpgradeReqs: 'សំណើ Upgrade ($10)',
    plan: 'គម្រោង',
    freePlan: 'Free (20 វិក្កយបត្រ/ថ្ងៃ)',
    unlimitedPlan: 'Lifetime Unlimited',
    userList: 'បញ្ជីសមាជិក និងអ្នកប្រើប្រាស់',
    addUserBtn: '+ បង្កើតគណនីថ្មី',
  },
  en: {
    // Navigation
    welcome: 'Home',
    invoices: 'Invoices List',
    createInvoice: 'New Invoice',
    packages: 'Packages',
    customers: 'Customers',
    revenue: 'Revenue Analytics',
    invoiceTemplates: 'Templates',
    settings: 'Studio Settings',
    adminConsole: 'Admin Panel',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    upgrade: 'Upgrade ($10)',
    noLimit: 'No Limit',
    todayInvoices: 'Today',
    installApp: 'Install App',

    // Buttons & Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    print: 'Print',
    share: 'Share',
    view: 'View',
    approve: 'Approve',
    reject: 'Reject',
    status: 'Status',
    action: 'Action',
    pending: 'Pending',
    active: 'Active',
    inactive: 'Inactive',
    all: 'All',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    loading: 'Loading...',

    // Welcome Page
    welcomeTitle: 'Photography Studio Invoice Management System',
    welcomeSub: 'Create and manage wedding, photo, and video invoices quickly, easily, and professionally',
    quickStart: 'Start Creating Invoices',
    viewAllInvoices: 'View All Invoices',
    totalInvoicesCount: 'Total Invoices',
    totalRevenueCount: 'Total Revenue',
    paidInvoicesCount: 'Paid Invoices',
    unpaidInvoicesCount: 'Pending Balance',

    // Invoice List
    invoiceListTitle: 'Invoice Management',
    searchInvoicePlaceholder: 'Search by invoice no., customer name, phone...',
    filterAll: 'All',
    filterPaid: 'Paid',
    filterPartial: 'Partial',
    filterUnpaid: 'Unpaid',
    noInvoicesFound: 'No invoices found',
    createNewInvoiceBtn: '+ Create New Invoice',
    paymentStatusPaid: 'Paid',
    paymentStatusPartial: 'Partial',
    paymentStatusUnpaid: 'Unpaid',

    // Invoice Form & Details
    invoiceNumber: 'Invoice No.',
    invoiceDate: 'Invoice Date',
    eventDate: 'Event Date',
    customerInfo: 'Customer Information',
    customerName: 'Customer Name',
    phoneNumber: 'Phone Number',
    addressLocation: 'Event Location',
    itemsServices: 'Items / Services',
    addItem: '+ Add Item',
    qty: 'Qty',
    rate: 'Rate ($)',
    total: 'Total ($)',
    subtotal: 'Subtotal',
    depositPaid: 'Deposit Paid',
    balanceDue: 'Balance Due',
    notesTerms: 'Notes & Terms',
    paymentInstruction: 'Payment Instruction',
    scanToPay: 'Scan Bakong KHQR to make a payment',
    saveInvoiceBtn: 'Save Invoice',

    // Upgrade & Limits
    upgradeTitle: 'Upgrade to Lifetime No Limit ($10)',
    upgradeDesc: 'One-time payment, lifetime unlimited invoice creation!',
    dailyLimitReached: 'You have reached your daily limit of 20 invoices today!',
    uploadPaymentSlip: 'Upload Payment Slip Image',
    submitUpgradeReq: 'Submit Proof for Approval ($10)',
    upgradeSuccess: 'Upgrade request submitted successfully!',

    // Settings
    studioProfile: 'Studio Profile',
    studioName: 'Studio Name',
    studioPhone: 'Studio Phone',
    studioAddress: 'Studio Address',
    bankInfo: 'Bank Info (Bakong KHQR)',
    bankAccountName: 'Account Name',
    bankAccountNumber: 'Account Number',
    uploadKhqr: 'Upload Bakong KHQR Image',
    userLogoNotice: 'ℹ️ This logo will be displayed on your account invoices only',
    adminLogoNotice: 'This logo will be displayed system-wide across all invoices',

    // Packages
    packagesTitle: 'Packages Management',
    addPackageBtn: '+ Add New Package',
    packageName: 'Package Name',
    packagePrice: 'Price ($)',
    packageDescription: 'Package Description',

    // Customers
    customersTitle: 'Customer History & Directory',
    totalSpent: 'Total Spent',

    // Revenue
    revenueTitle: 'Revenue Analytics & Reports',
    totalRevenue: 'Total Revenue',
    totalDeposit: 'Total Deposit Paid',
    totalBalance: 'Total Pending Balance',

    // Admin
    adminManageUsers: 'User Management',
    adminUpgradeReqs: 'Upgrade Requests ($10)',
    plan: 'Plan',
    freePlan: 'Free (20 Invoices/Day)',
    unlimitedPlan: 'Lifetime Unlimited',
    userList: 'User & Member Accounts List',
    addUserBtn: '+ Create New Account',
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.km;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'km',
  setLang: () => {},
  t: translations.km
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_language');
      if (saved === 'en' || saved === 'km') return saved;
    }
    return 'km';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_language', newLang);
    }
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
