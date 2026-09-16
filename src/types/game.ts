// ============================================================================
// TAKHTA NUSANTARA — Core Game Types
// Shared across Geopolitik, Politik, Ekonomi, and Ketenteraan systems.
// ============================================================================

// --- PLAYER -----------------------------------------------------------------

export interface Player {
  id: string;
  username: string;
  level: number;
  rank: PlayerRank;
  hp: number;
  hpMax: number;
  treasuryRM: number; // Perbendaharaan
  gems: number; // Permata Nilam
  homeRegionId: string;
  partyId: string | null;
  jawatanId: JawatanType | null;
  createdAt: string;
  lastActiveAt: string;
}

export type PlayerRank =
  | "Rakyat"
  | "Persekutuan"
  | "Menteri"
  | "Perdana Menteri"
  | "Agong";

// --- GEOPOLITIK & WILAYAH -----------------------------------------------------

export interface Region {
  id: string;
  name: string; // e.g. "Kuala Lumpur"
  countryId: string; // e.g. "MY"
  currencyCode: string; // e.g. "RM"
  controllingPartyId: string | null;
  autonomyLevel: AutonomyLevel;
  population: number;
  infrastructure: InfrastructureIndex;
  resourceDeposits: ResourceDeposit[];
  neighborsRegionIds: string[];
  coordinates: { lat: number; lng: number };
}

export type AutonomyLevel =
  | "Wilayah Persekutuan" // fully centralized
  | "Negeri Autonomi Separa" // partial autonomy
  | "Negeri Merdeka"; // full autonomy / independence

export interface InfrastructureIndex {
  akademi: number; // 0-10, education
  pertahanan: number; // 0-10, defense
  pembangunan: number; // 0-10, development
  kesihatan: number; // 0-10, health
}

export interface ResourceDeposit {
  resource: ResourceType;
  richness: number; // 0-1 multiplier applied to base yield
}

export type ResourceType =
  | "Padi" // rice
  | "Getah" // rubber
  | "Kelapa Sawit" // palm oil
  | "Bijih Timah" // tin ore
  | "Minyak" // oil
  | "Gas"
  | "Kayu" // timber
  | "Ikan"; // fish

// --- POLITIK & PARLIMEN -------------------------------------------------------

export interface Party {
  id: string;
  name: string;
  abbreviation: string;
  ideology: string;
  leaderId: string;
  memberIds: string[];
  foundedAt: string;
  treasuryRM: number;
  approvalRating: number; // 0-100
}

export type JawatanType =
  | "Perdana Menteri" // Prime Minister
  | "Timbalan Perdana Menteri" // Deputy PM
  | "Menteri Kewangan" // Finance Minister
  | "Menteri Pertahanan" // Defense Minister
  | "Menteri Dalam Negeri" // Home Minister
  | "Speaker Parlimen"; // Speaker of Parliament

export interface Election {
  id: string;
  regionId: string;
  type: "Pilihan Raya Umum" | "Pilihan Raya Negeri";
  status: "Dijadualkan" | "Berlangsung" | "Selesai";
  candidateIds: string[];
  startsAt: string;
  endsAt: string;
  seatsAvailable: number;
  votes: Record<string, number>; // candidateId -> vote count
}

export interface ParliamentSeat {
  id: string;
  regionId: string;
  holderPlayerId: string | null;
  partyId: string | null;
  termStartsAt: string;
  termEndsAt: string;
}

// --- EKONOMI & PERNIAGAAN (KILANG) --------------------------------------------

export type ProductionBuildingCategory = "Kilang" | "Ladang" | "Lombong" | "Kemudahan";

export interface ProductionBuilding {
  id: string;
  ownerId: string; // playerId, or null for state-owned
  regionId: string;
  category: ProductionBuildingCategory;
  type: ProductionBuildingType;
  level: number; // 1-10, upgrades raise output & cap
  isStateOwned: boolean;
  productionRatePerHour: number;
  storedGoods: number;
  storageCap: number;
  workersAssigned: number;
  workersCap: number;
  upkeepCostRMPerHour: number;
  lastCollectedAt: string;
  builtAt: string;
}

export type ProductionBuildingType =
  // Kilang (factories, refine raw -> manufactured goods)
  | "Kilang Tekstil"
  | "Kilang Elektronik"
  | "Kilang Automotif"
  | "Kilang Petrokimia"
  | "Kilang Simen"
  // Ladang (farms, produce raw agricultural goods)
  | "Ladang Padi"
  | "Ladang Kelapa Sawit"
  | "Ladang Getah"
  | "Ladang Ternakan"
  | "Kolam Ikan"
  // Lombong (mines/extraction)
  | "Lombong Bijih Timah"
  | "Telaga Minyak"
  | "Telaga Gas"
  | "Balak Hutan"
  // Kemudahan (state infrastructure/utility, boosts region, no goods output)
  | "Loji Kuasa"
  | "Pelabuhan"
  | "Lapangan Terbang";

export interface Good {
  type: ResourceType | ManufacturedGoodType;
  quantity: number;
}

export type ManufacturedGoodType =
  | "Tekstil"
  | "Elektronik"
  | "Kenderaan"
  | "Petrokimia"
  | "Simen";

export interface MarketListing {
  id: string;
  sellerId: string;
  regionId: string;
  goodType: ResourceType | ManufacturedGoodType;
  quantity: number;
  pricePerUnitRM: number;
  listedAt: string;
}

export interface MarketTransaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  goodType: string;
  quantity: number;
  totalPriceRM: number;
  transactedAt: string;
}

// --- KETENTERAAN & PERANG -----------------------------------------------------

export interface MilitaryUnitStack {
  id: string;
  ownerId: string;
  regionId: string;
  unitType: MilitaryUnitType;
  quantity: number;
  trainingStartedAt: string | null;
}

export type MilitaryUnitType =
  | "Infantri"
  | "Kereta Kebal" // tanks
  | "Artileri"
  | "Jet Pejuang" // fighter jets
  | "Kapal Perang"; // warships

export interface War {
  id: string;
  aggressorRegionId: string;
  defenderRegionId: string;
  status: "Diisytiharkan" | "Berlangsung" | "Tamat";
  declaredAt: string;
  endedAt: string | null;
  winnerRegionId: string | null;
}

export interface Battle {
  id: string;
  warId: string;
  regionId: string;
  seed: number; // deterministic PRNG seed (mulberry32)
  attackerStrength: number;
  defenderStrength: number;
  result: "Menang" | "Kalah" | "Seri" | null;
  occursAt: string;
  resolvedAt: string | null;
}

export interface Revolution {
  id: string;
  regionId: string;
  instigatorPlayerId: string;
  supportPercent: number; // 0-100, needs threshold to succeed
  status: "Berkumpul" | "Berlangsung" | "Berjaya" | "Gagal";
  startedAt: string;
  resolvesAt: string;
}
