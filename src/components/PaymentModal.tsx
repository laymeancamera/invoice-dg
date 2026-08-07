import React, { useState } from 'react';
import { Invoice, PaymentMethod, PaymentRecord } from '../types';
import { X, CreditCard, DollarSign, Calendar, CheckCircle2, History } from 'lucide-react';

interface PaymentModalProps {
  invoice: Invoice;
  onSavePayment: (updatedInvoice: Invoice) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  invoice,
  onSavePayment,
  onClose,
}) => {
  const [amount, setAmount] = useState<number>(invoice.balanceDue || 0);
  const [method, setMethod] = useState<PaymentMethod>('khqr');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      alert('សូមបញ្ចូលចំនួនទឹកប្រាក់ទូទាត់ដែលធំជាង ០!');
      return;
    }

    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      date,
      amount: Number(amount),
      method,
      note: note.trim() || (method === 'khqr' ? 'ទូទាត់តាម Bakong KHQR' : 'ទូទាត់ប្រាក់')
    };

    const updatedPayments = [...(invoice.payments || []), newRecord];
    const totalPaid = updatedPayments.reduce((acc, p) => acc + p.amount, 0);
    const newBalance = Math.max(0, invoice.total - totalPaid);

    const updatedInvoice: Invoice = {
      ...invoice,
      paidAmount: totalPaid,
      balanceDue: newBalance,
      deposit: invoice.deposit || totalPaid,
      status: totalPaid >= invoice.total ? 'paid' : totalPaid > 0 ? 'deposit' : 'unpaid',
      payments: updatedPayments,
      updatedAt: new Date().toISOString()
    };

    onSavePayment(updatedInvoice);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              កត់ត្រាការទូទាត់ - #{invoice.invoiceNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary Banner */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">តម្លៃសរុប</span>
            <span className="text-base font-extrabold text-slate-900">
              ${invoice.total.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">បានទូទាត់រួច</span>
            <span className="text-base font-bold text-emerald-600">
              ${invoice.paidAmount.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">ប្រាក់នៅខ្វះ</span>
            <span className="text-base font-extrabold text-blue-600">
              ${invoice.balanceDue.toLocaleString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              ចំនួនទឹកប្រាក់ទូទាត់ ($) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
              <input
                type="number"
                min={1}
                max={invoice.balanceDue || invoice.total}
                step="any"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full pl-8 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-base font-extrabold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              អ្នកអាចចុចទូទាត់គ្រប់ចំនួន ឬទូទាត់ប្រាក់កក់បន្ថែម
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              វិធីសាស្ត្រទូទាត់ (Payment Method)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('khqr')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  method === 'khqr'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Bakong KHQR
              </button>

              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  method === 'cash'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                សាច់ប្រាក់សុទ្ធ (Cash)
              </button>

              <button
                type="button"
                onClick={() => setMethod('bank_transfer')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  method === 'bank_transfer'
                    ? 'bg-sky-50 border-sky-500 text-sky-700 ring-2 ring-sky-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                វេរប្រាក់តាមធនាគារ
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              ថ្ងៃទូទាត់
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              ចំណាំបន្ថែម (Note)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ឧទាហរណ៍: ប្រាក់កក់ដំបូង ឬ ប្រាក់នៅសល់"
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Previous Payment History */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-bold text-slate-700 flex items-center space-x-1 mb-2">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>ប្រវត្តិការទូទាត់មុនៗ ({invoice.payments.length})</span>
              </p>
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {invoice.payments.map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">{p.date} • {p.method.toUpperCase()}</span>
                    <span className="font-bold text-emerald-700">${p.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>រក្សាទុកការទូទាត់</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
