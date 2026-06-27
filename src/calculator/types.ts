export interface RaidConfig {
  bayCount: number;
  drivesInUse: number;
  sizePerDrive: number;
  pricePerDrive: number | null;
}

export interface FaultTolerance {
  min: number;
  max?: number;
}

export interface CapacityBreakdown {
  usable: number;
  overhead: number;
}

export interface OperationalGuidance {
  onFailure: string;
  onExpansion: string;
}

export interface CostMetrics {
  totalHardware: number;
  perUsableTb: number;
}

export type RaidLevelId =
  | "jbod"
  | "raid0"
  | "raid1"
  | "raid5"
  | "raid6"
  | "raid10";

export interface RaidResult {
  id: RaidLevelId;
  name: string;
  valid: boolean;
  invalidReason?: string;
  usableTb: number;
  rawTb: number;
  efficiencyPct: number;
  breakdown: CapacityBreakdown;
  faultTolerance: FaultTolerance;
  faultLabel: string;
  guidance: OperationalGuidance;
  cost: CostMetrics | null;
  recommended: boolean;
}

export interface RaidLevelContext {
  drives: number;
  sizeTb: number;
  rawTb: number;
  bayCount: number;
  emptyBays: number;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export interface RaidLevelDef {
  id: RaidLevelId;
  name: string;
  validate: (drives: number) => ValidationResult;
  calculate: (ctx: RaidLevelContext) => CapacityBreakdown;
  faultTolerance: (drives: number) => FaultTolerance;
  failureGuidance: string;
  expansionGuidance: (ctx: RaidLevelContext) => string;
}
