import React, { useState, useEffect } from 'react';
import { 
  Invoice, 
  InvoiceItem, 
  PackageItem, 
  PackageCategory, 
  StudioProfile 
} from '../types';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  DollarSign, 
  Check, 
  HelpCircle,
  FileText
} from 'lucide-react';

import { INVOICE_TEMPLATES } from './InvoiceTemplateSelector';
import { useLanguage } from '../lib/i18n';

const COMMON_INCLUSIONS = [
  'អាវ ៣ឈុត (បុរាណ ១, សកល ២)',
  'រៀបចំមេកអាប់ និងធ្វើសក់',
  'អាល់ប៊ុម VIP 30x40cm (២០ទំព័រ)',
  'រូបថតស៊ុមឈើ 70x110cm (ប៉ាណូ)',
  'ជាងថតរូប ២នាក់ (Photo Crew)',
  'ជាងថតវីដេអូ 4K + Highlight 3-5នាទី',
  'Drone ថតពីលើអាកាស',
  'រូបថត 13x18cm ចំនួន ១០០សន្លឹក',
  'ផ្តល់ជូន Soft Copy រូបថតដើមទាំងអស់'
];

interface InvoiceFormProps {
  initialInvoice?: Invoice | null;
  packages: PackageItem[];
  studio: StudioProfile;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialInvoice,
  packages,
  studio,
  onSave,
  onCancel,
}) => {
  const { lang, t } = useLanguage();
  const isEditing = !!initialInvoice;

  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [packageCategory, setPackageCategory] = useState<PackageCategory>('pre_wedding');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [packageName, setPackageName] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceTitle, setInvoiceTitle] = useState(
    studio.defaultInvoiceTitle || 'វិក្កយបត្រ / INVOICE'
  );
  const [invoiceTemplate, setInvoiceTemplate] = useState<string>(
    studio.selectedTemplateId || 'classic_blue'
  );

  // Load initial data or generate new invoice number
  useEffect(() => {
    if (initialInvoice) {
      setInvoiceNumber(initialInvoice.invoiceNumber);
      setCustomerName(initialInvoice.customerName);
      setCustomerPhone(initialInvoice.customerPhone);
      setWeddingDate(initialInvoice.weddingDate || '');
      setEventLocation(initialInvoice.eventLocation || '');
      setPackageCategory(initialInvoice.packageCategory);
      setSelectedPackageId(initialInvoice.selectedPackageId || '');
      setPackageName(initialInvoice.packageName);
      setItems(initialInvoice.items || []);
      setDiscount(initialInvoice.discount || 0);
      setDeposit(initialInvoice.deposit || 0);
      setNotes(initialInvoice.notes || '');
      setIssueDate(initialInvoice.issueDate || new Date().toISOString().split('T')[0]);
      setInvoiceTitle(initialInvoice.invoiceTitle || studio.defaultInvoiceTitle || 'វិក្កយបត្រ / INVOICE');
      setInvoiceTemplate(initialInvoice.invoiceTemplate || studio.selectedTemplateId || 'classic_blue');
    } else {
      // Auto generate invoice number like INV-2026-003
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const today = new Date();
      const yr = today.getFullYear();
      setInvoiceNumber(`INV-${yr}-${randomSuffix}`);
      setNotes('សូមអរគុណសម្រាប់ការជ្រើសរើសសេវាកម្មថតរូបពីស្ទូឌីយោរបស់យើងខ្ញុំ!');
      setInvoiceTitle(studio.defaultInvoiceTitle || 'វិក្កយបត្រ / INVOICE');
      
      // Auto-select first package if available
      if (packages.length > 0) {
        applyPackageTemplate(packages[0]);
      }
    }
  }, [initialInvoice]);

  // Function to apply a preset package template instantly (Quick Option)
  const applyPackageTemplate = (pkg: PackageItem) => {
    setSelectedPackageId(pkg.id);
    setPackageCategory(pkg.category);
    setPackageName(pkg.nameKhmer);

    // Format description with title and bullet-pointed included items
    const descriptionText = [
      pkg.nameKhmer,
      ...(pkg.includedItems && pkg.includedItems.length > 0
        ? pkg.includedItems.map((inc) => `• ${inc}`)
        : [pkg.description])
    ].join('\n');

    // Build line items from package included items or single item
    const newItems: InvoiceItem[] = [
      {
        id: `item-${Date.now()}-1`,
        description: descriptionText,
        quantity: 1,
        unitPrice: pkg.price,
        total: pkg.price
      }
    ];

    setItems(newItems);
    // Suggest 30% deposit automatically
    const suggestedDeposit = Math.round(pkg.price * 0.3);
    setDeposit(suggestedDeposit);
  };

  // Line item handlers
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          const q = field === 'quantity' ? Number(value) : item.quantity;
          const p = field === 'unitPrice' ? Number(value) : item.unitPrice;
          updated.total = (q || 0) * (p || 0);
        }
        return updated;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      alert('វិក្កយបត្រត្រូវតែមានយ៉ាងហោចណាស់ ១ មុខទំនិញ ឬសេវាកម្ម!');
      return;
    }
    setItems(items.filter((i) => i.id !== id));
  };

  // Total calculations
  const subtotal = items.reduce((acc, item) => acc + (item.total || 0), 0);
  const total = Math.max(0, subtotal - (discount || 0));
  const balanceDue = Math.max(0, total - (deposit || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('សូមបំពេញ ឈ្មោះអតិថិជន!');
      return;
    }

    if (!customerPhone.trim()) {
      alert('សូមបំពេញ លេខទូរស័ព្ទអតិថិជន!');
      return;
    }

    if (items.length === 0) {
      alert('សូមបន្ថែមសេវាកម្មយ៉ាងហោចណាស់ ១!');
      return;
    }

    // Determine payment status
    const paid = initialInvoice ? initialInvoice.paidAmount : deposit;
    const finalDeposit = Math.min(total, deposit);

    const savedInvoice: Invoice = {
      id: initialInvoice ? initialInvoice.id : `inv-${Date.now()}`,
      invoiceNumber: invoiceNumber.trim() || `INV-${Date.now()}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      weddingDate: weddingDate,
      eventLocation: eventLocation.trim(),
      packageCategory,
      selectedPackageId,
      packageName: packageName || 'សេវាកម្មថតរូប',
      items,
      subtotal,
      discount: Number(discount) || 0,
      deposit: Number(finalDeposit) || 0,
      total,
      paidAmount: initialInvoice ? initialInvoice.paidAmount : Number(finalDeposit) || 0,
      balanceDue: Math.max(0, total - (initialInvoice ? initialInvoice.paidAmount : Number(finalDeposit) || 0)),
      status: (initialInvoice ? initialInvoice.paidAmount : finalDeposit) >= total
        ? 'paid'
        : (initialInvoice ? initialInvoice.paidAmount : finalDeposit) > 0
        ? 'deposit'
        : 'unpaid',
      issueDate,
      payments: initialInvoice
        ? initialInvoice.payments
        : finalDeposit > 0
        ? [
            {
              id: `pay-${Date.now()}`,
              date: issueDate,
              amount: finalDeposit,
              method: 'khqr',
              note: 'ប្រាក់កក់ដំបូង'
            }
          ]
        : [],
      notes,
      invoiceTitle: invoiceTitle.trim() || 'វិក្កយបត្រ / INVOICE',
      invoiceTemplate,
      createdAt: initialInvoice ? initialInvoice.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(savedInvoice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {isEditing ? `កែសម្រួលវិក្កយបត្រ #${invoiceNumber}` : 'បង្កើតវិក្កយបត្រថ្មី'}
            </h2>
            <p className="text-xs text-slate-500">
              ជ្រើសរើសកញ្ចប់សេវាកម្មរហ័ស ឬបំពេញព័ត៌មានអតិថិជន និងតម្លៃតាមការពេញចិត្ត
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer text-center"
          >
            បោះបង់
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all text-xs sm:text-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'រក្សាទុក' : 'រក្សាទុកវិក្កយបត្រ'}</span>
          </button>
        </div>
      </div>

      {/* QUICK OPTION: Preset Photography Packages */}
      <div className="bg-slate-900 p-6 rounded-xl shadow-md text-white border border-slate-800">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">
            Quick Option: ជ្រើសរើសកញ្ចប់សេវាកម្មថតរូបរហ័ស
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-4">
          ចុចលើកញ្ចប់ខាងក្រោមដើម្បីបំពេញឈ្មោះកញ្ចប់ តម្លៃ និងបញ្ជីសេវាកម្មដោយស្វ័យប្រវត្តិ៖
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {packages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => applyPackageTemplate(pkg)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-900/40 border-blue-500 text-white ring-2 ring-blue-500/50'
                    : 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-700 text-blue-300 uppercase">
                    {pkg.category === 'pre_wedding'
                      ? 'Pre-wedding'
                      : pkg.category === 'wedding_day'
                      ? 'ថ្ងៃមង្គលការ'
                      : 'Combo Special'}
                  </span>
                  <span className="text-base font-extrabold text-blue-400">
                    ${pkg.price}
                  </span>
                </div>
                <h4 className="text-sm font-bold mt-2 text-white line-clamp-1">
                  {pkg.nameKhmer}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {pkg.recommendedCount || pkg.description}
                </p>
                {isSelected && (
                  <div className="mt-3 flex items-center space-x-1 text-xs font-bold text-blue-400">
                    <Check className="w-4 h-4" />
                    <span>បានជ្រើសរើសកញ្ចប់នេះ</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer & Event Details Form Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
          <User className="w-5 h-5 text-blue-600" />
          <span>ព័ត៌មានអតិថិជន និងថ្ងៃកម្មវិធី (Customer & Event Info)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Invoice Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              លេខវិក្កយបត្រ (Invoice #)
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>ឈ្មោះអតិថិជន <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="ឧទាហរណ៍: សុខ ចាន់ដារ៉ា & ចាន់ ស្រីនាង"
              required
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>លេខទូរស័ព្ទ <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="012 345 678"
              required
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Wedding / Event Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>ថ្ងៃរៀបមង្គលការ / ថ្ងៃថត</span>
            </label>
            <input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Event Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>ទីតាំងមង្គលការ / អាសយដ្ឋាន</span>
            </label>
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="ឧទាហរណ៍: សណ្ឋាគារ សូហ្វីតែល ភ្នំពេញ"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              ថ្ងៃចេញវិក្កយបត្រ
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Invoice Header Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              ចំណងជើងវិក្កយបត្រ (Invoice Header Title)
            </label>
            <input
              type="text"
              value={invoiceTitle}
              onChange={(e) => setInvoiceTitle(e.target.value)}
              placeholder="ឧ. វិក្កយបត្រ / INVOICE ឬ Pro Forma Invoice"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Template Style Override */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              ម៉ូតវិក្កយបត្រ (Invoice Template)
            </label>
            <select
              value={invoiceTemplate}
              onChange={(e) => setInvoiceTemplate(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            >
              {INVOICE_TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.nameKhmer} ({tmpl.nameEnglish})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Package & Services Custom Line Items Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              តារាងកំណត់សេវាកម្ម និងតម្លៃ (Custom Service & Items)
            </h3>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>បន្ថែមមុខទំនិញ/សេវាកម្ម</span>
          </button>
        </div>

        {/* Package Name override field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            ឈ្មោះកញ្ចប់/សេវាកម្មសំខាន់ (Package Header)
          </label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            placeholder="ឈ្មោះកញ្ចប់ថត"
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Mobile View: Card List for Line Items */}
        <div className="space-y-3 md:hidden">
          {items.map((item, idx) => (
            <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  មុខទំនិញ/សេវាកម្ម #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="លុប"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  បរិយាយសេវាកម្ម (Description)
                </label>
                <textarea
                  rows={3}
                  value={item.description}
                  onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                  placeholder="រៀបរាប់ពីសេវាកម្ម..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-900 focus:ring-2 focus:ring-blue-500/30 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    ចំនួន (Qty)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    តម្លៃរាយ ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={item.unitPrice}
                    onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                    className="w-full p-2 text-right bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/30 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs font-extrabold text-slate-900">
                <span className="text-slate-500">សរុប (Total):</span>
                <span className="text-blue-600 text-sm font-extrabold">${item.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Items Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                <th className="p-3 rounded-tl-lg">បរិយាយសេវាកម្ម (Description)</th>
                <th className="p-3 w-24 text-center">ចំនួន</th>
                <th className="p-3 w-36 text-right">តម្លៃរាយ ($)</th>
                <th className="p-3 w-36 text-right">សរុប ($)</th>
                <th className="p-3 w-16 text-center rounded-tr-lg"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-2">
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) =>
                        handleUpdateItem(item.id, 'description', e.target.value)
                      }
                      placeholder="រៀបរាប់ពីសេវាកម្ម ដូចជា: ថតរូប Pre-wedding អាវ ៣ឈុត + អាល់ប៊ុម 30x40cm"
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                    />
                    
                    {/* Quick Inclusions Selector */}
                    <div className="mt-1.5 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 block">
                        + ចុចបន្ថែមជម្រើសក្នុងកញ្ចប់ថត (Quick Inclusions):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {COMMON_INCLUSIONS.map((inc, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              const bulletInc = `• ${inc}`;
                              if (!item.description.includes(inc)) {
                                const updatedDesc = item.description.trim()
                                  ? `${item.description}\n${bulletInc}`
                                  : bulletInc;
                                handleUpdateItem(item.id, 'description', updatedDesc);
                              }
                            }}
                            className="text-[10px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 px-2 py-0.5 rounded transition-colors cursor-pointer"
                          >
                            + {inc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateItem(item.id, 'quantity', Number(e.target.value))
                      }
                      className="w-full p-2 text-center bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/30 outline-none"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))
                      }
                      className="w-full p-2 text-right bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/30 outline-none"
                    />
                  </td>
                  <td className="p-2 text-right font-extrabold text-slate-900">
                    ${item.total.toLocaleString()}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculations & Payments Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Notes & Terms */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            កំណត់សម្គាល់សម្រាប់អតិថិជន (Invoice Notes)
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="បញ្ចូលកំណត់សម្គាល់បន្ថែម..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/30 outline-none"
          />
        </div>

        {/* Pricing Summary */}
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md space-y-4 border border-slate-800">
          <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            សរុបប្រាក់ទូទាត់ (Payment Calculations)
          </h4>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-300">
              <span>សរុបដើម (Subtotal):</span>
              <span className="font-bold text-white">${subtotal.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>បញ្ចុះតម្លៃ (Discount $):</span>
              <div className="w-32">
                <input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-2.5 py-1 text-right bg-slate-800 border border-slate-700 rounded-lg text-sm text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-base font-extrabold text-blue-400 pt-2 border-t border-slate-800">
              <span>សរុបចុងក្រោយ (Total):</span>
              <span className="text-xl">${total.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-emerald-400 uppercase">
                ប្រាក់កក់ដំបូង (Deposit Paid $):
              </span>
              <div className="w-32">
                <input
                  type="number"
                  min={0}
                  max={total}
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full px-2.5 py-1 text-right bg-slate-800 border border-emerald-500/60 rounded-lg text-sm text-emerald-400 font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
              <span className="text-blue-400">ប្រាក់នៅសល់ (Balance Due):</span>
              <span className="text-2xl text-blue-400">
                ${balanceDue.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 text-right">
              ≈ {(balanceDue * studio.exchangeRateKHR).toLocaleString('km-KH')} ៛
            </p>
          </div>
        </div>
      </div>

      {/* Save Action */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
        >
          បោះបង់
        </button>
        <button
          type="submit"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-all text-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isEditing ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតវិក្កយបត្រ'}</span>
        </button>
      </div>
    </form>
  );
};
