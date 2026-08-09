import React, { useState, useMemo } from 'react';
import { 
  Invoice, 
  StudioProfile, 
  PaymentStatus 
} from '../types';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  CreditCard, 
  Send, 
  Trash2, 
  Calendar, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileDown
} from 'lucide-react';
import { openTelegramShare, copyTelegramMessage } from '../lib/telegram';
import { useLanguage } from '../lib/i18n';

interface InvoiceListProps {
  invoices: Invoice[];
  studio: StudioProfile;
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onPayment: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onCreateNew: () => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  studio,
  onView,
  onEdit,
  onPayment,
  onDelete,
  onBulkDelete,
  onCreateNew,
}) => {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerPhone.includes(searchQuery) ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.weddingDate.includes(searchQuery) ||
        inv.eventLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ? true : inv.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' ? true : inv.packageCategory === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [invoices, searchQuery, statusFilter, categoryFilter]);

  // Select All & Bulk Selection Logic
  const isAllSelected =
    filteredInvoices.length > 0 &&
    filteredInvoices.every((inv) => selectedInvoiceIds.includes(inv.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedInvoiceIds([]);
    } else {
      setSelectedInvoiceIds(filteredInvoices.map((inv) => inv.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedInvoiceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteAction = () => {
    if (selectedInvoiceIds.length === 0) return;
    const count = selectedInvoiceIds.length;
    const confirmMsg =
      lang === 'km'
        ? `តើអ្នកប្រាកដជាចង់លុបវិក្កយបត្រចំនួន ${count} ដែលបានជ្រើសរើសនេះមែនទេ?`
        : `Are you sure you want to delete ${count} selected invoices?`;

    if (window.confirm(confirmMsg)) {
      if (onBulkDelete) {
        onBulkDelete(selectedInvoiceIds);
      } else {
        selectedInvoiceIds.forEach((id) => onDelete(id));
      }
      setSelectedInvoiceIds([]);
      showToast(
        lang === 'km'
          ? `បានលុបវិក្កយបត្រចំនួន ${count} រួចរាល់!`
          : `Successfully deleted ${count} invoices!`
      );
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const totalSales = invoices.reduce((acc, i) => acc + i.total, 0);
    const totalPaid = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
    const totalPending = invoices.reduce((acc, i) => acc + i.balanceDue, 0);
    return { totalSales, totalPaid, totalPending, count: invoices.length };
  }, [invoices]);

  const handleCopyTelegram = async (invoice: Invoice) => {
    const success = await copyTelegramMessage(invoice, studio);
    if (success) {
      showToast('បានចម្លងអត្ថបទវិក្កយបត្រសម្រាប់ Telegram រួចរាល់!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-amber-400 border border-amber-500/40 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-medium animate-bounce">
          <Send className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t.totalInvoicesCount}
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {stats.count}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-700">
              {t.invoices}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {t.totalRevenueCount}
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-900">
              ${stats.totalSales.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">
              ≈ {(stats.totalSales * studio.exchangeRateKHR).toLocaleString(lang === 'km' ? 'km-KH' : 'en-US')} ៛
            </span>
          </div>
        </div>

        <div className="bg-emerald-50/60 p-5 rounded-xl shadow-sm border border-emerald-200/80">
          <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            {t.paidInvoicesCount}
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-emerald-700">
              ${stats.totalPaid.toLocaleString()}
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        <div className="bg-amber-50/60 p-5 rounded-xl shadow-sm border border-amber-200/80">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            {t.unpaidInvoicesCount}
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-amber-700">
              ${stats.totalPending.toLocaleString()}
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchInvoicePlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.filterAll} ({invoices.length})
          </button>
          
          <button
            onClick={() => setStatusFilter('deposit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'deposit'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {t.filterPartial}
          </button>

          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'paid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {t.filterPaid}
          </button>

          <button
            onClick={() => setStatusFilter('unpaid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === 'unpaid'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            {t.filterUnpaid}
          </button>
        </div>

        {/* New Invoice Button */}
        <button
          onClick={onCreateNew}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors text-xs sm:text-sm whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.createNewInvoiceBtn}</span>
        </button>
      </div>

      {/* Select All & Bulk Delete Bar */}
      {filteredInvoices.length > 0 && (
        <div className="bg-slate-900 text-white p-3 px-4 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-3 border border-slate-800">
          <div className="flex items-center space-x-3">
            <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-500"
              />
              <span className="text-xs font-bold text-slate-200">
                {lang === 'km' ? 'ជ្រើសរើសទាំងអស់' : 'Select All'} ({filteredInvoices.length})
              </span>
            </label>

            {selectedInvoiceIds.length > 0 && (
              <span className="text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2.5 py-0.5 rounded-full">
                {lang === 'km' ? `បានជ្រើស ${selectedInvoiceIds.length}` : `Selected ${selectedInvoiceIds.length}`}
              </span>
            )}
          </div>

          {selectedInvoiceIds.length > 0 && (
            <button
              onClick={handleBulkDeleteAction}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold px-3.5 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer border border-rose-400/40"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'km'
                  ? `លុបវិក្កយបត្រដែលបានជ្រើស (${selectedInvoiceIds.length})`
                  : `Delete Selected (${selectedInvoiceIds.length})`}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Invoice Table / Cards List */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">រកមិនឃើញវិក្កយបត្រ</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            ពុំមានទិន្នន័យវិក្កយបត្រដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកទេ។ សូមសាកល្បងស្វែងរកពាក្យផ្សេង ឬបង្កើតវិក្កយបត្រថ្មី។
          </p>
          <button
            onClick={onCreateNew}
            className="mt-5 inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>បង្កើតវិក្កយបត្រដំបូង</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInvoices.map((inv) => {
            const isFullyPaid = inv.status === 'paid';
            const isDeposit = inv.status === 'deposit';
            const isSelected = selectedInvoiceIds.includes(inv.id);

            return (
              <div
                key={inv.id}
                className={`bg-white rounded-xl border transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20'
                    : 'border-slate-200 shadow-sm hover:border-slate-300'
                }`}
              >
                {/* Left: Checkbox + Customer & Event Details */}
                <div className="flex items-start space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(inv.id)}
                    className="w-4 h-4 mt-1 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 shrink-0"
                    title="ជ្រើសរើសវិក្កយបត្រនេះ"
                  />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
                        #{inv.invoiceNumber}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {inv.customerName}
                      </h3>

                    {/* Status Badge */}
                    {isFullyPaid && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>បានទូទាត់រួច ១០០%</span>
                      </span>
                    )}
                    {isDeposit && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <Clock className="w-3.5 h-3.5" />
                        <span>បានកក់ប្រាក់</span>
                      </span>
                    )}
                    {inv.status === 'unpaid' && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>មិនទាន់ទូទាត់</span>
                      </span>
                    )}
                  </div>

                  {/* Customer Meta */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inv.customerPhone || 'គ្មានលេខ'}</span>
                    </div>

                    {inv.weddingDate && (
                      <div className="flex items-center space-x-1.5 font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>ថ្ងៃការ: {inv.weddingDate}</span>
                      </div>
                    )}

                    {inv.eventLocation && (
                      <div className="flex items-center space-x-1.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-xs">{inv.eventLocation}</span>
                      </div>
                    )}
                  </div>

                  {/* Package Title */}
                  <p className="text-xs text-slate-500 font-medium pt-1">
                    សេវាកម្ម: <span className="text-slate-800 font-semibold">{inv.packageName}</span>
                  </p>
                </div>
              </div>

                {/* Center: Financial Figures */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-4 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-tight">
                      តម្លៃសរុប
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      ${inv.total.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-x border-slate-200 px-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase block tracking-tight">
                      បានកក់/ទូទាត់
                    </span>
                    <span className="text-sm sm:text-base font-bold text-emerald-700">
                      ${inv.paidAmount.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase block tracking-tight">
                      នៅខ្វះ
                    </span>
                    <span className={`text-sm sm:text-base font-extrabold ${inv.balanceDue > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                      ${inv.balanceDue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto">
                  
                  {/* View Invoice */}
                  <button
                    onClick={() => onView(inv)}
                    title="មើល និង Export PNG"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>មើល</span>
                  </button>

                  {/* Edit Invoice */}
                  <button
                    onClick={() => onEdit(inv)}
                    title="កែសម្រួលវិក្កយបត្រ"
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Record Payment */}
                  <button
                    onClick={() => onPayment(inv)}
                    title="កត់ត្រាការទូទាត់"
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                  </button>

                  {/* Send to Telegram */}
                  <button
                    onClick={() => openTelegramShare(inv, studio)}
                    title="ផ្ញើតាម Telegram"
                    className="p-2 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>

                  {/* Delete Invoice */}
                  <button
                    onClick={() => {
                      if (confirm(`តើអ្នកប្រាកដជាចង់លុបវិក្កយបត្រ #${inv.invoiceNumber} របស់ ${inv.customerName} ឬ?`)) {
                        onDelete(inv.id);
                      }
                    }}
                    title="លុប"
                    className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
