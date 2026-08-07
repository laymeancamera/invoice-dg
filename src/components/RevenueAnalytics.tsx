import React, { useMemo } from 'react';
import { Invoice, StudioProfile } from '../types';
import { TrendingUp, DollarSign, CheckCircle2, Clock, Calendar, BarChart3, PieChart } from 'lucide-react';

interface RevenueAnalyticsProps {
  invoices: Invoice[];
  studio: StudioProfile;
}

export const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ invoices, studio }) => {
  const metrics = useMemo(() => {
    const totalSales = invoices.reduce((acc, i) => acc + i.total, 0);
    const totalPaid = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
    const totalPending = invoices.reduce((acc, i) => acc + i.balanceDue, 0);

    // Group by category
    const categoryStats = {
      pre_wedding: 0,
      wedding_day: 0,
      combo: 0,
      custom: 0,
    };

    invoices.forEach((i) => {
      categoryStats[i.packageCategory] = (categoryStats[i.packageCategory] || 0) + i.total;
    });

    // Group by issue month (YYYY-MM)
    const monthlyMap = new Map<string, { total: number; paid: number; pending: number; count: number }>();

    invoices.forEach((i) => {
      const monthKey = i.issueDate ? i.issueDate.substring(0, 7) : 'Unknown';
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { total: 0, paid: 0, pending: 0, count: 0 });
      }
      const m = monthlyMap.get(monthKey)!;
      m.total += i.total;
      m.paid += i.paidAmount;
      m.pending += i.balanceDue;
      m.count += 1;
    });

    const monthlyList = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => b.month.localeCompare(a.month));

    return { totalSales, totalPaid, totalPending, categoryStats, monthlyList };
  }, [invoices]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-amber-500" />
          <span>ប្រព័ន្ធបូកបញ្ចូលចំណូលស្វ័យប្រវត្តិ (Automated Revenue Analytics)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          របាយការណ៍ហិរញ្ញវត្ថុ ប្រាក់ទទួលបាន ប្រាក់នៅសល់ និងការវិភាគចំណូលតាមខែរបស់ Studio
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            ចំណូលសរុប (Total Revenue)
          </span>
          <span className="text-3xl font-black text-amber-400 block">
            ${metrics.totalSales.toLocaleString()}
          </span>
          <p className="text-xs text-slate-300">
            ≈ {(metrics.totalSales * studio.exchangeRateKHR).toLocaleString('km-KH')} ៛
          </p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              ប្រាក់ប្រមូលបានសរុប (Collected)
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-emerald-700 block">
            ${metrics.totalPaid.toLocaleString()}
          </span>
          <p className="text-xs text-emerald-600">
            ≈ {(metrics.totalPaid * studio.exchangeRateKHR).toLocaleString('km-KH')} ៛
          </p>
        </div>

        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              ប្រាក់នៅខ្វះត្រូវទូទាត់ (Pending)
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-amber-700 block">
            ${metrics.totalPending.toLocaleString()}
          </span>
          <p className="text-xs text-amber-600">
            ≈ {(metrics.totalPending * studio.exchangeRateKHR).toLocaleString('km-KH')} ៛
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
          <PieChart className="w-5 h-5 text-amber-500" />
          <span>ចំណូលតាមប្រភេទកញ្ចប់សេវាកម្ម</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase">Pre-wedding</p>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              ${(metrics.categoryStats.pre_wedding || 0).toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase">ថ្ងៃមង្គលការ</p>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              ${(metrics.categoryStats.wedding_day || 0).toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase">កញ្ចប់ Combo ពេញលេញ</p>
            <p className="text-xl font-extrabold text-amber-600 mt-1">
              ${(metrics.categoryStats.combo || 0).toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase">ផ្សេងៗ / Custom</p>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              ${(metrics.categoryStats.custom || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Breakdown Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          <span>ចំណូលប្រចាំខែ (Monthly Revenue Breakdown)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                <th className="p-3">ខែ / ឆ្នាំ</th>
                <th className="p-3 text-center">ចំនួនវិក្កយបត្រ</th>
                <th className="p-3 text-right">ចំណូលសរុប ($)</th>
                <th className="p-3 text-right">ប្រមូលបាន ($)</th>
                <th className="p-3 text-right">នៅខ្វះ ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.monthlyList.map((m) => (
                <tr key={m.month} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{m.month}</td>
                  <td className="p-3 text-center font-semibold text-slate-600">{m.count}</td>
                  <td className="p-3 text-right font-bold text-slate-900">${m.total.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-emerald-600">${m.paid.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-amber-600">${m.pending.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
