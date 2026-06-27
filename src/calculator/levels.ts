import { buildExpansionGuidance } from "./guidance.ts";
import type {
  FaultTolerance,
  RaidLevelContext,
  RaidLevelDef,
  ValidationResult,
} from "./types.ts";

function minDrives(n: number, message: string): (drives: number) => ValidationResult {
  return (drives) =>
    drives >= n ? { valid: true } : { valid: false, reason: message };
}

function evenDrives(drives: number): ValidationResult {
  return drives % 2 === 0
    ? { valid: true }
    : { valid: false, reason: "needs an even number of drives" };
}

export const RAID_LEVELS: RaidLevelDef[] = [
  {
    id: "jbod",
    name: "JBOD",
    validate: minDrives(1, "needs at least 1 drive"),
    calculate: ({ rawTb }) => ({ usable: rawTb, overhead: 0 }),
    faultTolerance: () => ({ min: 0 }),
    failureGuidance:
      "Only data on the failed drive is at risk; other drives may still be readable.",
    expansionGuidance: (ctx) =>
      buildExpansionGuidance(ctx, true, "Add a drive to extend the concatenated volume."),
  },
  {
    id: "raid0",
    name: "RAID 0",
    validate: minDrives(2, "needs at least 2 drives"),
    calculate: ({ rawTb }) => ({ usable: rawTb, overhead: 0 }),
    faultTolerance: () => ({ min: 0 }),
    failureGuidance: "Any single drive failure destroys the entire array.",
    expansionGuidance: (ctx) =>
      ctx.emptyBays > 0
        ? "RAID 0 cannot safely expand in place — rebuild from backup with more or larger drives."
        : "No in-place expansion — rebuild from backup with larger drives.",
  },
  {
    id: "raid1",
    name: "RAID 1",
    validate: minDrives(2, "needs at least 2 drives"),
    calculate: ({ sizeTb, rawTb }) => ({
      usable: sizeTb,
      overhead: rawTb - sizeTb,
    }),
    faultTolerance: (drives) => ({ min: drives - 1 }),
    failureGuidance:
      "Array stays online degraded; rebuild copies from a mirror drive.",
    expansionGuidance: (ctx) =>
      buildExpansionGuidance(
        ctx,
        false,
        "Replace drives one at a time with larger disks to grow usable space.",
      ),
  },
  {
    id: "raid5",
    name: "RAID 5",
    validate: minDrives(3, "needs at least 3 drives"),
    calculate: ({ drives, sizeTb }) => ({
      usable: (drives - 1) * sizeTb,
      overhead: sizeTb,
    }),
    faultTolerance: () => ({ min: 1 }),
    failureGuidance:
      "Array runs degraded; rebuild is slow and reads all disks. A second failure during rebuild loses data.",
    expansionGuidance: (ctx) =>
      buildExpansionGuidance(
        ctx,
        true,
        "Replace all drives with larger disks one at a time, or backup and rebuild.",
      ),
  },
  {
    id: "raid6",
    name: "RAID 6",
    validate: minDrives(4, "needs at least 4 drives"),
    calculate: ({ drives, sizeTb }) => ({
      usable: (drives - 2) * sizeTb,
      overhead: 2 * sizeTb,
    }),
    faultTolerance: () => ({ min: 2 }),
    failureGuidance:
      "Array runs degraded; survives one additional drive failure during rebuild.",
    expansionGuidance: (ctx) =>
      buildExpansionGuidance(
        ctx,
        true,
        "Replace drives with larger disks one at a time; must keep at least 4 drives.",
      ),
  },
  {
    id: "raid10",
    name: "RAID 10",
    validate: (drives) => {
      if (drives < 4) return { valid: false, reason: "needs at least 4 drives" };
      return evenDrives(drives);
    },
    calculate: ({ drives, sizeTb }) => ({
      usable: (drives / 2) * sizeTb,
      overhead: (drives / 2) * sizeTb,
    }),
    faultTolerance: (drives) => ({ min: 1, max: drives / 2 }),
    failureGuidance:
      "Array stays degraded; rebuild copies one drive (fast). Data lost if both drives in the same mirror pair fail.",
    expansionGuidance: (ctx) =>
      buildExpansionGuidance(
        ctx,
        ctx.emptyBays >= 2,
        "Add drives in pairs, or replace drives one at a time with larger disks.",
      ),
  },
];

export function formatFaultLabel(tolerance: FaultTolerance): string {
  if (tolerance.max !== undefined && tolerance.max !== tolerance.min) {
    return `${tolerance.min}–${tolerance.max}`;
  }
  return String(tolerance.min);
}

export function buildLevelContext(config: {
  bayCount: number;
  drivesInUse: number;
  sizePerDrive: number;
}): RaidLevelContext {
  const drives = config.drivesInUse;
  const sizeTb = config.sizePerDrive;
  return {
    drives,
    sizeTb,
    rawTb: drives * sizeTb,
    bayCount: config.bayCount,
    emptyBays: Math.max(0, config.bayCount - drives),
  };
}
