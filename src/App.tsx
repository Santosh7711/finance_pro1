import { useMemo, useState } from 'react';
import { AlertTriangle, CalendarClock, CheckCircle2, IndianRupee, Landmark, Receipt, RefreshCw, TrendingUp } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import KpiCard from '@/components/KpiCard';
import DonutChart from '@/components/DonutChart';
import BarChart from '@/components/BarChart';
import PaymentsTable from '@/components/PaymentsTable';
import { computeKpis, generatePayments, formatCurrency, formatNumber } from '@/data';

export default function App() {
  const [payments, setPayments] = useState(() => generatePayments());
  const kpis = useMemo(() => computeKpis(payments), [payments]);

  const outstandingByType = [
    { label: 'RTGS Outstanding', value: kpis.rtgsOutstanding, color: '#e11d48' },
    { label: 'Billing Outstanding', value: kpis.billingOutstanding, color: '#0d9488' },
  ];

  const barData = [
    { label: 'RTGS', outstanding: kpis.rtgsOutstanding, normal: kpis.rtgsNormal },
    { label: 'Billing', outstanding: kpis.billingOutstanding, normal: kpis.billingNormal },
  ];

  function regenerate() {
    setPayments(generatePayments());
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Payments Dashboard</h1>
              <p className="text-sm text-slate-500">RTGS &amp; Billing — outstanding and normal settlements</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 sm:flex">
                <CalendarClock className="h-3.5 w-3.5" />
                As of 17 Oct 2026
              </span>
              <button
                onClick={regenerate}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-6 px-6 py-6">
          {/* KPI cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Outstanding Total"
              value={formatCurrency(kpis.totalOutstanding)}
              sub={`${formatNumber(kpis.outstandingCount)} payments pending`}
              icon={<AlertTriangle className="h-5 w-5" />}
              tone="outstanding"
              trend={`${formatCurrency(kpis.overdueAmount)} already overdue`}
            />
            <KpiCard
              label="Normal (Settled)"
              value={formatCurrency(kpis.totalNormal)}
              sub={`${formatNumber(kpis.normalCount)} payments settled`}
              icon={<CheckCircle2 className="h-5 w-5" />}
              tone="normal"
              trend="On-schedule clearance"
            />
            <KpiCard
              label="Due This Week"
              value={formatCurrency(kpis.dueThisWeek)}
              sub="Next 7 days"
              icon={<CalendarClock className="h-5 w-5" />}
              tone="due"
            />
            <KpiCard
              label="RTGS Throughput"
              value={formatCurrency(kpis.rtgsNormal + kpis.rtgsOutstanding)}
              sub="RTGS channel volume"
              icon={<TrendingUp className="h-5 w-5" />}
              tone="rtgs"
            />
          </section>

          {/* Secondary KPIs */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="RTGS Outstanding"
              value={formatCurrency(kpis.rtgsOutstanding)}
              icon={<Landmark className="h-5 w-5" />}
              tone="rtgs"
            />
            <KpiCard
              label="RTGS Settled"
              value={formatCurrency(kpis.rtgsNormal)}
              icon={<Landmark className="h-5 w-5" />}
              tone="rtgs"
            />
            <KpiCard
              label="Billing Outstanding"
              value={formatCurrency(kpis.billingOutstanding)}
              icon={<Receipt className="h-5 w-5" />}
              tone="billing"
            />
            <KpiCard
              label="Billing Settled"
              value={formatCurrency(kpis.billingNormal)}
              icon={<Receipt className="h-5 w-5" />}
              tone="billing"
            />
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Outstanding Breakdown</h3>
                  <p className="mt-0.5 text-xs text-slate-400">By payment channel</p>
                </div>
                <IndianRupee className="h-5 w-5 text-slate-300" />
              </div>
              <DonutChart
                data={outstandingByType}
                centerLabel="Total"
                centerValue={formatCurrency(kpis.totalOutstanding)}
              />
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">Channel Comparison</h3>
                  <p className="mt-0.5 text-xs text-slate-400">Outstanding vs settled by channel</p>
                </div>
                <TrendingUp className="h-5 w-5 text-slate-300" />
              </div>
              <BarChart data={barData} />
            </div>
          </section>

          {/* Table */}
          <section>
            <PaymentsTable payments={payments} />
          </section>

          <footer className="pt-2 text-center text-xs text-slate-400">
            FinaPay Treasury Suite · Sample dataset · Backend integration pending
          </footer>
        </div>
      </main>
    </div>
  );
}
