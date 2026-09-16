import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { StateGovernment, CandidateParty, ParliamentBill, RegimeType, BillType } from '../../types/politics';

interface ParliamentChamberViewProps {
  government: StateGovernment;
  parties: CandidateParty[];
  currentPlayerId: string;
  currentPlayerName: string;
  onProposeBill: (bill: ParliamentBill) => void;
  onVoteBill: (billId: string, vote: 'YES' | 'NO') => void;
  onExecuteBill: (billId: string) => void;
  onInstantPassBill: (billId: string) => void;
  onVetoBill: (billId: string) => void;
  onTriggerEmergencyElection?: () => void;
}

const PROTECTED_BILLS: BillType[] = [
  'BAJET_PERSEKUTUAN',
  'PEMINDAHAN_WILAYAH',
  'PEMINDAHAN_BAJET',
  'PEMINDAHAN_SUMBER',
  'IKATAN_ALLIANCE',
  'KEMERDEKAAN_WILAYAH',
  'TUBUH_KERAJAAN_NEGERI',
  'PENAKLUKAN_PERANG',
];

export function ParliamentChamberView({
  government,
  parties,
  currentPlayerId,
  currentPlayerName,
  onProposeBill,
  onVoteBill,
  onExecuteBill,
  onInstantPassBill,
  onVetoBill,
  onTriggerEmergencyElection,
}: ParliamentChamberViewProps) {
  const { totalSeats, regimeType, activeBills, isEstablished } = government;

  const [modalBukaUsul, setModalBukaUsul] = useState(false);
  const [selectedType, setSelectedType] = useState<BillType>('TUBUH_KERAJAAN_NEGERI');
  const [targetKerusi, setTargetKerusi] = useState<number>(100);
  const [targetRejim, setTargetRejim] = useState<RegimeType>('MONARKI_MUTLAK');
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  const isHeadOfState = currentPlayerId === government.rulingLeaderId;
  const canExecutiveAction = isHeadOfState && (
    regimeType === 'MONARKI_MUTLAK' ||
    regimeType === 'DIKTATOR_AUTOKRASI' ||
    regimeType === 'JUNTA_TENTERA' ||
    regimeType === 'DEMOKRASI_PARLIMEN' ||
    regimeType === 'MONARKI_BERPERLEMBAGAAN'
  );

  const { seatMatrix, govSeats, oppSeats } = useMemo(() => {
    const list: { id: number; color: string; isGov: boolean; x: number; y: number }[] = [];
    const isMonopoly = regimeType === 'MONARKI_MUTLAK' || regimeType === 'DIKTATOR_AUTOKRASI' || regimeType === 'JUNTA_TENTERA';
    
    const totalVotes = parties.reduce((sum, p) => sum + p.totalVotes, 0);
    const sorted = [...parties].sort((a, b) => b.totalVotes - a.totalVotes);

    let govCount = 0;
    if (isMonopoly) {
      govCount = totalSeats;
    } else {
      const share = totalVotes > 0 ? Math.round((sorted[0]?.totalVotes / totalVotes) * totalSeats) : Math.floor(totalSeats * 0.55);
      govCount = Math.max(Math.min(share, totalSeats), Math.floor(totalSeats / 2) + 1);
    }
    const oppCount = totalSeats - govCount;

    const rows = totalSeats <= 50 ? 4 : totalSeats <= 100 ? 6 : 8;
    let seatIndex = 0;

    for (let r = 0; r < rows; r++) {
      const radius = 60 + r * 20;
      const seatsInRow = Math.floor((Math.PI * radius) / 18);
      
      for (let s = 0; s < seatsInRow; s++) {
        if (seatIndex >= totalSeats) break;

        const angle = Math.PI - (s / (seatsInRow - 1 || 1)) * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * (radius * 0.65);

        const isGovSeat = isMonopoly ? true : angle <= Math.PI / 2;
        const color = isGovSeat
          ? (government.themeColor || '#F59E0B')
          : (sorted[1]?.bannerColor || '#EF4444');

        list.push({ id: seatIndex + 1, color, isGov: isGovSeat, x, y });
        seatIndex++;
      }
    }

    return { seatMatrix: list, govSeats: govCount, oppSeats: oppCount };
  }, [totalSeats, regimeType, parties, government]);

  const majorityNeeded = Math.floor(totalSeats / 2) + 1;

  const handleCreateBill = () => {
    const isProtected = PROTECTED_BILLS.includes(selectedType);
    let title = '';
    let desc = '';
    let targetVal: any = '';

    if (selectedType === 'TUBUH_KERAJAAN_NEGERI') {
      title = `Pengisytiharan Penubuhan Kedaulatan Rasmi`;
      desc = `Membentuk kerajaan berdaulat dan menobatkan nama rasmi negeri daripada status wilayah bebas.`;
      targetVal = government.stateName;
    } else if (selectedType === 'PENAKLUKAN_PERANG') {
      title = `RUU Penaklukan Wilayah Sempadan Melalui Peperangan`;
      desc = `Memberikan mandat rasmi angkatan bersenjata untuk menganeksasi wilayah jiran ke dalam lejar taklukan.`;
      targetVal = 'Penaklukan Wilayah';
    } else if (selectedType === 'BELI_WILAYAH') {
      title = `Perjanjian Pembelian Wilayah Strategik`;
      desc = `Memperuntukkan 100,000 Emas untuk membeli kedaulatan tanah wilayah jiran secara damai.`;
      targetVal = 100000;
    } else if (selectedType === 'SUBSIDI_KORPORAT') {
      title = `Insentif Subsidi Korporat & Kilang Tempatan`;
      desc = `Menurunkan tarif elektrik kilang dan memberi geran pembinaan 10,000 Emas kepada konglomerat.`;
      targetVal = 10000;
    } else if (selectedType === 'BAJET_PERSEKUTUAN') {
      title = `Pelepasan Bajet Pembangunan Persekutuan`;
      desc = `Menyalurkan 25,000 Emas dari perbendaharaan untuk kerja infrastruktur dan pertahanan.`;
      targetVal = 25000;
    } else if (selectedType === 'UBAH_KAPASITI_KERUSI') {
      title = `Pindaan Kuota Kerusi Dewan ke ${targetKerusi}`;
      desc = `Menyelaraskan jumlah perwakilan dewan kepada ${targetKerusi} kerusi bagi sidang penggal depan.`;
      targetVal = targetKerusi;
    } else if (selectedType === 'TUKAR_REJIM') {
      title = `Pindaan Perlembagaan Rejim: ${targetRejim.replace(/_/g, ' ')}`;
      desc = `Menukar struktur kerajaan kepada ${targetRejim.replace(/_/g, ' ')}.`;
      targetVal = targetRejim;
    } else {
      title = `RUU Hal Ehwal Luar & Kedaulatan`;
      desc = `Usul berkaitan autonomi wilayah dan pakatan strategik.`;
      targetVal = 'Lulus';
    }

    const now = Date.now();
    const newBill: ParliamentBill = {
      id: `BILL_${now}`,
      type: selectedType,
      title,
      description: desc,
      proposedBy: currentPlayerName,
      targetValue: targetVal,
      votesYes: 1,
      votesNo: 0,
      totalVoters: [currentPlayerId],
      status: 'VOTING',
      createdAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
      isProtected24H: isProtected,
    };

    onProposeBill(newBill);
    setModalBukaUsul(false);
  };

  const getRemainingTimeStr = (expiresAt: number) => {
    const diff = expiresAt - currentTime;
    if (diff <= 0) return 'Masa Sidang Tamat (Sedia Dikira)';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Baki: ${hours}j ${minutes}m`;
  };

  return (
    <View style={styles.container}>
      {/* Jika Wilayah Masih Bebas / Belum Ada Kerajaan */}
      {!isEstablished && (
        <View style={styles.unclaimedBanner}>
          <Text style={styles.unclaimedTitle}>⚠ WILAYAH BEBAS (TIADA KERAJAAN BERDAULAT)</Text>
          <Text style={styles.unclaimedDesc}>
            Wilayah ini belum ditubuhkan kerajaan rasmi. PRN Kilat 24 jam dibuka untuk rakyat memilih parti majoriti bagi membawa RUU Pengisytiharan Kedaulatan.
          </Text>
          <TouchableOpacity style={styles.emergencyBtn} onPress={onTriggerEmergencyElection}>
            <Text style={styles.emergencyBtnTxt}>🗳 MULAKAN PRN KILAT 24 JAM</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 1. Header Kedaulatan Dewan */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>DEWAN PERUNDANGAN PERLEMBAGAAN</Text>
          <Text style={styles.headerTitle}>{government.stateName.toUpperCase()}</Text>
          <Text style={styles.regimePill}>
            {government.rulingLeaderTitle}: <Text style={styles.goldText}>{government.rulingLeaderName}</Text> ({government.regimeType.replace(/_/g, ' ')})
          </Text>
          <Text style={styles.territorySub}>Wilayah Ditakluk: {government.controlledTerritories.join(', ')}</Text>
        </View>

        <View style={styles.seatBadge}>
          <Text style={styles.seatNum}>{totalSeats}</Text>
          <Text style={styles.seatLbl}>KERUSI DEWAN</Text>
        </View>
      </View>

      {/* 2. Blok Kerajaan vs Pembangkang */}
      <View style={styles.blocBar}>
        <View style={[styles.blocCard, { borderColor: '#EF4444' }]}>
          <Text style={[styles.blocName, { color: '#EF4444' }]}>BLOK PEMBANGKANG</Text>
          <Text style={styles.blocSeats}>{oppSeats} Kerusi</Text>
        </View>

        <View style={styles.centerGavel}>
          <Text style={{ fontSize: 18 }}>⚖</Text>
          <Text style={styles.majorityTxt}>MAJORITI: {majorityNeeded}</Text>
          <Text style={[styles.statusTxt, { color: govSeats >= majorityNeeded ? '#10B981' : '#EF4444' }]}>
            {govSeats >= majorityNeeded ? 'MAJORITI KUASA' : 'PARLIMEN GANTUNG'}
          </Text>
        </View>

        <View style={[styles.blocCard, { borderColor: '#10B981' }]}>
          <Text style={[styles.blocName, { color: '#10B981' }]}>BLOK KERAJAAN</Text>
          <Text style={styles.blocSeats}>{govSeats} Kerusi</Text>
        </View>
      </View>

      {/* 3. Dewan Hemisfera Diplomacia */}
      <View style={styles.hemisphereCanvas}>
        <View style={styles.speakerPodium}>
          <Text style={{ fontSize: 16 }}>👑</Text>
          <Text style={styles.speakerTitle}>TAKHTA YANG DI-PERTUA DEWAN</Text>
        </View>

        <View style={styles.radialField}>
          {seatMatrix.map((seat) => (
            <View
              key={seat.id}
              style={[
                styles.seatNode,
                {
                  backgroundColor: seat.color,
                  left: 140 + seat.x - 5,
                  bottom: seat.y + 10,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* 4. Butang Bentang Usul */}
      <TouchableOpacity style={styles.proposeBtn} onPress={() => setModalBukaUsul(true)}>
        <Text style={styles.proposeBtnText}>+ BENTANGKAN USUL PERUNDANGAN (RUU)</Text>
      </TouchableOpacity>

      {/* 5. Senarai Usul Sedang Diundi */}
      <View style={styles.billSection}>
        <Text style={styles.billHeader}>USUL SIDANG DEWAN AKTIF ({activeBills.length})</Text>

        {activeBills.length === 0 ? (
          <View style={styles.emptyBill}>
            <Text style={styles.emptyBillText}>Tiada usul perundangan aktif. Sidang dewan berada dalam keadaan tenang.</Text>
          </View>
        ) : (
          activeBills.map((bill) => {
            const hasVoted = bill.totalVoters.includes(currentPlayerId);
            const totalBillVotes = bill.votesYes + bill.votesNo;
            const yesPercent = totalBillVotes > 0 ? (bill.votesYes / totalBillVotes) * 100 : 0;
            const isExpired = currentTime >= bill.expiresAt;
            const passed = bill.votesYes >= majorityNeeded;

            return (
              <View key={bill.id} style={styles.billCard}>
                <View style={styles.billCardTop}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.billTitle}>{bill.title}</Text>
                      {bill.isProtected24H && (
                        <View style={styles.badge24H}>
                          <Text style={styles.badge24HText}>🔒 WAJIB 24 JAM</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.billDesc}>{bill.description}</Text>
                    <Text style={styles.billMeta}>
                      Pembentang: <Text style={styles.whiteTxt}>{bill.proposedBy}</Text> • <Text style={styles.goldTxt}>{getRemainingTimeStr(bill.expiresAt)}</Text>
                    </Text>
                  </View>
                  <View style={styles.billStatusPill}>
                    <Text style={styles.billStatusTxt}>{bill.status}</Text>
                  </View>
                </View>

                {/* Progress Undian */}
                <View style={styles.voteBarWrapper}>
                  <View style={styles.voteBarTrack}>
                    <View style={[styles.voteBarFill, { width: `${yesPercent}%` as any }]} />
                  </View>
                  <View style={styles.voteNumbersRow}>
                    <Text style={{ color: '#10B981', fontSize: 10, fontWeight: 'bold' }}>✔ {bill.votesYes} Sokong</Text>
                    <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: 'bold' }}>✖ {bill.votesNo} Bantah</Text>
                  </View>
                </View>

                {/* Tindakan Undi & Kuasa Eksekutif */}
                <View style={styles.billActionRow}>
                  {bill.status === 'VOTING' && (
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      {!hasVoted ? (
                        <>
                          <TouchableOpacity style={styles.voteYesBtn} onPress={() => onVoteBill(bill.id, 'YES')}>
                            <Text style={styles.btnTxtWhite}>SOKONG</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.voteNoBtn} onPress={() => onVoteBill(bill.id, 'NO')}>
                            <Text style={styles.btnTxtWhite}>BANTAH</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <Text style={styles.votedBadge}>✓ Undi Direkod</Text>
                      )}
                    </View>
                  )}

                  {/* Panel Kuasa Pemimpin (Veto / Lulus Segera) */}
                  {canExecutiveAction && bill.status === 'VOTING' && (
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      {!bill.isProtected24H ? (
                        <TouchableOpacity style={styles.instantPassBtn} onPress={() => onInstantPassBill(bill.id)}>
                          <Text style={styles.btnTxtDark}>⚡ LULUS SEGERA</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.lockedNotice}>
                          <Text style={styles.lockedNoticeText}>🔒 Undian Wajib 24 Jam</Text>
                        </View>
                      )}

                      <TouchableOpacity style={styles.vetoBtn} onPress={() => onVetoBill(bill.id)}>
                        <Text style={styles.btnTxtWhite}>✕ VETO</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {isExpired && passed && bill.status === 'VOTING' && (
                    <TouchableOpacity style={styles.executeBtn} onPress={() => onExecuteBill(bill.id)}>
                      <Text style={styles.executeBtnTxt}>KUAT KUASA RUU</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* MODAL BENTANGKAN USUL */}
      <Modal visible={modalBukaUsul} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>BENTANGKAN USUL SIDANG DEWAN</Text>
            <Text style={styles.modalSub}>
              Pilih undang-undang dasar persekutuan untuk digubal dan diundi oleh perwakilan dewan.
            </Text>

            <ScrollView style={{ maxHeight: 360, marginVertical: 8 }}>
              <Text style={styles.groupHeader}>USUL KEDAULATAN & PERLUASAN WILAYAH (WAJIB 24 JAM)</Text>
              {[
                { key: 'TUBUH_KERAJAAN_NEGERI', lbl: '👑 Pengisytiharan Penubuhan Kerajaan Berdaulat' },
                { key: 'PENAKLUKAN_PERANG', lbl: '⚔ RUU Perluasan Wilayah Melalui Penaklukan Perang' },
                { key: 'BELI_WILAYAH', lbl: '🗺 Pembelian Kedaulatan Wilayah Sempadan (100,000 Emas)' },
                { key: 'BAJET_PERSEKUTUAN', lbl: '💰 Bajet Persekutuan (Pelepasan 25,000 Emas)' },
                { key: 'PEMINDAHAN_BAJET', lbl: '💸 Pindahan Wang Perbendaharaan ke Wilayah Luar' },
                { key: 'PEMINDAHAN_WILAYAH', lbl: '📍 Penyerahan Sempadan Wilayah kepada Sekutu' },
                { key: 'PEMINDAHAN_SUMBER', lbl: '📦 Penghantaran Logistik Sumber & Minyak' },
                { key: 'IKATAN_ALLIANCE', lbl: '🤝 Ratifikasi Perikatan Pertahanan Bersama' },
                { key: 'KEMERDEKAAN_WILAYAH', lbl: '🕊 Referendum Kemerdekaan Wilayah' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.billOptionCard, selectedType === item.key && styles.billOptionCardActive]}
                  onPress={() => setSelectedType(item.key as BillType)}
                >
                  <Text style={[styles.billOptionTxt, selectedType === item.key && styles.billOptionTxtActive]}>
                    {item.lbl}
                  </Text>
                  <Text style={styles.protectedTag}>🔒 24 Jam</Text>
                </TouchableOpacity>
              ))}

              <Text style={[styles.groupHeader, { marginTop: 12 }]}>USUL EKONOMI & PERLEMBAGAAN</Text>
              {[
                { key: 'SUBSIDI_KORPORAT', lbl: '🏭 Insentif Geran & Tarif Subsidi Kilang Korporat' },
                { key: 'UBAH_KAPASITI_KERUSI', lbl: '🏛 Pindaan Kapasiti Kerusi Dewan' },
                { key: 'TUKAR_REJIM', lbl: '👑 Pindaan Sistem Rejim Kerajaan' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.billOptionCard, selectedType === item.key && styles.billOptionCardActive]}
                  onPress={() => setSelectedType(item.key as BillType)}
                >
                  <Text style={[styles.billOptionTxt, selectedType === item.key && styles.billOptionTxtActive]}>
                    {item.lbl}
                  </Text>
                </TouchableOpacity>
              ))}

              {selectedType === 'UBAH_KAPASITI_KERUSI' && (
                <View style={styles.extraBox}>
                  <Text style={styles.inputLabel}>Pilih Kuota Kerusi Baharu:</Text>
                  <View style={styles.seatRow}>
                    {[50, 100, 150, 200].map((num) => (
                      <TouchableOpacity
                        key={num}
                        style={[styles.seatSelectBtn, targetKerusi === num && styles.seatSelectBtnActive]}
                        onPress={() => setTargetKerusi(num)}
                      >
                        <Text style={[styles.seatSelectTxt, targetKerusi === num && styles.seatSelectTxtActive]}>
                          {num} Kerusi
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {selectedType === 'TUKAR_REJIM' && (
                <View style={styles.extraBox}>
                  <Text style={styles.inputLabel}>Pilih Bentuk Rejim Baharu:</Text>
                  {[
                    { key: 'DEMOKRASI_PARLIMEN', lbl: 'Demokrasi Berparlimen' },
                    { key: 'MONARKI_BERPERLEMBAGAAN', lbl: 'Raja Berperlembagaan' },
                    { key: 'MONARKI_MUTLAK', lbl: 'Monarki Mutlak (Dinasti)' },
                    { key: 'DIKTATOR_AUTOKRASI', lbl: 'Diktator Autokrasi' },
                    { key: 'JUNTA_TENTERA', lbl: 'Junta Tentera' },
                  ].map((reg) => (
                    <TouchableOpacity
                      key={reg.key}
                      style={[styles.regimeSelectBtn, targetRejim === reg.key && styles.regimeSelectBtnActive]}
                      onPress={() => setTargetRejim(reg.key as RegimeType)}
                    >
                      <Text style={[styles.regimeSelectTxt, targetRejim === reg.key && styles.regimeSelectTxtActive]}>
                        {reg.lbl}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalActionRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalBukaUsul(false)}>
                <Text style={styles.btnTxtWhite}>BATAL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreateBill}>
                <Text style={styles.modalSubmitTxt}>BENTANGKAN RUU</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#070A10', borderRadius: 8, borderWidth: 1.2, borderColor: '#D97706', padding: 14 },
  unclaimedBanner: { backgroundColor: '#451A03', borderWidth: 1, borderColor: '#D97706', padding: 12, borderRadius: 6, marginBottom: 12 },
  unclaimedTitle: { color: '#FBBF24', fontSize: 11, fontWeight: 'bold' },
  unclaimedDesc: { color: '#CBD5E1', fontSize: 10, marginVertical: 4 },
  emergencyBtn: { backgroundColor: '#D97706', paddingVertical: 6, borderRadius: 4, alignItems: 'center', marginTop: 4 },
  emergencyBtnTxt: { color: '#070A10', fontSize: 10, fontWeight: 'bold' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#1E293B', paddingBottom: 10 },
  headerSub: { color: '#94A3B8', fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 },
  headerTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  regimePill: { color: '#94A3B8', fontSize: 11, marginTop: 3 },
  goldText: { color: '#F59E0B', fontWeight: 'bold' },
  territorySub: { color: '#64748B', fontSize: 9, marginTop: 2 },
  seatBadge: { backgroundColor: '#131D2E', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  seatNum: { color: '#F8FAFC', fontSize: 18, fontWeight: 'bold' },
  seatLbl: { color: '#64748B', fontSize: 8, fontWeight: 'bold' },
  blocBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  blocCard: { flex: 1, backgroundColor: '#0B121D', borderWidth: 1, borderRadius: 6, padding: 8, alignItems: 'center' },
  blocName: { fontSize: 9, fontWeight: 'bold' },
  blocSeats: { color: '#F8FAFC', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  centerGavel: { paddingHorizontal: 8, alignItems: 'center' },
  majorityTxt: { color: '#94A3B8', fontSize: 9, fontWeight: 'bold' },
  statusTxt: { fontSize: 9, fontWeight: 'bold', marginTop: 2 },
  hemisphereCanvas: {
    height: 180,
    backgroundColor: '#030508',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    overflow: 'hidden',
  },
  speakerPodium: { position: 'absolute', bottom: 12, alignItems: 'center', zIndex: 10 },
  speakerTitle: { color: '#94A3B8', fontSize: 8, fontWeight: 'bold', letterSpacing: 0.5 },
  radialField: { width: 280, height: 160, position: 'relative' },
  seatNode: { width: 8, height: 8, borderRadius: 4, position: 'absolute' },
  proposeBtn: { backgroundColor: '#D97706', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginVertical: 12 },
  proposeBtnText: { color: '#0B121D', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  billSection: { borderTopWidth: 1, borderColor: '#1E293B', paddingTop: 10 },
  billHeader: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold', marginBottom: 10 },
  emptyBill: { backgroundColor: '#0B121D', padding: 16, borderRadius: 6, alignItems: 'center' },
  emptyBillText: { color: '#64748B', fontSize: 11, fontStyle: 'italic', textAlign: 'center' },
  billCard: { backgroundColor: '#0E1624', borderRadius: 6, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#1E293B' },
  billCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  billTitle: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold' },
  badge24H: { backgroundColor: '#451A03', borderWidth: 1, borderColor: '#D97706', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 3 },
  badge24HText: { color: '#FBBF24', fontSize: 8, fontWeight: 'bold' },
  billDesc: { color: '#94A3B8', fontSize: 11, marginVertical: 4 },
  billMeta: { color: '#64748B', fontSize: 10 },
  whiteTxt: { color: '#F8FAFC', fontWeight: 'bold' },
  goldTxt: { color: '#F59E0B', fontWeight: 'bold' },
  billStatusPill: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  billStatusTxt: { color: '#38BDF8', fontSize: 9, fontWeight: 'bold' },
  voteBarWrapper: { marginVertical: 8 },
  voteBarTrack: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, overflow: 'hidden' },
  voteBarFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 3 },
  voteNumbersRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  billActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  voteYesBtn: { backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  voteNoBtn: { backgroundColor: '#DC2626', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  instantPassBtn: { backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4 },
  vetoBtn: { backgroundColor: '#7F1D1D', borderWidth: 1, borderColor: '#EF4444', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4 },
  lockedNotice: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 },
  lockedNoticeText: { color: '#94A3B8', fontSize: 9, fontStyle: 'italic' },
  votedBadge: { color: '#10B981', fontSize: 10, fontWeight: 'bold' },
  executeBtn: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  executeBtnTxt: { color: '#0B121D', fontSize: 10, fontWeight: 'bold' },
  btnTxtWhite: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  btnTxtDark: { color: '#0B121D', fontSize: 9, fontWeight: 'bold' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 440, backgroundColor: '#0B121D', borderRadius: 8, borderWidth: 1.5, borderColor: '#D97706', padding: 16 },
  modalTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: 'bold' },
  modalSub: { color: '#94A3B8', fontSize: 11, marginVertical: 6 },
  groupHeader: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 6 },
  billOptionCard: { backgroundColor: '#131D2E', padding: 10, borderRadius: 4, marginBottom: 6, borderWidth: 1, borderColor: '#334155', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  billOptionCardActive: { borderColor: '#F59E0B', backgroundColor: '#1E1B13' },
  billOptionTxt: { color: '#94A3B8', fontSize: 11, flex: 1 },
  billOptionTxtActive: { color: '#FFF', fontWeight: 'bold' },
  protectedTag: { color: '#FBBF24', fontSize: 8, marginLeft: 6 },
  extraBox: { backgroundColor: '#070A10', padding: 10, borderRadius: 4, marginVertical: 6, borderWidth: 1, borderColor: '#1E293B' },
  inputLabel: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  seatRow: { flexDirection: 'row', gap: 6 },
  seatSelectBtn: { flex: 1, backgroundColor: '#131D2E', paddingVertical: 6, borderRadius: 4, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  seatSelectBtnActive: { backgroundColor: '#B45309', borderColor: '#F59E0B' },
  seatSelectTxt: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  seatSelectTxtActive: { color: '#FFF' },
  regimeSelectBtn: { backgroundColor: '#131D2E', padding: 8, borderRadius: 4, marginVertical: 3, borderWidth: 1, borderColor: '#334155' },
  regimeSelectBtnActive: { backgroundColor: '#B45309', borderColor: '#F59E0B' },
  regimeSelectTxt: { color: '#94A3B8', fontSize: 11 },
  regimeSelectTxtActive: { color: '#FFF', fontWeight: 'bold' },
  modalActionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 16 },
  modalCancelBtn: { backgroundColor: '#1E293B', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 4 },
  modalSubmitBtn: { backgroundColor: '#D97706', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 4 },
  modalSubmitTxt: { color: '#070A10', fontSize: 11, fontWeight: 'bold' },
});