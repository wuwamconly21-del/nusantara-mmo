export type IdeologiParti = 
  | 'MONARKISME' 
  | 'KONSERVATISME' 
  | 'DEMOKRASI_SOSIAL' 
  | 'SOSIALISME' 
  | 'NASIONALISME' 
  | 'LIBERALISME'
  | 'DIRAJA'
  | 'KAPITALIS'
  | 'MILITER'
  | 'DEMOKRAT';

export type JawatanParti = 
  | 'PRESIDEN' 
  | 'TIMBALAN_PRESIDEN' 
  | 'SETIAUSAHA_AGUNG' 
  | 'BENDAHARI' 
  | 'KETUA_PEMUDA' 
  | 'AHLI_BIASA';

export interface AhliParti {
  playerId: string;
  playerName: string;
  level: number;
  jawatan: JawatanParti;
  tarikhSertai: number;
  jumlahSumbanganEmas: number;
}

export interface PermohonanParti {
  playerId: string;
  playerName: string;
  level: number;
  tarikhMohon: number;
}

export interface DetailedParty {
  id: string;
  name: string;
  tag: string;
  bannerColor: string;
  ideologi: IdeologiParti;
  isOpen: boolean;
  leaderId: string;
  leaderName: string;
  manifesto: string;
  treasuryGold: number;
  members: AhliParti[];
  applications: PermohonanParti[];
  totalVotesPRN: number;
  establishedDate: number;
}