import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  Swords,
  Shield,
  Trophy,
  Flame,
  Zap,
  Coins,
} from 'lucide-react-native';
import { PlayerBarracks, CustomWarCampaign, WarType } from '../types/military';

interface WarHubViewProps {
  campaign: CustomWarCampaign;
  realWarCampaigns: CustomWarCampaign[];
  playerBarracks: PlayerBarracks;
  playerGold: number;
  onSendTroops: (campaignId: string, side: 'ATTACK' | 'DEFENSE', power: number, warCategory: WarType) => void;
  onOpenBarracks: () => void;
}

export function WarHubView({
  campaign,
  realWarCampaigns,
  playerBarracks,
  onSendTroops,
  onOpenBarracks,
}: WarHubViewProps) {
  const [activeTab, setActiveTab] = useState<'EVENT_WAR' | 'REAL_WAR'>('EVENT_WAR');
  const [selectedSide, setSelectedSide] = useState<'ATTACK' | 'DEFENSE'>('ATTACK');
  const [selectedRealWar, setSelectedRealWar] = useState<CustomWarCampaign | null>(null);
  const [modalConfirmSend, setModalConfirmSend] = useState(false);
  const [modalLeaderboard, setModalLeaderboard] = useState(false);

  const currentWar = activeTab === 'EVENT_WAR' ? campaign : (selectedRealWar || realWarCampaigns[0] || campaign);

  const totalAttackerDmg = currentWar.attackerTotalDamage || 1;
  const totalDefenderDmg = currentWar.defenderTotalDamage || 1;
  const grandTotal = totalAttackerDmg + totalDefenderDmg;
  const attackerPct = Math.round((totalAttackerDmg / grandTotal) * 100);
  const defenderPct = 100 - attackerPct;

  const handleConfirmAttack = () => {
    onSendTroops(currentWar.id, selectedSide, playerBarracks.totalMilitaryPower, currentWar.warCategory);
    setModalConfirmSend(false);
  };

  const formatLargeMoney = (val: number) => {
    if (val >= 1e18) return `${(val / 1e18).toFixed(2)} Sextillion`;
    if (val >= 1e15) return `${(val / 1e15).toFixed(2)} Quadrillion`;
    if (val >= 1e12) return `${(val / 1e12).toFixed(2)} Trillion`;
    if (val >= 1e9) return `${(val / 1e9).toFixed(2)} Billion`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)} Million`;
    return val.toLocaleString();
  };

  const getWarTypeColor = (type: WarType) => {
    if (type === 'REVOLUSI' || type === 'REVOLUTION') return '#EF4444';
    if (type === 'KEMERDEKAAN' || type === 'INDEPENDENCE_WAR') return '#10B981';
    return '#3B82F6';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* SEKSYEN TAB UTAMA MOD PERANG */}
      <View style={styles.tabSwitchContainer}>
        <TouchableOpacity
          style={[styles.tabSwitchBtn, activeTab === 'EVENT_WAR' && styles.tabSwitchBtnActiveEvent]}
          onPress={() => setActiveTab('EVENT_WAR')}
        >
          <Flame size={14} color={activeTab === 'EVENT_WAR' ? '#F59E0B' : '#64748B'} />
          <Text style={[styles.tabSwitchTxt, activeTab === 'EVENT_WAR' && styles.goldBold]}>
            EVENT WAR (24 JAM)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabSwitchBtn, activeTab === 'REAL_WAR' && styles.tabSwitchBtnActiveReal]}
          onPress={() => setActiveTab('REAL_WAR')}
        >
          <Swords size={14} color={activeTab === 'REAL_WAR' ? '#EF4444' : '#64748B'} />
          <Text style={[styles.tabSwitchTxt, activeTab === 'REAL_WAR' && styles.redBold]}>
            PERANG SEBENAR (REAL WAR)
          </Text>
        </TouchableOpacity>
      </View>

      {/* HEADER PERANG AKTIF */}
      {activeTab === 'EVENT_WAR' ? (
        <View style={styles.eventBannerBox}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Flame size={20} color="#F59E0B" />
              <Text style={styles.headerTitle}>{campaign.title.toUpperCase()}</Text>
            </View>
            <View style={styles.badgeLiveEvent}>
              <Text style={styles.badgeLiveEventTxt}>24H EVENT LIVE</Text>
            </View>
          </View>

          {/* GANJARAN PERANG EVENT */}
          <View style={styles.eventRewardRow}>
            <View style={styles.rewardChip}>
              <Zap size={14} color="#F59E0B" />
              <Text style={styles.rewardChipTxt}>{campaign.eventDetails?.expMultiplier || 2.5}x MULTIPLIER EXP</Text>
            </View>
            <View style={styles.rewardChip}>
              <Coins size={14} color="#10B981" />
              <Text style={styles.rewardChipTxt}>
                ${formatLargeMoney(campaign.eventDetails?.totalPrizePoolGold || 2500000000)} POOL HADIAH
              </Text>
            </View>
          </View>
          <Text style={styles.eventInfoDesc}>
            ✨ 0% Kehilangan Tentera! Hadiah Emas dibahagikan mengikut peratusan kerosakan (Damage Contribution) pemain.
          </Text>
        </View>
      ) : (
        <View style={{ gap: 8, marginBottom: 10 }}>
          <Text style={styles.sectionHeaderTitle}>SENARAI PEPERANGAN STRATEGIK WILAYAH</Text>
          {realWarCampaigns.map((war) => {
            const isSelected = (selectedRealWar?.id || realWarCampaigns[0]?.id) === war.id;
            return (
              <TouchableOpacity
                key={war.id}
                style={[styles.realWarCard, isSelected && styles.realWarCardActive]}
                onPress={() => setSelectedRealWar(war)}
              >
                <View style={styles.rowBetween}>
                  <Text style={styles.whiteBold}>{war.title}</Text>
                  <Text style={[styles.badgeTypeTxt, { color: getWarTypeColor(war.warCategory) }]}>
                    {war.warCategory}
                  </Text>
                </View>
                <Text style={styles.subText}>📍 {war.regionName} • {war.attackerName} VS {war.defenderName}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* BAR TUG-OF-WAR UTAMA */}
      <View style={styles.cardDark}>
        <View style={styles.rowBetween}>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={styles.sideNameAttacker}>{currentWar.attackerName}</Text>
            <Text style={styles.sideDamageAttacker}>{(totalAttackerDmg / 1000000).toFixed(1)}M DMG</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.sideNameDefender}>{currentWar.defenderName}</Text>
            <Text style={styles.sideDamageDefender}>{(totalDefenderDmg / 1000000).toFixed(1)}M DMG</Text>
          </View>
        </View>

        <View style={styles.towTrack}>
          <View style={[styles.towFillAttacker, { width: `${attackerPct}%` }]} />
          <View style={[styles.towFillDefender, { width: `${defenderPct}%` }]} />
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.pctTxt}>⚔ {attackerPct}%</Text>
          <Text style={styles.pctTxt}>{defenderPct}% 🛡</Text>
        </View>

        <TouchableOpacity style={styles.btnLeaderboard} onPress={() => setModalLeaderboard(true)}>
          <Trophy size={14} color="#F3CE65" />
          <Text style={styles.btnLeaderboardTxt}>LIHAT SENARAI KEROSAKAN (DAMAGE)</Text>
        </TouchableOpacity>
      </View>

      {/* AKSI GEMPURAN & BEREK LINK */}
      <View style={styles.cardDark}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionHeaderTitle}>PILIH PIHAK UNTUK DISERANG</Text>
          <TouchableOpacity style={styles.btnBarracksLink} onPress={onOpenBarracks}>
            <Text style={styles.btnBarracksLinkTxt}>🪖 BEREK TENTERA ➔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sideSelectRow}>
          <TouchableOpacity
            style={[styles.btnSideSelect, selectedSide === 'ATTACK' && styles.btnSideSelectActiveAttack]}
            onPress={() => setSelectedSide('ATTACK')}
          >
            <Swords size={16} color={selectedSide === 'ATTACK' ? '#FFF' : '#64748B'} />
            <Text style={[styles.sideSelectTxt, selectedSide === 'ATTACK' && styles.whiteBold]}>
              {currentWar.attackerName}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnSideSelect, selectedSide === 'DEFENSE' && styles.btnSideSelectActiveDefense]}
            onPress={() => setSelectedSide('DEFENSE')}
          >
            <Shield size={16} color={selectedSide === 'DEFENSE' ? '#FFF' : '#64748B'} />
            <Text style={[styles.sideSelectTxt, selectedSide === 'DEFENSE' && styles.whiteBold]}>
              {currentWar.defenderName}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btnMainAction, selectedSide === 'ATTACK' ? styles.bgAttack : styles.bgDefense]}
          onPress={() => setModalConfirmSend(true)}
        >
          <Zap size={18} color="#FFF" />
          <Text style={styles.btnMainActionTxt}>
            GEMPUR SEKARANG ({playerBarracks.totalMilitaryPower.toLocaleString()} DMG)
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL PENGESAHAN */}
      <Modal visible={modalConfirmSend} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>HANTAR KUASA TENTERA</Text>
            <Text style={styles.modalDesc}>
              Menyertai pertempuran {selectedSide === 'ATTACK' ? currentWar.attackerName : currentWar.defenderName}.{'\n'}
              {activeTab === 'EVENT_WAR' ? '✨ Event War: 0% Kehilangan Tentera. Dapat EXP & Emas!' : '⚠️ Real War: 5% tentera berek anda terkorban.'}
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalConfirmSend(false)}>
                <Text style={styles.btnCancelTxt}>BATAL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirmAttack}>
                <Text style={styles.btnConfirmTxt}>SERANG (+EXP)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07060A' },
  content: { padding: 12, paddingBottom: 30 },
  tabSwitchContainer: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  tabSwitchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#0F0C16',
    borderWidth: 1,
    borderColor: '#251D30',
    borderRadius: 6,
  },
  tabSwitchBtnActiveEvent: { borderColor: '#F59E0B', backgroundColor: '#1E1826' },
  tabSwitchBtnActiveReal: { borderColor: '#EF4444', backgroundColor: '#270F14' },
  tabSwitchTxt: { fontSize: 9, fontWeight: 'bold', color: '#64748B' },
  goldBold: { color: '#F59E0B' },
  redBold: { color: '#EF4444' },
  eventBannerBox: {
    backgroundColor: '#120E1A',
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#F59E0B',
    padding: 12,
    marginBottom: 10,
  },
  headerTitle: { color: '#F3CE65', fontSize: 13, fontWeight: 'bold' },
  badgeLiveEvent: { backgroundColor: '#B45309', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeLiveEventTxt: { color: '#FFF', fontSize: 8, fontWeight: 'bold' },
  eventRewardRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  rewardChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1C1528', padding: 6, borderRadius: 4, flex: 1 },
  rewardChipTxt: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  eventInfoDesc: { color: '#94A3B8', fontSize: 9, fontStyle: 'italic', marginTop: 6 },
  realWarCard: { backgroundColor: '#0E0B14', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#251D30' },
  realWarCardActive: { borderColor: '#EF4444', backgroundColor: '#1A0D12' },
  whiteBold: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  badgeTypeTxt: { fontSize: 8, fontWeight: 'bold' },
  subText: { color: '#94A3B8', fontSize: 9, marginTop: 2 },
  cardDark: { backgroundColor: '#0E0B14', borderRadius: 6, borderWidth: 1, borderColor: '#251D30', padding: 12, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sideNameAttacker: { color: '#60A5FA', fontSize: 12, fontWeight: 'bold' },
  sideDamageAttacker: { color: '#93C5FD', fontSize: 10 },
  sideNameDefender: { color: '#EF4444', fontSize: 12, fontWeight: 'bold' },
  sideDamageDefender: { color: '#FCA5A5', fontSize: 10 },
  towTrack: { height: 12, backgroundColor: '#1A1423', borderRadius: 6, flexDirection: 'row', overflow: 'hidden', marginVertical: 8 },
  towFillAttacker: { backgroundColor: '#2563EB' },
  towFillDefender: { backgroundColor: '#DC2626' },
  pctTxt: { color: '#94A3B8', fontSize: 9, fontWeight: 'bold' },
  btnLeaderboard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#1E1826', borderWidth: 1, borderColor: '#3D311F', paddingVertical: 8, borderRadius: 4, marginTop: 10 },
  btnLeaderboardTxt: { color: '#F3CE65', fontSize: 10, fontWeight: 'bold' },
  sectionHeaderTitle: { color: '#F3CE65', fontSize: 10, fontWeight: 'bold' },
  btnBarracksLink: { backgroundColor: '#1E1826', borderWidth: 1, borderColor: '#3D311F', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  btnBarracksLinkTxt: { color: '#F3CE65', fontSize: 9, fontWeight: 'bold' },
  sideSelectRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btnSideSelect: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#140F1D', borderWidth: 1, borderColor: '#251D30', paddingVertical: 10, borderRadius: 4 },
  btnSideSelectActiveAttack: { backgroundColor: '#1E3A8A', borderColor: '#3B82F6' },
  btnSideSelectActiveDefense: { backgroundColor: '#7F1D1D', borderColor: '#EF4444' },
  sideSelectTxt: { color: '#64748B', fontSize: 10 },
  btnMainAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 6, marginTop: 10 },
  bgAttack: { backgroundColor: '#1D4ED8' },
  bgDefense: { backgroundColor: '#B91C1C' },
  btnMainActionTxt: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalBox: { width: '100%', maxWidth: 360, backgroundColor: '#120F17', borderRadius: 8, borderWidth: 1, borderColor: '#F3CE65', padding: 16 },
  modalTitle: { color: '#F3CE65', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  modalDesc: { color: '#CBD5E1', fontSize: 10, textAlign: 'center', marginVertical: 10, lineHeight: 14 },
  modalBtnRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  btnCancel: { flex: 1, backgroundColor: '#1E1826', paddingVertical: 10, alignItems: 'center', borderRadius: 4 },
  btnCancelTxt: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  btnConfirm: { flex: 1, backgroundColor: '#8B111A', paddingVertical: 10, alignItems: 'center', borderRadius: 4 },
  btnConfirmTxt: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
});