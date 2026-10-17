import { LayoutDashboard, Landmark, FileText, BarChart3, Wallet, Settings, LifeBuoy } from 'lucide-react';

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'RTGS Payments', icon: Landmark },
  { label: 'Billing', icon: FileText },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Treasury', icon: Wallet },
];

const secondary = [
  { label: 'Settings', icon: Settings },
  { label: 'Support', icon: LifeBuoy },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-sm">
          <Landmark className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">FinaPay</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Treasury Suite</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Main</p>
        {nav.map((item) => (
          <button
            key={item.label}
            className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              item.active
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </button>
        ))}

        <p className="mt-4 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">System</p>
        {secondary.map((item) => (
          <button
            key={item.label}
            className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="m-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 ring-1 ring-slate-200">
        <p className="text-xs font-semibold text-slate-700">Sample Mode</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
          Live data will sync once the FastAPI backend is connected.
        </p>
      </div>
    </aside>
  );
}
