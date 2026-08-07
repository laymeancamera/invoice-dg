import React, { useRef, useState } from 'react';
import { Invoice, StudioProfile } from '../types';
import { toPng } from 'html-to-image';
import { 
  X, 
  Download, 
  Send, 
  Copy, 
  Printer, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  MapPin, 
  Calendar, 
  QrCode,
  Camera,
  Sparkles,
  FileText
} from 'lucide-react';
import { openTelegramShare, copyTelegramMessage } from '../lib/telegram';

interface InvoicePreviewModalProps {
  invoice: Invoice;
  studio: StudioProfile;
  onClose: () => void;
  onEdit: (invoice: Invoice) => void;
  onPayment: (invoice: Invoice) => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  studio,
  onClose,
  onEdit,
  onPayment,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // High Resolution PNG Export supporting A4 paper format on mobile (iPhone & Android)
  const handleExportPNG = async () => {
    if (!invoiceRef.current) return;
    setIsExporting(true);

    try {
      const element = invoiceRef.current;
      // Use standard A4 width (794px at 96 DPI) for consistent PNG output
      const dataUrl = await toPng(element, {
        quality: 0.98,
        pixelRatio: 2, // 2x DPI (~1600px width) for optimal balance of crisp print & mobile GPU memory
        backgroundColor: '#ffffff',
        fontEmbedCSS: '', // Avoids cross-origin CSS stylesheet read errors
        width: 794,
        style: {
          width: '794px',
          minWidth: '794px',
          maxWidth: '794px',
          overflow: 'visible',
          height: 'auto',
          maxHeight: 'none',
          transform: 'none',
        },
      });

      // Convert data URL to Blob for seamless iOS Safari & Android mobile download support
      const fetchRes = await fetch(dataUrl);
      const blob = await fetchRes.blob();
      const blobUrl = URL.createObjectURL(blob);

      const fileName = `Invoice_${invoice.invoiceNumber}_${invoice.customerName.replace(/[^a-zA-Z0-9_\u1780-\u17FF]/g, '_')}.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      showToast('បានរៀបចំ និងទាញយក File PNG A4 កម្រិតខ្ពស់រួចរាល់!');
    } catch (err) {
      console.error('Failed to export image', err);
      alert('មានបញ្ហាក្នុងការ Export PNG សូមសាកល្បងម្តងទៀត');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyTelegram = async () => {
    const ok = await copyTelegramMessage(invoice, studio);
    if (ok) {
      showToast('បានចម្លងអត្ថបទ Telegram រួចរាល់!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const khrTotal = (invoice.total * studio.exchangeRateKHR).toLocaleString('km-KH');
  const khrPaid = (invoice.paidAmount * studio.exchangeRateKHR).toLocaleString('km-KH');
  const khrBalance = (invoice.balanceDue * studio.exchangeRateKHR).toLocaleString('km-KH');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-amber-400 border border-amber-500/40 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-bold animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]">
        
        {/* Top Control Bar (Fixed) */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center justify-between sm:justify-start space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-600 text-white rounded-md">
                #{invoice.invoiceNumber}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                មើលវិក្កយបត្រ (Preview)
              </h3>
            </div>
            {/* Mobile close button right next to invoice number */}
            <button
              onClick={onClose}
              className="sm:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-1.5 flex-wrap">
            {/* Export High-Res PNG Button */}
            <button
              onClick={handleExportPNG}
              disabled={isExporting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'កំពុងបង្កើត PNG...' : 'Export PNG'}</span>
            </button>

            {/* Telegram Share Button */}
            <button
              onClick={() => openTelegramShare(invoice, studio)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 py-2 rounded-lg text-xs shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </button>

            {/* Copy Telegram Text */}
            <button
              onClick={handleCopyTelegram}
              title="ចម្លងអត្ថបទ Telegram"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              title="Print វិក្កយបត្រ"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer hidden md:block"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Desktop Close */}
            <button
              onClick={onClose}
              className="hidden sm:block p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Canvas Body */}
        <div className="p-3 sm:p-6 overflow-y-auto overflow-x-auto bg-slate-100/60 flex justify-start sm:justify-center w-full">
          
          {/* PRINTABLE HIGH-RES INVOICE CARD CONTAINER */}
          <div
            ref={invoiceRef}
            className="bg-white text-slate-900 w-full max-w-3xl p-6 sm:p-8 rounded-xl border border-slate-200 shadow-lg space-y-4 font-sans shrink-0"
            style={{ minWidth: '680px' }}
          >
            {/* Invoice Top Header */}
            <div className="flex justify-between items-start border-b-2 border-blue-600 pb-4">
              
              {/* Studio Info */}
              <div className="space-y-1.5 max-w-md">
                <div className="flex items-center space-x-3">
                  {studio.logoUrl ? (
                    <img
                      src={studio.logoUrl}
                      alt="Logo"
                      className="w-13 h-13 rounded-xl object-cover ring-1 ring-slate-300"
                    />
                  ) : (
                    <div className="w-13 h-13 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
                      <Camera className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl font-extrabold text-slate-900">
                      {studio.khmerName || studio.name}
                    </h1>
                    <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">
                      {studio.name}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>ទូរស័ព្ទ: {studio.phone} {studio.secondaryPhone ? `/ ${studio.secondaryPhone}` : ''}</span>
                  </div>
                  {studio.address && (
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>អាសយដ្ឋាន: {studio.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Title & Status */}
              <div className="text-right space-y-1">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  វិក្កយបត្រ
                </h2>
                <p className="text-xs font-bold text-amber-600 tracking-wider">
                  INVOICE: #{invoice.invoiceNumber}
                </p>

                {/* Status Stamp */}
                <div className="pt-1">
                  {invoice.status === 'paid' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>បានទូទាត់រួច (FULLY PAID)</span>
                    </span>
                  )}
                  {invoice.status === 'deposit' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-300 uppercase">
                      <Clock className="w-3.5 h-3.5" />
                      <span>បានកក់ប្រាក់ (DEPOSIT PAID)</span>
                    </span>
                  )}
                  {invoice.status === 'unpaid' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300 uppercase">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>មិនទាន់ទូទាត់ (UNPAID)</span>
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 pt-0.5">
                  ថ្ងៃចេញ: <span className="font-semibold">{invoice.issueDate}</span>
                </p>
              </div>
            </div>

            {/* Bill To Customer & Wedding Event Box */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  អតិថិជន (Client Details)
                </p>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {invoice.customerName}
                </h3>
                <p className="text-xs text-slate-700 font-medium mt-0.5">
                  📞 ទូរស័ព្ទ: {invoice.customerPhone}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  ព័ត៌មានកម្មវិធី (Event & Venue)
                </p>
                {invoice.weddingDate && (
                  <p className="text-xs font-bold text-amber-700 bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-200 mb-0.5">
                    💒 ថ្ងៃរៀបមង្គលការ/កម្មវិធី: {invoice.weddingDate}
                  </p>
                )}
                {invoice.eventLocation && (
                  <p className="text-xs text-slate-700 mt-0.5 break-words [word-break:break-word]">
                    📍 ទីតាំង: {invoice.eventLocation}
                  </p>
                )}
              </div>
            </div>

            {/* Invoice Line Items Table */}
            <div>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[11px] uppercase font-bold">
                    <th className="p-2.5 rounded-tl-lg">ល.រ</th>
                    <th className="p-2.5">បរិយាយសេវាកម្ម (Description)</th>
                    <th className="p-2.5 text-center">ចំនួន</th>
                    <th className="p-2.5 text-right">តម្លៃ ($)</th>
                    <th className="p-2.5 text-right rounded-tr-lg">សរុប ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 border-b border-slate-200">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id || idx} className="text-slate-800">
                      <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-2.5 font-semibold whitespace-pre-line text-slate-900 break-words [word-break:break-word] max-w-sm">
                        {item.description}
                      </td>
                      <td className="p-2.5 text-center font-bold text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="p-2.5 text-right font-medium text-slate-700">
                        ${item.unitPrice.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right font-extrabold text-slate-900">
                        ${item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals & KHQR Code Section */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              
              {/* KHQR Code & Bank Transfer Box */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center space-x-1.5">
                  <QrCode className="w-4 h-4 text-rose-600" />
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                    ទូទាត់ប្រាក់តាម Bakong KHQR / ធនាគារ
                  </h4>
                </div>

                <div className="flex items-center space-x-3">
                  {studio.khqrImageUrl ? (
                    <img
                      src={studio.khqrImageUrl}
                      alt="Bakong KHQR"
                      className="w-24 h-24 object-contain border border-slate-300 rounded-lg bg-white p-1 shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-white border border-rose-300 rounded-lg p-1.5 text-center flex flex-col items-center justify-center space-y-1 shadow-sm">
                      <QrCode className="w-8 h-8 text-rose-600" />
                      <span className="text-[9px] font-extrabold text-rose-600 uppercase">
                        KHQR Payment
                      </span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-700 space-y-0.5">
                    <p className="font-bold text-slate-900">{studio.bankName || 'ABA Bank'}</p>
                    <p className="font-extrabold text-amber-700">{studio.bankAccountNumber || '000 123 456'}</p>
                    <p className="text-slate-600 uppercase text-[10px] font-bold">{studio.bankAccountName || 'LAY MEAN'}</p>
                    <p className="text-[10px] text-slate-500 pt-0.5">
                      អត្រាប្តូរប្រាក់: $1 = {studio.exchangeRateKHR.toLocaleString('km-KH')} ៛
                    </p>
                  </div>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="space-y-1 text-xs text-slate-800">
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="text-slate-600">សរុប (Subtotal):</span>
                  <span className="font-bold">${invoice.subtotal.toLocaleString()}</span>
                </div>

                {invoice.discount > 0 && (
                  <div className="flex justify-between py-0.5 border-b border-slate-200 text-rose-600">
                    <span>បញ្ចុះតម្លៃ (Discount):</span>
                    <span className="font-bold">-${invoice.discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b-2 border-slate-900 text-slate-900">
                  <span className="font-extrabold">តម្លៃសរុប (Grand Total):</span>
                  <span className="font-black text-base">${invoice.total.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-0.5 text-emerald-700">
                  <span className="font-semibold">បានកក់/ទូទាត់ (Paid):</span>
                  <span className="font-bold">${invoice.paidAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-1.5 bg-amber-50 px-2.5 rounded-lg border border-amber-200 text-amber-900">
                  <span className="font-extrabold">ប្រាក់នៅសល់ (Balance Due):</span>
                  <span className="font-black text-lg text-amber-700">
                    ${invoice.balanceDue.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-right text-slate-500">
                  ≈ {khrBalance} ៛
                </p>
              </div>
            </div>

            {/* Terms and Notes Section (Moved up, compact & complete) */}
            <div className="border-t border-slate-200 pt-3 space-y-2 text-xs text-slate-600 w-full overflow-visible">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 w-full">
                <p className="font-bold text-slate-800 text-[11px] mb-1.5 uppercase tracking-wide flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>លក្ខខណ្ឌការងារ និងការទូទាត់ (Terms & Conditions)</span>
                </p>
                <ul className="space-y-1 text-[11px] text-slate-700 w-full">
                  {studio.termsAndConditions
                    .filter((t) => !t.includes('រក្សាសិទ្ធិក្នុងការប្រើប្រាស់រូបថត'))
                    .map((term, i) => (
                      <li key={i} className="flex items-start space-x-1.5 w-full">
                        <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                        <span className="flex-1 min-w-0 leading-relaxed text-slate-700 font-medium break-words [word-break:break-word] whitespace-pre-wrap">
                          {term}
                        </span>
                      </li>
                    ))}
                </ul>

                {invoice.notes && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-700 w-full">
                    <span className="font-bold text-slate-900">កំណត់សម្គាល់បន្ថែម: </span>
                    <p className="italic text-slate-700 mt-0.5 break-words [word-break:break-word] whitespace-pre-wrap">
                      {invoice.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Thank you note */}
              <div className="text-center pt-0.5 text-[10px] text-slate-400 font-medium">
                ~ សូមអរគុណយ៉ាងជ្រាលជ្រៅដែលបានជឿជាក់លើសេវាកម្មរបស់យើងខ្ញុំ ~
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => onPayment(invoice)}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>កត់ត្រាការទូទាត់</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onEdit(invoice);
              }}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              កែសម្រួល
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              បិទ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
