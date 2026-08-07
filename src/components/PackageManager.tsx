import React, { useState } from 'react';
import { PackageItem, PackageCategory } from '../types';
import { Package, Plus, Trash2, Edit3, Save, X, Check, DollarSign, Sparkles } from 'lucide-react';

interface PackageManagerProps {
  packages: PackageItem[];
  onSavePackage: (pkg: PackageItem) => void;
  onDeletePackage: (id: string) => void;
}

export const PackageManager: React.FC<PackageManagerProps> = ({
  packages,
  onSavePackage,
  onDeletePackage,
}) => {
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [nameKhmer, setNameKhmer] = useState('');
  const [nameEnglish, setNameEnglish] = useState('');
  const [category, setCategory] = useState<PackageCategory>('pre_wedding');
  const [price, setPrice] = useState<number>(500);
  const [description, setDescription] = useState('');
  const [includedItemsText, setIncludedItemsText] = useState('');
  const [recommendedCount, setRecommendedCount] = useState('');

  const handleOpenCreate = () => {
    setEditingPackage(null);
    setNameKhmer('');
    setNameEnglish('');
    setCategory('pre_wedding');
    setPrice(500);
    setDescription('');
    setIncludedItemsText('');
    setRecommendedCount('');
    setIsCreating(true);
  };

  const handleOpenEdit = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setNameKhmer(pkg.nameKhmer);
    setNameEnglish(pkg.nameEnglish);
    setCategory(pkg.category);
    setPrice(pkg.price);
    setDescription(pkg.description);
    setIncludedItemsText(pkg.includedItems ? pkg.includedItems.join('\n') : '');
    setRecommendedCount(pkg.recommendedCount || '');
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameKhmer.trim()) {
      alert('សូមបញ្ចូលឈ្មោះកញ្ចប់ (ជាភាសាខ្មែរ)!');
      return;
    }

    const itemsList = includedItemsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const savedPkg: PackageItem = {
      id: editingPackage ? editingPackage.id : `pkg-${Date.now()}`,
      nameKhmer: nameKhmer.trim(),
      nameEnglish: nameEnglish.trim() || nameKhmer.trim(),
      category,
      price: Number(price) || 0,
      description: description.trim(),
      includedItems: itemsList,
      recommendedCount: recommendedCount.trim()
    };

    onSavePackage(savedPkg);
    setIsCreating(false);
    setEditingPackage(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <Package className="w-6 h-6 text-blue-600" />
            <span>គ្រប់គ្រងកញ្ចប់តម្លៃ និងសេវាកម្ម (Package Templates)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            កំណត់ និងកែប្រែកញ្ចប់ថត Pre-wedding និង ថ្ងៃមង្គលការ សម្រាប់ប្រើប្រាស់ជា Quick Option ក្នុងវិក្កយបត្រ
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm text-xs sm:text-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>បង្កើតកញ្ចប់ថ្មី</span>
        </button>
      </div>

      {/* Package Creation/Editing Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8">
            
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-base font-bold flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{editingPackage ? 'កែប្រែកញ្ចប់សេវាកម្ម' : 'បង្កើតកញ្ចប់សេវាកម្មថ្មី'}</span>
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    ឈ្មោះកញ្ចប់ (ភាសាខ្មែរ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameKhmer}
                    onChange={(e) => setNameKhmer(e.target.value)}
                    placeholder="ឧ. កញ្ចប់ Pre-wedding VIP"
                    required
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    ប្រភេទកញ្ចប់ (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PackageCategory)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="pre_wedding">កញ្ចប់ថត Pre-wedding</option>
                    <option value="wedding_day">កញ្ចប់ថត ថ្ងៃមង្គលការ</option>
                    <option value="combo">កញ្ចប់ Combo (Pre-wedding + ថ្ងៃការ)</option>
                    <option value="custom">សេវាកម្មផ្សេងៗ (Custom)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    តម្លៃកំណត់ ($ USD) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-extrabold text-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    ការសង្ខេបរហ័ស (Quick Summary)
                  </label>
                  <input
                    type="text"
                    value={recommendedCount}
                    onChange={(e) => setRecommendedCount(e.target.value)}
                    placeholder="ឧ. អាវ ៣ឈុត, អាល់ប៊ុម ១, ប៉ាណូ ២"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ការពណ៌នាពីកញ្ចប់ (Description)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ការពណ៌នាសង្ខេបពីកញ្ចប់"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  បញ្ជីសេវាកម្មរាយដែលរាប់បញ្ចូល (១ បន្ទាត់ = ១ មុខ)
                </label>
                <textarea
                  rows={5}
                  value={includedItemsText}
                  onChange={(e) => setIncludedItemsText(e.target.value)}
                  placeholder="ថតរូប Pre-wedding ពេញ ១ថ្ងៃ&#10;សម្លៀកបំពាក់ ៣ឈុត&#10;មេកអាប់ ៣ឈុត&#10;អាល់ប៊ុម VIP 30x40cm"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  រក្សាទុកកញ្ចប់
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Package Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {pkg.category === 'pre_wedding'
                    ? 'Pre-wedding'
                    : pkg.category === 'wedding_day'
                    ? 'ថ្ងៃមង្គលការ'
                    : 'Combo'}
                </span>
                <span className="text-xl font-black text-amber-600">
                  ${pkg.price.toLocaleString()}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mt-2">
                {pkg.nameKhmer}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {pkg.description}
              </p>

              {pkg.includedItems && pkg.includedItems.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-slate-700 border-t border-slate-100 pt-3">
                  {pkg.includedItems.map((item, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => handleOpenEdit(pkg)}
                className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`តើអ្នកប្រាកដជាចង់លុបកញ្ចប់ "${pkg.nameKhmer}" នេះឬ?`)) {
                    onDeletePackage(pkg.id);
                  }
                }}
                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
