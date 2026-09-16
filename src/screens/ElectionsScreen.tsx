import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { ChevronLeft, Vote, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { ElectionCycleState, PartyVoteShare } from '../types/politics';

interface ElectionsScreenProps {
  electionState?: ElectionCycleState;
  userPartyId?: string | null;
  onCastVote?: (partyId: string) => void;
  onBack: () => void;
}

export const ElectionsScreen: React.FC<ElectionsScreenProps> = ({
  electionState,
  userPartyId,
  onCastVote,
  onBack,
}) => {
  const [subTab, setSubTab] = useState<'PRESIDEN' | 'PARLIMEN'>('PRESIDEN');
  const [modalVoteOpen, setModalVoteOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Ambil parti dinamik daripada state pilihan raya / ElectionEngine
  const partyList: PartyVoteShare[] = electionState?.parties || [];

  const handleVote = (partyId: string) => {
    setHasVoted(true);
    if (onCastVote) onCastVote(partyId);
  };

  return (
    <View style={styles.container}>
      {/* HEADER TOP NAV */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={16} color="#F3CE65" />
          <Text style={styles.backBtnTxt}>KEMBALI</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>PILIHAN RAYA (PRU / PRN)</Text>
      </View>

      {/* SUB TABS */}
      <View style={styles.tabHeaderRow}>
        <TouchableOpacity
          style={[styles.tabBtn, subTab === 'PRESIDEN' && styles.tabBtnActive]}
          onPress={() => setSubTab('PRESIDEN')}
        >
          <Text style={[styles.tabBtnTxt, subTab === 'PRESIDEN' && styles.tabBtnTxtActive]}>
            PRESIDEN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, subTab === 'PARLIMEN' && styles.tabBtnActive]}
          onPress={() => setSubTab('PARLIMEN')}
        >
          <Text style={[styles.tabBtnTxt, subTab === 'PARLIMEN' && styles.tabBtnTxtActive]}>
            PARLIMEN
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14 }}>
        {subTab === 'PRESIDEN' ? (
          <View>
            <View style={styles.cardBox}>
              <View style={styles.rowBetween}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Clock size={16} color="#F59E0B" />
                  <Text style={styles.goldTitle}>SEBELUM PILIHAN RAYA SETERUSNYA</Text>
                </View>
                <TouchableOpacity style={styles.btnVoteTrigger} onPress={() => setModalVoteOpen(true)}>
                  <Vote size={14} color="#07060A" />
                  <Text style={styles.btnVoteTriggerTxt}>UNDI CALON PARTI</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timerGrid}>
                <View style={styles.timerBox}><Text style={styles.timerNum}>00</Text><Text style={styles.timerSub}>HARI</Text></View>
                <View style={styles.timerBox}><Text style={styles.timerNum}>00</Text><Text style={styles.timerSub}>JAM</Text></View>
                <View style={styles.timerBox}><Text style={styles.timerNum}>00</Text><Text style={styles.timerSub}>MIN</Text></View>
                <View style={styles.timerBox}><Text style={styles.timerNum}>00</Text><Text style={styles.timerSub}>SAAT</Text></View>
              </View>
            </View>

            <View style={styles.cardBox}>
              <Text style={styles.sectionHeaderTitle}>KEPUTUSAN PILIHAN RAYA TERAKHIR</Text>
              <View style={styles.winnerCard}>
                <View style={styles.winnerAvatar}><ShieldCheck size={24} color="#F3CE65" /></View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.whiteBold}>Peti Undi Sedia Dibuka</Text>
                  <Text style={styles.mutedSmall}>Pilihan Raya akan bermula secara automatik mengikut kitaran Engine.</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.cardBox}>
            <Text style={styles.sectionHeaderTitle}>🏛️ KOMPOSISI PARLIMEN & KERUSI PARTI</Text>

            {partyList.length === 0 ? (
              <Text style={[styles.mutedSmall, { marginTop: 10 }]}>Tiada parti berdaftar buat masa ini.</Text>
            ) : (
              <View style={{ marginTop: 12, gap: 6 }}>
                {partyList.map((p, index) => (
                  <View key={p.partyId} style={styles.candidateRow}>
                    <Text style={{ color: '#F3CE65', fontWeight: 'bold', width: 24 }}>#{index + 1}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.whiteBold}>{p.partyName}</Text>
                      <Text style={styles.mutedSmall}>Ketua: {p.leaderName || 'Tiada'}</Text>
                    </View>
                    <Text style={styles.goldSmall}>{p.totalVotes} Undi</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* MODAL SPR / UNDI PARTI */}
      <Modal visible={modalVoteOpen} animationType="fade" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.rowBetween}>
              <Text style={styles.goldTitle}>🏛️ SURUHANJAYA PILIHAN RAYA (SPR)</Text>
              <TouchableOpacity onPress={() => setModalVoteOpen(false)}>
                <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 16 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.mutedSmall}>PILIH PARTI UNTUK MEMBUAT UNDIAN</Text>

            <View style={{ marginVertical: 12, gap: 8 }}>
              {partyList.length === 0 ? (
                <Text style={styles.mutedSmall}>Tiada parti politik didaftarkan lagi.</Text>
              ) : (
                partyList.map((party) => (
                  <View key={party.partyId} style={styles.voteOptionRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.whiteBold}>{party.partyName}</Text>
                      <Text style={styles.mutedSmall}>Tag: {party.partyTag}</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.btnMiniVote, hasVoted && styles.btnMiniVoteDisabled]}
                      disabled={hasVoted}
                      onPress={() => handleVote(party.partyId)}
                    >
                      <Text style={styles.btnMiniVoteTxt}>{hasVoted ? 'DIBUTI' : 'UNDI'}</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            {hasVoted && (
              <View style={styles.votedAlert}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={styles.votedAlertTxt}>Undian anda telah selamat dimasukkan ke dalam Peti Undi!</Text>
              </View>
            )}

            <TouchableOpacity style={styles.btnCloseModal} onPress={() => setModalVoteOpen(false)}>
              <Text style={styles.btnCloseModalTxt}>TUTUP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07060A' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#09070D', borderBottomWidth: 1, borderColor: '#1E1826' },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backBtnTxt: { color: '#F3CE65', fontSize: 10, fontWeight: 'bold' },
  pageTitle: { color: '#F3CE65', fontSize: 12, fontWeight: 'bold', marginLeft: 12, letterSpacing: 0.5 },
  tabHeaderRow: { flexDirection: 'row', backgroundColor: '#0E0B14', borderBottomWidth: 1, borderColor: '#22192D' },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#F3CE65', backgroundColor: '#14101B' },
  tabBtnTxt: { color: '#777', fontSize: 11, fontWeight: 'bold' },
  tabBtnTxtActive: { color: '#F3CE65' },
  cardBox: { backgroundColor: '#0E0B14', borderRadius: 6, borderWidth: 1, borderColor: '#3D311F', padding: 12, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goldTitle: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold' },
  btnVoteTrigger: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3CE65', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  btnVoteTriggerTxt: { color: '#07060A', fontSize: 9, fontWeight: 'bold' },
  timerGrid: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
  timerBox: { backgroundColor: '#181320', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6, borderWidth: 1, borderColor: '#3D311F', alignItems: 'center' },
  timerNum: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  timerSub: { color: '#64748B', fontSize: 8, marginTop: 2 },
  sectionHeaderTitle: { fontSize: 11, fontWeight: 'bold', color: '#F3CE65', letterSpacing: 1 },
  winnerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#130F1A', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#22192D', marginTop: 8 },
  winnerAvatar: { width: 36, height: 36, borderRadius: 6, backgroundColor: '#1E1826', alignItems: 'center', justifyContent: 'center' },
  whiteBold: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  mutedSmall: { color: '#64748B', fontSize: 8, marginTop: 1 },
  goldSmall: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold' },
  candidateRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#14101B', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#22192D' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalBox: { width: '100%', maxWidth: 380, backgroundColor: '#120F17', borderRadius: 8, borderWidth: 1, borderColor: '#F3CE65', padding: 16 },
  voteOptionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18141F', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#2B2035' },
  btnMiniVote: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  btnMiniVoteDisabled: { backgroundColor: '#334155' },
  btnMiniVoteTxt: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  votedAlert: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#064E3B', padding: 8, borderRadius: 4, marginTop: 8 },
  votedAlertTxt: { color: '#34D399', fontSize: 9, fontWeight: 'bold', flex: 1 },
  btnCloseModal: { backgroundColor: '#1E1826', borderWidth: 1, borderColor: '#3D311F', paddingVertical: 8, borderRadius: 4, alignItems: 'center', marginTop: 12 },
  btnCloseModalTxt: { color: '#F3CE65', fontSize: 10, fontWeight: 'bold' },
});