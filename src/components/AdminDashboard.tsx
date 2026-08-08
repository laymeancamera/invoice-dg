import React, { useState, useEffect } from 'react';
import { 
  UserAccount, 
  UserRole, 
  UserStatus, 
  SystemConfig,
  StudioProfile
} from '../types';
import { 
  getUsers, 
  saveUsers, 
  saveSingleUser, 
  deleteUser, 
  getSystemConfig, 
  saveSystemConfig, 
  getInvoices,
  STORAGE_EVENT 
} from '../lib/storage';
import { compressImageToDataUrl } from '../lib/imageUtils';
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  UserX, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  FileText, 
  Building, 
  Phone, 
  Lock, 
  User, 
  X, 
  Save, 
  ToggleLeft, 
  ToggleRight,
  Shield,
  Activity,
  UserPlus,
  Camera,
  Upload,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserAccount | null;
  studio?: StudioProfile;
  onSaveStudio?: (profile: StudioProfile) => void;
}

export function AdminDashboard({ currentUser, studio, onSaveStudio }: AdminDashboardProps) {
  const [users, setUsers] = useState<UserAccount[]>(getUsers());
  const [sysConfig, setSysConfig] = useState<SystemConfig>(getSystemConfig());
  const invoices = getInvoices();

  // Local System & Studio Config state
  const [systemTitle, setSystemTitle] = useState(sysConfig.systemTitle || 'វិក្កយបត្រ Digital Pro');
  const [studioKhmerName, setStudioKhmerName] = useState(studio?.khmerName || 'ជាងថតរូប ឡាយ មីន');
  const [studioEngName, setStudioEngName] = useState(studio?.name || 'Digital Pro Studio');
  const [systemLogo, setSystemLogo] = useState(studio?.logoUrl || '');
  const [logoUrlInput, setLogoUrlInput] = useState('');

  useEffect(() => {
    if (studio) {
      setStudioKhmerName(studio.khmerName || '');
      setStudioEngName(studio.name || '');
      setSystemLogo(studio.logoUrl || '');
    }
  }, [studio]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'admin'>('all');

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formStudio, setFormStudio] = useState('');
  const [formPhoneEmail, setFormPhoneEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('member');
  const [formStatus, setFormStatus] = useState<UserStatus>('active');

  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Refresh users list from storage
  const refreshUsersList = () => {
    setUsers(getUsers());
    setSysConfig(getSystemConfig());
  };

  useEffect(() => {
    refreshUsersList();
    window.addEventListener(STORAGE_EVENT, refreshUsersList);
    return () => window.removeEventListener(STORAGE_EVENT, refreshUsersList);
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotificationMsg({ type, text });
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // Toggle User Active / Inactive Status
  const handleToggleStatus = (user: UserAccount) => {
    // Prevent deactivating oneself if logged in
    if (user.id === currentUser?.id) {
      showNotification('error', 'អ្នកមិនអាចផ្អាកគណនី Admin ដែលកំពុងប្រើប្រាស់បានទេ!');
      return;
    }

    const nextStatus: UserStatus = user.status === 'active' ? 'inactive' : 'active';
    const updated = { ...user, status: nextStatus };
    saveSingleUser(updated);
    refreshUsersList();
    showNotification('success', `បានផ្លាស់ប្តូរស្ថានភាពគណនី ${user.name} ទៅជា ${nextStatus === 'active' ? 'កំពុងប្រើប្រាស់ (Active)' : 'ផ្អាកប្រើប្រាស់ (Inactive)'}`);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormName('');
    setFormUsername('');
    setFormStudio('');
    setFormPhoneEmail('');
    setFormPassword('');
    setFormRole('member');
    setFormStatus('active');
    setIsUserModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormUsername(user.username);
    setFormStudio(user.studioName || '');
    setFormPhoneEmail(user.emailPhone);
    setFormPassword(user.password);
    setFormRole(user.role);
    setFormStatus(user.status);
    setIsUserModalOpen(true);
  };

  // Save User (Create or Update)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formUsername.trim()) {
      showNotification('error', 'សូមបញ្ចូលឈ្មោះគណនី (Username)!');
      return;
    }

    // Check duplicate username if create or changing username
    if (!editingUser || editingUser.username.toLowerCase() !== formUsername.trim().toLowerCase()) {
      const existing = users.find((u) => u.username.toLowerCase() === formUsername.trim().toLowerCase());
      if (existing) {
        showNotification('error', 'ឈ្មោះគណនី (Username) នេះមានរួចហើយ!');
        return;
      }
    }

    const newUser: UserAccount = {
      id: editingUser ? editingUser.id : `usr-${Date.now()}`,
      username: formUsername.trim().toLowerCase(),
      name: formName.trim(),
      emailPhone: formPhoneEmail.trim(),
      password: formPassword || '123456',
      studioName: formStudio.trim() || 'Photo Studio',
      role: formRole,
      status: formStatus,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString(),
      lastLoginAt: editingUser?.lastLoginAt
    };

    saveSingleUser(newUser);
    refreshUsersList();
    setIsUserModalOpen(false);
    showNotification('success', editingUser ? 'បានកែប្រែគណនីជោគជ័យ!' : 'បានបង្កើតគណនីថ្មីជោគជ័យ!');
  };

  // Delete User Trigger (Opens custom confirm modal)
  const handleDeleteUser = (user: UserAccount) => {
    if (user.id === currentUser?.id) {
      showNotification('error', 'អ្នកមិនអាចលុបគណនី Admin ដែលកំពុងប្រើប្រាស់បានទេ!');
      return;
    }
    setUserToDelete(user);
  };

  // Confirm Delete User Action
  const confirmDeleteUser = () => {
    if (!userToDelete) return;

    if (userToDelete.id === currentUser?.id) {
      showNotification('error', 'អ្នកមិនអាចលុបគណនី Admin ដែលកំពុងប្រើប្រាស់បានទេ!');
      setUserToDelete(null);
      return;
    }

    deleteUser(userToDelete.id);
    refreshUsersList();
    showNotification('success', `បានលុបគណនី "${userToDelete.name}" (${userToDelete.username}) ចេញពី Cloud Firestore រួចរាល់!`);
    setUserToDelete(null);
    if (isUserModalOpen && editingUser?.id === userToDelete.id) {
      setIsUserModalOpen(false);
      setEditingUser(null);
    }
  };

  // Reset User Password directly
  const handleResetPassword = (user: UserAccount) => {
    const newPass = window.prompt(`បញ្ចូលពាក្យសម្ងាត់ថ្មីសម្រាប់គណនី "${user.name}":`, '123456');
    if (newPass) {
      const updated = { ...user, password: newPass };
      saveSingleUser(updated);
      refreshUsersList();
      showNotification('success', `បានកំណត់ពាក្យសម្ងាត់ថ្មីជា "${newPass}" ជោគជ័យ!`);
    }
  };

  // Admin Upload System Logo (compressed data URL)
  const handleLogoUploadAdmin = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImageToDataUrl(file, 500, 500, 0.85);
      setSystemLogo(compressed);
      showNotification('success', 'បានបញ្ចូល និងបង្រួមរូបភាព Logo លើ Cloud!');
    } catch (err) {
      console.error('Failed to compress logo image:', err);
      showNotification('error', 'មានបញ្ហាក្នុងការ Upload រូបភាព Logo!');
    }
  };

  // Admin Add Logo via Link URL
  const handleAddLogoUrlAdmin = () => {
    if (!logoUrlInput.trim()) return;
    setSystemLogo(logoUrlInput.trim());
    setLogoUrlInput('');
    showNotification('success', 'បានប្តូរ Logo តាម Link URL!');
  };

  // Save System & Studio Settings to Cloud Firestore
  const handleSaveSystemAndStudio = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Update System Config
    const updatedSysConfig: SystemConfig = {
      ...sysConfig,
      systemTitle: systemTitle.trim() || 'វិក្កយបត្រ Digital Pro'
    };
    setSysConfig(updatedSysConfig);
    saveSystemConfig(updatedSysConfig);

    // 2. Update Studio Profile
    if (studio && onSaveStudio) {
      const updatedStudio: StudioProfile = {
        ...studio,
        khmerName: studioKhmerName.trim() || studio.khmerName,
        name: studioEngName.trim() || studio.name,
        logoUrl: systemLogo
      };
      onSaveStudio(updatedStudio);
    }

    showNotification('success', 'បានរក្សាទុកឈ្មោះប្រព័ន្ធ និង Logo ទៅកាន់ Cloud Firestore រួចរាល់!');
  };

  // Toggle Public Registration Setting
  const handleToggleRegistration = () => {
    const updated = { ...sysConfig, allowPublicRegistration: !sysConfig.allowPublicRegistration };
    setSysConfig(updated);
    saveSystemConfig(updated);
    showNotification('success', `បាន ${updated.allowPublicRegistration ? 'បើក' : 'បិទ'} ការចុះឈ្មោះជាសាធារណៈ`);
  };

  // Toggle Maintenance Mode Setting
  const handleToggleMaintenance = () => {
    const updated = { ...sysConfig, maintenanceMode: !sysConfig.maintenanceMode };
    setSysConfig(updated);
    saveSystemConfig(updated);
    showNotification('success', `បាន ${updated.maintenanceMode ? 'បើក' : 'បិទ'} របៀបថែទាំប្រព័ន្ធ (Maintenance)`);
  };

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      u.name.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      (u.studioName && u.studioName.toLowerCase().includes(query)) ||
      u.emailPhone.toLowerCase().includes(query);

    if (!matchesQuery) return false;

    if (statusFilter === 'active') return u.status === 'active';
    if (statusFilter === 'inactive') return u.status === 'inactive';
    if (statusFilter === 'admin') return u.role === 'admin';

    return true;
  });

  const activeCount = users.filter((u) => u.status === 'active').length;
  const inactiveCount = users.filter((u) => u.status === 'inactive').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Top Banner / Notification */}
      {notificationMsg && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-bold shadow-sm ${
          notificationMsg.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
            : 'bg-rose-50 border-rose-300 text-rose-800'
        }`}>
          <div className="flex items-center space-x-2">
            {notificationMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <span>{notificationMsg.text}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Admin Console • ប្រព័ន្ធគ្រប់គ្រងថ្នាក់ខ្ពស់</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ និងសមាជិក (Admin Management)
          </h1>
          <p className="text-xs text-slate-400">
            គ្រប់គ្រងគណនីសមាជិក ស្ថានភាព Active/Inactive និងការកំណត់ប្រព័ន្ធទាំងមូល
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>បន្ថែមសមាជិកថ្មី</span>
        </button>
      </div>

      {/* METRICS STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Card 1: Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">អ្នកប្រើប្រាស់សរុប</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{users.length}</div>
          <p className="text-[11px] text-slate-400">សមាជិកក្នុងប្រព័ន្ធ</p>
        </div>

        {/* Card 2: Active Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-emerald-700">កំពុងប្រើប្រាស់</span>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{activeCount}</div>
          <p className="text-[11px] text-emerald-700 font-medium">ស្ថានភាព Active</p>
        </div>

        {/* Card 3: Inactive Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-amber-700">ផ្អាកប្រើប្រាស់</span>
            <UserX className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{inactiveCount}</div>
          <p className="text-[11px] text-amber-700 font-medium">ស្ថានភាព Inactive</p>
        </div>

        {/* Card 4: Admins */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">អ្នកគ្រប់គ្រង (Admin)</span>
            <Shield className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{adminCount}</div>
          <p className="text-[11px] text-slate-400">សិទ្ធិ Admin</p>
        </div>

        {/* Card 5: Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">វិក្កយបត្រសរុប</span>
            <FileText className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{invoices.length}</div>
          <p className="text-[11px] text-slate-400">បង្កើតលើប្រព័ន្ធ</p>
        </div>

      </div>

      {/* USER MANAGEMENT TABLE SECTION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Table Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              បញ្ជីសមាជិក និងអ្នកប្រើប្រាស់ (User Accounts List)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ស្វែងរកតាម ឈ្មោះ, Username, Studio..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/30 outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-bold text-slate-600">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'hover:bg-slate-200'
                }`}
              >
                ទាំងអស់ ({users.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'active' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-slate-200'
                }`}
              >
                កំពុងប្រើ ({activeCount})
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'inactive' ? 'bg-amber-600 text-white shadow-sm' : 'hover:bg-slate-200'
                }`}
              >
                ផ្អាក ({inactiveCount})
              </button>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                <th className="p-3">ឈ្មោះ និង Username</th>
                <th className="p-3">ឈ្មោះ Studio</th>
                <th className="p-3">លេខទូរស័ព្ទ / អ៊ីមែល</th>
                <th className="p-3 text-center">សិទ្ធិ (Role)</th>
                <th className="p-3 text-center">ស្ថានភាព (Status)</th>
                <th className="p-3 text-right">សកម្មភាព (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    មិនមានទិន្នន័យសមាជិកដែលត្រូវគ្នាឡើយ។
                  </td>
                </tr>
              ) : (
                filteredUsers.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Name & Username */}
                    <td className="p-3">
                      <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                        <span>{usr.name}</span>
                        {usr.role === 'admin' && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 font-mono">@{usr.username}</span>
                    </td>

                    {/* Studio Name */}
                    <td className="p-3 text-slate-700 font-medium">
                      {usr.studioName || '-'}
                    </td>

                    {/* Phone/Email */}
                    <td className="p-3 text-slate-700 font-medium">
                      {usr.emailPhone}
                    </td>

                    {/* Role */}
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        usr.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {usr.role}
                      </span>
                    </td>

                    {/* Status Toggle Badge */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(usr)}
                        title="ចុចដើម្បីប្តូរស្ថានភាព Active / Inactive"
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full font-bold text-[10px] cursor-pointer transition-all ${
                          usr.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {usr.status === 'active' ? (
                          <>
                            <UserCheck className="w-3 h-3 text-emerald-600" />
                            <span>កំពុងប្រើ (Active)</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3 text-amber-600" />
                            <span>ផ្អាកប្រើ (Inactive)</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {/* Reset Password */}
                        <button
                          onClick={() => handleResetPassword(usr)}
                          title="កំណត់ពាក្យសម្ងាត់ថ្មី"
                          className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit User */}
                        <button
                          onClick={() => handleOpenEdit(usr)}
                          title="កែប្រែព័ត៌មាន"
                          className="p-1.5 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(usr)}
                          title="លុបគណនី"
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* SYSTEM CONFIGURATION PANEL */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              ការកំណត់ប្រព័ន្ធទូទៅ និង Logo (System Configurations & Branding)
            </h2>
          </div>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Cloud Sync Enabled
          </span>
        </div>

        {/* System Title & Logo Form */}
        <form onSubmit={handleSaveSystemAndStudio} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
            <Camera className="w-4 h-4 text-blue-600" />
            <span>កែប្រែ Logo និងឈ្មោះប្រព័ន្ធបង្ហាញលើ Cloud (System Branding)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* System / Studio Logo Box */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="relative group">
                {systemLogo ? (
                  <img
                    src={systemLogo}
                    alt="System Logo"
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-md">
                    <Camera className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 w-full">
                <label className="inline-flex items-center justify-center space-x-1.5 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>ជ្រើសរើស Logo ថ្មី</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUploadAdmin}
                    className="hidden"
                  />
                </label>

                {systemLogo && (
                  <button
                    type="button"
                    onClick={() => {
                      setSystemLogo('');
                      showNotification('success', 'បានលុប Logo ចេញពីប្រព័ន្ធ!');
                    }}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    លុប Logo នេះចេញ
                  </button>
                )}
              </div>
            </div>

            {/* Inputs: System Names */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    ឈ្មោះប្រព័ន្ធ / ហាង (ភាសាខ្មែរ)
                  </label>
                  <input
                    type="text"
                    value={studioKhmerName}
                    onChange={(e) => setStudioKhmerName(e.target.value)}
                    placeholder="ឧ. ជាងថតរូប ឡាយ មីន"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    ឈ្មោះប្រព័ន្ធ / ហាង (ភាសាអង់គ្លេស)
                  </label>
                  <input
                    type="text"
                    value={studioEngName}
                    onChange={(e) => setStudioEngName(e.target.value)}
                    placeholder="ឧ. Lay Mean Photography"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              {/* Logo Link URL input option */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ឬបញ្ចូល Logo តាមរយះ Image URL (Link)
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={logoUrlInput}
                      onChange={(e) => setLogoUrlInput(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLogoUrlAdmin}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    ប្រើ Link នេះ
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>រក្សាទុក Logo និងឈ្មោះប្រព័ន្ធទៅ Cloud</span>
                </button>
              </div>

            </div>

          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Config 1: Allow Public Registration */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-1 max-w-xs">
              <h3 className="text-xs font-bold text-slate-900">
                ការចុះឈ្មោះជាសាធារណៈ (Public Registration)
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                អនុញ្ញាតឱ្យសមាជិកថ្មីចុះឈ្មោះដោយខ្លួនឯងតាមរយៈផ្ទាំង Sign Up
              </p>
            </div>

            <button
              onClick={handleToggleRegistration}
              className={`p-2 rounded-xl flex items-center space-x-2 font-bold text-xs cursor-pointer transition-colors ${
                sysConfig.allowPublicRegistration
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {sysConfig.allowPublicRegistration ? (
                <>
                  <ToggleRight className="w-5 h-5" />
                  <span>បើក (Enabled)</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  <span>បិទ (Disabled)</span>
                </>
              )}
            </button>
          </div>

          {/* Config 2: Maintenance Mode */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-1 max-w-xs">
              <h3 className="text-xs font-bold text-slate-900">
                របៀបថែទាំប្រព័ន្ធ (Maintenance Mode)
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                បង្ហាញសារជូនដំណឹងការថែទាំប្រព័ន្ធជាបណ្តោះអាសន្ន
              </p>
            </div>

            <button
              onClick={handleToggleMaintenance}
              className={`p-2 rounded-xl flex items-center space-x-2 font-bold text-xs cursor-pointer transition-colors ${
                sysConfig.maintenanceMode
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {sysConfig.maintenanceMode ? (
                <>
                  <ToggleRight className="w-5 h-5" />
                  <span>កំពុងថែទាំ</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  <span>ធម្មតា</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* CREATE / EDIT USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                <span>{editingUser ? 'កែប្រែព័ត៌មានគណនី' : 'បន្ថែមសមាជិកថ្មី'}</span>
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ឈ្មោះពេញ (Full Name)
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ឧទាហរណ៍: លី ម៉េង"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    ឈ្មោះគណនី (Username)
                  </label>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="laymean"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    ពាក្យសម្ងាត់ (Password)
                  </label>
                  <input
                    type="text"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="123456"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ឈ្មោះ Studio
                </label>
                <input
                  type="text"
                  value={formStudio}
                  onChange={(e) => setFormStudio(e.target.value)}
                  placeholder="Laymean Wedding Photography"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  លេខទូរស័ព្ទ / អ៊ីមែល
                </label>
                <input
                  type="text"
                  value={formPhoneEmail}
                  onChange={(e) => setFormPhoneEmail(e.target.value)}
                  placeholder="012 345 678"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    សិទ្ធិ (Role)
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                  >
                    <option value="member">Member (សមាជិក)</option>
                    <option value="admin">Admin (អ្នកគ្រប់គ្រង)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    ស្ថានភាព (Status)
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as UserStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                  >
                    <option value="active">Active (កំពុងប្រើ)</option>
                    <option value="inactive">Inactive (ផ្អាកប្រើ)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {editingUser && editingUser.id !== currentUser?.id ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(editingUser)}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>លុបគណនីនេះ</span>
                  </button>
                ) : <div />}

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>រក្សាទុក</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            
            <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-white" />
                <span>បញ្ជាក់ការលុបគណនីសមាជិក</span>
              </h3>
              <button
                onClick={() => setUserToDelete(null)}
                className="p-1 text-rose-200 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <p className="text-xs font-bold text-rose-900">
                  តើអ្នកពិតជាចង់លុបគណនីនេះចេញពី Cloud ដែរឬទេ?
                </p>
                <div className="text-xs text-slate-700 space-y-1 bg-white p-3 rounded-lg border border-rose-100 font-mono">
                  <div><strong>ឈ្មោះ:</strong> {userToDelete.name}</div>
                  <div><strong>Username:</strong> @{userToDelete.username}</div>
                  <div><strong>Studio:</strong> {userToDelete.studioName || '-'}</div>
                  <div><strong>លេខទូរស័ព្ទ:</strong> {userToDelete.emailPhone}</div>
                </div>
                <p className="text-[11px] text-rose-700 italic">
                  * ការលុបនេះនឹងលុបទិន្នន័យគណនីចេញពី Cloud Firestore ជារៀងរហូត ហើយមិនអាចស្តារឡើងវិញបានឡើយ!
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteUser}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>លុបគណនីចេញពី Cloud</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
