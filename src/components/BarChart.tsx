import { formatCurrency } from '@/data';

interface BarDatum {
  label: string;
  outstanding: number;
  normal: number;
}

interface BarChartProps {
  data: BarDatum[];
}

export default function BarChart({ data }: BarChartProps) {
  const max = Math.max(...data.flatMap((d) => [d.outstanding, d.normal]), 1);
  const scale = (v: number) => (v / max) * 100;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" /> Outstanding
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Normal
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.map((d) => (
          <div key={d.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">{d.label}</span>
              <span className="text-xs text-slate-400 tabular-nums">
                {formatCurrency(d.outstanding + d.normal)}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex h-5 items-center overflow-hidden rounded-md bg-slate-100">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-500"
                  style={{ width: `${scale(d.outstanding)}%` }}
                  title={`Outstanding: ${formatCurrency(d.outstanding)}`}
                />
              </div>
              <div className="flex h-5 items-center overflow-hidden rounded-md bg-slate-100">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                  style={{ width: `${scale(d.normal)}%` }}
                  title={`Normal: ${formatCurrency(d.normal)}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
