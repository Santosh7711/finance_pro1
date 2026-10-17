import { useMemo, useState } from 'react';
import { ArrowDownUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { Payment, PaymentType, PaymentStatus } from '@/types';
import { formatCurrency } from '@/data';

interface PaymentsTableProps {
  payments: Payment[];
}

type StatusFilter = 'All' | PaymentStatus;
type TypeFilter = 'All' | PaymentType;
type SortKey = 'reference' | 'party' | 'amount' | 'dueDate' | 'method';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 8;

const statusBadge: Record<PaymentStatus, string> = {
  Outstanding: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  Normal: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};

const typeBadge: Record<PaymentType, string> = {
  RTGS: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  Billing: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
};

const priorityDot: Record<Payment['priority'], string> = {
  High: 'bg-rose-500',
  Medium: 'bg-amber-500',
  Low: 'bg-slate-300',
};

function isOverdue(p: Payment): boolean {
  return p.status === 'Outstanding' && new Date(p.dueDate + 'T00:00:00Z').getTime() < new Date('2026-10-17T00:00:00Z').getTime();
}

export default function PaymentsTable({ payments }: PaymentsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [sortKey, setSortKey] = useState<SortKey>('dueDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter((p) => {
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      if (typeFilter !== 'All' && p.type !== typeFilter) return false;
      if (!q) return true;
      return (
        p.reference.toLowerCase().includes(q) ||
        p.party.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.method.toLowerCase().includes(q)
      );
    });
  }, [payments, search, statusFilter, typeFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'amount') cmp = a.amount - b.amount;
      else cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(0, pageCount - 1));
  const rows = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const SortHeader = ({ label, keyName }: { label: string; keyName: SortKey }) => (
    <button
      onClick={() => toggleSort(keyName)}
      className="group inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-800"
    >
      {label}
      <ArrowDownUp className={`h-3 w-3 ${sortKey === keyName ? 'text-slate-800' : 'text-slate-300'}`} />
    </button>
  );

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Payment Ledger</h3>
          <p className="mt-0.5 text-xs text-slate-400">{sorted.length} records matching filters</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search reference, party…"
              className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <div className="flex rounded-lg bg-slate-100 p-0.5">
            {(['All', 'Outstanding', 'Normal'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(0); }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  statusFilter === s ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg bg-slate-100 p-0.5">
            {(['All', 'RTGS', 'Billing'] as TypeFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTypeFilter(t); setPage(0); }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  typeFilter === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-5 py-3 text-left"><SortHeader label="Reference" keyName="reference" /></th>
              <th className="px-5 py-3 text-left"><SortHeader label="Party" keyName="party" /></th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
              <th className="px-5 py-3 text-left"><SortHeader label="Amount" keyName="amount" /></th>
              <th className="px-5 py-3 text-left"><SortHeader label="Due Date" keyName="dueDate" /></th>
              <th className="px-5 py-3 text-left"><SortHeader label="Method" keyName="method" /></th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Priority</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-400">
                  No payments match the current filters.
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} className="transition hover:bg-slate-50/70">
                <td className="px-5 py-3 font-medium text-slate-700 tabular-nums">{p.reference}</td>
                <td className="px-5 py-3 text-slate-600">{p.party}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${typeBadge[p.type]}`}>{p.type}</span>
                </td>
                <td className="px-5 py-3 font-semibold text-slate-800 tabular-nums">{formatCurrency(p.amount)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums text-slate-600">{p.dueDate}</span>
                    {isOverdue(p) && (
                      <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700 ring-1 ring-amber-200">
                        Overdue
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-500">{p.method}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${priorityDot[p.priority]}`} />
                    <span className="text-xs text-slate-500">{p.priority}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${statusBadge[p.status]}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            Showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-500 tabular-nums">{safePage + 1} / {pageCount}</span>
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePage >= pageCount - 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
