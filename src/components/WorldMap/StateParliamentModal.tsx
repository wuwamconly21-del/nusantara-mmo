import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ElectionCycleState, StateGovernment } from '../../types/politics';
import { ElectionEngine } from '../../services/ElectionEngine';

interface StateParliamentModalProps {
  government: StateGovernment;
  cycle: ElectionCycleState;
  currentPlayerId: string;
  currentPlayerName: string;
  onUpdateState: (gov: StateGovernment, cycle: ElectionCycleState) => void;
  onClose: () => void;
}

export function StateParliamentModal({
  government,
  cycle,
  currentPlayerId,
  currentPlayerName,
  onUpdateState,
  onClose,
}: StateParliamentModalProps) {
  const [partyNameInput, setPartyNameInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [bannerColor, setBannerColor] = useState('#F59E0B');
  const [feedback, setFeedback] = useState<string | null>(null);

  const phaseText = {
    GOVERNING: 'Sidang Parlimen Aktif (Pemerintahan Berjalan)',
    DISSOLVED: 'Parlimen Dibubar (Kempen & Pendaftaran Calon)',
    ELECTION_DAY: 'Hari Pengundian PRN (Hari Ahad)',
  }[cycle.phase];

  const handleRegister = () => {
    if (!partyNameInput.trim() || !tagInput.trim()) {
      setFeedback('Sila masukkan nama dan akronim parti.');
      return;
    }

    const res = ElectionEngine.registerParty(cycle, {
      partyId: `PTY_${Date.now()}`,
      partyName: partyNameInput,
      partyTag: tagInput.toUpperCase(),
      leaderId: currentPlayerId,
      leaderName: currentPlayerName,
      bannerColor,
      manifesto: 'Membangunkan ekonomi wilayah dan logistik maritim.',
    });

    setFeedback(res.message);
    if (res.success && res.updatedCycle) {
      onUpdateState(government, res.updatedCycle);
      setPartyNameInput('');
      setTagInput('');
    }
  };

  const handleVote = (partyId: string) => {
    const res = ElectionEngine.castVote(cycle, currentPlayerId, partyId);
    setFeedback(res.message);
    if (res.success && res.updatedCycle) {
      onUpdateState(government, res.updatedCycle);
    }
  };

  const handleManualResolve = () => {
    const { newGov, resetCycle } = ElectionEngine.resolveElection(cycle, government);
    onUpdateState(newGov, resetCycle);
    setFeedback(`Pengiraan selesai! Kerajaan Negeri kini dipimpin oleh ${newGov.rulingPartyName}.`);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        <View style={styles.header}>
          <Text style={styles.stateTitle}>DEWAN NEGERI: {government.stateName}</Text>
          <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
        </View>

        <View style={styles.badgeRow}>
          <Text style={[styles.phaseBadge, { borderColor: cycle.phase === 'ELECTION_DAY' ? '#10B981' : '#F59E0B' }]}>
            STATUS: {phaseText}
          </Text>
          <Text style={styles.termBadge}>PENGGAL KE-{cycle.currentTerm}</Text>
        </View>

        {feedback && <Text style={styles.feedbackText}>{feedback}</Text>}

        <ScrollView style={styles.contentScroll}>
          {/* Status Kerajaan Semasa */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>KERAJAAN NEGERI SEMASA</Text>
            <Text style={styles.cardDetail}>Parti Memerintah: <Text style={{ color: government.themeColor, fontWeight: 'bold' }}>{government.rulingPartyName}</Text></Text>
            <Text style={styles.cardDetail}>Ketua Pentadbir: <Text style={styles.whiteText}>{government.rulingLeaderName}</Text></Text>
            <Text style={styles.cardDetail}>Kadar Cukai Wilayah: <Text style={styles.goldText}>{government.taxRatePercent}%</Text></Text>
          </View>

          {/* Senarai Calon Bertanding */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>CALON PARTI BERTANDING ({cycle.parties.length})</Text>
            {cycle.parties.length === 0 ? (
              <Text style={styles.mutedText}>Belum ada parti mendaftar untuk penggal ini.</Text>
            ) : (
              cycle.parties.map((party) => (
                <View key={party.partyId} style={styles.partyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.partyName, { color: party.bannerColor }]}>[{party.partyTag}] {party.partyName}</Text>
                    <Text style={styles.partySub}>Ketua: {party.leaderName} • Jumlah Undi: {party.totalVotes}</Text>
                  </View>
                  {cycle.phase === 'ELECTION_DAY' && (
                    <TouchableOpacity style={styles.voteBtn} onPress={() => handleVote(party.partyId)}>
                      <Text style={styles.btnText}>UNDI</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>

          {/* Bahagian Daftar Parti (Buka bila Parlimen Bubar) */}
          {cycle.phase === 'DISSOLVED' && (
            <View style={styles.card}>
              <Text style={styles.cardHeader}>DAFTARKAN PARTI ANDA</Text>
              <TextInput
                style={styles.input}
                placeholder="Nama Penuh Parti..."
                placeholderTextColor="#64748B"
                value={partyNameInput}
                onChangeText={setPartyNameInput}
              />
              <TextInput
                style={styles.input}
                placeholder="Akronim / Tag (cth: TAKHTA, WARISAN)..."
                placeholderTextColor="#64748B"
                value={tagInput}
                onChangeText={setTagInput}
              />
              <View style={styles.colorSelectRow}>
                <Text style={styles.cardDetail}>Warna Panji Peta:</Text>
                {['#F59E0B', '#1E3A8A', '#065F46', '#DC2626', '#7C2D12'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.colorBox, { backgroundColor: c, borderWidth: bannerColor === c ? 2 : 0 }]}
                    onPress={() => setBannerColor(c)}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.submitBtn} onPress={handleRegister}>
                <Text style={styles.submitBtnText}>HANTAR PENDAFTARAN CALON</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Panel Kawalan Pentadbir/Ujian */}
        <View style={styles.footerAdmin}>
          <TouchableOpacity style={styles.adminActionBtn} onPress={handleManualResolve}>
            <Text style={styles.adminActionText}>⚙ TUTUP PETI & KIRA UNDI (ADMIN)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 10, 18, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalBox: {
    width: '90%',
    maxWidth: 520,
    maxHeight: '85%',
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#D97706',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 10,
  },
  stateTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },
  closeBtn: { color: '#94A3B8', fontSize: 18, fontWeight: 'bold' },
  badgeRow: { flexDirection: 'row', gap: 8, marginVertical: 10 },
  phaseBadge: { color: '#F8FAFC', fontSize: 10, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  termBadge: { color: '#94A3B8', fontSize: 10, borderWidth: 1, borderColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  feedbackText: { color: '#38BDF8', fontSize: 11, marginBottom: 8, textAlign: 'center' },
  contentScroll: { marginVertical: 6 },
  card: { backgroundColor: '#162032', padding: 12, borderRadius: 6, marginBottom: 10, borderWidth: 1, borderColor: '#1E293B' },
  cardHeader: { color: '#F59E0B', fontSize: 11, fontWeight: 'bold', marginBottom: 6, letterSpacing: 0.5 },
  cardDetail: { color: '#94A3B8', fontSize: 12, marginBottom: 4 },
  whiteText: { color: '#F8FAFC', fontWeight: 'bold' },
  goldText: { color: '#FBBF24', fontWeight: 'bold' },
  mutedText: { color: '#64748B', fontSize: 11, fontStyle: 'italic' },
  partyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  partyName: { fontSize: 13, fontWeight: 'bold' },
  partySub: { color: '#64748B', fontSize: 10, marginTop: 2 },
  voteBtn: { backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  btnText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  input: { backgroundColor: '#0B121D', borderWidth: 1, borderColor: '#334155', borderRadius: 4, color: '#F8FAFC', paddingHorizontal: 10, height: 36, fontSize: 12, marginBottom: 8 },
  colorSelectRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6 },
  colorBox: { width: 22, height: 22, borderRadius: 4, borderColor: '#FFFFFF' },
  submitBtn: { backgroundColor: '#D97706', paddingVertical: 8, borderRadius: 4, alignItems: 'center', marginTop: 6 },
  submitBtnText: { color: '#0B121D', fontSize: 11, fontWeight: 'bold' },
  footerAdmin: { borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 10, marginTop: 6 },
  adminActionBtn: { backgroundColor: '#1E293B', paddingVertical: 6, borderRadius: 4, alignItems: 'center' },
  adminActionText: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
});