import { formatCurrency } from '@/data';

interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutDatum[];
  centerLabel: string;
  centerValue: string;
}

export default function DonutChart({ data, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
      <svg viewBox="0 0 180 180" className="h-44 w-44 shrink-0">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="20" />
        {data.map((d) => {
          const fraction = d.value / total;
          const dash = fraction * circumference;
          const seg = (
            <circle
              key={d.label}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth="20"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 90 90)"
              className="transition-all duration-500"
            >
              <title>{`${d.label}: ${formatCurrency(d.value)}`}</title>
            </circle>
          );
          offset += dash;
          return seg;
        })}
        <text x="90" y="84" textAnchor="middle" className="fill-slate-400 text-[10px] font-medium uppercase tracking-wide">
          {centerLabel}
        </text>
        <text x="90" y="102" textAnchor="middle" className="fill-slate-800 text-base font-bold">
          {centerValue}
        </text>
      </svg>
      <div className="flex-1 space-y-3">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
              <span className="text-sm text-slate-600">{d.label}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-slate-800 tabular-nums">{formatCurrency(d.value)}</span>
              <span className="ml-2 text-xs text-slate-400 tabular-nums">{((d.value / total) * 100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
