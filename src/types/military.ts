export type MilitaryUnitType =
  | 'INFANTRI'
  | 'KERETA_KEBAL'
  | 'DRON_SERANGAN'
  | 'JET_PEJUANG'
  | 'SUBMARINE'
  | 'STEALTH_BOMBER'
  | 'KAPAL_PERANG'
  | 'PELURU_BERPANDU';

export type WarType =
  | 'EVENT_WAR'
  | 'PERANG_ACARA'
  | 'REVOLUSI'
  | 'REVOLUTION'
  | 'KEMERDEKAAN'
  | 'INDEPENDENCE_WAR'
  | 'PENAKLUKAN'
  | 'CONQUEST_WAR';

export interface MilitaryUnitBlueprint {
  id: MilitaryUnitType;
  name: string;
  icon: string;
  imageUrl: string;
  power: number;
  reqSkillWar: number;
  reqSkillEng: number;
  trainingCost: {
    gold: number;
    resource: 'BERLIAN' | 'KULIT' | 'EMAS' | 'MINYAK' | 'MINYAK_DITAPIS' | 'NTE' | 'BAUKSIT' | 'KAYU_CENDANA' | 'KOPI' | 'GANDUM';
    amount: number;
  };
}

export const MILITARY_CATALOG: Record<MilitaryUnitType, MilitaryUnitBlueprint> = {
  INFANTRI: {
    id: 'INFANTRI',
    name: 'Infantri Darat Taktikal',
    icon: '🪖',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400',
    power: 120,
    reqSkillWar: 1,
    reqSkillEng: 1,
    trainingCost: { gold: 300, resource: 'GANDUM', amount: 8 },
  },
  KERETA_KEBAL: {
    id: 'KERETA_KEBAL',
    name: 'Kereta Kebal Zirah Utama',
    icon: '🛡️',
    imageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400',
    power: 1450,
    reqSkillWar: 10,
    reqSkillEng: 5,
    trainingCost: { gold: 1500, resource: 'BAUKSIT', amount: 12 },
  },
  DRON_SERANGAN: {
    id: 'DRON_SERANGAN',
    name: 'Dron Autonomi UAV',
    icon: '🛸',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400',
    power: 2800,
    reqSkillWar: 20,
    reqSkillEng: 15,
    trainingCost: { gold: 3500, resource: 'NTE', amount: 5 },
  },
  JET_PEJUANG: {
    id: 'JET_PEJUANG',
    name: 'Jet Pejuang Supersonik',
    icon: '✈️',
    imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400',
    power: 4500,
    reqSkillWar: 35,
    reqSkillEng: 25,
    trainingCost: { gold: 7500, resource: 'MINYAK_DITAPIS', amount: 8 },
  },
  SUBMARINE: {
    id: 'SUBMARINE',
    name: 'Kapal Selam Nuklear Stealth',
    icon: '🌊',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    power: 8800,
    reqSkillWar: 50,
    reqSkillEng: 40,
    trainingCost: { gold: 15000, resource: 'MINYAK_DITAPIS', amount: 15 },
  },
  STEALTH_BOMBER: {
    id: 'STEALTH_BOMBER',
    name: 'Pengebom Halimunan B-2',
    icon: '🦅',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400',
    power: 13500,
    reqSkillWar: 65,
    reqSkillEng: 55,
    trainingCost: { gold: 28000, resource: 'NTE', amount: 12 },
  },
  KAPAL_PERANG: {
    id: 'KAPAL_PERANG',
    name: 'Kapal Pengangkut Pesawat',
    icon: '⚓',
    imageUrl: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=400',
    power: 19000,
    reqSkillWar: 80,
    reqSkillEng: 70,
    trainingCost: { gold: 45000, resource: 'BAUKSIT', amount: 30 },
  },
  PELURU_BERPANDU: {
    id: 'PELURU_BERPANDU',
    name: 'Peluru Berpandu ICBM',
    icon: '🚀',
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400',
    power: 28000,
    reqSkillWar: 95,
    reqSkillEng: 85,
    trainingCost: { gold: 75000, resource: 'NTE', amount: 25 },
  },
};

export interface PlayerBarracks {
  level: number;
  maxCapacity: number;
  units: Record<MilitaryUnitType, number>;
  totalMilitaryPower: number;
}

export interface EventWarDetails {
  expMultiplier: number;
  totalPrizePoolGold: number;
  timeRemainingHours: number;
}

export interface WarParticipant {
  playerId: string;
  playerName: string;
  partyName: string;
  side: 'ATTACK' | 'DEFENSE';
  damageDealt: number;
}

export interface WarCampaign {
  id: string;
  title: string;
  regionName: string;
  warCategory: WarType;
  warType?: WarType;
  attackerName: string;
  defenderName: string;
  attackerTotalDamage: number;
  defenderTotalDamage: number;
  endTime?: number;
  timeRemaining?: string;
  status?: 'AKTIF' | 'TAMAT';
  participants?: WarParticipant[];
  eventDetails?: EventWarDetails;
}

export interface CustomWarCampaign extends WarCampaign {}