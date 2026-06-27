import {
  buildLevelContext,
  formatFaultLabel,
  RAID_LEVELS,
} from "./levels.ts";
import type { RaidConfig, RaidResult } from "./types.ts";

export function calculateAll(config: RaidConfig): RaidResult[] {
  const ctx = buildLevelContext(config);
  const { rawTb } = ctx;

  const results: RaidResult[] = RAID_LEVELS.map((level) => {
    const validation = level.validate(ctx.drives);
    const faultTolerance = level.faultTolerance(ctx.drives);
    const breakdown = validation.valid
      ? level.calculate(ctx)
      : { usable: 0, overhead: 0 };
    const efficiencyPct =
      validation.valid && rawTb > 0
        ? Math.round((breakdown.usable / rawTb) * 100)
        : 0;

    let cost: RaidResult["cost"] = null;
    if (config.pricePerDrive !== null && validation.valid && breakdown.usable > 0) {
      const totalHardware = ctx.drives * config.pricePerDrive;
      cost = {
        totalHardware,
        perUsableTb: totalHardware / breakdown.usable,
      };
    } else if (config.pricePerDrive !== null && validation.valid) {
      const totalHardware = ctx.drives * config.pricePerDrive;
      cost = { totalHardware, perUsableTb: 0 };
    }

    return {
      id: level.id,
      name: level.name,
      valid: validation.valid,
      invalidReason: validation.reason,
      usableTb: breakdown.usable,
      rawTb,
      efficiencyPct,
      breakdown,
      faultTolerance,
      faultLabel: validation.valid ? formatFaultLabel(faultTolerance) : "—",
      guidance: {
        onFailure: level.failureGuidance,
        onExpansion: level.expansionGuidance(ctx),
      },
      cost,
      recommended: false,
    };
  });

  const sorted = results.sort((a, b) => {
    if (a.valid !== b.valid) return a.valid ? -1 : 1;
    if (a.valid && b.valid) {
      const aRedundant = a.faultTolerance.min > 0;
      const bRedundant = b.faultTolerance.min > 0;
      if (aRedundant !== bRedundant) return aRedundant ? -1 : 1;
      return b.usableTb - a.usableTb;
    }
    return a.name.localeCompare(b.name);
  });

  const recommended = pickRecommended(sorted);
  if (recommended) recommended.recommended = true;

  return sorted;
}

// Best balance of safety and capacity for the current drive count: prefer
// dual-parity, then single-parity, then mirroring, before unprotected layouts.
function pickRecommended(results: RaidResult[]): RaidResult | undefined {
  const preference: RaidResult["id"][] = ["raid6", "raid5", "raid10", "raid1"];
  for (const id of preference) {
    const match = results.find((r) => r.id === id && r.valid && r.usableTb > 0);
    if (match) return match;
  }
  return undefined;
}

export type { RaidConfig, RaidResult } from "./types.ts";
