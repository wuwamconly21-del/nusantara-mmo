export type IdeologyType = 
  | 'Nasionalisme' 
  | 'Liberalisme' 
  | 'Konservatisme' 
  | 'Sosialisme' 
  | 'Komunisme' 
  | 'Anarkisme' 
  | 'Politik Hijau' 
  | 'Populisme' 
  | 'Teknokrasi' 
  | 'Fasisme' 
  | 'Monarkisme';

export type BillType =
  | 'UNDANG_UNDANG'
  | 'KEBENARAN_PERANG'
  | 'CUKAI'
  | 'BAJET'
  | 'PINDAH_BAJET'
  | 'PINDAH_SUMBER'
  | 'PINDAH_IBUKOTA'
  | 'TUKAR_IDEOLOGI'
  | 'SAIZ_PARLIMEN'
  | 'TUKAR_NAMA_BENDERA'
  | 'KEMERDEKAAN';

export interface ParliamentBill {
  id: string;
  type: BillType;
  title: string;
  author: string;
  justification: string;
  votesYes: number;
  votesNo: number;
  status: 'UNDI' | 'LULUS' | 'TOLAK' | 'VETO';
  targetRegion?: string;
  taxRate?: number;
}

export interface RegionDetail {
  code: string;
  name: string;
  nationName: string;
  isCapital: boolean;
  residentsCount: number;
  factoriesCount: number;
  partiesCount: number;
  treasury: number;
  educationIndex: number;
  militaryIndex: number;
  developmentIndex: number;
  healthIndex: number;
  taxes: { oil: number; ore: number; gold: number; uranium: number; diamond: number };
  borderRegions: { code: string; name: string; nationName: string }[];
}

export interface NationDetail {
  id: string;
  name: string;
  governmentType: 'Republik' | 'Monarkisme';
  isOpenBorder: boolean;
  citizensCount: number;
  treasury: number;
  factoriesCount: number;
  partiesCount: number;
  happinessPercent: number;
  leaderName: string;
  geopoliticalBlock: string;
  taxRates: { oil: number; ore: number; gold: number; uranium: number; diamond: number };
  regions: string[];
}