import { describe, expect, it } from "vitest";
import { calculateAll } from "./index.ts";

const baseConfig = {
  bayCount: 8,
  drivesInUse: 4,
  sizePerDrive: 8,
  pricePerDrive: 200,
};

describe("calculateAll — 4×8 TB equal drives", () => {
  const results = calculateAll(baseConfig);
  const byId = Object.fromEntries(results.map((r) => [r.id, r]));

  it("calculates RAID 5 usable capacity", () => {
    expect(byId.raid5?.valid).toBe(true);
    expect(byId.raid5?.usableTb).toBe(24);
    expect(byId.raid5?.efficiencyPct).toBe(75);
    expect(byId.raid5?.breakdown).toEqual({ usable: 24, overhead: 8 });
  });

  it("calculates RAID 6 usable capacity", () => {
    expect(byId.raid6?.valid).toBe(true);
    expect(byId.raid6?.usableTb).toBe(16);
    expect(byId.raid6?.efficiencyPct).toBe(50);
  });

  it("calculates RAID 10 usable capacity and fault range", () => {
    expect(byId.raid10?.valid).toBe(true);
    expect(byId.raid10?.usableTb).toBe(16);
    expect(byId.raid10?.faultLabel).toBe("1–2");
  });

  it("calculates RAID 0 and JBOD at full raw capacity", () => {
    expect(byId.raid0?.usableTb).toBe(32);
    expect(byId.jbod?.usableTb).toBe(32);
  });

  it("calculates RAID 1 usable capacity", () => {
    expect(byId.raid1?.usableTb).toBe(8);
    expect(byId.raid1?.faultLabel).toBe("3");
  });

  it("computes cost metrics for RAID 5", () => {
    expect(byId.raid5?.cost).toEqual({
      totalHardware: 800,
      perUsableTb: 800 / 24,
    });
  });

  it("sorts redundant options before no-redundancy options, then by usable capacity descending within each tier", () => {
    const valid = results.filter((r) => r.valid);
    const redundant = valid.filter((r) => r.faultTolerance.min > 0);
    const noRedundancy = valid.filter((r) => r.faultTolerance.min === 0);

    // All redundant entries appear before any no-redundancy entries
    const firstNoRedundancyIdx = valid.findIndex((r) => r.faultTolerance.min === 0);
    const lastRedundantIdx = valid.findLastIndex((r) => r.faultTolerance.min > 0);
    expect(lastRedundantIdx).toBeLessThan(firstNoRedundancyIdx);

    // Within each tier, usable capacity is descending
    for (let i = 1; i < redundant.length; i++) {
      expect(redundant[i - 1]!.usableTb).toBeGreaterThanOrEqual(redundant[i]!.usableTb);
    }
    for (let i = 1; i < noRedundancy.length; i++) {
      expect(noRedundancy[i - 1]!.usableTb).toBeGreaterThanOrEqual(noRedundancy[i]!.usableTb);
    }
  });
});

describe("operational guidance", () => {
  it("mentions empty bays when chassis is not full", () => {
    const raid5 = calculateAll(baseConfig).find((r) => r.id === "raid5");
    expect(raid5?.guidance.onExpansion).toContain("empty bays");
  });

  it("describes replace-with-larger-drives when chassis is full", () => {
    const raid5 = calculateAll({
      ...baseConfig,
      bayCount: 4,
    }).find((r) => r.id === "raid5");
    expect(raid5?.guidance.onExpansion).toContain("Replace all drives");
  });

  it("includes drive failure guidance for RAID 5", () => {
    const raid5 = calculateAll(baseConfig).find((r) => r.id === "raid5");
    expect(raid5?.guidance.onFailure).toContain("degraded");
  });
});

describe("validation edge cases", () => {
  it("invalidates RAID 6 with 3 drives", () => {
    const raid6 = calculateAll({
      ...baseConfig,
      drivesInUse: 3,
      bayCount: 4,
    }).find((r) => r.id === "raid6");
    expect(raid6?.valid).toBe(false);
    expect(raid6?.invalidReason).toBe("needs at least 4 drives");
  });

  it("invalidates RAID 10 with 5 drives", () => {
    const raid10 = calculateAll({
      ...baseConfig,
      drivesInUse: 5,
      bayCount: 8,
    }).find((r) => r.id === "raid10");
    expect(raid10?.valid).toBe(false);
    expect(raid10?.invalidReason).toBe("needs an even number of drives");
  });
});
