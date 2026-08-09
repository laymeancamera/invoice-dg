import React, { useState, useEffect } from 'react';
import { StudioProfile, UserAccount } from '../types';
import { 
  Settings, 
  Upload, 
  Save, 
  QrCode, 
  Camera, 
  Building, 
  CreditCard, 
  Download, 
  RefreshCw, 
  Sparkles,
  Link as LinkIcon,
  Palette,
  Globe,
  Smartphone
} from 'lucide-react';
import { exportAllDataJSON, importAllDataJSON } from '../lib/storage';
import { compressImageToDataUrl } from '../lib/imageUtils';
import { INVOICE_TEMPLATES } from './InvoiceTemplateSelector';
import { useLanguage } from '../lib/i18n';
import { InstallPwaModal } from './InstallPwaModal';

interface StudioSettingsProps {
  studio: StudioProfile;
  currentUser: UserAccount | null;
  onSaveStudio: (profile: StudioProfile) => void;
}

export const StudioSettings: React.FC<StudioSettingsProps> = ({ 
  studio, 
  currentUser, 
  onSaveStudio 
}) => {
  const { lang, setLang } = useLanguage();
  const [profile, setProfile] = useState<StudioProfile>(studio);
  const [termsText, setTermsText] = useState(
    studio.termsAndConditions ? studio.termsAndConditions.join('\n') : ''
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  useEffect(() => {
    setProfile(studio);
    if (studio.termsAndConditions) {
      setTermsText(studio.termsAndConditions.join('\n'));
    }
  }, [studio]);

  const isAdmin = currentUser?.role === 'admin';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Upload Logo handler (compresses & converts to data URL)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImageToDataUrl(file, 500, 500, 0.85);
      setProfile((prev) => ({ ...prev, logoUrl: compressedDataUrl }));
      showToast('បានបញ្ចូល និងបង្រួមរូបភាព Logo លើ Cloud រួចរាល់!');
    } catch (err) {
      console.error('Error compressing logo image:', err);
      alert('មានបញ្ហាក្នុងការ Upload រូបភាព! សូមព្យាយាមម្តងទៀត');
    }
  };

  // Add Logo via Image URL
  const handleAddLogoUrl = () => {
    if (!logoUrlInput.trim()) return;
    setProfile((prev) => ({ ...prev, logoUrl: logoUrlInput.trim() }));
    setLogoUrlInput('');
    showToast('បានប្តូរ Logo តាម Link URL រួចរាល់!');
  };

  // Upload KHQR Image handler (compresses & converts to data URL)
  const handleKhqrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImageToDataUrl(file, 500, 500, 0.85);
      setProfile((prev) => ({ ...prev, khqrImageUrl: compressedDataUrl }));
      showToast('បានបញ្ចូលរូបភាព Bakong KHQR រួចរាល់!');
    } catch (err) {
      console.error('Error compressing KHQR image:', err);
      alert('មានបញ្ហាក្នុងការ Upload រូបភាព! សូមព្យាយាមម្តងទៀត');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTerms = termsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updatedProfile: StudioProfile = {
      ...profile,
      termsAndConditions: updatedTerms
    };

    onSaveStudio(updatedProfile);
    showToast('បានរក្សាទុកការកំណត់ Studio & Logo ទៅកាន់ Cloud Firestore រួចរាល់!');
  };

  // JSON Export for Cloud Backup
  const handleExportJSON = () => {
    const jsonStr = exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital_pro_studio_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('បានទាញយកទិន្នន័យ Backup ជា File JSON!');
  };

  // JSON Import for Cloud Restore
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const success = importAllDataJSON(content);
      if (success) {
        showToast('បាន Restore ទិន្នន័យជោគជ័យទៅកាន់ Cloud!');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        alert('File JSON ពុំត្រឹមត្រូវទេ! សូមពិនិត្យមើលម្តងទៀត');
      }
    };
    reader.readAsText(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-amber-400 border border-amber-500/40 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-bold animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick Mobile App Install & System Language Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Language Selection Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              {lang === 'km' ? 'ភាសាប្រើប្រាស់ក្នុងប្រព័ន្ធ (System Language)' : 'System Language Setting'}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLang('km')}
              className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                lang === 'km'
                  ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">🇰🇭</span>
                <div className="text-left">
                  <p className="font-extrabold text-slate-900 text-xs">ភាសាខ្មែរ</p>
                </div>
              </div>
              {lang === 'km' && (
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full ring-4 ring-amber-200" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setLang('en')}
              className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                lang === 'en'
                  ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">🇬🇧</span>
                <div className="text-left">
                  <p className="font-extrabold text-slate-900 text-xs">English</p>
                </div>
              </div>
              {lang === 'en' && (
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full ring-4 ring-amber-200" />
              )}
            </button>
          </div>
        </div>

        {/* Install Mobile App PWA Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Smartphone className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="font-extrabold text-white text-sm">
              {lang === 'km' ? 'ដំឡើង App លើទូរស័ព្ទ (Install Mobile App)' : 'Install App on Phone'}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'km' 
              ? 'ដំឡើងប្រព័ន្ធវិក្កយបត្រនេះទៅលើអេក្រង់ Home Screen ទូរស័ព្ទដៃ (iOS & Android) ដើម្បីប្រើប្រាស់បានលឿន!'
              : 'Add Digital Pro Invoicing directly to your home screen for fast mobile access.'}
          </p>
          <button
            type="button"
            onClick={() => setIsPwaModalOpen(true)}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Smartphone className="w-4 h-4 fill-slate-950" />
            <span>{lang === 'km' ? '📲 ដំឡើង App លើទូរស័ព្ទ (Install App)' : '📲 Install Mobile App Now'}</span>
          </button>
        </div>

      </div>

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">
              {isAdmin ? 'ការកំណត់ប្រព័ន្ធ និង Logo (Admin Console)' : 'ការកំណត់ហាងថតរូប (Studio Settings)'}
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-black bg-blue-100 text-blue-800 rounded-md uppercase">
              {isAdmin ? 'Admin Console' : 'Member Studio'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin 
              ? 'កែប្រែ Logo, ឈ្មោះ Studio, Bakong KHQR និងរក្សាទុកទៅ Cloud Firestore ដោយស្វ័យប្រវត្តិ'
              : 'កែប្រែឈ្មោះហាង, Bakong KHQR, និងព័ត៌មានគណនីសម្រាប់បង្ហាញលើវិក្កយបត្ររបស់អ្នក'}
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl shadow transition-all text-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>រក្សាទុកទៅ Cloud</span>
        </button>
      </div>

      {/* Branding & Logo & KHQR Upload Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Studio Logo Upload */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Camera className="w-4 h-4 text-amber-500" />
              <span>
                {isAdmin 
                  ? 'រូបភាព Logo ប្រព័ន្ធ (System Logo - Admin)' 
                  : 'រូបភាព Logo លើវិក្កយបត្រគណនីរបស់អ្នក (User Invoice Logo)'}
              </span>
            </h3>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
              isAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
            }`}>
              {isAdmin ? 'System Logo' : 'User Invoice Only'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {profile.logoUrl ? (
              <img
                src={profile.logoUrl}
                alt="Studio Logo"
                className="w-24 h-24 rounded-2xl object-cover ring-2 ring-amber-500/50 shadow shrink-0"
              />
            ) : (
              <div className="w-24 h-24 bg-slate-900 text-amber-400 rounded-2xl flex flex-col items-center justify-center font-bold text-xs p-2 text-center shadow shrink-0">
                <Camera className="w-8 h-8 mb-1" />
                <span>គ្មាន Logo</span>
              </div>
            )}

            <div className="space-y-3 w-full">
              <div className="flex items-center space-x-2">
                <label className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Upload Logo ( File )</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {profile.logoUrl && (
                  <button
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, logoUrl: '' }))}
                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer px-2 py-1"
                  >
                    លុប Logo
                  </button>
                )}
              </div>

              {/* URL input fallback */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">
                  ឬ ដាក់តាម Link រូបភាព (Image URL)
                </span>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={logoUrlInput}
                    onChange={(e) => setLogoUrlInput(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddLogoUrl}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className={`text-[11px] p-2 rounded-lg font-medium border ${
                isAdmin 
                  ? 'bg-amber-50/70 text-amber-900 border-amber-200' 
                  : 'bg-blue-50/70 text-blue-900 border-blue-200'
              }`}>
                {isAdmin 
                  ? 'រូបភាព Logo នេះនឹងបង្ហាញលើ Header ប្រព័ន្ធ និងវិក្កយបត្រទាំងអស់របស់អ្នកប្រើប្រាស់ (System Wide)' 
                  : 'ℹ️ រូបភាព Logo នេះនឹងបង្ហាញតែនៅលើវិក្កយបត្រក្នុងគណនីរបស់អ្នកប៉ុណ្ណោះ — មិនអនុញ្ញាតឱ្យប្តូរ Logo ប្រព័ន្ធទាំងមូល (System Logo) ឡើយ'}
              </p>
            </div>
          </div>
        </div>

        {/* Bakong KHQR Code Upload */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <QrCode className="w-4 h-4 text-rose-600" />
            <span>រូបភាព Bakong KHQR Code</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {profile.khqrImageUrl ? (
              <img
                src={profile.khqrImageUrl}
                alt="Bakong KHQR"
                className="w-24 h-24 rounded-2xl object-contain border border-slate-300 p-1 bg-white shadow shrink-0"
              />
            ) : (
              <div className="w-24 h-24 bg-rose-50 border border-rose-300 rounded-2xl flex flex-col items-center justify-center text-rose-600 font-bold text-xs p-2 text-center shadow shrink-0">
                <QrCode className="w-8 h-8 mb-1" />
                <span>គ្មាន KHQR</span>
              </div>
            )}

            <div className="space-y-2 w-full">
              <label className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload KHQR Code</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleKhqrUpload}
                  className="hidden"
                />
              </label>
              {profile.khqrImageUrl && (
                <button
                  type="button"
                  onClick={() => setProfile((p) => ({ ...p, khqrImageUrl: '' }))}
                  className="block text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  លុប KHQR
                </button>
              )}
              <p className="text-[11px] text-slate-400">
                Upload រូប KHQR របស់ ABA ឬ Bakong ដើម្បីឱ្យអតិថិជន Scan ទូទាត់ប្រាក់បានលឿន
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Studio Info Fields */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
          <Building className="w-5 h-5 text-amber-500" />
          <span>ព័ត៌មានហាងថតរូប និងប្រព័ន្ធ (Studio Profile)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              ឈ្មោះហាង / Studio (ភាសាខ្មែរ)
            </label>
            <input
              type="text"
              value={profile.khmerName}
              onChange={(e) => setProfile({ ...profile, khmerName: e.target.value })}
              placeholder="ឧ. ជាងថតរូប ឡាយ មីន"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
            />
            <p className="text-[11px] text-amber-700 font-bold mt-1.5 bg-amber-50 p-2 rounded-lg border border-amber-200">
              ℹ️ ឈ្មោះភាសាខ្មែរនេះនឹងត្រូវបង្ហាញ និងដំណើរការតែនៅលើផ្ទាំង Invoice របស់គណនី User តែប៉ុណ្ណោះ (មិនប្តូរឈ្មោះប្រព័ន្ធទាំងមូលឡើយ)
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              ពាក្យស្លោក / Tagline
            </label>
            <input
              type="text"
              value={profile.tagline || ''}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              placeholder="ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រ និងសេវាកម្មថតរូបអាជីព"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              អាសយដ្ឋាន Studio
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              placeholder="រាជធានីភ្នំពេញ"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              លេខទូរស័ព្ទទំនាក់ទំនងទី១
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="012 345 678"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              លេខទូរស័ព្ទទី២ (បម្រុង)
            </label>
            <input
              type="text"
              value={profile.secondaryPhone || ''}
              onChange={(e) => setProfile({ ...profile, secondaryPhone: e.target.value })}
              placeholder="098 765 432"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Telegram Username (សម្រាប់ Share)
            </label>
            <input
              type="text"
              value={profile.telegramUsername || ''}
              onChange={(e) => setProfile({ ...profile, telegramUsername: e.target.value })}
              placeholder="laymeancamera"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Facebook Page
            </label>
            <input
              type="text"
              value={profile.facebookPage || ''}
              onChange={(e) => setProfile({ ...profile, facebookPage: e.target.value })}
              placeholder="Digital Pro Photography"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 text-blue-700">
              ចំណងជើងវិក្កយបត្រដើម (Default Invoice Header Title)
            </label>
            <input
              type="text"
              value={profile.defaultInvoiceTitle || ''}
              onChange={(e) => setProfile({ ...profile, defaultInvoiceTitle: e.target.value })}
              placeholder="ឧ. វិក្កយបត្រ / INVOICE ឬ Pro Forma Invoice ឬ បង្កាន់ដៃទទួលប្រាក់ / RECEIPT"
              className="w-full p-2.5 bg-white border border-blue-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/30"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              ចំណងជើងនេះនឹងបង្ហាញនៅលើ Header ខាងស្តាំលើនៃវិក្កយបត្រ (អ្នកអាចកែប្រែក្នុងទម្រង់ Invoice នីមួយៗបានផងដែរ)
            </p>
          </div>
        </div>
      </div>

      {/* Bank Account & Exchange Rate */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-amber-500" />
          <span>ព័ត៌មានគណនីធនាគារ និងអត្រាប្តូរប្រាក់ (Bank Details & Rate)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              ឈ្មោះធនាគារ (Bank Name)
            </label>
            <input
              type="text"
              value={profile.bankName || ''}
              onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
              placeholder="ABA Bank"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              លេខគណនី (Account Number)
            </label>
            <input
              type="text"
              value={profile.bankAccountNumber || ''}
              onChange={(e) => setProfile({ ...profile, bankAccountNumber: e.target.value })}
              placeholder="000 123 456"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-amber-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              ឈ្មោះម្ចាស់គណនី (Account Name)
            </label>
            <input
              type="text"
              value={profile.bankAccountName || ''}
              onChange={(e) => setProfile({ ...profile, bankAccountName: e.target.value })}
              placeholder="LAY MEAN"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              អត្រាប្តូរប្រាក់ ($1 = ? ៛)
            </label>
            <input
              type="number"
              value={profile.exchangeRateKHR}
              onChange={(e) => setProfile({ ...profile, exchangeRateKHR: Number(e.target.value) })}
              placeholder="4100"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold"
            />
          </div>
        </div>
      </div>

      {/* Invoice Template Selection Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              ម៉ូតវិក្កយបត្រសំខាន់ (Default Invoice Template)
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            {INVOICE_TEMPLATES.find((t) => t.id === profile.selectedTemplateId)?.nameKhmer || 'Classic Blue Pro'}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          ជ្រើសរើសម៉ូតដើម (Default Style) សម្រាប់បង្កើតវិក្កយបត្រថ្មីៗទាំងអស់ក្នុងគណនីរបស់អ្នក៖
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {INVOICE_TEMPLATES.map((tmpl) => {
            const isSelected = (profile.selectedTemplateId || 'classic_blue') === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setProfile({ ...profile, selectedTemplateId: tmpl.id })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400 font-extrabold shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  {tmpl.icon}
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">
                    {tmpl.nameKhmer.split(' (')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">
                    {tmpl.nameEnglish}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase">
          លក្ខខណ្ឌការងារលើវិក្កយបត្រ (១ បន្ទាត់ = ១ លក្ខខណ្ឌ)
        </label>
        <textarea
          rows={4}
          value={termsText}
          onChange={(e) => setTermsText(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
        />
      </div>

      {/* Cloud Backup / Restore */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center space-x-2">
          <Download className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">
            Cloud Backup & Real-time JSON Restore
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          ប្រព័ន្ធដំណើរការលើ Cloud Firestore ដោយស្វ័យប្រវត្តិ។ អ្នកក៏អាចទាញយក File Backup JSON សម្រាប់រក្សាទុក ឬ Restore ទិន្នន័យបានផងដែរ។
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ទាញយក File JSON Backup</span>
          </button>

          <label className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer border border-slate-700 transition-colors">
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Restore ទិន្នន័យទៅ Cloud ពី JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-8 py-3 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
        >
          <Save className="w-5 h-5" />
          <span>រក្សាទុកការកំណត់ទាំងអស់ទៅ Cloud</span>
        </button>
      </div>

      <InstallPwaModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />

    </form>
  );
};
