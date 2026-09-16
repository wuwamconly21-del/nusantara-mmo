export interface TravelRoute {
    id: string;
    fromRegion: string;
    toRegion: string;
    durationMinutes: number; // Mengikut IRL Time (cth: 50 minit)
    ticketCostRM: number;
    requiresVisa: boolean;
  }
  
  export interface ActiveFlight {
    flightId: string;
    fromRegion: string;
    toRegion: string;
    departureTime: number; // epoch ms
    arrivalTime: number;   // epoch ms
  }
  
  // Kiraan masa penerbangan anggaran rantau Nusantara
  export function calculateFlightTime(fromRegion: string, toRegion: string): number {
    if (fromRegion === toRegion) return 0;
    
    const isFromMY = fromRegion.startsWith('MY');
    const isToMY = toRegion.startsWith('MY');
  
    // Domestik Malaysia
    if (isFromMY && isToMY) {
      return 15; // 15 Minit Sebenar
    }
  
    // Antarabangsa Antara Negara (cth: Indonesia/Filipina ke Malaysia)
    return 55; // 55 Minit Sebenar
  }
  
  // Anggaran kos tiket penerbangan
  export function calculateTicketPrice(durationMinutes: number): number {
    return durationMinutes * 15; // RM15 setiap minit penerbangan
  }