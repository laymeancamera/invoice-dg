import React, { useState } from 'react';
import { 
  UserAccount, 
  SystemConfig 
} from '../types';
import { 
  getUsers, 
  saveSingleUser, 
  setCurrentUser, 
  getSystemConfig 
} from '../lib/storage';
import { 
  X, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Camera, 
  Lock, 
  User, 
  Phone, 
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'forgot';
  onSuccessLogin: (user: UserAccount) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'login',
  onSuccessLogin
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(defaultTab);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign In Form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form state
  const [regName, setRegName] = useState('');
  const [regStudio, setRegStudio] = useState('');
  const [regPhoneEmail, setRegPhoneEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot Password state
  const [forgotUsername, setForgotUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotResetSuccess, setForgotResetSuccess] = useState(false);

  const sysConfig: SystemConfig = getSystemConfig();

  if (!isOpen) return null;

  // Fill Admin Credentials
  const fillAdmin = () => {
    setLoginUsername('admin');
    setLoginPassword('admin');
    setErrorMsg('');
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const users = getUsers();
    const user = users.find(
      (u) => 
        u.username.toLowerCase() === loginUsername.trim().toLowerCase() ||
        u.emailPhone.toLowerCase() === loginUsername.trim().toLowerCase()
    );

    if (!user) {
      setErrorMsg('រកមិនឃើញគណនីនេះទេ! សូមពិនិត្យឈ្មោះគណនី ឬចុះឈ្មោះថ្មី។');
      return;
    }

    if (user.password !== loginPassword) {
      setErrorMsg('ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ! សូមព្យាយាមម្តងទៀត។');
      return;
    }

    if (user.status === 'inactive') {
      setErrorMsg('គណនីនេះត្រូវបានផ្អាកប្រើប្រាស់ជាបណ្តោះអាសន្ន (Inactive)! សូមទាក់ទង Admin។');
      return;
    }

    // Success
    setCurrentUser(user);
    setSuccessMsg(`ស្វាគមន៍មកវិញ, ${user.name}!`);
    setTimeout(() => {
      onSuccessLogin(user);
      onClose();
    }, 400);
  };

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!sysConfig.allowPublicRegistration) {
      setErrorMsg('ប្រព័ន្ធបិទការចុះឈ្មោះជាសាធារណៈជាបណ្តោះអាសន្ន! សូមទាក់ទង Admin។');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('ពាក្យសម្ងាត់ទាំងពីរមិនត្រូវគ្នាទេ!');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMsg('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៤ តួអក្សរ!');
      return;
    }

    const users = getUsers();
    const existing = users.find(
      (u) => u.username.toLowerCase() === regUsername.trim().toLowerCase()
    );

    if (existing) {
      setErrorMsg('ឈ្មោះគណនី (Username) នេះមានគេប្រើប្រាស់រួចហើយ!');
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      username: regUsername.trim().toLowerCase(),
      name: regName.trim(),
      emailPhone: regPhoneEmail.trim(),
      password: regPassword,
      studioName: regStudio.trim() || 'Photo Studio',
      role: 'member',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    saveSingleUser(newUser);
    setCurrentUser(newUser);

    setSuccessMsg('ការចុះឈ្មោះជោគជ័យ! កំពុងចូលទៅកាន់ប្រព័ន្ធ...');
    setTimeout(() => {
      onSuccessLogin(newUser);
      onClose();
    }, 600);
  };

  // Handle Reset Password
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const users = getUsers();
    const user = users.find(
      (u) => 
        u.username.toLowerCase() === forgotUsername.trim().toLowerCase() ||
        u.emailPhone.toLowerCase() === forgotUsername.trim().toLowerCase()
    );

    if (!user) {
      setErrorMsg('រកមិនឃើញគណនី ឬលេខទូរស័ព្ទនេះនៅក្នុងប្រព័ន្ធទេ!');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setErrorMsg('សូមបញ្ចូលពាក្យសម្ងាត់ថ្មីយ៉ាងហោចណាស់ ៤ តួអក្សរ!');
      return;
    }

    const updatedUser = { ...user, password: newPassword };
    saveSingleUser(updatedUser);
    setForgotResetSuccess(true);
    setSuccessMsg('បានផ្លាស់ប្តូរពាក្យសម្ងាត់ជោគជ័យ! អ្នកអាចចូលប្រើប្រាស់ឥឡូវនេះបាន។');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative transition-all">
        
        {/* Header / Banner */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center space-x-1.5">
                <span>វិក្កយបត្រ Digital Pro</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400">
                ប្រព័ន្ធគ្រប់គ្រងវិក្កយបត្រជាងថតរូប
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-extrabold'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>ចូលប្រើប្រាស់ (Sign In)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-extrabold'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>ចុះឈ្មោះ (Sign Up)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">

          {/* Alert Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-medium flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ឈ្មោះគណនី ឬ លេខទូរស័ព្ទ
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="ឧទាហរណ៍: admin ឬ 012345678"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    ពាក្យសម្ងាត់ (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    ភ្លេចពាក្យសម្ងាត់?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2"
              >
                <span>ចូលប្រព័ន្ធ (Sign In)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: SIGN UP / REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ឈ្មោះពេញ (Full Name)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="ឧទាហរណ៍: ចាន់ សុខារ៉ា"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ឈ្មោះ Studio / ហាងថតរូប
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={regStudio}
                    onChange={(e) => setRegStudio(e.target.value)}
                    placeholder="ឧទាហរណ៍: Sokhara Wedding Studio"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  លេខទូរស័ព្ទ ឬ អ៊ីមែល
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={regPhoneEmail}
                    onChange={(e) => setRegPhoneEmail(e.target.value)}
                    placeholder="012 345 678"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ឈ្មោះគណនី (Username)
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="sokhara_photo"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    ពាក្យសម្ងាត់
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    បញ្ជាក់ពាក្យសម្ងាត់
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2 mt-3"
              >
                <UserPlus className="w-4 h-4" />
                <span>ចុះឈ្មោះគណនីថ្មី (Register Member)</span>
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-xs flex items-start space-x-2">
                <KeyRound className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  បញ្ចូលឈ្មោះគណនី (Username) ឬ លេខទូរស័ព្ទរបស់អ្នក ដើម្បីកំណត់ពាក្យសម្ងាត់ថ្មី។
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ឈ្មោះគណនី ឬ លេខទូរស័ព្ទ
                </label>
                <input
                  type="text"
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  placeholder="ឧទាហរណ៍: admin ឬ 012345678"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ពាក្យសម្ងាត់ថ្មី (New Password)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  ត្រឡប់ក្រោយ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  រក្សាទុកពាក្យសម្ងាត់ថ្មី
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
