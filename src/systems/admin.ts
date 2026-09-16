export type PlayerRole = 'citizen' | 'monarch_admin';

export interface PlayerRecord {
  id: string;
  username: string;
  role: PlayerRole;
  isBanned: boolean;
  isMuted: boolean;
  muteExpiresAt?: string | null;
  nationId?: string | null;
}

export interface MonarchyFaction {
  id: string;
  name: string;
  rulerId: string;
  rulerTitle: string;
  capitalRegion: string;
  isOpenForJoin: false; // Strictly locked to everyone else
  decrees: string[];
}

export const PUTRAJAYA_MONARCHY: MonarchyFaction = {
  id: 'takhta-putrajaya',
  name: 'Takhta Diraja Putrajaya',
  rulerId: 'admin-001',
  rulerTitle: 'Duli Yang Maha Mulia Pemilik Daulat',
  capitalRegion: 'MY-16',
  isOpenForJoin: false,
  decrees: [
    'Semua wilayah Nusantara terbuka untuk pengasasan kuasa bebas.',
    'Putrajaya kekal wilayah berdaulat mutlak pentadbiran Diraja.',
    'Cukai perang tidak berkuat kuasa di zon Putrajaya.',
  ],
};