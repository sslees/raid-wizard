import { useMemo, useState } from "react";
import { calculateAll, type RaidResult } from "../calculator/index.ts";

export interface RaidConfigState {
  bayCount: number;
  drivesInUse: number;
  sizePerDrive: number;
  pricePerDrive: number | null;
}

const DEFAULTS: RaidConfigState = {
  bayCount: 4,
  drivesInUse: 4,
  sizePerDrive: 8,
  pricePerDrive: 200,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function useRaidConfig() {
  const [config, setConfig] = useState<RaidConfigState>(DEFAULTS);

  const setBayCount = (bayCount: number) => {
    setConfig((prev) => {
      const nextBays = clamp(Math.round(bayCount), 1, 24);
      return {
        ...prev,
        bayCount: nextBays,
        drivesInUse: clamp(prev.drivesInUse, 1, nextBays),
      };
    });
  };

  const setDrivesInUse = (drivesInUse: number) => {
    setConfig((prev) => ({
      ...prev,
      drivesInUse: clamp(Math.round(drivesInUse), 1, prev.bayCount),
    }));
  };

  const setSizePerDrive = (sizePerDrive: number) => {
    setConfig((prev) => ({
      ...prev,
      sizePerDrive: clamp(Math.round(sizePerDrive), 1, 100),
    }));
  };

  const setPricePerDrive = (price: number | null) => {
    setConfig((prev) => ({
      ...prev,
      pricePerDrive: price === null ? null : clamp(Math.round(price), 0, 1_000_000),
    }));
  };

  const results: RaidResult[] = useMemo(
    () => calculateAll(config),
    [config.bayCount, config.drivesInUse, config.sizePerDrive, config.pricePerDrive],
  );

  const rawTb = config.drivesInUse * config.sizePerDrive;
  const totalCost =
    config.pricePerDrive !== null ? config.drivesInUse * config.pricePerDrive : null;
  const derivedPerTb =
    config.pricePerDrive !== null && config.sizePerDrive > 0
      ? config.pricePerDrive / config.sizePerDrive
      : null;

  return {
    config,
    results,
    rawTb,
    totalCost,
    derivedPerTb,
    setBayCount,
    setDrivesInUse,
    setSizePerDrive,
    setPricePerDrive,
  };
}
