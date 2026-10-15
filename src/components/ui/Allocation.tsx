import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { naira } from '../../lib/format';

export const SERIES_COLORS = ['#1A9959', '#88C6A7', '#C0D20D', '#081308', '#DBE47A', '#798179'];

export interface Slice { label: string; sub?: string; value: number }

/** Portfolio allocation: donut with a total in the centre and a labelled legend. */
export function Allocation({ data, totalLabel = 'Total contributed' }: { data: Slice[]; totalLabel?: string }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[200px_1fr]">
      <div className="relative mx-auto h-[200px] w-[200px] max-w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={70} outerRadius={96} paddingAngle={1.5} stroke="#fff" strokeWidth={2} startAngle={90} endAngle={-270} isAnimationActive>
              {data.map((_, i) => <Cell key={i} fill={SERIES_COLORS[i % SERIES_COLORS.length]} />)}
            </Pie>
            <Tooltip
              formatter={(v: number) => [`${naira(v)} · ${Math.round((v / total) * 100)}%`, '']}
              contentStyle={{ border: '1px solid #DDE5DC', borderRadius: 6, fontSize: 12, fontFamily: 'Manrope, system-ui', color: '#081308', padding: '6px 10px' }}
              separator=""
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-semibold uppercase tracking-label text-sage">{totalLabel}</span>
          <span className="display mt-1 text-[26px] leading-none text-ink tnum">{naira(total, true)}</span>
        </div>
      </div>
      <ul className="min-w-0 divide-y divide-line">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-3 py-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-semibold text-ink">{d.label}</div>
              {d.sub && <div className="text-[11.5px] text-sage">{d.sub}</div>}
            </div>
            <div className="text-right tnum">
              <div className="text-[13.5px] font-semibold text-ink">{naira(d.value)}</div>
              <div className="text-[11.5px] text-sage">{Math.round((d.value / total) * 100)}%</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
