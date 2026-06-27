import type { RaidResult } from "../calculator/types.ts";
import { formatTb } from "../format.ts";
import { RaidRow } from "./RaidRow.tsx";

interface ComparisonZoneProps {
  results: RaidResult[];
  drivesInUse: number;
  sizePerDrive: number;
  rawTb: number;
  bayCount: number;
}

export function ComparisonZone({
  results,
  drivesInUse,
  sizePerDrive,
  rawTb,
  bayCount,
}: ComparisonZoneProps) {
  const emptyBays = bayCount - drivesInUse;

  return (
    <section className="zone comparison-zone">
      <header className="zone__header">
        <div>
          <h2>RAID comparison</h2>
          <p>
            {drivesInUse}× {sizePerDrive} TB drives
            {emptyBays > 0 ? ` · ${emptyBays} empty bays` : " · chassis full"}
          </p>
        </div>
        <span className="zone__header-meta">{formatTb(rawTb)} raw</span>
      </header>

      <div className="capacity-legend" aria-hidden="true">
        <span>
          <i className="swatch swatch--usable" /> Usable
        </span>
        <span>
          <i className="swatch swatch--overhead" /> Parity / mirror overhead
        </span>
      </div>

      <div className="comparison-zone__rows">
        {results.map((result) => (
          <RaidRow key={result.id} result={result} />
        ))}
      </div>
    </section>
  );
}
