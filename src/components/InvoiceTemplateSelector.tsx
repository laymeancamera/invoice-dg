import React, { useState } from 'react';
import { StudioProfile, Invoice } from '../types';
import { 
  Palette, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  Star, 
  Crown, 
  Layers, 
  FileText,
  Printer,
  Camera,
  Phone,
  MapPin,
  Clock,
  AlertCircle
} from 'lucide-react';

export interface InvoiceTemplateOption {
  id: string;
  nameKhmer: string;
  nameEnglish: string;
  description: string;
  badge: string;
  themeColor: string;
  gradient: string;
  icon: React.ReactNode;
}

export const INVOICE_TEMPLATES: InvoiceTemplateOption[] = [
  {
    id: 'proforma_corporate',
    nameKhmer: 'គំរូប្រូហ្វរម៉ា ខៀវស្អាត (Pro Forma Corporate)',
    nameEnglish: 'Pro Forma Corporate Blue',
    description: 'ទម្រង់រចនា Pro Forma Corporate មាន Logo ធំច្បាស់, Header បន្ទះពណ៌ខៀវ #007aff, From/Bill To លម្អិត និងកាត Balance Due Highlight ដូចគំរូ',
    badge: 'Pro Forma Corporate',
    themeColor: 'blue',
    gradient: 'from-blue-600 via-sky-500 to-indigo-600',
    icon: <FileText className="w-5 h-5 text-blue-600" />
  },
  {
    id: 'classic_blue',
    nameKhmer: 'គំរូប៊្លូខៀវ Standard (Classic Blue)',
    nameEnglish: 'Classic Blue Pro',
    description: 'ទម្រង់ស្តង់ដារពេញនិយមបំផុត មានភាពច្បាស់លាស់ ព័ត៌មានលម្អិត និងកូដ KHQR ធំច្បាស់',
    badge: 'ពេញនិយម',
    themeColor: 'blue',
    gradient: 'from-blue-600 to-indigo-700',
    icon: <FileText className="w-5 h-5 text-blue-500" />
  },
  {
    id: 'modern_gold',
    nameKhmer: 'គំរូហ្គោល មង្គលការ (Luxury Gold)',
    nameEnglish: 'Luxury Wedding Gold',
    description: 'ទម្រង់ពណ៌មាសប្រណិត យ៉ាងស័ក្តិសមបំផុតសម្រាប់សេវាកម្មថតរូបមង្គលការ និងព្រឹត្តិការណ៍ធំៗ',
    badge: 'ប្រណិតបំផុត',
    themeColor: 'amber',
    gradient: 'from-amber-500 to-yellow-600',
    icon: <Crown className="w-5 h-5 text-amber-500" />
  },
  {
    id: 'minimal_slate',
    nameKhmer: 'គំរូមីនីម៉ាល់ ទំនើប (Minimal Slate)',
    nameEnglish: 'Minimalist Clean Slate',
    description: 'ទម្រង់បែប មីនីម៉ាល់ Clean ពណ៌ខ្មៅ-ប្រផេះ ខ្ទាស់ស៊ុមច្បាស់ៗ មើលទៅទំនើបបែប High-End',
    badge: 'មុំស្រួច Clean',
    themeColor: 'slate',
    gradient: 'from-slate-800 to-slate-950',
    icon: <Layers className="w-5 h-5 text-slate-400" />
  },
  {
    id: 'emerald_elegance',
    nameKhmer: 'គំរូអេមើរ៉ល់ បៃតង (Emerald Elegance)',
    nameEnglish: 'Emerald Teal Fresh',
    description: 'ទម្រង់ពណ៌បៃតងត្បូងថ្ម ស្រស់ស្អាត មានផ្លាក Tag ស្ទីលទំនើប ទាក់ទាញភ្នែក',
    badge: 'ស្រស់ស្អាត',
    themeColor: 'emerald',
    gradient: 'from-emerald-600 to-teal-700',
    icon: <Sparkles className="w-5 h-5 text-emerald-500" />
  },
  {
    id: 'royal_purple',
    nameKhmer: 'គំរូរ៉ូយ៉ាល់ ស្វាយ (Royal Purple)',
    nameEnglish: 'Royal Purple & Gold',
    description: 'ទម្រង់ពណ៌ស្វាយអភិជន លាយពណ៌មាស ផ្តល់អារម្មណ៍ VIP ខ្ពង់ខ្ពស់សម្រាប់អតិថិជន',
    badge: 'VIP Royalty',
    themeColor: 'purple',
    gradient: 'from-purple-700 to-indigo-900',
    icon: <Star className="w-5 h-5 text-purple-400" />
  },
  {
    id: 'compact_receipt',
    nameKhmer: 'គំរូបង្កាន់ដៃរហ័ស (Compact Express)',
    nameEnglish: 'Compact Express Receipt',
    description: 'ទម្រង់ខ្លីរហ័ស Compact Card ងាយស្រួលផ្ញើតាម Telegram ឬ Save រូបភាពលើទូរស័ព្ទ',
    badge: 'លឿនទាន់ចិត្ត',
    themeColor: 'rose',
    gradient: 'from-rose-600 to-pink-700',
    icon: <Printer className="w-5 h-5 text-rose-500" />
  }
];

