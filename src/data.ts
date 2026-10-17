import type { Payment, PaymentType, PaymentStatus, PaymentMethod } from '@/types';

const parties = [
  'Apex Logistics Ltd',
  'Northwind Trading Co',
  'Summit Pharmaceuticals',
  'Helios Energy Solutions',
  'Crestline Manufacturing',
  'Verdant Agro Industries',
  'Orbit Telecom Services',
  'Pinnacle Steel Works',
  'Lumen Electricals Pvt Ltd',
  'Trident Exports Inc',
  'Cascade Textiles Mills',
  'Beacon Infotech Systems',
  'Sterling Cement Corp',
  'Aurora Chemicals Ltd',
  'Granite Foods & Beverages',
  'Quartz Automotive Parts',
  'Nimbus Packaging Co',
  'Delta Freight Movers',
  'Equinox Real Estate Group',
  'Pioneer Heavy Machinery',
];

const categories: Record<PaymentType, string[]> = {
  RTGS: ['Vendor Settlement', 'Inter-Branch Transfer', 'Bulk Disbursement', 'Tax Payment', 'Loan Payout'],
  Billing: ['Utility Invoice', 'Service Charges', 'Subscription Fee', 'Equipment Lease', 'Consultancy Retainer'],
};

const methodsByType: Record<PaymentType, PaymentMethod[]> = {
  RTGS: ['RTGS', 'NEFT', 'IMPS', 'Cheque'],
  Billing: ['UPI', 'Card', 'Cheque', 'NEFT'],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pad(n: number, len = 4) {
  return n.toString().padStart(len, '0');
}

function dateOffset(days: number): string {
  const d = new Date('2026-10-17T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function generatePayments(count = 64): Payment[] {
  const rand = seededRandom(20261017);
  const payments: Payment[] = [];

  for (let i = 0; i < count; i++) {
    const type: PaymentType = rand() > 0.5 ? 'RTGS' : 'Billing';
    // ~42% outstanding, weighted toward older entries
    const status: PaymentStatus = rand() < 0.42 ? 'Outstanding' : 'Normal';
    const party = parties[Math.floor(rand() * parties.length)];
    const cat = categories[type][Math.floor(rand() * categories[type].length)];
    const method = methodsByType[type][Math.floor(rand() * methodsByType[type].length)];
    const amount = Math.round((rand() * 950_000 + 5_000) / 100) * 100;
    const priority: Payment['priority'] =
      rand() < 0.25 ? 'High' : rand() < 0.6 ? 'Medium' : 'Low';

    const dueDayOffset = Math.floor(rand() * 60 - 20); // -20..+39 days from "today"
    const dueDate = dateOffset(dueDayOffset);
    const settledDate =
      status === 'Normal'
        ? dateOffset(dueDayOffset - Math.floor(rand() * 5 + 1))
        : null;

    payments.push({
      id: `P${pad(i + 1)}`,
      reference: `${type === 'RTGS' ? 'RTG' : 'BIL'}-2026-${pad(i + 1)}`,
      party,
      type,
      status,
      method,
      amount,
      currency: 'INR',
      dueDate,
      settledDate,
      category: cat,
      priority,
    });
  }

  return payments.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function computeKpis(payments: Payment[]) {
  let totalOutstanding = 0;
  let totalNormal = 0;
  let outstandingCount = 0;
  let normalCount = 0;
  let rtgsOutstanding = 0;
  let billingOutstanding = 0;
  let rtgsNormal = 0;
  let billingNormal = 0;
  let overdueAmount = 0;
  let dueThisWeek = 0;

  const today = new Date('2026-10-17T00:00:00Z').getTime();
  const weekAhead = today + 7 * 24 * 60 * 60 * 1000;

  for (const p of payments) {
    if (p.status === 'Outstanding') {
      totalOutstanding += p.amount;
      outstandingCount++;
      if (p.type === 'RTGS') rtgsOutstanding += p.amount;
      else billingOutstanding += p.amount;
      const due = new Date(p.dueDate + 'T00:00:00Z').getTime();
      if (due < today) overdueAmount += p.amount;
      if (due >= today && due <= weekAhead) dueThisWeek += p.amount;
    } else {
      totalNormal += p.amount;
      normalCount++;
      if (p.type === 'RTGS') rtgsNormal += p.amount;
      else billingNormal += p.amount;
    }
  }

  return {
    totalOutstanding,
    totalNormal,
    outstandingCount,
    normalCount,
    rtgsOutstanding,
    billingOutstanding,
    rtgsNormal,
    billingNormal,
    overdueAmount,
    dueThisWeek,
  };
}

export function formatCurrency(value: number, currency = 'INR'): string {
  const symbols: Record<string, string> = { INR: '₹' };
  const sym = symbols[currency] ?? currency + ' ';
  if (Math.abs(value) >= 10_000_000) return `${sym}${(value / 10_000_000).toFixed(2)} Cr`;
  if (Math.abs(value) >= 100_000) return `${sym}${(value / 100_000).toFixed(2)} L`;
  return `${sym}${value.toLocaleString('en-IN')}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-IN');
}
