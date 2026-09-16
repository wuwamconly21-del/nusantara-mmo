// ============================================================================
// EKONOMI & PERNIAGAAN — Kilang (factories), Ladang (farms), Lombong (mines),
// Kemudahan (state utilities), and the player-to-player market.
// ============================================================================

import type {
  ProductionBuilding,
  ProductionBuildingType,
  ProductionBuildingCategory,
  ManufacturedGoodType,
  ResourceType,
  MarketListing,
  MarketTransaction,
} from "../types/game";

// --- BUILDING CATALOG ---------------------------------------------------------
// Base stats at level 1. Every level adds +BUILDING_LEVEL_SCALING to output,
// storage, and worker cap, and raises upkeep proportionally.

interface BuildingBlueprint {
  category: ProductionBuildingCategory;
  outputGood: ResourceType | ManufacturedGoodType | null; // null for Kemudahan
  inputGoods: { good: ResourceType; quantityPerUnit: number }[]; // Kilang only
  baseProductionPerHour: number;
  baseStorageCap: number;
  baseWorkersCap: number;
  baseUpkeepRMPerHour: number;
  buildCostRM: number;
  buildCostGems: number;
  requiredAutonomyAllowed: boolean; // whether player-owned build is allowed here
}

export const BUILDING_CATALOG: Record<ProductionBuildingType, BuildingBlueprint> = {
  // --- Kilang (factories) — refine raw resources into manufactured goods
  "Kilang Tekstil": {
    category: "Kilang",
    outputGood: "Tekstil",
    inputGoods: [{ good: "Getah", quantityPerUnit: 0.5 }],
    baseProductionPerHour: 40,
    baseStorageCap: 2000,
    baseWorkersCap: 20,
    baseUpkeepRMPerHour: 15,
    buildCostRM: 25000,
    buildCostGems: 0,
    requiredAutonomyAllowed: true,
  },
  "Kilang Elektronik": {
    category: "Kilang",
    outputGood: "Elektronik",
    inputGoods: [{ good: "Bijih Timah", quantityPerUnit: 1 }],
    baseProductionPerHour: 25,
    baseStorageCap: 1500,
    baseWorkersCap: 15,
    baseUpkeepRMPerHour: 30,
    buildCostRM: 60000,
    buildCostGems: 5,
    requiredAutonomyAllowed: true,
  },
  "Kilang Automotif": {
    category: "Kilang",
    outputGood: "Kenderaan",
    inputGoods: [
      { good: "Bijih Timah", quantityPerUnit: 2 },
      { good: "Getah", quantityPerUnit: 1 },
    ],
    baseProductionPerHour: 10,
    baseStorageCap: 500,
    baseWorkersCap: 30,
    baseUpkeepRMPerHour: 50,
    buildCostRM: 120000,
    buildCostGems: 10,
    requiredAutonomyAllowed: true,
  },
  "Kilang Petrokimia": {
    category: "Kilang",
    outputGood: "Petrokimia",
    inputGoods: [{ good: "Minyak", quantityPerUnit: 1.5 }],
    baseProductionPerHour: 35,
    baseStorageCap: 2000,
    baseWorkersCap: 25,
    baseUpkeepRMPerHour: 40,
    buildCostRM: 90000,
    buildCostGems: 8,
    requiredAutonomyAllowed: true,
  },
  "Kilang Simen": {
    category: "Kilang",
    outputGood: "Simen",
    inputGoods: [{ good: "Kayu", quantityPerUnit: 0.2 }],
    baseProductionPerHour: 50,
    baseStorageCap: 3000,
    baseWorkersCap: 18,
    baseUpkeepRMPerHour: 20,
    buildCostRM: 35000,
    buildCostGems: 0,
    requiredAutonomyAllowed: true,
  },

  // --- Ladang (farms) — raw agricultural goods, no inputs required
  "Ladang Padi": {
    category: "Ladang",
    outputGood: "Padi",
    inputGoods: [],
    baseProductionPerHour: 60,
    baseStorageCap: 2500,
    baseWorkersCap: 12,
    baseUpkeepRMPerHour: 5,
    buildCostRM: 8000,
    buildCostGems: 0,
    requiredAutonomyAllowed: true,
  },
  "Ladang Kelapa Sawit": {
    category: "Ladang",
    outputGood: "Kelapa Sawit",
    inputGoods: [],
    baseProductionPerHour: 45,
    baseStorageCap: 2500,
    baseWorkersCap: 15,
    baseUpkeepRMPerHour: 8,
    buildCostRM: 15000,
    buildCostGems: 0,
    requiredAutonomyAllowed: true,
  },
  "Ladang Getah": {
    category: "Ladang",
    outputGood: "Getah",
    inputGoods: [],
    baseProductionPerHour: 40,
    baseStorageCap: 2000,
    baseWorkersCap: 12,
    baseUpkeepRMPerHour: 6,
    buildCostRM: 12000,
    buildCostGems: 0,
    requiredAutonomyAllowed: true,
  },
  "Ladang Ternakan": {
    category: "Ladang",
    outputGood: "Ikan", // treated as general livestock/food yield bucket
    inputGoods: [],
    baseProductionPerHour: 30,
    baseStorageCap: 1500,
    baseWorkersCap: 10,
    baseUpkeepRMPerHour: 7,
    buildCostRM: 10000,
    buildCostGems: 0,
    requiredAutonomyAllowed: true,
  },
  "Kolam Ikan": {
    category: "Ladang",
    outputGood: "Ikan",
    inputGoods: [],
    baseProductionPerHour: 50,
    baseStorageCap: 2000,
    baseWorkersCap: 8,
    baseUpkeepRMPerHour: 4,
    buildCostRM: 7000,
    buildCostGems: 0,
    requiredAutonomyAllowed: true,
  },

  // --- Lombong (extraction)
  "Lombong Bijih Timah": {
    category: "Lombong",
    outputGood: "Bijih Timah",
    inputGoods: [],
    baseProductionPerHour: 20,
    baseStorageCap: 1500,
    baseWorkersCap: 25,
    baseUpkeepRMPerHour: 18,
    buildCostRM: 40000,
    buildCostGems: 0,
    requiredAutonomyAllowed: true,
  },
  "Telaga Minyak": {
    category: "Lombong",
    outputGood: "Minyak",
    inputGoods: [],
    baseProductionPerHour: 30,
    baseStorageCap: 3000,
    baseWorkersCap: 20,
    baseUpkeepRMPerHour: 35,
    buildCostRM: 100000,
    buildCostGems: 15,
    requiredAutonomyAllowed: true,
  },
  "Telaga Gas": {
    category: "Lombong",
    outputGood: "Gas",
    inputGoods: [],
    baseProductionPerHour: 28,
    baseStorageCap: 3000,
    baseWorkersCap: 20,
    baseUpkeepRMPerHour: 32,
    buildCostRM: 95000,
    buildCostGems: 15,
    requiredAutonomyAllowed: true,
  },
  "Balak Hutan": {
    category: "Lombong",
    outputGood: "Kayu",
    inputGoods: [],
    baseProductionPerHour: 55,
    baseStorageCap: 2500,
    baseWorkersCap: 15,
    baseUpkeepRMPerHour: 10,
    buildCostRM: 18000,
    buildCostGems: 0,
    requiredAutonomyAllowed: true,
  },

  // --- Kemudahan (state utilities) — boost the region, produce no goods.
  // Only ever state-owned; see canPlayerBuild() below.
  "Loji Kuasa": {
    category: "Kemudahan",
    outputGood: null,
    inputGoods: [],
    baseProductionPerHour: 0,
    baseStorageCap: 0,
    baseWorkersCap: 30,
    baseUpkeepRMPerHour: 100,
    buildCostRM: 500000,
    buildCostGems: 0,
    requiredAutonomyAllowed: false,
  },
  Pelabuhan: {
    category: "Kemudahan",
    outputGood: null,
    inputGoods: [],
    baseProductionPerHour: 0,
    baseStorageCap: 0,
    baseWorkersCap: 40,
    baseUpkeepRMPerHour: 150,
    buildCostRM: 800000,
    buildCostGems: 0,
    requiredAutonomyAllowed: false,
  },
  "Lapangan Terbang": {
    category: "Kemudahan",
    outputGood: null,
    inputGoods: [],
    baseProductionPerHour: 0,
    baseStorageCap: 0,
    baseWorkersCap: 50,
    baseUpkeepRMPerHour: 200,
    buildCostRM: 1200000,
    buildCostGems: 0,
    requiredAutonomyAllowed: false,
  },
};

