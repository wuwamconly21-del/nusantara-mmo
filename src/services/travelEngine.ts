export type TransportMode = 'CAR' | 'TRAIN' | 'FLIGHT' | 'SHIP';

export interface TravelOption {
  mode: TransportMode;
  name: string;
  icon: string;
  durationMinutes: number;
  ticketCost: number;
  tourismTax: number;
}

export interface TravelSession {
  originCode: string;
  originName?: string;
  originCountry?: string;
  targetCode: string;
  targetName: string;
  targetCountry: string;
  mode: TransportMode;
  startTime: number;
  arrivalTime: number;
  totalCost: number;
  isReturning?: boolean; // Penanda jika sedang berpatah balik
}

export function calculateTravelOptions(
  originCountry: string,
  targetCountry: string,
  isCrossBorder: boolean
): TravelOption[] {
  const isSameCountry = originCountry === targetCountry;
  const baseTourismTax = isSameCountry ? 50 : 250;

  const options: TravelOption[] = [];

  if (isSameCountry) {
    options.push({
      mode: 'CAR',
      name: 'Pemanduan Darat (Kenderaan)',
      icon: '🚗',
      durationMinutes: 4,
      ticketCost: 30,
      tourismTax: baseTourismTax,
    });
    options.push({
      mode: 'TRAIN',
      name: 'Kereta Api Laju (HSR)',
      icon: '🚆',
      durationMinutes: 2,
      ticketCost: 80,
      tourismTax: baseTourismTax,
    });
    options.push({
      mode: 'FLIGHT',
      name: 'Penerbangan Domestik Ekspres',
      icon: '✈️',
      durationMinutes: 1,
      ticketCost: 200,
      tourismTax: baseTourismTax,
    });
  } else {
    options.push({
      mode: 'FLIGHT',
      name: 'Penerbangan Antarabangsa',
      icon: '✈️',
      durationMinutes: 15,
      ticketCost: 750,
      tourismTax: baseTourismTax,
    });
    options.push({
      mode: 'SHIP',
      name: 'Kapal Laut / Feri Inter-Sempadan',
      icon: '🛳️',
      durationMinutes: 8,
      ticketCost: 300,
      tourismTax: baseTourismTax,
    });
  }

  return options;
}

// Logik Batal Perjalanan & Berpatah Balik mengikut Masa Terkumpul
export function cancelTravelSession(session: TravelSession): TravelSession {
  const now = Date.now();
  const elapsedTime = Math.max(now - session.startTime, 0); // Masa yang sudah dilalui

  return {
    ...session,
    originCode: session.targetCode,
    targetCode: session.originCode,
    targetName: session.originName || 'Pangkalan Asal',
    targetCountry: session.originCountry || 'Malaysia',
    startTime: now,
    arrivalTime: now + elapsedTime, // Masa berpatah balik = Masa yang telah dilalui
    isReturning: true,
  };
}

export function isPlayerInTransit(session: TravelSession | null): boolean {
  if (!session) return false;
  return Date.now() < session.arrivalTime;
}