import React, { useRef, useState, useEffect } from 'react';
import { Invoice, StudioProfile, UserAccount } from '../types';
import { toPng } from 'html-to-image';
import { 
  X, 
  Download, 
  Send, 
  Copy, 
  Printer, 
  CreditCard, 
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { openTelegramShare, copyTelegramMessage } from '../lib/telegram';
import { InvoiceTemplateRender, INVOICE_TEMPLATES } from './InvoiceTemplateSelector';
import { useLanguage } from '../lib/i18n';

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
  const { lang } = useLanguage();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string>(
    invoice.invoiceTemplate || studio.selectedTemplateId || 'classic_blue'
  );

  // Initial responsive zoom level: fit 794px A4 canvas on mobile screen (~48% zoom)
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return 0.48;
    }
    return 1.0;
  });

  const effectiveStudio: StudioProfile = {
    ...studio,
    logoUrl: studio.logoUrl || '/digital_pro_logo.svg'
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Convert image URL to Data URL (Base64) to guarantee images render in exported PNG
  const urlToDataUrl = async (url: string): Promise<string | null> => {
    if (!url) return null;
    if (url.startsWith('data:')) return url;

    let fullUrl = url;
    if (url.startsWith('/')) {
      fullUrl = window.location.origin + url;
    }

    // Method 1: Fetch as Blob and convert via FileReader
    try {
      const res = await fetch(fullUrl, { cache: 'no-cache', mode: 'cors' });
      if (res.ok) {
        const blob = await res.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string) || '');
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        if (dataUrl && dataUrl.startsWith('data:')) {
          return dataUrl;
        }
      }
    } catch (err) {
      console.warn('Fetch blob conversion failed for:', fullUrl, err);
    }

    // Method 2: HTML Canvas drawImage with crossOrigin anonymous
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.clientWidth || 300;
            canvas.height = img.naturalHeight || img.clientHeight || 300;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL('image/png'));
            } else {
              reject('No canvas context');
            }
          } catch (e) {
            reject(e);
          }
        };
        img.onerror = (e) => reject(e);
        img.src = fullUrl + (fullUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
      });
      if (dataUrl && dataUrl.startsWith('data:')) {
        return dataUrl;
      }
    } catch (err) {
      console.warn('Canvas conversion failed for:', fullUrl, err);
    }

    return null;
  };

  // Pre-process all images (Logo & Bakong KHQR) inside container before PNG export
  const inlineContainerImages = async (container: HTMLElement) => {
    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(
      images.map(async (img) => {
        if (!img.src || img.src.startsWith('data:')) return;
        const dataUrl = await urlToDataUrl(img.src);
        if (dataUrl) {
          img.src = dataUrl;
        }
      })
    );
  };

  // High Resolution PNG Export supporting full A4 paper format on mobile & desktop
  const handleExportPNG = async () => {
    if (!invoiceRef.current) return;
    setIsExporting(true);

    const prevZoom = zoomLevel;
    // Set zoom scale to 1.0 during export to generate full-resolution 1:1 crisp image
    setZoomLevel(1.0);
    await new Promise((r) => setTimeout(r, 120));

    try {
      const element = invoiceRef.current;
      
      // Convert all images (Logo & KHQR) to Base64 to guarantee visibility in PNG
      await inlineContainerImages(element);

      // Calculate exact full dimensions of the invoice card (A4 ratio min 794px x 1123px)
      const targetWidth = Math.max(element.scrollWidth, element.offsetWidth, 794);
      const targetHeight = Math.max(element.scrollHeight, element.offsetHeight, 1123);

      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2.5, // High DPI (~2000px width) for crystal clear output
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

      showToast(lang === 'km' ? 'បានរៀបចំ និងទាញយក File PNG A4 កម្រិតខ្ពស់ពេញលេញរួចរាល់!' : 'High-Res A4 PNG Exported Successfully!');
    } catch (err) {
      console.error('Failed to export image', err);
      alert(lang === 'km' ? 'មានបញ្ហាក្នុងការ Export PNG សូមសាកល្បងម្តងទៀត' : 'Failed to export PNG. Please try again.');
    } finally {
      setIsExporting(false);
      setZoomLevel(prevZoom); // Restore interactive view zoom
    }
  };

  const handleCopyTelegram = async () => {
    const ok = await copyTelegramMessage(invoice, studio);
    if (ok) {
      showToast(lang === 'km' ? 'បានចម្លងអត្ថបទ Telegram រួចរាល់!' : 'Copied Telegram text to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-amber-400 border border-amber-500/40 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-bold animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-4 sm:my-8 max-h-[92vh]">
        
        {/* Top Control Bar (Fixed) */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center justify-between sm:justify-start space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-600 text-white rounded-md">
                #{invoice.invoiceNumber}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {lang === 'km' ? 'មើលវិក្កយបត្រ (Preview)' : 'Preview Invoice'}
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
              <span>{isExporting ? (lang === 'km' ? 'កំពុងបង្កើត PNG...' : 'Exporting PNG...') : 'Export PNG'}</span>
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
              title={lang === 'km' ? 'ចម្លងអត្ថបទ Telegram' : 'Copy Telegram Text'}
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

        {/* Mobile & Desktop Interactive Zoom Toolbar */}
        <div className="bg-slate-800 text-slate-200 px-3 sm:px-6 py-2 flex items-center justify-between border-b border-slate-700 text-xs">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="font-extrabold text-slate-300 text-[11px] sm:text-xs">
              {lang === 'km' ? 'ពង្រីក/បង្រួម:' : 'Zoom:'}
            </span>

            {/* Zoom Out Button */}
            <button
              onClick={() => setZoomLevel((prev) => Math.max(0.3, +(prev - 0.1).toFixed(2)))}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all cursor-pointer active:scale-95 border border-slate-600"
              title={lang === 'km' ? 'បង្រួមតូច (Zoom Out)' : 'Zoom Out'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Percentage Indicator */}
            <span className="font-mono font-black text-amber-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-700 text-[11px] sm:text-xs min-w-[46px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>

            {/* Zoom In Button */}
            <button
              onClick={() => setZoomLevel((prev) => Math.min(2.0, +(prev + 0.1).toFixed(2)))}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all cursor-pointer active:scale-95 border border-slate-600"
              title={lang === 'km' ? 'ពង្រីកធំ (Zoom In)' : 'Zoom In'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setZoomLevel(0.5)}
              className={`px-2 py-1 rounded-md font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer ${
                Math.abs(zoomLevel - 0.5) < 0.05 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              50%
            </button>
            <button
              onClick={() => setZoomLevel(0.75)}
              className={`px-2 py-1 rounded-md font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer ${
                Math.abs(zoomLevel - 0.75) < 0.05 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              75%
            </button>
            <button
              onClick={() => setZoomLevel(1.0)}
              className={`px-2 py-1 rounded-md font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer ${
                Math.abs(zoomLevel - 1.0) < 0.05 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              100%
            </button>

            <button
              onClick={() => setZoomLevel(typeof window !== 'undefined' && window.innerWidth < 640 ? 0.48 : 1.0)}
              className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-amber-300 rounded-md font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer border border-slate-600"
              title={lang === 'km' ? 'កំណត់ឡើងវិញ (Reset Zoom)' : 'Reset Zoom'}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden xs:inline">{lang === 'km' ? 'សមអេក្រង់' : 'Fit'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Canvas Body */}
        <div className="p-2 sm:p-6 overflow-auto bg-slate-100/90 flex-1 flex justify-center items-start w-full min-h-[350px]">
          {/* PRINTABLE HIGH-RES INVOICE CARD CONTAINER WITH TRANSFORM SCALE */}
          <div 
            className="transition-transform duration-150 origin-top flex justify-center shrink-0 shadow-2xl rounded-xl overflow-hidden"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              width: `${794 * zoomLevel}px`,
              minHeight: `${1123 * zoomLevel}px`,
              marginBottom: zoomLevel < 1 ? `-${Math.max(0, 1123 * (1 - zoomLevel))}px` : '1rem'
            }}
          >
            <div ref={invoiceRef} className="bg-white rounded-xl border border-slate-200 overflow-hidden shrink-0" style={{ width: '794px' }}>
              <InvoiceTemplateRender
                templateId={activeTemplate}
                invoice={invoice}
                studio={effectiveStudio}
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => onPayment(invoice)}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>{lang === 'km' ? 'កត់ត្រាការទូទាត់' : 'Record Payment'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onEdit(invoice);
              }}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              {lang === 'km' ? 'កែសម្រួល' : 'Edit'}
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              {lang === 'km' ? 'បិទ' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

