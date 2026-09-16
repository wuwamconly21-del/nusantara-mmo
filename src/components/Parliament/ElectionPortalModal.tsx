import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { ElectionSession, PartyCandidate, isElectionActive } from '../../services/ElectionEngine';

interface ElectionPortalModalProps {
  visible: boolean;
  userPartyId?: string;
  userVotedCandidateId?: string;
  election: ElectionSession;
  onCastVote: (candidateId: string) => void;
  onClose: () => void;
}

export function ElectionPortalModal({
  visible,
  userVotedCandidateId,
  election,
  onCastVote,
  onClose,
}: ElectionPortalModalProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(userVotedCandidateId || null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = election.endTime - now;

      if (remaining <= 0) {
        setTimeLeft('PENGUNDIAN TAMAT - PROSES PELANTIKAN DIRAJA');
        clearInterval(timer);
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}j ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [election]);

  if (!visible) return null;

  const handleVoteSubmit = () => {
    if (!selectedCandidate) return;
    onCastVote(selectedCandidate);
    const msg = 'Undi anda telah selamat dimasukkan ke dalam Peti Undi Persekutuan!';
    if (Platform.OS === 'web') alert(msg); else Alert.alert('Undi Diterima', msg);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>🗳️ SURUHANJAYA PILIHAN RAYA ({election.type})</Text>
          <TouchableOpacity onPress={onClose}><Text style={styles.closeTxt}>✕</Text></TouchableOpacity>
        </View>

        {/* PEMASA 24 JAM */}
        <View style={styles.timerBadge}>
          <Text style={styles.timerTitle}>MASA BERBAKI PENGUNDIAN (24 JAM):</Text>
          <Text style={styles.timerCountdown}>{timeLeft}</Text>
        </View>

        <Text style={styles.secLabel}>SENARAI CALON PARTI POLITIK BERBERTANDING:</Text>

        {/* SENARAI CALON DARI PARTI-PARTI */}
        <ScrollView style={styles.candidateList}>
          {election.candidates.map((cand) => {
            const isSelected = selectedCandidate === cand.candidateId;
            return (
              <TouchableOpacity
                key={cand.id}
                style={[styles.candidateCard, isSelected && styles.candidateCardSelected]}
                onPress={() => setSelectedCandidate(cand.candidateId)}
                disabled={!!userVotedCandidateId}
              >
                <View style={styles.partyIconBox}>
                  <Text style={{ fontSize: 18 }}>🏛️</Text>
                </View>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.candName}>{cand.candidateName}</Text>
                  <Text style={styles.partyTag}>PARTI: <Text style={{ color: '#FBBF24' }}>{cand.partyName}</Text></Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.voteCount}>{cand.votesCount} UNDI</Text>
                  {userVotedCandidateId === cand.candidateId && (
                    <Text style={styles.votedBadge}>✓ UNDIAN ANDA</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* BUTANG UNDI */}
        {!userVotedCandidateId ? (
          <TouchableOpacity
            style={[styles.btnVote, !selectedCandidate && { opacity: 0.5 }]}
            onPress={handleVoteSubmit}
            disabled={!selectedCandidate}
          >
            <Text style={styles.btnVoteTxt}>BUANG UNDI RASMI ➔</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.votedNotice}>
            <Text style={styles.votedNoticeTxt}>
              ✅ Anda telah mengundi. Pelantikan calon pemenang ke Parlimen akan diumumkan esok selepas tempoh 24 jam tamat!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(5, 8, 15, 0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 140 },
  modalBox: { width: 460, maxHeight: '85%', backgroundColor: '#0F172A', borderWidth: 1.5, borderColor: '#D97706', borderRadius: 8, padding: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { color: '#F59E0B', fontSize: 12, fontWeight: 'bold' },
  closeTxt: { color: '#94A3B8', fontSize: 16, fontWeight: 'bold' },
  timerBadge: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#D97706', padding: 10, borderRadius: 6, alignItems: 'center', marginBottom: 12 },
  timerTitle: { color: '#94A3B8', fontSize: 8, fontWeight: 'bold' },
  timerCountdown: { color: '#EF4444', fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 2 },
  secLabel: { color: '#64748B', fontSize: 9, fontWeight: 'bold', marginBottom: 8 },
  candidateList: { maxHeight: 220, marginBottom: 12 },
  candidateCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#182234', borderWidth: 1, borderColor: '#334155', padding: 10, borderRadius: 6, marginBottom: 8 },
  candidateCardSelected: { borderColor: '#F59E0B', backgroundColor: '#2E2315' },
  partyIconBox: { width: 36, height: 36, backgroundColor: '#0F172A', borderRadius: 4, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#475569' },
  candName: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold' },
  partyTag: { color: '#94A3B8', fontSize: 9, marginTop: 2 },
  voteCount: { color: '#38BDF8', fontSize: 12, fontWeight: 'bold' },
  votedBadge: { color: '#10B981', fontSize: 8, fontWeight: 'bold', marginTop: 2 },
  btnVote: { backgroundColor: '#D97706', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  btnVoteTxt: { color: '#0F172A', fontSize: 11, fontWeight: 'bold' },
  votedNotice: { backgroundColor: '#064E3B', borderWidth: 1, borderColor: '#10B981', padding: 10, borderRadius: 6, alignItems: 'center' },
  votedNoticeTxt: { color: '#A7F3D0', fontSize: 9, textAlign: 'center' },
});