export type ElectionPhase = 'NOMINATION' | 'VOTING_ACTIVE' | 'COMPLETED';
export type ElectionType = 'PRU' | 'PRN';

export interface PartyCandidate {
  id: string;
  candidateId: string;
  candidateName: string;
  partyId: string;
  partyName: string;
  partyLogo?: string;
  targetRegionCode: string;
  votesCount: number;
}

export interface ElectionSession {
  id: string;
  type: ElectionType;
  title: string;
  regionCode?: string;
  startTime: number;
  endTime: number;
  status: ElectionPhase;
  candidates: PartyCandidate[];
  winningCandidateId?: string;
}

export interface ElectionCycleState {
  stateCode: string;
  phase: ElectionPhase;
  currentTerm: number;
  parties: { partyId: string; votes: number }[];
}

export class ElectionEngineService {
  private static instance: ElectionEngineService;

  public getCurrentPhase(): ElectionPhase {
    return 'VOTING_ACTIVE';
  }

  public isElectionActive(session: ElectionSession): boolean {
    const now = Date.now();
    return session.status === 'VOTING_ACTIVE' && now < session.endTime;
  }

  public finalizeElectionResults(session: ElectionSession): ElectionSession {
    if (!session.candidates || session.candidates.length === 0) {
      return { ...session, status: 'COMPLETED' };
    }

    const sorted = [...session.candidates].sort((a, b) => b.votesCount - a.votesCount);
    const winner = sorted[0];

    return {
      ...session,
      status: 'COMPLETED',
      winningCandidateId: winner?.candidateId,
    };
  }

  public calculateRemainingTime(endTime: number): string {
    const now = Date.now();
    const remaining = endTime - now;

    if (remaining <= 0) {
      return 'PENGUNDIAN TAMAT';
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return `${hours}j ${minutes}m ${seconds}s`;
  }

  public createDefaultSession(type: ElectionType, title: string, regionCode?: string): ElectionSession {
    const startTime = Date.now();
    const endTime = startTime + 86400000; // 24 Jam Tempoh Undian

    return {
      id: `election-${Math.random().toString(36).substring(7)}`,
      type,
      title,
      regionCode,
      startTime,
      endTime,
      status: 'VOTING_ACTIVE',
      candidates: [
        {
          id: 'c-1',
          candidateId: 'player-maha-1',
          candidateName: 'Wan Nur Luqman',
          partyId: 'party-1',
          partyName: 'House Of Mahawangsa',
          targetRegionCode: regionCode || 'Putrajaya_MY',
          votesCount: 154,
        },
        {
          id: 'c-2',
          candidateId: 'player-luriax-2',
          candidateName: 'Sir Luriax',
          partyId: 'party-2',
          partyName: 'Parti Muafakat Rakyat',
          targetRegionCode: regionCode || 'Selangor_MY',
          votesCount: 112,
        },
      ],
    };
  }
}

// Eksport Instance Tunggal serta fungsi pembantu bagi mengelakkan ralat undefined
export const ElectionEngine = new ElectionEngineService();

export function getCurrentPhase(): ElectionPhase {
  return ElectionEngine.getCurrentPhase();
}

export function isElectionActive(session: ElectionSession): boolean {
  return ElectionEngine.isElectionActive(session);
}

export function finalizeElectionResults(session: ElectionSession): ElectionSession {
  return ElectionEngine.finalizeElectionResults(session);
}

export default ElectionEngine;