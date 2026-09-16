export interface CountryScope {
  id: string;
  name: string;
  zone: 'SEA' | 'CHINA' | 'JAPAN' | 'LOCKED';
  isActive: boolean;
}

// Set kod ISO 2-huruf yang DIBENARKAN sahaja (SEA + China + Jepun)
export const ALLOWED_COUNTRY_CODES = new Set([
  // Asia Tenggara (SEA)
  'MY', // Malaysia
  'ID', // Indonesia
  'SG', // Singapura
  'TH', // Thailand
  'VN', // Vietnam
  'PH', // Filipina
  'BN', // Brunei
  'KH', // Kemboja
  'LA', // Laos
  'MM', // Myanmar
  'TL', // Timor-Leste

  // Asia Timur
  'CN', // China
  'JP', // Jepun
]);

// Konfigurasi penuh negara dunia untuk kegunaan peta & sistem sempadan
export const WORLD_COUNTRIES_CONFIG: Record<string, CountryScope> = {
  // === ASIA TENGGARA (SEA) - AKTIF ===
  MY: { id: 'MY', name: 'Malaysia', zone: 'SEA', isActive: true },
  ID: { id: 'ID', name: 'Indonesia', zone: 'SEA', isActive: true },
  SG: { id: 'SG', name: 'Singapore', zone: 'SEA', isActive: true },
  TH: { id: 'TH', name: 'Thailand', zone: 'SEA', isActive: true },
  VN: { id: 'VN', name: 'Vietnam', zone: 'SEA', isActive: true },
  PH: { id: 'PH', name: 'Philippines', zone: 'SEA', isActive: true },
  BN: { id: 'BN', name: 'Brunei', zone: 'SEA', isActive: true },
  KH: { id: 'KH', name: 'Cambodia', zone: 'SEA', isActive: true },
  LA: { id: 'LA', name: 'Laos', zone: 'SEA', isActive: true },
  MM: { id: 'MM', name: 'Myanmar', zone: 'SEA', isActive: true },
  TL: { id: 'TL', name: 'Timor-Leste', zone: 'SEA', isActive: true },

  // === ASIA TIMUR - AKTIF ===
  CN: { id: 'CN', name: 'China', zone: 'CHINA', isActive: true },
  JP: { id: 'JP', name: 'Japan', zone: 'JAPAN', isActive: true },

  // === RANTAU LAIN - DITUTUP (LOCKED) ===
  US: { id: 'US', name: 'United States', zone: 'LOCKED', isActive: false },
  GB: { id: 'GB', name: 'United Kingdom', zone: 'LOCKED', isActive: false },
  IN: { id: 'IN', name: 'India', zone: 'LOCKED', isActive: false },
  AU: { id: 'AU', name: 'Australia', zone: 'LOCKED', isActive: false },
  RU: { id: 'RU', name: 'Russia', zone: 'LOCKED', isActive: false },
  KR: { id: 'KR', name: 'South Korea', zone: 'LOCKED', isActive: false },
  DE: { id: 'DE', name: 'Germany', zone: 'LOCKED', isActive: false },
  FR: { id: 'FR', name: 'France', zone: 'LOCKED', isActive: false },
  CA: { id: 'CA', name: 'Canada', zone: 'LOCKED', isActive: false },
  BR: { id: 'BR', name: 'Brazil', zone: 'LOCKED', isActive: false },
};

export const isCountryActive = (countryCode: string): boolean => {
  const codeUpper = countryCode.toUpperCase();
  return ALLOWED_COUNTRY_CODES.has(codeUpper);
};