import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  Flag,
  Users,
  ShieldAlert,
  Coins,
  Crown,
  ChevronLeft,
  Plus,
  UserPlus,
  Check,
  X,
  Award,
} from 'lucide-react-native';
import { DetailedParty, JawatanParti, IdeologiParti } from '../types/party';

interface PartiesScreenProps {
  currentPlayerId: string;
  currentPlayerName: string;
  playerGold: number;
  userPartyId: string | null;
  parties: DetailedParty[];
  onCreateParty: (party: DetailedParty) => void;
  onJoinParty: (partyId: string) => void;
  onApplyParty: (partyId: string) => void;
  onLeaveParty: () => void;
  onDonateGold: (partyId: string, amount: number) => void;
  onAppointRole: (partyId: string, targetPlayerId: string, role: JawatanParti) => void;
  onAcceptApplication: (partyId: string, applicantId: string) => void;
  onRejectApplication: (partyId: string, applicantId: string) => void;
  onBack: () => void;
}

export function PartiesScreen({
  currentPlayerId,
  currentPlayerName,
  playerGold,
  userPartyId,
  parties,
  onCreateParty,
  onJoinParty,
  onApplyParty,
  onLeaveParty,
  onDonateGold,
  onAppointRole,
  onAcceptApplication,
  onRejectApplication,
  onBack,
}: PartiesScreenProps) {
  const [activeTab, setActiveTab] = useState<'SENARAI' | 'PARTI_SAYA'>('SENARAI');
  const [modalBinaParti, setModalBinaParti] = useState(false);
  const [modalDerma, setModalDerma] = useState(false);
  const [dermaAmt, setDermaAmt] = useState('');

  // Form Penubuhan Parti
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyTag, setNewPartyTag] = useState('');
  const [newPartyColor, setNewPartyColor] = useState('#F59E0B');
  const [newPartyIdeology, setNewPartyIdeology] = useState<IdeologiParti>('MONARKISME');
  const [newPartyIsOpen, setNewPartyIsOpen] = useState(true);
  const [newPartyManifesto, setNewPartyManifesto] = useState('');

  const myParty = parties.find((p) => p.id === userPartyId);
  const myMemberData = myParty?.members.find((m) => m.playerId === currentPlayerId);
  const isLeader = myParty?.leaderId === currentPlayerId;
  const canManageRoles = isLeader || myMemberData?.jawatan === 'TIMBALAN_PRESIDEN';

  const handleCreateSubmit = () => {
    if (playerGold < 10000) {
      Alert.alert('Emas Kurang', 'Penubuhan parti politik memerlukan $10,000 RM.');
      return;
    }
    if (!newPartyName.trim() || !newPartyTag.trim()) {
      Alert.alert('Ralat', 'Sila isi nama dan tag parti.');
      return;
    }

    const created: DetailedParty = {
      id: `PTY_${Date.now()}`,
      name: newPartyName.trim(),
      tag: newPartyTag.trim().toUpperCase(),
      bannerColor: newPartyColor,
      ideologi: newPartyIdeology,
      isOpen: newPartyIsOpen,
      leaderId: currentPlayerId,
      leaderName: currentPlayerName,
      manifesto: newPartyManifesto.trim() || 'Kedaulatan bangsa dan tanah watan.',
      treasuryGold: 5000,
      members: [
        {
          playerId: currentPlayerId,
          playerName: currentPlayerName,
          level: 27,
          jawatan: 'PRESIDEN',
          tarikhSertai: Date.now(),
          jumlahSumbanganEmas: 5000,
        },
      ],
      applications: [],
      totalVotesPRN: 0,
      establishedDate: Date.now(),
    };

    onCreateParty(created);
    setModalBinaParti(false);
    Alert.alert('Parti Ditubuhkan', `Parti ${created.name} telah didaftarkan.`);
  };

  return (
    <View style={styles.container}>
      {/* Header Halaman Parti */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.btnBack} onPress={onBack}>
          <ChevronLeft size={16} color="#F3CE65" />
          <Text style={styles.btnBackTxt}>KEMBALI</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DEWAN PARTI POLITIK</Text>
        <TouchableOpacity
          disabled={!!userPartyId}
          style={[styles.btnBinaPill, !!userPartyId && { opacity: 0.4 }]}
          onPress={() => setModalBinaParti(true)}
        >
          <Plus size={12} color="#07090E" />
          <Text style={styles.btnBinaPillTxt}>BINA PARTI</Text>
        </TouchableOpacity>
      </View>

      {/* Navigasi Sub-Tab */}
      <View style={styles.tabNav}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'SENARAI' && styles.tabBtnActive]}
          onPress={() => setActiveTab('SENARAI')}
        >
          <Text style={[styles.tabTxt, activeTab === 'SENARAI' && styles.tabTxtActive]}>Senarai Parti</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!userPartyId}
          style={[styles.tabBtn, activeTab === 'PARTI_SAYA' && styles.tabBtnActive, !userPartyId && { opacity: 0.4 }]}
          onPress={() => setActiveTab('PARTI_SAYA')}
        >
          <Text style={[styles.tabTxt, activeTab === 'PARTI_SAYA' && styles.tabTxtActive]}>Parti Saya</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'SENARAI' ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          {parties.map((party) => {
            const isMyParty = party.id === userPartyId;
            const isApplied = party.applications.some((a) => a.playerId === currentPlayerId);

            return (
              <View key={party.id} style={[styles.partyCard, { borderLeftColor: party.bannerColor }]}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.partyName}>{party.name}</Text>
                      <View style={[styles.tagBadge, { backgroundColor: party.bannerColor }]}>
                        <Text style={styles.tagBadgeTxt}>{party.tag}</Text>
                      </View>
                    </View>
                    <Text style={styles.partyMeta}>
                      Ketua: <Text style={styles.whiteBold}>{party.leaderName}</Text> • Ideologi: {party.ideologi}
                    </Text>
                    <Text style={styles.manifestoTxt} numberOfLines={2}>"{party.manifesto}"</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                    <Text style={styles.goldTxt}>${party.treasuryGold.toLocaleString()} RM</Text>
                    <Text style={styles.mutedSmall}>{party.members.length} Ahli</Text>
                  </View>
                </View>

                <View style={styles.cardActionsRow}>
                  <View style={styles.statusPill}>
                    <Text style={styles.statusPillTxt}>{party.isOpen ? 'TERBUKA' : 'PERLU KELULUSAN'}</Text>
                  </View>

                  {!userPartyId && (
                    <TouchableOpacity
                      disabled={isApplied}
                      style={[styles.btnJoin, isApplied && { opacity: 0.5 }]}
                      onPress={() => (party.isOpen ? onJoinParty(party.id) : onApplyParty(party.id))}
                    >
                      <Text style={styles.btnJoinTxt}>
                        {isApplied ? 'MEMOHON...' : party.isOpen ? 'SERTAI' : 'MOHON MASUK'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {isMyParty && (
                    <View style={styles.joinedBadge}>
                      <Text style={styles.joinedBadgeTxt}>PARTI ANDA</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : myParty ? (
        /* TAB PARTI SAYA & PENGURUSAN AHLI */
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <View style={[styles.detailBanner, { borderColor: myParty.bannerColor }]}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.detailTitle}>{myParty.name}</Text>
                <Text style={styles.detailSub}>Tag: [{myParty.tag}] • Ideologi: {myParty.ideologi}</Text>
              </View>
              <TouchableOpacity style={styles.btnDerma} onPress={() => setModalDerma(true)}>
                <Coins size={14} color="#07090E" />
                <Text style={styles.btnDermaTxt}>DERMA DANA</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statGrid}>
              <View style={styles.statCell}>
                <Text style={styles.statLbl}>TABUNG PARTI</Text>
                <Text style={styles.statValGold}>${myParty.treasuryGold.toLocaleString()}</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statLbl}>JUMLAH AHLI</Text>
                <Text style={styles.statValWhite}>{myParty.members.length} Orang</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={styles.statLbl}>UNDI PRN</Text>
                <Text style={styles.statValBlue}>{myParty.totalVotesPRN} Undi</Text>
              </View>
            </View>

            <Text style={styles.manifestoQuote}>"{myParty.manifesto}"</Text>
          </View>

          {/* Senarai Permohonan Menunggu Kelulusan */}
          {canManageRoles && myParty.applications.length > 0 && (
            <View style={styles.secCard}>
              <Text style={styles.secTitle}>PERMOHONAN MASUK ({myParty.applications.length})</Text>
              {myParty.applications.map((app) => (
                <View key={app.playerId} style={styles.applicantRow}>
                  <View>
                    <Text style={styles.whiteBold}>{app.playerName}</Text>
                    <Text style={styles.mutedSmall}>Tahap Kedaulatan: {app.level}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      style={styles.btnAccept}
                      onPress={() => onAcceptApplication(myParty.id, app.playerId)}
                    >
                      <Check size={14} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.btnReject}
                      onPress={() => onRejectApplication(myParty.id, app.playerId)}
                    >
                      <X size={14} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Senarai Hierarki Ahli & Pelantikan Jawatan */}
          <View style={styles.secCard}>
            <Text style={styles.secTitle}>BARISAN KEPIMPINAN & AHLI</Text>
            {myParty.members.map((m) => {
              const isMe = m.playerId === currentPlayerId;

              return (
                <View key={m.playerId} style={styles.memberRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.whiteBold}>{m.playerName}</Text>
                      {isMe && <Text style={styles.youBadge}>(Anda)</Text>}
                    </View>
                    <Text style={styles.roleTagTxt}>{m.jawatan.replace('_', ' ')}</Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.goldTxt}>+${m.jumlahSumbanganEmas.toLocaleString()} RM</Text>
                    {canManageRoles && !isMe && m.jawatan !== 'PRESIDEN' && (
                      <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                        <TouchableOpacity
                          style={styles.btnRoleAppoint}
                          onPress={() => onAppointRole(myParty.id, m.playerId, 'TIMBALAN_PRESIDEN')}
                        >
                          <Text style={styles.btnRoleAppointTxt}>Timbalan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.btnRoleAppoint}
                          onPress={() => onAppointRole(myParty.id, m.playerId, 'BENDAHARI')}
                        >
                          <Text style={styles.btnRoleAppointTxt}>Bendahari</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <TouchableOpacity style={styles.btnKeluarParti} onPress={onLeaveParty}>
            <Text style={styles.btnKeluarPartiTxt}>TINGGALKAN PARTI</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : null}

      {/* Modal Penubuhan Parti */}
      <Modal visible={modalBinaParti} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>DAFTAR PARTI POLITIK</Text>
            <Text style={styles.cardDesc}>Yuran pendaftaran: $10,000 RM (Termasuk $5,000 permulaan tabung):</Text>

            <TextInput
              style={styles.inputModal}
              placeholder="Nama Penuh Parti..."
              placeholderTextColor="#666"
              value={newPartyName}
              onChangeText={setNewPartyName}
            />

            <TextInput
              style={styles.inputModal}
              placeholder="Tag Singkatan (cth: WARISAN)..."
              placeholderTextColor="#666"
              maxLength={6}
              value={newPartyTag}
              onChangeText={setNewPartyTag}
            />

            <TextInput
              style={[styles.inputModal, { height: 60 }]}
              multiline
              placeholder="Manifesto perjuangan..."
              placeholderTextColor="#666"
              value={newPartyManifesto}
              onChangeText={setNewPartyManifesto}
            />

            <Text style={styles.fieldLblSmall}>PILIH IDEOLOGI:</Text>
            <View style={styles.ideologyGrid}>
              {(['MONARKISME', 'KONSERVATISME', 'DEMOKRASI_SOSIAL', 'SOSIALISME', 'NASIONALISME', 'LIBERALISME'] as IdeologiParti[]).map((ide) => (
                <TouchableOpacity
                  key={ide}
                  style={[styles.ideologyBtn, newPartyIdeology === ide && styles.ideologyBtnActive]}
                  onPress={() => setNewPartyIdeology(ide)}
                >
                  <Text style={[styles.ideologyBtnTxt, newPartyIdeology === ide && { color: '#F3CE65' }]}>{ide}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.fieldLblSmall}>Keahlian Terbuka:</Text>
              <TouchableOpacity
                style={[styles.togglePill, newPartyIsOpen ? styles.toggleOn : styles.toggleOff]}
                onPress={() => setNewPartyIsOpen(!newPartyIsOpen)}
              >
                <Text style={styles.togglePillTxt}>{newPartyIsOpen ? 'TERBUKA' : 'TERTUTUP'}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
              <TouchableOpacity style={[styles.btnActionModal, { backgroundColor: '#1E293B' }]} onPress={() => setModalBinaParti(false)}>
                <Text style={styles.whiteBold}>BATAL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnActionModal, { backgroundColor: '#F59E0B' }]} onPress={handleCreateSubmit}>
                <Text style={[styles.whiteBold, { color: '#07090E' }]}>DAFTAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Derma Dana Parti */}
      <Modal visible={modalDerma} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { maxWidth: 320 }]}>
            <Text style={styles.modalTitle}>SUMBANGAN DANA PARTI</Text>
            <Text style={styles.cardDesc}>Baki tunai anda: ${playerGold.toLocaleString()} RM</Text>
            <TextInput
              style={styles.inputModal}
              placeholder="Jumlah derma..."
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={dermaAmt}
              onChangeText={setDermaAmt}
            />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TouchableOpacity style={[styles.btnActionModal, { backgroundColor: '#1E293B' }]} onPress={() => setModalDerma(false)}>
                <Text style={styles.whiteBold}>BATAL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnActionModal, { backgroundColor: '#10B981' }]}
                onPress={() => {
                  const val = parseInt(dermaAmt, 10);
                  if (val > 0 && playerGold >= val && myParty) {
                    onDonateGold(myParty.id, val);
                    setModalDerma(false);
                    setDermaAmt('');
                  }
                }}
              >
                <Text style={[styles.whiteBold, { color: '#07090E' }]}>HANTAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090E', paddingHorizontal: 12 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  btnBack: { flexDirection: 'row', alignItems: 'center' },
  btnBackTxt: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold' },
  headerTitle: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold' },
  btnBinaPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3CE65', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  btnBinaPillTxt: { color: '#07090E', fontSize: 9, fontWeight: 'bold' },
  tabNav: { flexDirection: 'row', backgroundColor: '#0D111A', borderRadius: 6, padding: 3, marginBottom: 10, borderWidth: 1, borderColor: '#1E293B' },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 4 },
  tabBtnActive: { backgroundColor: '#1C1626', borderWidth: 1, borderColor: '#F3CE65' },
  tabTxt: { color: '#888', fontSize: 10, fontWeight: 'bold' },
  tabTxtActive: { color: '#F3CE65' },
  partyCard: { backgroundColor: '#0E0B14', borderRadius: 6, borderWidth: 1, borderColor: '#2B2035', borderLeftWidth: 4, padding: 12, marginBottom: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  partyName: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold' },
  tagBadge: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 3 },
  tagBadgeTxt: { color: '#07090E', fontSize: 8, fontWeight: 'bold' },
  partyMeta: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  manifestoTxt: { color: '#64748B', fontSize: 9, fontStyle: 'italic', marginTop: 4 },
  goldTxt: { color: '#F59E0B', fontSize: 11, fontWeight: 'bold' },
  mutedSmall: { color: '#888', fontSize: 8 },
  cardActionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#1E1826', paddingTop: 8, marginTop: 8 },
  statusPill: { backgroundColor: '#131D2E', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
  statusPillTxt: { color: '#38BDF8', fontSize: 8, fontWeight: 'bold' },
  btnJoin: { backgroundColor: '#B45309', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 4 },
  btnJoinTxt: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  joinedBadge: { backgroundColor: '#064E3B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 3 },
  joinedBadgeTxt: { color: '#10B981', fontSize: 8, fontWeight: 'bold' },
  detailBanner: { backgroundColor: '#0D131C', borderRadius: 8, borderWidth: 1.2, padding: 14, marginBottom: 10 },
  detailTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: 'bold' },
  detailSub: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  btnDerma: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3CE65', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 },
  btnDermaTxt: { color: '#07090E', fontSize: 9, fontWeight: 'bold' },
  statGrid: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#1E293B', paddingTop: 10, marginTop: 10 },
  statCell: { alignItems: 'center' },
  statLbl: { color: '#64748B', fontSize: 8, fontWeight: 'bold' },
  statValGold: { color: '#F59E0B', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  statValWhite: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  statValBlue: { color: '#38BDF8', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  manifestoQuote: { color: '#94A3B8', fontSize: 10, fontStyle: 'italic', marginTop: 8 },
  secCard: { backgroundColor: '#0E0B14', borderRadius: 6, borderWidth: 1, borderColor: '#2B2035', padding: 12, marginBottom: 10 },
  secTitle: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 6 },
  applicantRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#1A1424' },
  whiteBold: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  btnAccept: { backgroundColor: '#065F46', padding: 6, borderRadius: 4 },
  btnReject: { backgroundColor: '#7F1D1D', padding: 6, borderRadius: 4 },
  memberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#1A1424' },
  youBadge: { color: '#10B981', fontSize: 9, fontWeight: 'bold' },
  roleTagTxt: { color: '#38BDF8', fontSize: 9, fontWeight: 'bold', marginTop: 1 },
  btnRoleAppoint: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 3, borderWidth: 1, borderColor: '#475569' },
  btnRoleAppointTxt: { color: '#CBD5E1', fontSize: 8 },
  btnKeluarParti: { backgroundColor: '#1A0E12', borderWidth: 1, borderColor: '#EF4444', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  btnKeluarPartiTxt: { color: '#EF4444', fontSize: 10, fontWeight: 'bold' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalBox: { width: '100%', maxWidth: 380, backgroundColor: '#0E0B14', borderRadius: 8, borderWidth: 1.2, borderColor: '#F3CE65', padding: 16 },
  modalTitle: { color: '#F3CE65', fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 },
  cardDesc: { color: '#888', fontSize: 10, marginVertical: 4 },
  inputModal: { backgroundColor: '#07090E', borderWidth: 1, borderColor: '#334155', borderRadius: 4, color: '#FFF', paddingHorizontal: 10, height: 38, fontSize: 11, marginVertical: 4 },
  fieldLblSmall: { color: '#94A3B8', fontSize: 9, fontWeight: 'bold', marginTop: 8 },
  ideologyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginVertical: 6 },
  ideologyBtn: { backgroundColor: '#13111C', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 3, borderWidth: 1, borderColor: '#261F30' },
  ideologyBtnActive: { borderColor: '#F3CE65', backgroundColor: '#1E1826' },
  ideologyBtnTxt: { color: '#888', fontSize: 9, fontWeight: 'bold' },
  togglePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  toggleOn: { backgroundColor: '#064E3B' },
  toggleOff: { backgroundColor: '#7F1D1D' },
  togglePillTxt: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  btnActionModal: { flex: 1, paddingVertical: 10, borderRadius: 4, alignItems: 'center' },
});