// Sample Invoice Data for Live Preview
const SAMPLE_INVOICE: Invoice = {
  id: 'sample-001',
  invoiceNumber: 'INV-2026-88',
  customerName: 'លោក សុខ ចាន់ថា & កញ្ញា ជា សុភ័ក្រ',
  customerPhone: '012 345 678',
  weddingDate: '2026-11-18',
  eventLocation: 'សណ្ឋាគារ ហ៊ីលតុន ភ្នំពេញ (Hilton Hotel)',
  packageCategory: 'wedding_day',
  packageName: 'កញ្ចប់ថតរូបថ្ងៃការ VIP Full Day',
  items: [
    {
      id: 'i1',
      description: 'សេវាកម្មថតរូបថ្ងៃការ ព្រឹក-ល្ងាច (ក្រុមការងារ ២នាក់)',
      quantity: 1,
      unitPrice: 850,
      total: 850
    },
    {
      id: 'i2',
      description: 'អាល់ប៊ុមឈើប្រណិត 30x40cm + រូបធំ 60x90cm ជើងទម្រ UV',
      quantity: 1,
      unitPrice: 250,
      total: 250
    }
  ],
  subtotal: 1100,
  discount: 50,
  deposit: 300,
  total: 1050,
  paidAmount: 300,
  balanceDue: 750,
  status: 'deposit',
  issueDate: '2026-08-08',
  payments: [
    {
      id: 'p1',
      date: '2026-08-08',
      amount: 300,
      method: 'khqr',
      note: 'ប្រាក់កក់ដំបូង'
    }
  ],
  createdAt: '2026-08-08',
  updatedAt: '2026-08-08'
};

interface InvoiceTemplateSelectorProps {
  studio: StudioProfile;
  onSaveStudio: (profile: StudioProfile) => void;
  sampleInvoice?: Invoice;
}

