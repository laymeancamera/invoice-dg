import React, { useRef, useState } from 'react';
import { Invoice, StudioProfile, UserAccount } from '../types';
import { toPng } from 'html-to-image';
import { 
  X, 
  Download, 
  Send, 
  Copy, 
  Printer, 
  CreditCard, 
  Sparkles
} from 'lucide-react';
import { openTelegramShare, copyTelegramMessage } from '../lib/telegram';
import { InvoiceTemplateRender, INVOICE_TEMPLATES } from './InvoiceTemplateSelector';

interface InvoicePreviewModalProps {
  invoice: Invoice;
  studio: StudioProfile;
  currentUser?: UserAccount | null;
  onClose: () => void;
  onEdit: (invoice: Invoice) => void;
  onPayment: (invoice: Invoice) => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  studio,
  currentUser,
  onClose,
  onEdit,
  onPayment,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string>(
    invoice.invoiceTemplate || studio.selectedTemplateId || 'classic_blue'
  );

  const effectiveStudio: StudioProfile = {
    ...studio,
    logoUrl: studio.logoUrl || '/digital_pro_logo.svg'
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to ensure all images in DOM are converted to Data URLs before toPng export
  const inlineContainerImages = async (container: HTMLElement) => {
    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(
      images.map(async (img) => {
        if (!img.src || img.src.startsWith('data:')) return;

        try {
          const res = await fetch(img.src, { mode: 'cors', cache: 'force-cache' });
          if (res.ok) {
            const blob = await res.blob();
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve((reader.result as string) || '');
              reader.readAsDataURL(blob);
            });
            if (dataUrl && dataUrl.startsWith('data:')) {
              img.src = dataUrl;
              return;
            }
          }
        } catch (err) {
          console.warn('Direct fetch image inline failed:', img.src, err);
        }

        try {
          if (!img.complete || img.naturalWidth === 0) {
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.clientWidth || 300;
          canvas.height = img.naturalHeight || img.clientHeight || 300;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const canvasDataUrl = canvas.toDataURL('image/png');
            if (canvasDataUrl && canvasDataUrl !== 'data:,') {
              img.src = canvasDataUrl;
            }
          }
        } catch (e) {
          console.error('Canvas image inline failed:', e);
        }
      })
    );
  };

  // High Resolution PNG Export supporting full A4 paper format on mobile & desktop
  const handleExportPNG = async () => {
    if (!invoiceRef.current) return;
    setIsExporting(true);

    try {
      const element = invoiceRef.current;
      
      // Convert all images (Logo & KHQR) to Base64 to guarantee visibility in PNG
      await inlineContainerImages(element);

      // Calculate exact full dimensions of the invoice card (A4 ratio min 794px x 1123px)
      const targetWidth = Math.max(element.scrollWidth, element.offsetWidth, 794);
      const targetHeight = Math.max(element.scrollHeight, element.offsetHeight, 1123);

      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2, // High DPI (~1600px width) for crisp output
        backgroundColor: '#ffffff',
        fontEmbedCSS: '', // Avoids cross-origin CSS stylesheet read errors
        width: targetWidth,
        height: targetHeight,
        style: {
          width: `${targetWidth}px`,
          minWidth: `${targetWidth}px`,
          maxWidth: `${targetWidth}px`,
          height: `${targetHeight}px`,
          minHeight: `${targetHeight}px`,
          maxHeight: `${targetHeight}px`,
          overflow: 'visible',
          transform: 'none',
          margin: '0',
          padding: '0',
        },
        cacheBust: true,
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

      showToast('បានរៀបចំ និងទាញយក File PNG A4 កម្រិតខ្ពស់ពេញលេញរួចរាល់!');
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
          <div ref={invoiceRef} className="shrink-0">
            <InvoiceTemplateRender
              templateId={activeTemplate}
              invoice={invoice}
              studio={effectiveStudio}
            />
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
