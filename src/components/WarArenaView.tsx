import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Swords, Trophy, ShieldAlert, Flame } from 'lucide-react-native';
import { WarCampaign, PlayerBarracks } from '../types/military';

interface WarArenaViewProps {
  campaign: WarCampaign;
  playerBarracks: PlayerBarracks;
  onSendTroops: (campaignId: string, side: 'ATTACK' | 'DEFENSE', power: number) => void;
}

export function WarArenaView({
  campaign,
  playerBarracks,
  onSendTroops,
}: WarArenaViewProps) {
  const [selectedSide, setSelectedSide] = useState<'ATTACK' | 'DEFENSE'>('ATTACK');

  const totalDmg = campaign.attackerTotalDamage + campaign.defenderTotalDamage;
  const attackPct = totalDmg > 0 ? (campaign.attackerTotalDamage / totalDmg) * 100 : 50;
  const defensePct = 100 - attackPct;

  const sortedParticipants = [...campaign.participants].sort((a, b) => b.damageDealt - a.damageDealt);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Tajuk Perang & Bar Tarik-Tali */}
      <View style={styles.warHeaderCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.warTitle}>⚔ OPERASI MEDAN PERANG: {campaign.title.toUpperCase()}</Text>
          <View style={styles.liveBadge}><Text style={styles.liveTxt}>● AKTIF</Text></View>
        </View>
        <Text style={styles.warSub}>Wilayah Sasar: {campaign.regionName}</Text>

        {/* Bar Tarik-Tali */}
        <View style={styles.tugBarWrapper}>
          <View style={styles.tugBarTrack}>
            <View style={[styles.tugAttackFill, { width: `${attackPct}%` as any }]} />
            <View style={[styles.tugDefenseFill, { width: `${defensePct}%` as any }]} />
          </View>
          <View style={styles.tugNumbersRow}>
            <Text style={styles.attackDmgText}>🔴 Penyerang: {campaign.attackerTotalDamage.toLocaleString()} DMG ({attackPct.toFixed(1)}%)</Text>
            <Text style={styles.defenseDmgText}>🔵 Pertahanan: {campaign.defenderTotalDamage.toLocaleString()} DMG ({defensePct.toFixed(1)}%)</Text>
          </View>
        </View>

        {/* Pemilihan Pihak */}
        <Text style={styles.chooseSideLbl}>PILIH PIHAK ANDA UTK SERTAI:</Text>
        <View style={styles.sideToggleRow}>
          <TouchableOpacity
            style={[styles.sideBtn, selectedSide === 'ATTACK' && styles.sideBtnAttackActive]}
            onPress={() => setSelectedSide('ATTACK')}
          >
            <Text style={[styles.sideBtnTxt, selectedSide === 'ATTACK' && { color: '#FFF' }]}>
              ⚔ PIHAK PENYERANG ({campaign.attackerName})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sideBtn, selectedSide === 'DEFENSE' && styles.sideBtnDefenseActive]}
            onPress={() => setSelectedSide('DEFENSE')}
          >
            <Text style={[styles.sideBtnTxt, selectedSide === 'DEFENSE' && { color: '#FFF' }]}>
              🛡 PIHAK BERTAHAN ({campaign.defenderName})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Butang Kerah Angkatan */}
        <TouchableOpacity
          style={styles.sendTroopBtn}
          onPress={() => onSendTroops(campaign.id, selectedSide, playerBarracks.totalMilitaryPower)}
        >
          <Flame size={16} color="#FFF" />
          <Text style={styles.sendTroopBtnTxt}>KERAHKAN KEKUATAN TENTERA ({playerBarracks.totalMilitaryPower.toLocaleString()} KUASA)</Text>
        </TouchableOpacity>
      </View>

      {/* Jadual Kerosakan Peserta & Parti */}
      <View style={styles.card}>
        <Text style={styles.secTitle}>🏆 PAPAN KEROSAKAN PEMBANGKING & PARTI</Text>
        <Text style={styles.cardDesc}>Senarai wira perang yang menyumbang impak kerosakan tertinggi:</Text>

        {sortedParticipants.map((p, idx) => (
          <View key={idx} style={styles.participantRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.rankNum}>#{idx + 1}</Text>
              <View>
                <Text style={styles.whiteBold}>{p.playerName} <Text style={styles.partyTag}>[{p.partyName}]</Text></Text>
                <Text style={styles.sideTagTxt}>{p.side === 'ATTACK' ? '🔴 Penyerang' : '🔵 Pertahanan'}</Text>
              </View>
            </View>
            <Text style={styles.dmgScore}>{p.damageDealt.toLocaleString()} DMG</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090E', paddingHorizontal: 12 },
  warHeaderCard: { backgroundColor: '#0D131C', borderRadius: 8, borderWidth: 1.2, borderColor: '#8B111A', padding: 14, marginVertical: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  warTitle: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold' },
  liveBadge: { backgroundColor: '#450A0A', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#EF4444' },
  liveTxt: { color: '#EF4444', fontSize: 8, fontWeight: 'bold' },
  warSub: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  tugBarWrapper: { marginVertical: 14 },
  tugBarTrack: { height: 12, backgroundColor: '#1E293B', borderRadius: 6, flexDirection: 'row', overflow: 'hidden' },
  tugAttackFill: { height: '100%', backgroundColor: '#EF4444' },
  tugDefenseFill: { height: '100%', backgroundColor: '#3B82F6' },
  tugNumbersRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  attackDmgText: { color: '#FCA5A5', fontSize: 10, fontWeight: 'bold' },
  defenseDmgText: { color: '#93C5FD', fontSize: 10, fontWeight: 'bold' },
  chooseSideLbl: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold', marginTop: 8, marginBottom: 4 },
  sideToggleRow: { flexDirection: 'row', gap: 8 },
  sideBtn: { flex: 1, backgroundColor: '#131D2E', paddingVertical: 8, borderRadius: 4, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  sideBtnAttackActive: { backgroundColor: '#7F1D1D', borderColor: '#EF4444' },
  sideBtnDefenseActive: { backgroundColor: '#1E3A8A', borderColor: '#3B82F6' },
  sideBtnTxt: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  sendTroopBtn: { backgroundColor: '#8B111A', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginTop: 12, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  sendTroopBtnTxt: { color: '#FFF', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  card: { backgroundColor: '#0E0B14', borderRadius: 8, borderWidth: 1, borderColor: '#3D311F', padding: 12, marginBottom: 10 },
  secTitle: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  cardDesc: { color: '#888', fontSize: 10, marginVertical: 4 },
  participantRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#130F1A', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#2B1E3B', marginTop: 6 },
  rankNum: { color: '#F59E0B', fontSize: 13, fontWeight: 'bold', minWidth: 24 },
  whiteBold: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  partyTag: { color: '#38BDF8', fontSize: 10 },
  sideTagTxt: { color: '#888', fontSize: 9, marginTop: 1 },
  dmgScore: { color: '#10B981', fontSize: 12, fontWeight: 'bold' },
});