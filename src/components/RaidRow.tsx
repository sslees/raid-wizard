import type { RaidResult } from "../calculator/types.ts";
import { formatMoney } from "../format.ts";
import { CapacityBar } from "./CapacityBar.tsx";

interface RaidRowProps {
  result: RaidResult;
}

export function RaidRow({ result }: RaidRowProps) {
  if (!result.valid) {
    return (
      <div className="raid-row raid-row--invalid">
        <h3 className="raid-row__name">{result.name}</h3>
        <span className="raid-row__invalid-reason">{result.invalidReason}</span>
      </div>
    );
  }

  return (
    <article className={`raid-row${result.recommended ? " raid-row--recommended" : ""}`}>
      <div className="raid-row__header">
        <div className="raid-row__title">
          <h3 className="raid-row__name">{result.name}</h3>
          {result.recommended && <span className="raid-row__badge">Recommended</span>}
        </div>
        <div className="raid-row__stats">
          <span className="stat-chip stat-chip--fault" title={faultTooltip(result)}>
            {faultLabel(result)}
          </span>
          {result.cost && result.cost.perUsableTb > 0 && (
            <span className="stat-chip">{formatMoney(result.cost.perUsableTb)}/usable TB</span>
          )}
        </div>
      </div>

      <CapacityBar
        breakdown={result.breakdown}
        rawTb={result.rawTb}
        usableTb={result.usableTb}
        efficiencyPct={result.efficiencyPct}
      />

      <div className="raid-row__guidance">
        <div className="raid-row__guidance-cell raid-row__guidance-cell--failure">
          <h4>If a drive fails</h4>
          <p>{result.guidance.onFailure}</p>
        </div>
        <div className="raid-row__guidance-cell raid-row__guidance-cell--expansion">
          <h4>Need more space later</h4>
          <p>{result.guidance.onExpansion}</p>
        </div>
      </div>
    </article>
  );
}

function faultLabel(result: RaidResult): string {
  const { min, max } = result.faultTolerance;
  if (min === 0) return "No redundancy";
  if (max !== undefined && max !== min) {
    return `Survives ${min}–${max} drive failures`;
  }
  return `Survives ${min} drive failure${min === 1 ? "" : "s"}`;
}

function faultTooltip(result: RaidResult): string | undefined {
  if (result.id !== "raid10" || result.faultTolerance.max === undefined) return undefined;
  return `Guaranteed minimum: ${result.faultTolerance.min}. Best case (failures spread across mirror pairs): up to ${result.faultTolerance.max}.`;
}
