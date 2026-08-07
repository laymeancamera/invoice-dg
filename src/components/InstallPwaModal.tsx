import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, CheckCircle, ArrowDown } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(ios);

    // Check if already in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center relative border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ដំឡើង App ទៅលើ Home Screen</h3>
              <p className="text-xs text-slate-400">ដើម្បីដំណើរការលឿនដូច App Original</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-slate-800">
          {isInstalled ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-lg text-slate-900">កម្មវិធីត្រូវ បានដំឡើងរួចរាល់!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                លោកអ្នកអាចបើកប្រើប្រាស់ដោយផ្ទាល់ចេញពី Home Screen នៃទូរស័ព្ទរបស់អ្នកបានយ៉ាងរលូន។
              </p>
            </div>
          ) : (
            <>
              {/* Feature Highlights */}
              <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3.5 text-xs text-blue-900 space-y-2">
                <p className="font-bold flex items-center space-x-1.5 text-blue-800">
                  <span>✨ អត្ថប្រយោជន៍នៃការដំឡើង (Add to Home Screen):</span>
                </p>
                <ul className="space-y-1 pl-4 list-disc text-slate-700">
                  <li>ដំណើរការពេញអេក្រង់ Fullscreen ដូច App Original (គ្មានរបារ Browser)</li>
                  <li>ដំណើរការលឿន មិនរអាក់រអួល និងងាយស្រួលបើកប្រើប្រាស់ភ្លាមៗ</li>
                  <li>រក្សាទិន្នន័យសុវត្ថិភាព និងមិនបាត់បង់វិក្កយបត្រ</li>
                </ul>
              </div>

              {/* One-click install prompt if available (Chrome / Edge / Android) */}
              {deferredPrompt && (
                <div className="space-y-3">
                  <button
                    onClick={handleInstallClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>ចុចដំឡើងឥឡូវនេះ (Install Now)</span>
                  </button>
                </div>
              )}

              {/* iOS Safari Instructions */}
              {isIos && (
                <div className="space-y-3 border-t border-slate-200 pt-3">
                  <p className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                    <Smartphone className="w-4 h-4 text-amber-600" />
                    <span>របៀបដំឡើងលើ iPhone / iPad (Safari):</span>
                  </p>
                  <ol className="space-y-2.5 text-xs text-slate-700 pl-1">
                    <li className="flex items-start space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span>ចុចប៊ូតុង <strong className="text-slate-900 inline-flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300"><Share className="w-3.5 h-3.5 text-blue-600" /> Share</strong> នៅខាងក្រោមអេក្រង់ Safari</span>
                    </li>
                    <li className="flex items-start space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span>អូសចុះក្រោម រួចចុចលើ <strong className="text-slate-900 inline-flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300"><PlusSquare className="w-3.5 h-3.5 text-blue-600" /> Add to Home Screen</strong></span>
                    </li>
                    <li className="flex items-start space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span>ចុចប៊ូតុង <strong className="text-blue-600 font-extrabold">Add</strong> នៅខាងស្តាំលើ ដើម្បីបញ្ចប់</span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Android General Instructions (if deferredPrompt not triggered automatically) */}
              {!deferredPrompt && !isIos && (
                <div className="space-y-3 border-t border-slate-200 pt-3">
                  <p className="font-bold text-xs text-slate-900">
                    របៀបដំឡើងលើ Android (Chrome):
                  </p>
                  <ol className="space-y-2 text-xs text-slate-700 pl-1">
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">១.</span>
                      <span>ចុចលើសញ្ញាចុចបី <strong className="text-slate-900">⋮ (Menu)</strong> នៅជ្រុងខាងស្តាំលើនៃ Browser</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="font-bold text-blue-600">២.</span>
                      <span>ជ្រើសរើស <strong className="text-slate-900">"Add to Home screen"</strong> ឬ <strong className="text-slate-900">"Install app"</strong></span>
                    </li>
                  </ol>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            បិទ (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
