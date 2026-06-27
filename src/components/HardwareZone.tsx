import { formatMoney, formatTb } from "../format.ts";
import { BayVisualization } from "./BayVisualization.tsx";
import { NumberField } from "./NumberField.tsx";

interface HardwareZoneProps {
  bayCount: number;
  drivesInUse: number;
  sizePerDrive: number;
  pricePerDrive: number | null;
  rawTb: number;
  totalCost: number | null;
  derivedPerTb: number | null;
  onBayCountChange: (value: number) => void;
  onDrivesChange: (value: number) => void;
  onSizeChange: (value: number) => void;
  onPriceChange: (value: number | null) => void;
}

export function HardwareZone({
  bayCount,
  drivesInUse,
  sizePerDrive,
  pricePerDrive,
  rawTb,
  totalCost,
  derivedPerTb,
  onBayCountChange,
  onDrivesChange,
  onSizeChange,
  onPriceChange,
}: HardwareZoneProps) {
  return (
    <section className="zone hardware-zone">
      <header className="zone__header">
        <div>
          <h2>Hardware</h2>
          <p>All drives the same size</p>
        </div>
      </header>

      <div className="hardware-zone__inputs">
        <NumberField label="Bays" value={bayCount} min={1} max={24} onCommit={onBayCountChange} />
        <NumberField
          label="Drives in use"
          value={drivesInUse}
          min={1}
          max={bayCount}
          onCommit={onDrivesChange}
        />
        <NumberField
          label="Size (TB each)"
          value={sizePerDrive}
          min={1}
          max={100}
          onCommit={onSizeChange}
        />
        <label className="field">
          <span>Price per drive</span>
          <input
            type="number"
            min={0}
            value={pricePerDrive ?? ""}
            placeholder="Optional"
            onChange={(e) => {
              const v = e.target.value;
              onPriceChange(v === "" ? null : Number(v));
            }}
          />
        </label>
      </div>

      <div className="hardware-zone__derived">
        <div className="stat">
          <span className="stat__value">{formatTb(rawTb)}</span>
          <span className="stat__label">Raw capacity</span>
        </div>
        <div className="stat">
          <span className="stat__value">
            {totalCost !== null ? formatMoney(totalCost) : "—"}
          </span>
          <span className="stat__label">Hardware cost</span>
        </div>
        <div className="stat">
          <span className="stat__value">
            {derivedPerTb !== null ? `$${derivedPerTb.toFixed(0)}/TB` : "—"}
          </span>
          <span className="stat__label">Cost per raw TB</span>
        </div>
      </div>

      <div className="hardware-zone__bays">
        <BayVisualization
          bayCount={bayCount}
          drivesInUse={drivesInUse}
          sizePerDrive={sizePerDrive}
        />
      </div>
    </section>
  );
}
