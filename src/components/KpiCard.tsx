import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  tone: 'outstanding' | 'normal' | 'overdue' | 'due' | 'rtgs' | 'billing';
  trend?: string;
}

const toneStyles: Record<KpiCardProps['tone'], { ring: string; iconBg: string; value: string; accent: string }> = {
  outstanding: { ring: 'ring-rose-200', iconBg: 'bg-rose-50 text-rose-600', value: 'text-rose-700', accent: 'from-rose-500 to-rose-600' },
  normal: { ring: 'ring-emerald-200', iconBg: 'bg-emerald-50 text-emerald-600', value: 'text-emerald-700', accent: 'from-emerald-500 to-emerald-600' },
  overdue: { ring: 'ring-amber-200', iconBg: 'bg-amber-50 text-amber-600', value: 'text-amber-700', accent: 'from-amber-500 to-amber-600' },
  due: { ring: 'ring-sky-200', iconBg: 'bg-sky-50 text-sky-600', value: 'text-sky-700', accent: 'from-sky-500 to-sky-600' },
  rtgs: { ring: 'ring-indigo-200', iconBg: 'bg-indigo-50 text-indigo-600', value: 'text-indigo-700', accent: 'from-indigo-500 to-indigo-600' },
  billing: { ring: 'ring-teal-200', iconBg: 'bg-teal-50 text-teal-600', value: 'text-teal-700', accent: 'from-teal-500 to-teal-600' },
};

export default function KpiCard({ label, value, sub, icon, tone, trend }: KpiCardProps) {
  const s = toneStyles[tone];
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ${s.ring} transition hover:shadow-md`}>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.accent}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <p className={`mt-2 text-2xl font-bold tabular-nums ${s.value}`}>{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg}`}>{icon}</div>
      </div>
      {trend && (
        <p className="mt-3 text-xs font-medium text-slate-500">{trend}</p>
      )}
    </div>
  );
}
