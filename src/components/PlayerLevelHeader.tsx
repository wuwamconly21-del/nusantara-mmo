import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LevelSystem } from '../services/LevelSystem';
import { VisaStatusModal } from './Immigration/VisaStatusModal';

interface PlayerLevelHeaderProps {
  playerName: string;
  level: number;
  xp: number;
  gold: number;
  hp: number;
  regionName: string;
}

export function PlayerLevelHeader({
  playerName,
  level,
  xp,
  gold,
  hp,
  regionName,
}: PlayerLevelHeaderProps) {
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const rank = LevelSystem.getRankForLevel(level);
  const xpNeeded = LevelSystem.getXpRequiredForNextLevel(level);
  const xpPercent = xpNeeded > 0 ? Math.min((xp / xpNeeded) * 100, 100) : 100;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarTxt}>{playerName.charAt(0)}</Text>
        </View>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.playerName}>{playerName}</Text>
            <View style={[styles.rankTag, { borderColor: rank.color }]}>
              <Text style={[styles.rankTagTxt, { color: rank.color }]}>
                {rank.badge} {rank.title}
              </Text>
            </View>
          </View>
          <Text style={styles.subMeta}>
            Tahap <Text style={styles.levelNum}>{level}</Text> / 999 • {regionName}
          </Text>
        </View>

        {/* IKON VISA REGALE & BADGE EMAS */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TouchableOpacity
            style={styles.visaHeaderBtn}
            onPress={() => setIsVisaModalOpen(true)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: '/assets/visa_regale_icon.png' }}
              style={styles.visaHeaderImg}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={styles.goldBadge}>
            <Text style={styles.goldVal}>💰 {gold.toLocaleString()}</Text>
            <Text style={styles.goldLbl}>EMAS KEDALAMAN</Text>
          </View>
        </View>
      </View>

      {/* Bar Kemajuan XP */}
      <View style={styles.xpSection}>
        <View style={styles.rowBetween}>
          <Text style={styles.xpLabel}>Kemajuan Pengalaman (XP)</Text>
          <Text style={styles.xpNumbers}>
            {xp.toLocaleString()} / {xpNeeded.toLocaleString()} XP ({xpPercent.toFixed(1)}%)
          </Text>
        </View>
        <View style={styles.xpTrack}>
          <View style={[styles.xpFill, { width: `${xpPercent}%` as any, backgroundColor: rank.color }]} />
        </View>
      </View>

      {/* Tenaga HP */}
      <View style={styles.hpSection}>
        <View style={styles.rowBetween}>
          <Text style={styles.hpLabel}>Tenaga Batin (HP)</Text>
          <Text style={styles.hpNumbers}>{hp} / 100</Text>
        </View>
        <View style={styles.hpTrack}>
          <View style={[styles.hpFill, { width: `${hp}%` as any }]} />
        </View>
      </View>

      {/* MODAL STATUS PASPORT */}
      <VisaStatusModal
        visible={isVisaModalOpen}
        playerName={playerName}
        currentRegion={regionName}
        currentCountry="Malaysia"
        visaStatus="TOURIST"
        applications={[]}
        onClose={() => setIsVisaModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0E0B14', borderRadius: 8, borderWidth: 1.2, borderColor: '#3D311F', padding: 14, marginBottom: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatarBox: { width: 46, height: 46, borderRadius: 8, backgroundColor: '#181320', borderWidth: 1.5, borderColor: '#F3CE65', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: '#F3CE65', fontSize: 20, fontWeight: 'bold' },
  playerName: { color: '#F8FAFC', fontSize: 15, fontWeight: 'bold' },
  rankTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, backgroundColor: '#13111C' },
  rankTagTxt: { fontSize: 9, fontWeight: 'bold' },
  subMeta: { color: '#94A3B8', fontSize: 10, marginTop: 3 },
  levelNum: { color: '#FBBF24', fontWeight: 'bold' },
  visaHeaderBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#0F172A',
    borderWidth: 1.2,
    borderColor: '#D97706',
    borderRadius: 6,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visaHeaderImg: { width: '100%', height: '100%' },
  goldBadge: { backgroundColor: '#16121E', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#332446', alignItems: 'flex-end' },
  goldVal: { color: '#F59E0B', fontSize: 13, fontWeight: 'bold' },
  goldLbl: { color: '#64748B', fontSize: 7, fontWeight: 'bold', marginTop: 1 },
  xpSection: { marginTop: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpLabel: { color: '#94A3B8', fontSize: 9, fontWeight: 'bold' },
  xpNumbers: { color: '#CBD5E1', fontSize: 9 },
  xpTrack: { height: 6, backgroundColor: '#262016', borderRadius: 3, marginTop: 4, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 3 },
  hpSection: { marginTop: 8 },
  hpLabel: { color: '#94A3B8', fontSize: 9, fontWeight: 'bold' },
  hpNumbers: { color: '#EF4444', fontSize: 9, fontWeight: 'bold' },
  hpTrack: { height: 4, backgroundColor: '#2B1417', borderRadius: 2, marginTop: 4, overflow: 'hidden' },
  hpFill: { height: '100%', backgroundColor: '#EF4444' },
});