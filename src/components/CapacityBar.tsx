import type { CapacityBreakdown } from "../calculator/types.ts";
import { formatTb } from "../format.ts";

interface CapacityBarProps {
  breakdown: CapacityBreakdown;
  rawTb: number;
  usableTb: number;
  efficiencyPct: number;
}

export function CapacityBar({ breakdown, rawTb, usableTb, efficiencyPct }: CapacityBarProps) {
  const usablePct = rawTb > 0 ? (breakdown.usable / rawTb) * 100 : 0;
  const overheadPct = rawTb > 0 ? (breakdown.overhead / rawTb) * 100 : 0;

  return (
    <div
      className="capacity-bar"
      role="img"
      aria-label={`${formatTb(usableTb)} usable, ${efficiencyPct}% of ${formatTb(rawTb)} raw`}
    >
      <div className="capacity-bar__segment capacity-bar__segment--usable" style={{ width: `${usablePct}%` }}>
        <span className="capacity-bar__label">
          {formatTb(usableTb)} <span className="capacity-bar__label-pct">{efficiencyPct}%</span>
        </span>
      </div>
      {overheadPct > 0 && (
        <div
          className="capacity-bar__segment capacity-bar__segment--overhead"
          style={{ width: `${overheadPct}%` }}
        >
          <span className="capacity-bar__label">{formatTb(breakdown.overhead)}</span>
        </div>
      )}
    </div>
  );
}