const LEVEL_SCALING = 0.15; // each level above 1 adds 15% to output/storage/upkeep

export function canPlayerBuild(type: ProductionBuildingType): boolean {
  return BUILDING_CATALOG[type].requiredAutonomyAllowed;
}

/** Only the state (isStateOwned = true, ownerId = null) may build Kemudahan
 *  and may also build any Kilang/Ladang/Lombong directly as a "state factory". */
export function buildBuilding(params: {
  ownerId: string | null; // null => state-owned
  regionId: string;
  type: ProductionBuildingType;
  now?: Date;
}): ProductionBuilding {
  const blueprint = BUILDING_CATALOG[params.type];
  const isStateOwned = params.ownerId === null;

  if (!isStateOwned && !blueprint.requiredAutonomyAllowed) {
    throw new Error(
      `${params.type} is a state-only Kemudahan and cannot be privately owned.`
    );
  }

  const now = (params.now ?? new Date()).toISOString();

  return {
    id: crypto.randomUUID(),
    ownerId: params.ownerId ?? "STATE",
    regionId: params.regionId,
    category: blueprint.category,
    type: params.type,
    level: 1,
    isStateOwned,
    productionRatePerHour: blueprint.baseProductionPerHour,
    storedGoods: 0,
    storageCap: blueprint.baseStorageCap,
    workersAssigned: 0,
    workersCap: blueprint.baseWorkersCap,
    upkeepCostRMPerHour: blueprint.baseUpkeepRMPerHour,
    lastCollectedAt: now,
    builtAt: now,
  };
}

