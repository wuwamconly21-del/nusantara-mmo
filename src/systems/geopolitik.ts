// ============================================================================
// GEOPOLITIK & WILAYAH — region control, autonomy transitions, and the
// infrastructure index shown on the player dashboard (Akademi, Pertahanan,
// Pembangunan, Kesihatan).
// ============================================================================

import type { AutonomyLevel, InfrastructureIndex, Region } from "../types/game";

const AUTONOMY_ORDER: AutonomyLevel[] = [
  "Wilayah Persekutuan",
  "Negeri Autonomi Separa",
  "Negeri Merdeka",
];

/** Autonomy rises one step at a time and only once infrastructure clears a
 *  bar — you can't leapfrog from fully centralized straight to independence. */
const AUTONOMY_THRESHOLDS: Record<AutonomyLevel, number> = {
  "Wilayah Persekutuan": 0,
  "Negeri Autonomi Separa": 6, // avg infra index >= 6
  "Negeri Merdeka": 8.5, // avg infra index >= 8.5
};

export function averageInfrastructure(index: InfrastructureIndex): number {
  return (
    (index.akademi + index.pertahanan + index.pembangunan + index.kesihatan) / 4
  );
}

export function canAdvanceAutonomy(region: Region): boolean {
  const currentIdx = AUTONOMY_ORDER.indexOf(region.autonomyLevel);
  if (currentIdx === AUTONOMY_ORDER.length - 1) return false;
  const nextLevel = AUTONOMY_ORDER[currentIdx + 1];
  return averageInfrastructure(region.infrastructure) >= AUTONOMY_THRESHOLDS[nextLevel];
}

export function advanceAutonomy(region: Region): Region {
  if (!canAdvanceAutonomy(region)) return region;
  const currentIdx = AUTONOMY_ORDER.indexOf(region.autonomyLevel);
  return { ...region, autonomyLevel: AUTONOMY_ORDER[currentIdx + 1] };
}

/** A lost war or a successful revolution can also force autonomy DOWN a
 *  step (re-centralization) — call this from ketenteraan.ts's war/revolution
 *  resolution when the losing/defending side is the region itself. */
export function demoteAutonomy(region: Region): Region {
  const currentIdx = AUTONOMY_ORDER.indexOf(region.autonomyLevel);
  if (currentIdx === 0) return region;
  return { ...region, autonomyLevel: AUTONOMY_ORDER[currentIdx - 1] };
}

/** Investing treasury into a specific infrastructure pillar. Cost grows
 *  quadratically so maxing every pillar isn't trivially cheap. */
export function investInInfrastructure(
  region: Region,
  pillar: keyof InfrastructureIndex,
  amountRM: number
): { region: Region; pointsGained: number } {
  const current = region.infrastructure[pillar];
  if (current >= 10) return { region, pointsGained: 0 };

  const costPerPoint = 20000 * (current + 1); // next point costs more
  const pointsGained = Math.min(10 - current, Math.floor(amountRM / costPerPoint));
  if (pointsGained <= 0) return { region, pointsGained: 0 };

  return {
    region: {
      ...region,
      infrastructure: {
        ...region.infrastructure,
        [pillar]: current + pointsGained,
      },
    },
    pointsGained,
  };
}

/** Transfer control after a won war, election, or annexation deal. */
export function transferRegionControl(region: Region, newPartyId: string | null): Region {
  return { ...region, controllingPartyId: newPartyId };
}

export function isNeighbor(region: Region, otherRegionId: string): boolean {
  return region.neighborsRegionIds.includes(otherRegionId);
}