export function InvoiceTemplateSelector({
  studio,
  onSaveStudio,
  sampleInvoice = SAMPLE_INVOICE
}: InvoiceTemplateSelectorProps) {
  const activeTemplateId = studio.selectedTemplateId || 'classic_blue';
  const [selectedTemplate, setSelectedTemplate] = useState<string>(activeTemplateId);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyTemplate = (id: string) => {
    setSelectedTemplate(id);
    const updated = {
      ...studio,
      selectedTemplateId: id
    };
    onSaveStudio(updated);
    showToast(`បានកំណត់ម៉ូតវិក្កយបត្រមកត្រឹម៖ ${INVOICE_TEMPLATES.find(t => t.id === id)?.nameKhmer}`);
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-amber-400 border border-amber-500/40 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs sm:text-sm font-bold animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Palette className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              ម៉ូតវិក្កយបត្រ (Invoice Template Styles)
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 uppercase">
              6 Options
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            ជ្រើសរើសម៉ូត និង Style រចនារបស់វិក្កយបត្រដែលអ្នកចូលចិត្តសម្រាប់ប្រើប្រាស់លើ Invoices ទាំងអស់ក្នុង Studio របស់អ្នក។ រាល់ពេល Export ជា PNG ឬទាញយក នឹងទទួលបានស្ទីលយ៉ាងស្រស់ស្អាតភ្លាមៗ!
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl flex items-center space-x-3 shrink-0">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase">
              ម៉ូតកំពុងប្រើប្រាស់ (Active Template)
            </span>
            <span className="text-sm font-black text-amber-400">
              {INVOICE_TEMPLATES.find(t => t.id === activeTemplateId)?.nameKhmer || 'Classic Blue Pro'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 6 Template Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INVOICE_TEMPLATES.map((tmpl) => {
          const isActive = activeTemplateId === tmpl.id;
          const isSelected = selectedTemplate === tmpl.id;

          return (
            <div
              key={tmpl.id}
              onClick={() => handleApplyTemplate(tmpl.id)}
              className={`relative bg-white rounded-2xl border-2 p-5 shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-xl ${
                isActive
                  ? 'border-amber-500 ring-4 ring-amber-500/20 bg-amber-50/20'
                  : isSelected
                  ? 'border-blue-600 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full shadow-md flex items-center space-x-1 uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                  <span>កំពុងប្រើប្រាស់ (Active)</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-slate-100 rounded-xl">
                      {tmpl.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {tmpl.nameKhmer}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">
                        {tmpl.nameEnglish}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                    {tmpl.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Color Palette Indicator */}
                <div className="flex items-center space-x-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">
                    ពណ៍ចម្បង:
                  </span>
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${tmpl.gradient} ring-2 ring-slate-200`} />
                  <span className="text-[11px] font-bold text-slate-700 capitalize">
                    {tmpl.themeColor}
                  </span>
                </div>
              </div>

              {/* Apply / Select Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApplyTemplate(tmpl.id);
                }}
                className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  isActive
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                }`}
              >
                {isActive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ម៉ូតសកម្មស្រាប់ (Active Template)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>ជ្រើសរើសប្រើប្រាស់ម៉ូតនេះ</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Sample Preview Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                មើលទម្រង់គំរូជាក់ស្តែង (Live Preview: {INVOICE_TEMPLATES.find(t => t.id === selectedTemplate)?.nameEnglish})
              </h2>
              <p className="text-xs text-slate-500">
                ខាងក្រោមនេះជាគំរូបង្ហាញជាក់ស្តែងនៅពេលប្តូរម៉ូត Template រាល់ទិន្នន័យ Invoices នឹងរៀបចំតាមស្ទីលនេះភ្លាមៗ
              </p>
            </div>
          </div>

          <button
            onClick={() => handleApplyTemplate(selectedTemplate)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>រក្សាទុកម៉ូតនេះជា Default</span>
          </button>
        </div>

        {/* Live Template Render Canvas */}
        <div className="p-4 sm:p-8 bg-slate-100/80 rounded-2xl flex justify-center overflow-x-auto">
          <InvoiceTemplateRender
            templateId={selectedTemplate}
            invoice={sampleInvoice}
            studio={studio}
          />
        </div>
      </div>

    </div>
  );
}

// Universal Render Component for All Invoice Templates (Standard Classic Blue Layout with Customizable Color Schemes)
interface InvoiceTemplateRenderProps {
  templateId: string;
  invoice: Invoice;
  studio: StudioProfile;
}

const TEMPLATE_THEMES: Record<string, {
  primaryBorder: string;
  primaryText: string;
  headerBg: string;
  headerText: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  cardBorder: string;
  accentBg: string;
  subtextColor: string;
}> = {
  classic_blue: {
    primaryBorder: 'border-blue-600',
    primaryText: 'text-blue-600',
    headerBg: 'bg-slate-900',
    headerText: 'text-white',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-700',
    cardBorder: 'border-slate-200',
    accentBg: 'bg-blue-50/60',
    subtextColor: 'text-blue-700'
  },
  modern_gold: {
    primaryBorder: 'border-amber-500',
    primaryText: 'text-amber-600',
    headerBg: 'bg-amber-950',
    headerText: 'text-amber-100',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-800',
    cardBorder: 'border-amber-300',
    accentBg: 'bg-amber-50/60',
    subtextColor: 'text-amber-800'
  },
  minimal_slate: {
    primaryBorder: 'border-slate-800',
    primaryText: 'text-slate-800',
    headerBg: 'bg-slate-950',
    headerText: 'text-slate-100',
    badgeBg: 'bg-slate-100',
    badgeBorder: 'border-slate-300',
    badgeText: 'text-slate-800',
    cardBorder: 'border-slate-300',
    accentBg: 'bg-slate-100/80',
    subtextColor: 'text-slate-900'
  },
  emerald_elegance: {
    primaryBorder: 'border-emerald-600',
    primaryText: 'text-emerald-600',
    headerBg: 'bg-emerald-950',
    headerText: 'text-emerald-100',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-800',
    cardBorder: 'border-emerald-300',
    accentBg: 'bg-emerald-50/60',
    subtextColor: 'text-emerald-800'
  },
  royal_purple: {
    primaryBorder: 'border-purple-600',
    primaryText: 'text-purple-600',
    headerBg: 'bg-purple-950',
    headerText: 'text-purple-100',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-800',
    cardBorder: 'border-purple-300',
    accentBg: 'bg-purple-50/60',
    subtextColor: 'text-purple-800'
  },
  compact_receipt: {
    primaryBorder: 'border-rose-500',
    primaryText: 'text-rose-600',
    headerBg: 'bg-rose-950',
    headerText: 'text-rose-100',
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-800',
    cardBorder: 'border-rose-300',
    accentBg: 'bg-rose-50/60',
    subtextColor: 'text-rose-800'
  }
};

export function InvoiceTemplateRender({
  templateId,
  invoice,
  studio
}: InvoiceTemplateRenderProps) {
  const theme = TEMPLATE_THEMES[templateId] || TEMPLATE_THEMES.classic_blue;
  const khrTotal = (invoice.total * studio.exchangeRateKHR).toLocaleString('km-KH');
  const khrPaid = (invoice.paidAmount * studio.exchangeRateKHR).toLocaleString('km-KH');
  const khrBalance = (invoice.balanceDue * studio.exchangeRateKHR).toLocaleString('km-KH');

  const displayTitle = invoice.invoiceTitle || studio.defaultInvoiceTitle || 'វិក្កយបត្រ / INVOICE';

  // Dedicated Pro Forma Corporate Blue Layout
  if (templateId === 'proforma_corporate') {
    return (
      <div className="bg-white text-slate-900 w-[794px] min-h-[1123px] p-8 sm:p-10 rounded-xl border border-slate-200 shadow-2xl flex flex-col justify-between font-sans shrink-0 box-border print:w-[210mm] print:min-h-[297mm] print:p-8 print:shadow-none print:border-none print:rounded-none">
        {/* Main Content Area */}
        <div className="space-y-6 flex-1 flex flex-col justify-start">
          
          {/* Corporate Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <img
                src={studio.logoUrl || '/digital_pro_logo.svg'}
                alt="Studio Logo"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/digital_pro_logo.svg';
                }}
                className="w-20 h-20 rounded-xl object-contain ring-1 ring-slate-200 bg-white p-1"
              />
              <div>
                <h1 className="text-xl font-black text-slate-900">
                  {studio.khmerName || studio.name}
                </h1>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  {studio.name}
                </p>
              </div>
            </div>

            {/* Right Invoice Title & Metadata */}
            <div className="text-right space-y-1">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {displayTitle}
              </h2>
              <div className="text-xs font-medium text-slate-600 space-y-0.5 pt-1">
                <p><span className="font-bold text-slate-800">Invoice no.:</span> #{invoice.invoiceNumber}</p>
                <p><span className="font-bold text-slate-800">Invoice date:</span> {invoice.issueDate}</p>
                <p><span className="font-bold text-slate-800">Due / Event date:</span> {invoice.weddingDate || invoice.issueDate}</p>
              </div>
            </div>
          </div>

          {/* From / Bill To Grid */}
          <div className="grid grid-cols-2 gap-8 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
            {/* From */}
            <div className="space-y-1">
              <span className="font-bold text-blue-600 text-[11px] block uppercase tracking-wider">From</span>
              <h3 className="text-sm font-extrabold text-slate-900">{studio.khmerName || studio.name}</h3>
              <p className="text-slate-600 font-medium">{studio.name}</p>
              <p className="text-slate-600">📞 {studio.phone} {studio.secondaryPhone ? ` / ${studio.secondaryPhone}` : ''}</p>
              {studio.address && <p className="text-slate-600">📍 {studio.address}</p>}
              {studio.facebookPage && <p className="text-slate-600">🌐 {studio.facebookPage}</p>}
            </div>

            {/* Bill To & Ship To */}
            <div className="space-y-2">
              <div>
                <span className="font-bold text-blue-600 text-[11px] block uppercase tracking-wider">Bill to</span>
                <h3 className="text-sm font-extrabold text-slate-900">{invoice.customerName}</h3>
                <p className="text-slate-600 font-medium">📞 {invoice.customerPhone}</p>
              </div>
              
              {(invoice.eventLocation || invoice.weddingDate) && (
                <div className="pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-500 text-[10px] block uppercase tracking-wider">Ship to / Event Location</span>
                  {invoice.eventLocation && <p className="text-slate-700">📍 {invoice.eventLocation}</p>}
                  {invoice.weddingDate && <p className="text-slate-700 font-semibold">💒 {invoice.weddingDate}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm flex-1 min-h-[220px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#007aff] text-white font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4 text-center w-20">QTY</th>
                  <th className="py-3 px-4 text-right w-28">RATE ($)</th>
                  <th className="py-3 px-4 text-right w-28">TOTAL ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id || `item-${idx}`} className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                    <td className="py-3 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-pre-line leading-relaxed">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-700">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Instructions & Totals Summary */}
          <div className="flex justify-between items-start gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            {/* Payment Instruction */}
            <div className="space-y-2.5 flex-1 max-w-md">
              <p className="font-black text-slate-900 text-xs uppercase tracking-wider text-blue-700">Payment instruction</p>
              {studio.khqrImageUrl ? (
                <div className="flex items-center space-x-4 bg-white p-3.5 rounded-2xl border border-slate-300 shadow-sm">
                  <img src={studio.khqrImageUrl} alt="Bakong KHQR" className="w-28 h-28 object-contain rounded-xl shrink-0 ring-1 ring-slate-200" />
                  <div className="text-xs text-slate-700 space-y-1">
                    <p className="font-black text-slate-900 text-sm">Bakong KHQR Payment</p>
                    <p className="font-bold text-slate-800">Account: <span className="font-extrabold text-blue-900">{studio.bankAccountName || studio.name}</span></p>
                    <p className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 inline-block shadow-inner">{studio.bankAccountNumber}</p>
                    <p className="text-[11px] font-medium text-slate-500 pt-0.5">សូមស្កេន KHQR ដើម្បីធ្វើការទូទាត់ប្រាក់</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200">
                  សូមធ្វើការទូទាត់ប្រាក់កក់ ឬប្រាក់សរុបតាមរយៈគណនីធនាគារ ឬ KHQR របស់ស្ទូឌីយោ។
                </p>
              )}
              {invoice.notes && (
                <p className="text-xs text-slate-600 italic pt-1.5 border-t border-slate-200 font-medium">
                  {invoice.notes}
                </p>
              )}
            </div>

            {/* Right Totals Box */}
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal:</span>
                <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Discount:</span>
                  <span className="font-bold">-${invoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-black text-sm pt-1.5 border-t border-slate-200">
                <span>Total:</span>
                <span className="text-blue-600 font-black">${invoice.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <span>Amount Paid:</span>
                <span>${invoice.paidAmount.toFixed(2)}</span>
              </div>

              {/* Balance Due Highlight Box */}
              <div className="bg-[#f0f7ff] border border-blue-200 text-slate-900 font-black p-3 rounded-xl flex justify-between items-center text-sm shadow-sm mt-1">
                <span>Balance Due:</span>
                <span className="text-blue-700 text-base font-extrabold">${invoice.balanceDue.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-slate-500 text-right font-medium pt-0.5">
                (ជាប្រាក់រៀល: <span className="font-bold text-slate-800">{khrBalance} ៛</span>)
              </p>
            </div>
          </div>

        </div>

        {/* Footer & Signatures */}
        <div className="pt-6 border-t border-slate-200 mt-6 space-y-5">
          <div className="grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-10">
              <p className="font-bold text-slate-700 uppercase tracking-wider">
                ហត្ថលេខាអតិថិជន / Customer Signature
              </p>
              <div className="border-b border-dashed border-slate-300 w-48 mx-auto"></div>
              <p className="text-[11px] text-slate-500">{invoice.customerName}</p>
            </div>
            <div className="space-y-10">
              <p className="font-bold text-slate-700 uppercase tracking-wider">
                ហត្ថលេខាស្ទូឌីយោ / Studio Signature
              </p>
              <div className="border-b border-dashed border-slate-300 w-48 mx-auto"></div>
              <p className="text-[11px] text-slate-500">{studio.khmerName || studio.name}</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-500">
              📄 Pro Forma Corporate Invoice
            </span>
            <span className="font-semibold text-slate-600 italic">
              Thank you for choosing our photography services!
            </span>
            <span className="font-mono">
              Digital Pro Invoicing
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white text-slate-900 w-[794px] min-h-[1123px] p-8 sm:p-10 rounded-xl border ${theme.cardBorder} shadow-2xl flex flex-col justify-between font-sans shrink-0 box-border print:w-[210mm] print:min-h-[297mm] print:p-8 print:shadow-none print:border-none print:rounded-none`}>
      {/* Top and Content Area */}
      <div className="space-y-6 flex-1 flex flex-col justify-start">
        
        {/* Top Header */}
        <div className={`flex justify-between items-start border-b-2 ${theme.primaryBorder} pb-5`}>
          <div className="space-y-2 max-w-md">
            <div className="flex items-center space-x-3.5">
              <img
                src={studio.logoUrl || '/digital_pro_logo.svg'}
                alt="Logo"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/digital_pro_logo.svg';
                }}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-200 shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  {studio.khmerName || studio.name}
                </h1>
                <p className={`text-xs ${theme.primaryText} font-bold uppercase tracking-wider`}>
                  {studio.name}
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-1 pt-1 font-medium">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>ទូរស័ព្ទ: {studio.phone} {studio.secondaryPhone ? ` / ${studio.secondaryPhone}` : ''}</span>
              </div>
              {studio.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>អាសយដ្ឋាន: {studio.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {displayTitle}
            </h2>
            <p className={`text-sm font-black ${theme.primaryText} tracking-wider font-mono`}>
              INVOICE: #{invoice.invoiceNumber}
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 uppercase shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>{invoice.status === 'paid' ? 'បានទូទាត់រួច' : invoice.status === 'deposit' ? 'បានកក់ប្រាក់' : 'មិនទាន់ទូទាត់'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 pt-0.5">
              ថ្ងៃចេញវិក្កយបត្រ: <span className="font-bold text-slate-800">{invoice.issueDate}</span>
            </p>
          </div>
        </div>

        {/* Customer & Event Details Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              អតិថិជន (Client Details)
            </p>
            <h3 className="text-base font-black text-slate-900">
              {invoice.customerName}
            </h3>
            <p className="text-xs text-slate-700 font-semibold">
              📞 ទូរស័ព្ទ: {invoice.customerPhone}
            </p>
            {invoice.packageName && (
              <p className="text-xs text-blue-700 font-medium pt-1">
                📦 កញ្ចប់សេវា: {invoice.packageName}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              ព័ត៌មានកម្មវិធី (Event Details)
            </p>
            {invoice.weddingDate && (
              <p className={`text-xs font-bold ${theme.primaryText} ${theme.badgeBg} inline-block px-2.5 py-1 rounded border ${theme.badgeBorder}`}>
                💒 ថ្ងៃកម្មវិធី: {invoice.weddingDate}
              </p>
            )}
            {invoice.eventLocation && (
              <p className="text-xs text-slate-700 font-medium pt-0.5">
                📍 ទីតាំង: {invoice.eventLocation}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm flex-1 min-h-[200px]">
          <table className="w-full text-left text-xs">
            <thead className={`${theme.headerBg} ${theme.headerText} font-bold uppercase`}>
              <tr>
                <th className="py-3 px-4 w-12 text-center">ល.រ</th>
                <th className="py-3 px-4">បរិយាយសេវាកម្ម (Description)</th>
                <th className="py-3 px-4 text-center w-20">ចំនួន</th>
                <th className="py-3 px-4 text-right w-28">តម្លៃរាយ ($)</th>
                <th className="py-3 px-4 text-right w-28">សរុប ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {invoice.items.map((item, idx) => (
                <tr key={item.id || `item-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-pre-line leading-relaxed">{item.description}</td>
                  <td className="py-3 px-4 text-center font-medium text-slate-600">{item.quantity}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-600">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment & KHQR Details Box */}
        <div className="flex justify-between items-start gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          {/* KHQR code preview & Bank account */}
          {studio.khqrImageUrl ? (
            <div className="flex items-center space-x-4 bg-white p-3.5 rounded-2xl border border-slate-300 shadow-sm flex-1 max-w-md">
              <img src={studio.khqrImageUrl} alt="Bakong KHQR" className="w-28 h-28 object-contain rounded-xl border border-slate-200 bg-white p-1 shadow-sm shrink-0" />
              <div className="text-xs text-slate-700 space-y-1.5">
                <p className="font-black text-slate-900 text-sm">Bakong KHQR Payment</p>
                <p className="font-bold text-slate-800">ឈ្មោះគណនី: <span className="font-extrabold text-slate-950">{studio.bankAccountName || 'LAY MEAN'}</span></p>
                <p className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 inline-block">
                  {studio.bankAccountNumber}
                </p>
                <p className="text-[11px] font-medium text-slate-500">សូមស្កេន KHQR ដើម្បីធ្វើការទូទាត់ប្រាក់</p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-600 max-w-sm space-y-1">
              <p className="font-extrabold text-slate-900 text-sm">ចំណាំ / Terms & Conditions:</p>
              <p className="text-xs leading-relaxed text-slate-600">
                1. សូមពិនិត្យព័ត៌មានអោយបានត្រឹមត្រូវមុនពេលទូទាត់ប្រាក់កក់។
              </p>
              <p className="text-xs leading-relaxed text-slate-600">
                2. រាល់ការបង់ប្រាក់កក់មិនអាចដកវិញបានឡើយ (Deposit non-refundable)។
              </p>
            </div>
          )}

          {/* Totals Summary */}
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>សរុបរង (Subtotal):</span>
              <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>បញ្ចុះតម្លៃ (Discount):</span>
                <span className="font-bold">-${invoice.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-900 font-black text-base pt-1.5 border-t border-slate-200">
              <span>សរុបចុងក្រោយ (Total):</span>
              <span className={theme.primaryText}>${invoice.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <span>បានទូទាត់/កក់ (Paid):</span>
              <span>${invoice.paidAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-rose-800 font-black bg-rose-50 px-2.5 py-1.5 rounded border border-rose-200 text-sm">
              <span>នៅសល់ត្រូវបង់ (Balance Due):</span>
              <span>${invoice.balanceDue.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-slate-500 text-right font-medium pt-0.5">
              (ប្រាក់រៀល: <span className="font-bold text-slate-800">{khrBalance} ៛</span>)
            </p>
          </div>
        </div>

      </div>

      {/* A4 Bottom Footer & Signatures (Always at the bottom of the A4 page) */}
      <div className="pt-8 border-t border-slate-200 mt-6 space-y-6">
        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-12">
            <p className="font-bold text-slate-700 uppercase tracking-wider">
              ស្នាមមេដៃ / ហត្ថលេខាអតិថិជន
            </p>
            <div className="border-b border-dashed border-slate-300 w-48 mx-auto"></div>
            <p className="text-[11px] text-slate-500">{invoice.customerName}</p>
          </div>
          <div className="space-y-12">
            <p className="font-bold text-slate-700 uppercase tracking-wider">
              ហត្ថលេខា និងត្រាអ្នកទទួល
            </p>
            <div className="border-b border-dashed border-slate-300 w-48 mx-auto"></div>
            <p className="text-[11px] text-slate-500">{studio.khmerName || studio.name}</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          <span className="font-bold text-slate-500">
            📄 ទម្រង់វិក្កយបត្រ A4 Standard Format
          </span>
          <span className="font-semibold text-slate-600 italic">
            សូមអរគុណយ៉ាងជ្រាលជ្រៅដែលបានជ្រើសរើសសេវាកម្មយើងខ្ញុំ!
          </span>
          <span className="font-mono">
            Digital Pro Invoicing
          </span>
        </div>
      </div>
    </div>
  );
}

