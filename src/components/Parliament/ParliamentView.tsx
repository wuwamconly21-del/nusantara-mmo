import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { BillType } from '../../systems/geopolitics';
import { ElectionPortalModal } from './ElectionPortalModal';
import { ElectionSession } from '../../services/ElectionEngine';

interface ParliamentViewProps {
  nationName: string;
  onBack: () => void;
}

export function ParliamentView({ nationName, onBack }: ParliamentViewProps) {
  const [activeTab, setActiveTab] = useState<'UNDI' | 'LULUS' | 'TOLAK'>('UNDI');
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [selectedBillType, setSelectedBillType] = useState<BillType | null>(null);
  
  // Status Modal Pilihan Raya
  const [isElectionPortalOpen, setIsElectionPortalOpen] = useState(false);
  const [userVotedCandidateId, setUserVotedCandidateId] = useState<string | undefined>(undefined);

  // Sesi Pilihan Raya Aktif (24 Jam Tempoh Berjalan)
  const activeElection: ElectionSession = {
    id: 'pru-2026',
    type: 'PRU',
    title: 'Pilihan Raya Persekutuan Ke-15',
    startTime: Date.now(),
    endTime: Date.now() + 86400000, // Pemasa 24 Jam
    status: 'VOTING_ACTIVE',
    candidates: [
      { id: 'c1', candidateId: 'p-1', candidateName: 'Wan Nur Luqman', partyId: 'pty-1', partyName: 'House Of Mahawangsa', targetRegionCode: 'MY_16', votesCount: 142 },
      { id: 'c2', candidateId: 'p-2', candidateName: 'Sir Luriax', partyId: 'pty-2', partyName: 'Parti Muafakat Rakyat', targetRegionCode: 'Selangor_MY', votesCount: 98 },
      { id: 'c3', candidateId: 'p-3', candidateName: 'Dato Wan', partyId: 'pty-3', partyName: 'Barisan Geopolitik', targetRegionCode: 'Terengganu_MY', votesCount: 65 },
    ],
  };

  const BILL_OPTIONS: { type: BillType; label: string; desc: string }[] = [
    { type: 'UNDANG_UNDANG', label: 'Undang-undang', desc: 'Usul perundangan berbentuk bebas.' },
    { type: 'KEBENARAN_PERANG', label: 'Kebenaran Perang', desc: 'Kebenaran parlimen untuk mengisytiharkan perang.' },
    { type: 'CUKAI', label: 'Cukai', desc: 'Ubah kadar cukai sumber negara.' },
    { type: 'BAJET', label: 'Bajet', desc: 'Usul perbelanjaan daripada perbendaharaan.' },
    { type: 'PINDAH_BAJET', label: 'Pemindahan Bajet', desc: 'Pemindahan bajet negara atau wilayah.' },
    { type: 'PINDAH_IBUKOTA', label: 'Pemindahan Ibu Negara', desc: 'Usul untuk memindahkan ibu negara.' },
    { type: 'TUKAR_IDEOLOGI', label: 'Perubahan Ideologi', desc: 'Ubah ideologi rasmi negara.' },
    { type: 'SAIZ_PARLIMEN', label: 'Saiz Parlimen', desc: 'Ubah bilangan kerusi parlimen (50, 100, 150, 200).' },
  ];

  return (
    <View style={styles.container}>
      {/* Pengepala Dewan Parlimen */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>‹ KEMBALI</Text>
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.supTitle}>BADAN PERUNDANGAN</Text>
          <Text style={styles.mainTitle}>PARLIMEN</Text>
          <Text style={styles.nationSub}>{nationName}</Text>
        </View>

        {/* Action Right: Kerusi & Butang PRU/PRN */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            style={styles.btnElectionHeader}
            onPress={() => setIsElectionPortalOpen(true)}
          >
            <Text style={styles.btnElectionHeaderTxt}>🗳️ PUSAT PILIHAN RAYA (PRU/PRN)</Text>
          </TouchableOpacity>

          <View style={styles.seatBadge}>
            <Text style={styles.seatNumber}>50</Text>
            <Text style={styles.seatLabel}>KERUSI</Text>
          </View>
        </View>
      </View>

      {!isCreatingBill ? (
        <ScrollView style={styles.body}>
          {/* Dewan Separuh Bulatan */}
          <View style={styles.chamberBox}>
            <Text style={styles.chamberIcon}>🏛️</Text>
            <Text style={styles.chamberText}>Parlimen Sedang Bersidang</Text>
            <Text style={styles.chamberSub}>Setiap usul memerlukan undian majoriti ahli dewan.</Text>
            
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <TouchableOpacity
                style={styles.btnNewBill}
                onPress={() => setIsCreatingBill(true)}
              >
                <Text style={styles.btnNewBillText}>+ KEMUKAKAN USUL BARU</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnOpenVote}
                onPress={() => setIsElectionPortalOpen(true)}
              >
                <Text style={styles.btnOpenVoteText}>🗳️ UNDI CALON PARTI (24 JAM)</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Undian Usul */}
          <View style={styles.filterTabs}>
            {(['UNDI', 'LULUS', 'TOLAK'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabItemText, activeTab === tab && styles.tabItemTextActive]}>
                  {tab === 'UNDI' ? '1 DIUNDI' : tab === 'LULUS' ? '30 DILULUSKAN' : '0 DITOLAK'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contoh Usul Aktif */}
          <View style={styles.billCard}>
            <View style={styles.billHeader}>
              <Text style={styles.billTypeBadge}>CUKAI</Text>
              <Text style={styles.billTitle}>Kadar Cukai Minyak & Emas (Usul #104)</Text>
            </View>
            <Text style={styles.billDesc}>Penyelarasan kadar cukai wilayah kepada 10% untuk dana pertahanan.</Text>
            <View style={styles.voteBarTrack}>
              <View style={[styles.voteBarFill, { width: '75%' }]} />
            </View>
            <View style={styles.voteBtnRow}>
              <TouchableOpacity style={styles.btnVoteYes}><Text style={styles.voteBtnText}>SOKONG (18)</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnVoteNo}><Text style={styles.voteBtnText}>BANTAH (4)</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        /* Borang Pemilihan Jenis Usul */
        <ScrollView style={styles.body}>
          <View style={styles.billTypePickerHeader}>
            <Text style={styles.pickerTitle}>PILIH JENIS USUL</Text>
            <Text style={styles.pickerDesc}>Pilih jenis usul yang anda mahu kemukakan kepada dewan parlimen:</Text>
          </View>

          {!selectedBillType ? (
            BILL_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item.type}
                style={styles.typeRow}
                onPress={() => setSelectedBillType(item.type)}
              >
                <View>
                  <Text style={styles.typeRowLabel}>{item.label}</Text>
                  <Text style={styles.typeRowDesc}>{item.desc}</Text>
                </View>
                <Text style={styles.typeRowArrow}>›</Text>
              </TouchableOpacity>
            ))
          ) : (
            /* Borang Pengisian Usul */
            <View style={styles.formBox}>
              <TouchableOpacity onPress={() => setSelectedBillType(null)}>
                <Text style={styles.linkCancel}>‹ Pilih jenis usul lain</Text>
              </TouchableOpacity>
              <Text style={styles.formHeading}>USUL: {selectedBillType}</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Tajuk ringkas usul..."
                placeholderTextColor="#52525B"
              />
              <TextInput
                style={[styles.formInput, { height: 100 }]}
                multiline
                placeholder="Penerangan dan justifikasi mengapa usul ini wajar diluluskan..."
                placeholderTextColor="#52525B"
              />
              <TouchableOpacity
                style={styles.btnSubmitBill}
                onPress={() => {
                  alert('Usul berjaya dihantar ke dewan parlimen untuk undian!');
                  setIsCreatingBill(false);
                  setSelectedBillType(null);
                }}
              >
                <Text style={styles.btnSubmitText}>BENTANGKAN KE PARLIMEN</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* PORTAL PILIHAN RAYA 24 JAM */}
      <ElectionPortalModal
        visible={isElectionPortalOpen}
        election={activeElection}
        userVotedCandidateId={userVotedCandidateId}
        onCastVote={(candidateId) => {
          setUserVotedCandidateId(candidateId);
        }}
        onClose={() => setIsElectionPortalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07090E',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    backgroundColor: '#0A0D14',
  },
  backBtn: {
    paddingVertical: 6,
  },
  backBtnText: {
    color: '#D97706',
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleWrap: {
    alignItems: 'center',
  },
  supTitle: {
    color: '#71717A',
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  mainTitle: {
    color: '#F59E0B',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  nationSub: {
    color: '#A1A1AA',
    fontSize: 11,
  },
  btnElectionHeader: {
    backgroundColor: '#1E293B',
    borderWidth: 1.2,
    borderColor: '#D97706',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  btnElectionHeaderTxt: {
    color: '#FBBF24',
    fontSize: 9,
    fontWeight: 'bold',
  },
  seatBadge: {
    alignItems: 'center',
    backgroundColor: '#18181B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  seatNumber: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  seatLabel: {
    color: '#71717A',
    fontSize: 8,
  },
  body: {
    flex: 1,
    padding: 24,
  },
  chamberBox: {
    backgroundColor: '#0F121A',
    borderWidth: 1,
    borderColor: '#1E2433',
    borderRadius: 6,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  chamberIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  chamberText: {
    color: '#FAFAFA',
    fontSize: 15,
    fontWeight: 'bold',
  },
  chamberSub: {
    color: '#71717A',
    fontSize: 11,
    marginTop: 4,
  },
  btnNewBill: {
    backgroundColor: '#B45309',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  btnNewBillText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
  },
  btnOpenVote: {
    backgroundColor: '#065F46',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  btnOpenVoteText: {
    color: '#A7F3D0',
    fontWeight: 'bold',
    fontSize: 10,
  },
  filterTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    marginBottom: 16,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#10B981',
  },
  tabItemText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: 'bold',
  },
  tabItemTextActive: {
    color: '#10B981',
  },
  billCard: {
    backgroundColor: '#0D1017',
    borderWidth: 1,
    borderColor: '#1F2430',
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  billTypeBadge: {
    backgroundColor: '#78350F',
    color: '#FDE68A',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  billTitle: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: 'bold',
  },
  billDesc: {
    color: '#A1A1AA',
    fontSize: 11,
    marginTop: 6,
  },
  voteBarTrack: {
    height: 6,
    backgroundColor: '#DC2626',
    borderRadius: 3,
    marginVertical: 12,
    overflow: 'hidden',
  },
  voteBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  voteBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnVoteYes: {
    flex: 1,
    backgroundColor: '#065F46',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  btnVoteNo: {
    flex: 1,
    backgroundColor: '#991B1B',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  voteBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  billTypePickerHeader: {
    marginBottom: 16,
  },
  pickerTitle: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pickerDesc: {
    color: '#71717A',
    fontSize: 11,
    marginTop: 2,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0E1118',
    borderColor: '#1E2433',
    borderWidth: 1,
    padding: 14,
    borderRadius: 6,
    marginBottom: 8,
  },
  typeRowLabel: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: 'bold',
  },
  typeRowDesc: {
    color: '#71717A',
    fontSize: 10,
    marginTop: 2,
  },
  typeRowArrow: {
    color: '#D97706',
    fontSize: 18,
  },
  formBox: {
    gap: 12,
  },
  linkCancel: {
    color: '#D97706',
    fontSize: 11,
    marginBottom: 6,
  },
  formHeading: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formInput: {
    backgroundColor: '#131722',
    borderWidth: 1,
    borderColor: '#272F45',
    borderRadius: 4,
    color: '#FAFAFA',
    padding: 12,
    fontSize: 12,
  },
  btnSubmitBill: {
    backgroundColor: '#B45309',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 6,
  },
  btnSubmitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});