export function upgradeBuilding(building: ProductionBuilding): ProductionBuilding {
  if (building.level >= 10) return building;
  const blueprint = BUILDING_CATALOG[building.type as ProductionBuildingType];
  const nextLevel = building.level + 1;
  const scale = 1 + LEVEL_SCALING * (nextLevel - 1);
  return {
    ...building,
    level: nextLevel,
    productionRatePerHour: round2(blueprint.baseProductionPerHour * scale),
    storageCap: round2(blueprint.baseStorageCap * scale),
    workersCap: Math.round(blueprint.baseWorkersCap * scale),
    upkeepCostRMPerHour: round2(blueprint.baseUpkeepRMPerHour * scale),
  };
}

export function upgradeCostRM(building: ProductionBuilding): number {
  const blueprint = BUILDING_CATALOG[building.type as ProductionBuildingType];
  return Math.round(blueprint.buildCostRM * 0.6 * building.level);
}

/** Worker staffing directly scales effective output: 0 workers = 20% trickle
 *  output (idle machinery), full staffing = 100%. */
function workerEfficiency(building: ProductionBuilding): number {
  if (building.workersCap === 0) return 1;
  const staffRatio = building.workersAssigned / building.workersCap;
  return 0.2 + 0.8 * Math.min(1, staffRatio);
}

/** Call this whenever a player views/collects a building to roll forward
 *  production since lastCollectedAt, capped at storageCap. Idempotent to call
 *  repeatedly — it always re-derives from the timestamp delta. */
export function collectProduction(
  building: ProductionBuilding,
  now: Date = new Date()
): { building: ProductionBuilding; goodsCollected: number } {
  const blueprint = BUILDING_CATALOG[building.type as ProductionBuildingType];
  if (blueprint.category === "Kemudahan") {
    return { building: { ...building, lastCollectedAt: now.toISOString() }, goodsCollected: 0 };
  }

  const hoursElapsed =
    (now.getTime() - new Date(building.lastCollectedAt).getTime()) / 3_600_000;
  if (hoursElapsed <= 0) return { building, goodsCollected: 0 };

  const efficiency = workerEfficiency(building);
  const produced = building.productionRatePerHour * efficiency * hoursElapsed;
  const newStored = Math.min(building.storageCap, building.storedGoods + produced);
  const goodsCollected = newStored - building.storedGoods;

  return {
    building: { ...building, storedGoods: 0, lastCollectedAt: now.toISOString() },
    goodsCollected: round2(goodsCollected), // credited straight to owner's inventory
  };
}

/** Upkeep is billed hourly against the owner's treasury; state buildings bill
 *  the region's treasury instead (wire this to your region economy ledger). */
export function calculateUpkeepDue(building: ProductionBuilding, hoursElapsed: number): number {
  return round2(building.upkeepCostRMPerHour * hoursElapsed);
}

// --- MARKET --------------------------------------------------------------------

export function createListing(params: {
  sellerId: string;
  regionId: string;
  goodType: ResourceType | ManufacturedGoodType;
  quantity: number;
  pricePerUnitRM: number;
}): MarketListing {
  if (params.quantity <= 0) throw new Error("Quantity must be positive.");
  if (params.pricePerUnitRM <= 0) throw new Error("Price must be positive.");
  return {
    id: crypto.randomUUID(),
    ...params,
    listedAt: new Date().toISOString(),
  };
}

export function executeTrade(
  listing: MarketListing,
  buyerId: string,
  quantity: number
): { updatedListing: MarketListing | null; transaction: MarketTransaction } {
  if (quantity <= 0 || quantity > listing.quantity) {
    throw new Error("Invalid trade quantity.");
  }
  const totalPriceRM = round2(quantity * listing.pricePerUnitRM);
  const remaining = listing.quantity - quantity;

  const transaction: MarketTransaction = {
    id: crypto.randomUUID(),
    listingId: listing.id,
    buyerId,
    sellerId: listing.sellerId,
    goodType: listing.goodType,
    quantity,
    totalPriceRM,
    transactedAt: new Date().toISOString(),
  };

  return {
    updatedListing: remaining > 0 ? { ...listing, quantity: remaining } : null,
    transaction,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
