import React, { useState } from 'react';
import { CustomerProfile, Invoice } from '../types';
import { Search, User, Phone, Calendar, MapPin, DollarSign, FileText, Heart, Clock } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

interface CustomerDirectoryProps {
  customers: CustomerProfile[];
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
}

export const CustomerDirectory: React.FC<CustomerDirectoryProps> = ({
  customers,
  invoices,
  onViewInvoice,
}) => {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCustomer = customers.find((c) => c.id === selectedCustomerId) || filteredCustomers[0];

  const activeCustomerInvoices = activeCustomer
    ? invoices.filter((inv) => activeCustomer.invoiceIds.includes(inv.id))
    : [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <User className="w-6 h-6 text-amber-500" />
            <span>ប្រវត្តិអតិថិជនស្វ័យប្រវត្តិ (Auto Customer Profiles)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ប្រព័ន្ធកត់ត្រានិងបូកសរុបប្រវត្តិអតិថិជន និងថ្ងៃរៀបអាពាហ៍ពិពាហ៍ដោយស្វ័យប្រវត្តិពីវិក្កយបត្រ
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ស្វែងរកតាម ឈ្មោះអតិថិជន, លេខទូរស័ព្ទ..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold">ពុំទាន់មានប្រវត្តិអតិថិជននៅឡើយទេ</p>
          <p className="text-xs mt-1">ប្រវត្តិអតិថិជននឹងបង្កើតឡើងដោយស្វ័យប្រវត្តិនៅពេលអ្នកបង្កើតវិក្កយបត្រដំបូង។</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Customers List Sidebar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              បញ្ជីអតិថិជន ({filteredCustomers.length})
            </h3>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredCustomers.map((cust) => {
                const isSelected = activeCustomer?.id === cust.id;
                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 shadow-sm'
                        : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {cust.name}
                      </h4>
                      <span className="text-xs font-extrabold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
                        ${cust.totalSpent.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 space-y-1 mt-1">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{cust.phone}</span>
                      </div>
                      {cust.weddingDate && (
                        <div className="flex items-center space-x-1 text-amber-800 font-medium">
                          <Calendar className="w-3 h-3 text-amber-600" />
                          <span>ថ្ងៃការ: {cust.weddingDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Customer Profile Detail */}
          {activeCustomer && (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      VIP Client
                    </span>
                    <h3 className="text-2xl font-black text-white pt-1">
                      {activeCustomer.name}
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>{activeCustomer.phone}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block uppercase font-bold">
                      ចំណាយសរុប (Total Spent)
                    </span>
                    <span className="text-3xl font-black text-amber-400">
                      ${activeCustomer.totalSpent.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-700/80 text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block font-semibold">ថ្ងៃរៀបមង្គលការ</span>
                    <span className="font-bold text-amber-300 text-sm">
                      {activeCustomer.weddingDate || 'មិនទាន់កំណត់'}
                    </span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block font-semibold">ចំនួនវិក្កយបត្រ</span>
                    <span className="font-bold text-white text-sm">
                      {activeCustomer.totalInvoices} វិក្កយបត្រ
                    </span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block font-semibold">ប្រាក់នៅខ្វះ</span>
                    <span className="font-extrabold text-amber-400 text-sm">
                      ${activeCustomer.totalPending.toLocaleString()}
                    </span>
                  </div>
                </div>

                {activeCustomer.location && (
                  <p className="text-xs text-slate-300 flex items-center space-x-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>ទីតាំង: {activeCustomer.location}</span>
                  </p>
                )}
              </div>

              {/* Customer's Invoices History */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>ប្រវត្តិវិក្កយបត្ររបស់អតិថិជន ({activeCustomerInvoices.length})</span>
                </h4>

                <div className="space-y-3">
                  {activeCustomerInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-amber-700">#{inv.invoiceNumber}</span>
                          <span className="text-sm font-bold text-slate-900">{inv.packageName}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          ថ្ងៃចេញ: {inv.issueDate} • ថ្ងៃការ: {inv.weddingDate || 'N/A'}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-slate-900">
                            ${inv.total.toLocaleString()}
                          </span>
                          <span className="block text-[11px] font-bold text-emerald-600">
                            បានទូទាត់: ${inv.paidAmount.toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => onViewInvoice(inv)}
                          className="p-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                        >
                          មើល
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};
