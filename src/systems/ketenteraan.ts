// ============================================================================
// KETENTERAAN & PERANG — recruitment, deterministic battle resolution
// (mulberry32-seeded, matching your existing multiplayer sync), and
// revolutions.
// ============================================================================

import { mulberry32, seedFromString } from "../lib/rng";
import type {
  Battle,
  MilitaryUnitStack,
  MilitaryUnitType,
  Revolution,
  War,
} from "../types/game";

// Relative combat power per unit — tune freely.
const UNIT_POWER: Record<MilitaryUnitType, number> = {
  Infantri: 1,
  "Kereta Kebal": 6,
  Artileri: 4,
  "Jet Pejuang": 10,
  "Kapal Perang": 12,
};

export const RECRUIT_COST_RM: Record<MilitaryUnitType, number> = {
  Infantri: 500,
  "Kereta Kebal": 8000,
  Artileri: 4000,
  "Jet Pejuang": 20000,
  "Kapal Perang": 35000,
};

export const TRAINING_HOURS: Record<MilitaryUnitType, number> = {
  Infantri: 1,
  "Kereta Kebal": 6,
  Artileri: 4,
  "Jet Pejuang": 12,
  "Kapal Perang": 24,
};

// --- RECRUITMENT -----------------------------------------------------------------

export function recruitUnits(params: {
  ownerId: string;
  regionId: string;
  unitType: MilitaryUnitType;
  quantity: number;
}): { stack: MilitaryUnitStack; costRM: number; readyAt: string } {
  if (params.quantity <= 0) throw new Error("Kuantiti mesti positif.");
  const costRM = RECRUIT_COST_RM[params.unitType] * params.quantity;
  const now = new Date();
  const readyAt = new Date(
    now.getTime() + TRAINING_HOURS[params.unitType] * 3_600_000
  ).toISOString();

  return {
    stack: {
      id: crypto.randomUUID(),
      ownerId: params.ownerId,
      regionId: params.regionId,
      unitType: params.unitType,
      quantity: params.quantity,
      trainingStartedAt: now.toISOString(),
    },
    costRM,
    readyAt,
  };
}

export function isTrainingComplete(stack: MilitaryUnitStack, now: Date = new Date()): boolean {
  if (!stack.trainingStartedAt) return true;
  const readyAt =
    new Date(stack.trainingStartedAt).getTime() +
    TRAINING_HOURS[stack.unitType] * 3_600_000;
  return now.getTime() >= readyAt;
}

export function calculateStrength(stacks: MilitaryUnitStack[]): number {
  return stacks.reduce((sum, s) => sum + s.quantity * UNIT_POWER[s.unitType], 0);
}

// --- WAR -------------------------------------------------------------------------

export function declareWar(aggressorRegionId: string, defenderRegionId: string): War {
  return {
    id: crypto.randomUUID(),
    aggressorRegionId,
    defenderRegionId,
    status: "Diisytiharkan",
    declaredAt: new Date().toISOString(),
    endedAt: null,
    winnerRegionId: null,
  };
}

export function startWar(war: War): War {
  return { ...war, status: "Berlangsung" };
}

/** Deterministic battle resolution: every client derives the same outcome
 *  from the same seed via mulberry32, per your existing sync architecture.
 *  attackerStrength/defenderStrength should come from calculateStrength().
 *  A small random swing (±15%) is applied on top of raw strength so battles
 *  aren't pure spreadsheet math. */
export function resolveBattle(battle: Battle): Battle {
  const rng = mulberry32(battle.seed);
  const attackerSwing = 0.85 + rng() * 0.3; // 0.85–1.15
  const defenderSwing = 0.85 + rng() * 0.3;

  const effectiveAttacker = battle.attackerStrength * attackerSwing;
  const effectiveDefender = battle.defenderStrength * defenderSwing;

  let result: Battle["result"];
  if (Math.abs(effectiveAttacker - effectiveDefender) < effectiveDefender * 0.03) {
    result = "Seri";
  } else {
    result = effectiveAttacker > effectiveDefender ? "Menang" : "Kalah";
  }

  return { ...battle, result, resolvedAt: new Date().toISOString() };
}

export function createBattle(params: {
  warId: string;
  regionId: string;
  attackerStrength: number;
  defenderStrength: number;
  occursAt?: Date;
}): Battle {
  const occursAt = params.occursAt ?? new Date();
  return {
    id: crypto.randomUUID(),
    warId: params.warId,
    regionId: params.regionId,
    // Seed derived from war+region+timestamp so it's reproducible but not
    // guessable ahead of time; swap for your Supabase anchor value if you
    // want cross-client determinism tied to the world clock instead.
    seed: seedFromString(`${params.warId}:${params.regionId}:${occursAt.getTime()}`),
    attackerStrength: params.attackerStrength,
    defenderStrength: params.defenderStrength,
    result: null,
    occursAt: occursAt.toISOString(),
    resolvedAt: null,
  };
}

export function endWar(war: War, winnerRegionId: string | null): War {
  return {
    ...war,
    status: "Tamat",
    endedAt: new Date().toISOString(),
    winnerRegionId,
  };
}

// --- REVOLUTIONS -------------------------------------------------------------------

const REVOLUTION_SUCCESS_THRESHOLD = 66; // % support needed to succeed
const REVOLUTION_WINDOW_HOURS = 48;

export function startRevolution(regionId: string, instigatorPlayerId: string): Revolution {
  const startedAt = new Date();
  return {
    id: crypto.randomUUID(),
    regionId,
    instigatorPlayerId,
    supportPercent: 0,
    status: "Berkumpul",
    startedAt: startedAt.toISOString(),
    resolvesAt: new Date(
      startedAt.getTime() + REVOLUTION_WINDOW_HOURS * 3_600_000
    ).toISOString(),
  };
}

export function addSupport(revolution: Revolution, supportDelta: number): Revolution {
  const supportPercent = Math.max(
    0,
    Math.min(100, revolution.supportPercent + supportDelta)
  );
  return {
    ...revolution,
    supportPercent,
    status: revolution.status === "Berkumpul" ? "Berlangsung" : revolution.status,
  };
}

export function resolveRevolution(revolution: Revolution, now: Date = new Date()): Revolution {
  if (now < new Date(revolution.resolvesAt)) return revolution;
  const succeeded = revolution.supportPercent >= REVOLUTION_SUCCESS_THRESHOLD;
  return { ...revolution, status: succeeded ? "Berjaya" : "Gagal" };
}
