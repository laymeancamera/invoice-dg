import React, { createContext, useContext, useState } from 'react';

export type Language = 'km' | 'en';

export const translations = {
  km: {
    // Navigation & Common Header
    welcome: 'ទំព័រដើម',
    welcomePortal: 'ទំព័រដើម Welcome',
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
    superAppPro: 'SUPER APP PRO',
    memberStudio: 'Member Studio',

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
    accounts: 'គណនី',

    // Welcome Page Section
    publicPortal: 'Public Portal',
    aboutSystem: 'អំពីប្រព័ន្ធ',
    usageStats: 'ស្ថិតិប្រើប្រាស់',
    systemServices: 'សេវាកម្មប្រព័ន្ធ',
    getStarted: 'ចាប់ផ្តើមប្រើប្រាស់',
    launchApp: 'ចូលទៅកាន់ App ថតរូប (Launch App)',
    signUpApp: 'ចុះឈ្មោះចូលប្រើប្រាស់ App (Sign Up)',
    heroTag: 'ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រ និងសេវាកម្មថតរូបអាជីព',
    heroTitlePart1: 'វិក្កយបត្រ',
    heroTitlePart2: 'Digital Pro',
    heroSubtitle: 'ផ្ទាំង Portal ផ្លូវការសម្រាប់ជាងថតរូប',
    heroDesc: 'ដំណោះស្រាយឌីជីថលឆ្លាតវៃ រចនាឡើងយ៉ាងពិសេសសម្រាប់ ជាងថតរូប (Photographers), អ្នកថតវីដេអូ, និង ហាងថតរូបមង្គលការ (Wedding Photo Studios) ក្នុងប្រទេសកម្ពុជា។ បង្កើតវិក្កយបត្រស្អាត, បញ្ចូល KHQR ទូទាត់, ផ្ញើទៅ Telegram រហ័ស, និងតាមដានចំណូលបានយ៉ាងងាយស្រួល។',
    systemNormal: 'ប្រព័ន្ធដំណើរការធម្មតា',
    sloganQuote: '"រៀបចំវិក្កយបត្រឱ្យមានរបៀបរៀបរយ ស្អាត និងគួរឱ្យជឿជាក់"',
    
    // Stats Section
    livePlatformMetrics: 'Live Platform Metrics',
    statsTitle: 'ស្ថិតិអ្នកប្រើប្រាស់ និងការប្រើប្រាស់ប្រព័ន្ធ',
    statsSub: 'ទិន្នន័យជាក់ស្តែងនៃចំនួនអ្នកប្រើប្រាស់សរុប អ្នកកំពុងប្រើប្រាស់ និងវិក្កយបត្រក្នុងប្រព័ន្ធ',
    totalUsers: 'អ្នកប្រើប្រាស់សរុប',
    registeredInSystem: 'បានចុះឈ្មោះក្នុងប្រព័ន្ធ',
    activeUsers: 'កំពុងប្រើប្រាស់ (Active)',
    activeNormal: 'សកម្មភាពធម្មតា',
    inactiveUsers: 'ផ្អាកប្រើប្រាស់ (Inactive)',
    pausedTemp: 'ផ្អាកជាបណ្តោះអាសន្ន',
    createdInvoices: 'វិក្កយបត្របានបង្កើត',
    totalSystemWide: 'សរុបទូទាំងប្រព័ន្ធ',

    // About Section
    aboutTag: 'អំពីប្រព័ន្ធ (About Digital Pro)',
    aboutTitle: 'ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រដែលយល់ច្បាស់ពីតម្រូវការជាងថតរូប',
    aboutDesc: 'ជាងថតរូប និងម្ចាស់ Studio ជាច្រើនតែងតែជួបការលំបាកក្នុងការកត់ត្រាប្រាក់កក់ថ្ងៃការ, ការរៀបចំបញ្ជីអាវ/អាល់ប៊ុមក្នុងកញ្ចប់ Pre-wedding, និងការផ្ញើវិក្កយបត្រអោយអតិថិជន។ Digital Pro ត្រូវបានបង្កើតឡើងដើម្បីដោះស្រាយបញ្ហាទាំងនេះដោយផ្ទាល់!',
    pillar1Title: 'រចនាសម្រាប់ Photography Standard',
    pillar1Desc: 'មានមុខងារជ្រើសរើសកញ្ចប់ Pre-wedding, Wedding Day, Combo និងការបន្ថែមជម្រើសអាវ ៣ឈុត, អាល់ប៊ុម VIP 30x40cm ដោយស្វ័យប្រវត្តិ។',
    pillar2Title: 'ទូទាត់ Bakong KHQR ងាយស្រួល',
    pillar2Desc: 'អតិថិជនអាច Scan បង់ប្រាក់កក់ ឬប្រាក់នៅសល់តាម Bakong KHQR ដោយផ្ទាល់នៅលើផ្ទាំងវិក្កយបត្រយ៉ាងរហ័ស។',
    pillar3Title: 'Telegram Instant Direct Share',
    pillar3Desc: 'ផ្ញើសារសង្ខេបវិក្កយបត្រ និង Link/រូបភាព ទៅកាន់ Telegram អតិថិជនបានត្រឹមតែចុច ១ដង មិនបាច់វាយអក្សរឡើងវិញ។',

    // Services Section
    servicesTag: 'Services & Capabilities',
    servicesTitle: 'សេវាកម្ម និងសមត្ថភាពរបស់ប្រព័ន្ធ (Platform Services)',
    servicesSub: 'រៀបចំឡើងយ៉ាងពេញលេញ ដើម្បីជួយអោយការងារថតរូបរបស់អ្នកកាន់តែមានអាជីព',
    service1Title: '១. បង្កើតវិក្កយបត្រឌីជីថល (Digital Invoices)',
    service1Desc: 'បញ្ចូលឈ្មោះកូនកំលោះ កូនក្រមុំ, លេខទូរស័ព្ទ, ថ្ងៃរៀបការ, ទីតាំង, គណនាប្រាក់កក់ និងប្រាក់នៅខ្វះស្វ័យប្រវត្តិ។',
    service2Title: '២. កញ្ចប់សេវាកម្ម (Package Templates)',
    service2Desc: 'កំណត់កញ្ចប់តម្លៃរហ័ស Pre-wedding, Wedding Day, Combo Special ជាមួយបញ្ជីសម្ភារក្នុងកញ្ចប់យ៉ាងលម្អិត។',
    service3Title: '៣. Export PNG HD & Print',
    service3Desc: 'ទាញយកវិក្កយបត្រជារូបភាព PNG HD កម្រិតច្បាស់ខ្ពស់សម្រាប់ផ្ញើតាម Chat ឬបោះពុម្ព (Print) ជាក្រដាស។',
    service4Title: '៤. ផ្ញើតាម Telegram 1-Click',
    service4Desc: 'ចែករំលែកព័ត៌មានវិក្កយបត្រទៅ Telegram អតិថិជនដោយស្វ័យប្រវត្តិ រួមទាំងអត្ថបទសង្ខេបភាសាខ្មែរ។',
    service5Title: '៥. របាយការណ៍ចំណូល & អតិថិជន',
    service5Desc: 'តាមដានចំណូលប្រចាំខែ, ប្រាក់ដែលអតិថិជននៅខ្វះ (Balance Due), និងប្រវត្តិការកត់ត្រាប្រាក់កក់។',
    service6Title: '៦. ប្រព័ន្ធគ្រប់គ្រងសមាជិក (Admin Console)',
    service6Desc: 'គ្រប់គ្រងគណនីសមាជិក, ស្ថានភាពប្រើប្រាស់ Active/Inactive, និងការកំណត់ប្រព័ន្ធទាំងមូល។',

    // CTA Section
    ctaTitle: 'ចាប់ផ្តើមរៀបចំវិក្កយបត្រ និងសេវាកម្មថតរូបរបស់អ្នកឥឡូវនេះ',
    ctaSub: 'គ្មានការស្មុគស្មាញ បង្កើតវិក្កយបត្រដំបូងរបស់អ្នកបានត្រឹមតែ 1 នាទីប៉ុណ្ណោះ!',
    ctaButtonLaunch: 'ចូលទៅកាន់ App ថតរូបឥឡូវនេះ (Launch App)',
    ctaButtonSignUp: 'ចុះឈ្មោះជាសមាជិកដើម្បីប្រើប្រាស់ App',

    // Footer
    copyright: '© 2026 វិក្កយបត្រ Digital Pro. All rights reserved.',
    developedBy: 'អភិវឌ្ឍដោយ (Developer):',
    footerSubText: 'ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រជាងថតរូបអាជីព • គាំទ្រទូទាត់ Bakong KHQR & Telegram Export',

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
    systemLanguageSetting: 'ភាសាប្រើប្រាស់ក្នុងប្រព័ន្ធ (System Language)',
    studioSettingsTitle: 'ការកំណត់ហាងថតរូប (Studio Settings)',
    adminSettingsTitle: 'ការកំណត់ប្រព័ន្ធ និង Logo (Admin Console)',
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
    saveToCloud: 'រក្សាទុកទៅ Cloud',

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
    adminManageUsers: 'គ្រប់គ្រងសមាជិក (Admin Console)',
    adminUpgradeReqs: 'សំណើ Upgrade ($10)',
    plan: 'គម្រោង',
    freePlan: 'Free (20 វិក្កយបត្រ/ថ្ងៃ)',
    unlimitedPlan: 'Lifetime Unlimited',
    userList: 'បញ្ជីសមាជិក និងអ្នកប្រើប្រាស់',
    addUserBtn: '+ បង្កើតគណនីថ្មី',
  },
  en: {
    // Navigation & Common Header
    welcome: 'Home',
    welcomePortal: 'Welcome Portal',
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
    superAppPro: 'SUPER APP PRO',
    memberStudio: 'Member Studio',

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
    accounts: 'Accounts',

    // Welcome Page Section
    publicPortal: 'Public Portal',
    aboutSystem: 'About System',
    usageStats: 'Usage Stats',
    systemServices: 'Services',
    getStarted: 'Get Started',
    launchApp: 'Launch App',
    signUpApp: 'Sign Up for App',
    heroTag: 'Professional Photography Invoice & Studio Management',
    heroTitlePart1: 'Digital Pro',
    heroTitlePart2: 'Invoice System',
    heroSubtitle: 'Official Invoicing Portal for Photographers',
    heroDesc: 'Smart digital solution tailored specifically for photographers, videographers, and wedding photo studios in Cambodia. Create clean invoices, attach KHQR payment codes, share directly to Telegram, and track revenue seamlessly.',
    systemNormal: 'System Operational',
    sloganQuote: '"Organize invoices neatly, beautifully and reliably"',

    // Stats Section
    livePlatformMetrics: 'Live Platform Metrics',
    statsTitle: 'Platform Usage & User Statistics',
    statsSub: 'Real-time statistics of registered members, active users, and generated invoices in the system',
    totalUsers: 'Total Users',
    registeredInSystem: 'Registered Accounts',
    activeUsers: 'Active Users',
    activeNormal: 'Normal Activity',
    inactiveUsers: 'Inactive Users',
    pausedTemp: 'Temporarily Paused',
    createdInvoices: 'Invoices Created',
    totalSystemWide: 'System-wide Total',

    // About Section
    aboutTag: 'About System',
    aboutTitle: 'Invoice Management Designed for Photographers Needs',
    aboutDesc: 'Photographers and studio owners often struggle with tracking wedding deposits, setting up dress/album items in Pre-wedding packages, and sending bills to clients. Digital Pro was built directly to solve these issues effortlessly!',
    pillar1Title: 'Designed for Photography Standards',
    pillar1Desc: 'Built-in support for Pre-wedding, Wedding Day, and Combo packages with automated dress items and VIP album options.',
    pillar2Title: 'Easy Bakong KHQR Payment',
    pillar2Desc: 'Clients can scan and pay deposits or balance dues via Bakong KHQR directly on the digital invoice canvas.',
    pillar3Title: 'Telegram Instant Direct Share',
    pillar3Desc: 'Send invoice summaries, links, and high-res images to client Telegram chats with just 1-click.',

    // Services Section
    servicesTag: 'Services & Capabilities',
    servicesTitle: 'Platform Services & Capabilities',
    servicesSub: 'Comprehensive feature set designed to elevate your photography business professionalism',
    service1Title: '1. Digital Invoices Creation',
    service1Desc: 'Fill groom/bride names, phone, event date, location, and automatically calculate deposits and balance dues.',
    service2Title: '2. Package Templates',
    service2Desc: 'Set quick package prices for Pre-wedding, Wedding Day, and Special Combos with detailed item checklists.',
    service3Title: '3. Export PNG HD & Print',
    service3Desc: 'Download crisp HD PNG invoice images for messaging apps or print hardcopies effortlessly.',
    service4Title: '4. Telegram 1-Click Sharing',
    service4Desc: 'Auto-share invoice details with localized summaries straight into customer Telegram chats.',
    service5Title: '5. Revenue & Customer Reports',
    service5Desc: 'Track monthly income, pending balance dues from clients, and complete deposit log histories.',
    service6Title: '6. Member Management (Admin Console)',
    service6Desc: 'Manage member user accounts, active/inactive statuses, and system-wide configurations.',

    // CTA Section
    ctaTitle: 'Start Organizing Your Photography Invoices Today',
    ctaSub: 'No complexity — create your very first professional invoice in under 1 minute!',
    ctaButtonLaunch: 'Launch Photography App Now',
    ctaButtonSignUp: 'Sign Up to Access App',

    // Footer
    copyright: '© 2026 Digital Pro Invoice. All rights reserved.',
    developedBy: 'Developer:',
    footerSubText: 'Professional Photography Invoicing System • Supports Bakong KHQR & Telegram Export',

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
    systemLanguageSetting: 'System Language Setting',
    studioSettingsTitle: 'Studio Settings',
    adminSettingsTitle: 'System Settings & Logo (Admin)',
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
    saveToCloud: 'Save to Cloud',

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
    adminManageUsers: 'User Management (Admin)',
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

  const t = translations[lang] || translations.km;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
