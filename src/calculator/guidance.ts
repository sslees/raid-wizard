import { formatTb } from "../format.ts";
import type { RaidLevelContext } from "./types.ts";

export function buildExpansionGuidance(
  ctx: RaidLevelContext,
  canAddDrive: boolean,
  fullChassisNote: string,
): string {
  const { emptyBays, sizeTb } = ctx;
  if (emptyBays === 0) return fullChassisNote;

  const bayLabel = emptyBays === 1 ? "bay" : "bays";
  if (canAddDrive) {
    return `${emptyBays} empty ${bayLabel} — add a drive to grow usable capacity by ${formatTb(sizeTb)} (controller permitting).`;
  }
  return `${emptyBays} empty ${bayLabel}, but this RAID level needs specific drive counts — ${fullChassisNote}`;
}
