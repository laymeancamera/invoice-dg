import React, { useState } from 'react';
import { UserAccount, StudioProfile, UpgradeRequest } from '../types';
import { saveUpgradeRequest, getUpgradeRequests } from '../lib/storage';
import { 
  X, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  CreditCard,
  QrCode,
  Zap,
  Check,
  Copy,
  Lock,
  Smartphone,
  Send,
  Cloud,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../lib/i18n';

interface UpgradeModalProps {
  currentUser: UserAccount;
  adminStudio: StudioProfile;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  currentUser,
  adminStudio,
  onClose,
  onSuccess
}) => {
  const { lang, t } = useLanguage();
  const existingRequests = getUpgradeRequests();
  const userPendingReq = existingRequests.find(
    r => r.userId === currentUser.id && r.status === 'pending'
  );

  const [paymentSlipUrl, setPaymentSlipUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Handle image file upload for payment slip
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(lang === 'km' ? 'ទំហំរូបភាពត្រូវតូចជាង 5MB!' : 'File size must be under 5MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPaymentSlipUrl(reader.result);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyAccount = () => {
    const accNum = adminStudio.bankAccountNumber || '000 123 456';
    navigator.clipboard.writeText(accNum);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentSlipUrl) {
      setError(lang === 'km' ? 'សូម Upload រូបភាពវិក្កយបត្រ/វិក្កយបត្រទូទាត់ប្រាក់ (Payment Slip)!' : 'Please upload payment slip image!');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newReq: UpgradeRequest = {
        id: `upg-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmailPhone: currentUser.emailPhone,
        studioName: currentUser.studioName,
        paymentSlipUrl: paymentSlipUrl,
        amount: 10,
        status: 'pending',
        requestedAt: new Date().toISOString()
      };

      saveUpgradeRequest(newReq);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(lang === 'km' ? 'មានបញ្ហាក្នុងការផ្ញើសំណើ សូមសាកល្បងម្តងទៀត' : 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 w-full max-w-xl rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden my-4 sm:my-8 border border-cyan-500/40 text-slate-100 relative">
        
        {/* Top Digital Circuit Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Super App Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 border-b border-slate-800/90 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-[11px] font-black mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>DIGITAL SUPER APP • LIFETIME PRO PASS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
            <span>{lang === 'km' ? 'ដំឡេីងគម្រោង SUPER APP PRO' : 'Upgrade to Super App Pro'}</span>
            <span className="text-amber-400 text-lg">($10)</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            {lang === 'km' 
              ? 'ទិញតែមួយដងគត់ ($10) • ប្រើប្រាស់បានមួយជីវិត គ្មានដែនកំណត់បង្កើតវិក្កយបត្រ!'
              : 'Pay once ($10), use forever with zero limits and lifetime cloud sync!'}
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar">
          
          {/* Pending Request Banner */}
          {(userPendingReq || submitted) ? (
            <div className="bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border-2 border-amber-500/50 p-6 rounded-2xl text-center space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                <Clock className="w-7 h-7 animate-spin" />
              </div>
              <div>
                <h3 className="font-black text-amber-300 text-lg">
                  {lang === 'km' ? 'សំណើ Upgrade PRO ($10) កំពុងស្ថិតក្នុងដំណើរការ!' : 'Upgrade Request Pending Approval!'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mt-1 max-w-md mx-auto">
                  {lang === 'km'
                    ? 'សំណើទូទាត់ប្រាក់របស់អ្នកបានផ្ញើទៅកាន់ Admin រួចរាល់។ ប្រព័ន្ធនឹងធ្វើការប្តូរគណនីរបស់អ្នកទៅជា No Limit ដោយស្វ័យប្រវត្តិនៅពេល Admin ពិនិត្យរួច។'
                    : 'Your payment slip has been submitted to Admin. Your account will automatically unlock unlimited status upon approval.'}
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-md border border-slate-700 transition-all cursor-pointer"
                >
                  {lang === 'km' ? 'យល់ព្រម / បិទ' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Plan Benefits Super App Card */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-cyan-500/30 p-4 sm:p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-lg">
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="font-black text-white text-base block">
                      {lang === 'km' ? 'គម្រោង Super App Lifetime Pro' : 'Super App Lifetime Pro'}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'km' ? 'គ្មានថ្លៃសេវាប្រចាំខែ (Zero Monthly Fees)' : 'Zero Monthly Fees'}</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400">$10</span>
                    <span className="text-[10px] text-slate-400 block font-mono">/ One-Time</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300 pt-1">
                  <div className="flex items-center space-x-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold text-[11px]">បង្កើតវិក្កយបត្រគ្មានដែនកំណត់</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <Cloud className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-semibold text-[11px]">Cloud Backup & Sync រហ័ស</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <QrCode className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-[11px]">Bakong KHQR Auto Generator</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <Send className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-semibold text-[11px]">Export PNG & Telegram Direct</span>
                  </div>
                </div>
              </div>

              {/* Admin KHQR Payment Box (Digital Super App Box) */}
              <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-black text-amber-400 flex items-center space-x-2">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>ស្កេនទូទាត់ $10 តាម Bakong KHQR</span>
                  </span>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-black">
                    $10.00 USD
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <div className="relative shrink-0 bg-white p-2 rounded-xl shadow-md border border-slate-700">
                    <img 
                      src={adminStudio.khqrImageUrl || '/digital_pro_logo.svg'} 
                      alt="Admin Bakong KHQR" 
                      className="w-32 h-32 object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-xl pointer-events-none" />
                  </div>

                  <div className="space-y-2 text-xs flex-1 text-center sm:text-left">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">ឈ្មោះគណនីធនាគារ</span>
                      <p className="font-black text-white text-base text-amber-300">
                        {adminStudio.bankAccountName || 'LAY MEAN'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">លេខគណនី (Account No.)</span>
                      <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                        <span className="font-mono text-cyan-300 font-black bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
                          {adminStudio.bankAccountNumber || '000 123 456'}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyAccount}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center space-x-1 text-[11px]"
                          title="ចម្លងលេខគណនី"
                        >
                          {copiedAccount ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] text-emerald-400 font-bold">បានចម្លង</span>
                            </>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 pt-1 leading-normal">
                      សូមស្កេនទូទាត់ប្រាក់ចំនួន <span className="text-amber-400 font-bold">$10.00</span> រួចថតរូបវិក្កយបត្រ (Payment Slip) Upload ខាងក្រោម។
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Slip Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-200">
                  {lang === 'km' ? 'Upload រូបភាពវិក្កយបត្រទូទាត់ប្រាក់ (Payment Slip): *' : 'Upload Payment Slip Image: *'}
                </label>

                {paymentSlipUrl ? (
                  <div className="relative border-2 border-emerald-500/80 rounded-2xl p-3 bg-slate-900/90 text-center space-y-2 shadow-lg">
                    <img 
                      src={paymentSlipUrl} 
                      alt="Payment Slip Preview" 
                      className="max-h-52 mx-auto rounded-xl border border-slate-700 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setPaymentSlipUrl('')}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer inline-block"
                    >
                      {lang === 'km' ? 'ប្តូររូបភាពផ្សេង' : 'Change Image'}
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-6 text-center bg-slate-900/60 hover:bg-slate-900 transition-all cursor-pointer relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <Upload className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-200">
                      {lang === 'km' ? 'ចុចទីនេះដើម្បី Upload រូបភាព Payment Slip' : 'Click to Upload Payment Slip'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang === 'km' ? 'គាំទ្រ PNG, JPG (ទំហំអតិបរមា 5MB)' : 'Supports PNG, JPG (Max 5MB)'}
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/50 text-rose-300 rounded-xl text-xs font-bold flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black py-4 px-6 rounded-2xl text-sm shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2.5 disabled:opacity-50 border border-amber-200/50"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
                <span className="uppercase tracking-wider">
                  {isSubmitting 
                    ? (lang === 'km' ? 'កំពុងផ្ញើសំណើ...' : 'Submitting...') 
                    : (lang === 'km' ? '🚀 ផ្ញើភស្តុតាងដំឡើង Super App Pro ($10)' : '🚀 Submit Payment Slip ($10)')
                  }
                </span>
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
