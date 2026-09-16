// ============================================================================
// POLITIK & PARLIMEN — parties, the 6 jawatan (positions), elections & seats.
// ============================================================================

import type { Election, JawatanType, Party, ParliamentSeat, Player } from "../types/game";

export const JAWATAN_LIST: JawatanType[] = [
  "Perdana Menteri",
  "Timbalan Perdana Menteri",
  "Menteri Kewangan",
  "Menteri Pertahanan",
  "Menteri Dalam Negeri",
  "Speaker Parlimen",
];

// --- PARTIES -------------------------------------------------------------------

export function createParty(params: {
  name: string;
  abbreviation: string;
  ideology: string;
  leaderId: string;
}): Party {
  return {
    id: crypto.randomUUID(),
    name: params.name,
    abbreviation: params.abbreviation,
    ideology: params.ideology,
    leaderId: params.leaderId,
    memberIds: [params.leaderId],
    foundedAt: new Date().toISOString(),
    treasuryRM: 0,
    approvalRating: 50,
  };
}

export function joinParty(party: Party, playerId: string): Party {
  if (party.memberIds.includes(playerId)) return party;
  return { ...party, memberIds: [...party.memberIds, playerId] };
}

export function leaveParty(party: Party, playerId: string): Party {
  return { ...party, memberIds: party.memberIds.filter((id) => id !== playerId) };
}

/** Only the party leader or a player already holding a jawatan in the same
 *  region's government may make appointments — enforce that at the call site
 *  using players[].jawatanId / party.leaderId before calling this. */
export function assignJawatan(
  player: Player,
  jawatan: JawatanType
): Pick<Player, "jawatanId"> {
  return { jawatanId: jawatan };
}

export function revokeJawatan(): Pick<Player, "jawatanId"> {
  return { jawatanId: null };
}

// --- ELECTIONS -------------------------------------------------------------------

export function scheduleElection(params: {
  regionId: string;
  type: Election["type"];
  seatsAvailable: number;
  startsAt: Date;
  durationHours: number;
}): Election {
  const endsAt = new Date(params.startsAt.getTime() + params.durationHours * 3_600_000);
  return {
    id: crypto.randomUUID(),
    regionId: params.regionId,
    type: params.type,
    status: "Dijadualkan",
    candidateIds: [],
    startsAt: params.startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    seatsAvailable: params.seatsAvailable,
    votes: {},
  };
}

export function registerCandidate(election: Election, playerId: string): Election {
  if (election.status !== "Dijadualkan" && election.status !== "Berlangsung") {
    throw new Error("Pendaftaran calon sudah ditutup.");
  }
  if (election.candidateIds.includes(playerId)) return election;
  return { ...election, candidateIds: [...election.candidateIds, playerId] };
}

export function castVote(election: Election, candidateId: string): Election {
  if (election.status !== "Berlangsung") {
    throw new Error("Pengundian belum/tidak lagi berlangsung.");
  }
  if (!election.candidateIds.includes(candidateId)) {
    throw new Error("Calon tidak sah.");
  }
  return {
    ...election,
    votes: { ...election.votes, [candidateId]: (election.votes[candidateId] ?? 0) + 1 },
  };
}

/** D'Hondt-style seat allocation across the top vote-getters. Returns
 *  candidateId -> seats won, summing to election.seatsAvailable. */
export function tallyElection(election: Election): Record<string, number> {
  const results: Record<string, number> = {};
  for (const id of election.candidateIds) results[id] = 0;

  const quotients: { candidateId: string; value: number }[] = [];
  for (let round = 1; round <= election.seatsAvailable; round++) {
    for (const candidateId of election.candidateIds) {
      const votes = election.votes[candidateId] ?? 0;
      quotients.push({ candidateId, value: votes / round });
    }
  }
  quotients.sort((a, b) => b.value - a.value);

  let seatsLeft = election.seatsAvailable;
  const seen = new Set<string>();
  for (const q of quotients) {
    if (seatsLeft <= 0) break;
    const key = `${q.candidateId}:${q.value}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results[q.candidateId] = (results[q.candidateId] ?? 0) + 1;
    seatsLeft--;
  }
  return results;
}

export function closeElection(election: Election): Election {
  return { ...election, status: "Selesai" };
}

export function assignParliamentSeats(
  election: Election,
  seatResults: Record<string, number>,
  playerPartyMap: Record<string, string | null>
): ParliamentSeat[] {
  const seats: ParliamentSeat[] = [];
  const termStart = new Date();
  const termEnd = new Date(termStart.getTime() + 90 * 24 * 3_600_000); // 90-day term

  for (const [candidateId, seatCount] of Object.entries(seatResults)) {
    for (let i = 0; i < seatCount; i++) {
      seats.push({
        id: crypto.randomUUID(),
        regionId: election.regionId,
        holderPlayerId: candidateId,
        partyId: playerPartyMap[candidateId] ?? null,
        termStartsAt: termStart.toISOString(),
        termEndsAt: termEnd.toISOString(),
      });
    }
  }
  return seats;
}
