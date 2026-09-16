export type PoliticalPhase = 'GOVERNING' | 'DISSOLVED' | 'ELECTION_DAY';

export type RegimeType = 
  | 'DEMOKRASI_PARLIMEN' 
  | 'MONARKI_BERPERLEMBAGAAN' 
  | 'MONARKI_MUTLAK' 
  | 'DIKTATOR_AUTOKRASI' 
  | 'JUNTA_TENTERA';

export type BillType = 
  | 'BAJET_PERSEKUTUAN'
  | 'PEMINDAHAN_WILAYAH'
  | 'PEMINDAHAN_BAJET'
  | 'PEMINDAHAN_SUMBER'
  | 'IKATAN_ALLIANCE'
  | 'KEMERDEKAAN_WILAYAH'
  | 'TUBUH_KERAJAAN_NEGERI'
  | 'PENAKLUKAN_PERANG'
  | 'BELI_WILAYAH'
  | 'SUBSIDI_KORPORAT'
  | 'KADAR_FAEDAH_BANK'
  | 'CETAK_WANG_FIAT'
  | 'TARIF_EKSPORT_KILANG'
  | 'TUKAR_REJIM'
  | 'UBAH_KAPASITI_KERUSI';

export interface ParliamentBill {
  id: string;
  type: BillType;
  title: string;
  description: string;
  proposedBy: string;
  targetValue: any;
  votesYes: number;
  votesNo: number;
  totalVoters: string[];
  status: 'VOTING' | 'PASSED' | 'REJECTED' | 'VETOED';
  createdAt: number;
  expiresAt: number;
  isProtected24H: boolean;
}

export interface CandidateParty {
  partyId: string;
  partyName: string;
  partyTag: string;
  leaderId: string;
  leaderName: string;
  bannerColor: string;
  manifesto: string;
  totalVotes: number;
  memberCount: number;
  treasuryGold: number;
  ideology: 'NASIONALIS' | 'KAPITALIS' | 'MILITER' | 'DEMOKRAT' | 'SOSIALIS' | 'DIRAJA';
  isDynasty?: boolean;
}

export type ResourceId = 
  | 'BERLIAN'
  | 'KULIT'
  | 'EMAS'
  | 'MINYAK'
  | 'MINYAK_DITAPIS'
  | 'NTE'
  | 'BAUKSIT'
  | 'KAYU_CENDANA'
  | 'KOPI'
  | 'GANDUM';

export type PlayerWarehouse = Record<ResourceId, number>;

export interface FactoryBlueprint {
  id: string;
  name: string;
  icon: string;
  resourceId: ResourceId;
  category: string;
  buildCostRM: number;
  baseOutput: number;
  outputName: string;
  desc: string;
  minDevLevel: number;
}

export interface AdvancedFactoryData {
  id: string;
  name: string;
  factoryType: string;
  resourceId: ResourceId;
  level: number;
  ownerId: string;
  ownerName: string;
  regionId: string;
  regionName: string;
  stateName: string;
  wageType: 'PERCENTAGE' | 'FIXED';
  wageRate: number;
  treasury: number;
  workerCount: number;
  maxWorkers: number;
  stock: number;
  isWorkingHere: boolean;
  isGlobalFeatured?: boolean;
}

export interface StateGovernment {
  stateCode: string;
  stateName: string;
  regimeType: RegimeType;
  totalSeats: number;
  rulingPartyId: string | null;
  rulingPartyName: string;
  rulingLeaderId: string;
  rulingLeaderName: string;
  rulingLeaderTitle: string;
  themeColor: string;
  treasuryGold: number;
  taxRatePercent: number;
  isEstablished: boolean;
  populationCount: number;
  resources: Record<ResourceId, number>;
  activeBills: ParliamentBill[];
  controlledTerritories: string[];
}

export interface ElectionCycleState {
  stateCode: string;
  phase: PoliticalPhase;
  currentTerm: number;
  parties: CandidateParty[];
  voterLedger: Record<string, string>;
  nextDissolutionDate: string;
  nextElectionDate: string;
  isEmergency24HElection?: boolean;
}

export interface PlayerCorporation {
  id: string;
  name: string;
  tag: string;
  ceoId: string;
  ceoName: string;
  treasury: number;
  totalShares: number;
  sharePrice: number;
  lastDividendPerShare: number;
  factoriesOwnedCount: number;
  shareholders: { playerId: string; sharesOwned: number }[];
}

export interface BankAccount {
  playerId: string;
  depositBalance: number;
  loanBalance: number;
  interestRate: number;
}