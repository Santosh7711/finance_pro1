export type PaymentType = 'RTGS' | 'Billing';

export type PaymentStatus = 'Outstanding' | 'Normal';

export type PaymentMethod = 'RTGS' | 'NEFT' | 'IMPS' | 'UPI' | 'Cheque' | 'Card';

export interface Payment {
  id: string;
  reference: string;
  party: string;
  type: PaymentType;
  status: PaymentStatus;
  method: PaymentMethod;
  amount: number;
  currency: string;
  dueDate: string;
  settledDate: string | null;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface KpiSummary {
  totalOutstanding: number;
  totalNormal: number;
  outstandingCount: number;
  normalCount: number;
  rtgsOutstanding: number;
  billingOutstanding: number;
  rtgsNormal: number;
  billingNormal: number;
  overdueAmount: number;
  dueThisWeek: number;
}
