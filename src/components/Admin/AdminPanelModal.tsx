import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { PlayerRecord, PUTRAJAYA_MONARCHY } from '../../systems/admin';

interface AdminPanelModalProps {
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanelModal({ currentUserId, isOpen, onClose }: AdminPanelModalProps) {
  const [players, setPlayers] = useState<PlayerRecord[]>([
    { id: 'usr-101', username: 'PahlawanMelaka', role: 'citizen', isBanned: false, isMuted: false },
    { id: 'usr-102', username: 'RajaLaut99', role: 'citizen', isBanned: false, isMuted: true },
    { id: 'usr-103', username: 'PengkhianatKota', role: 'citizen', isBanned: true, isMuted: true },
  ]);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const toggleBan = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBanned: !p.isBanned } : p))
    );
  };

  const toggleMute = (id: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isMuted: !p.isMuted } : p))
    );
  };

  const filtered = players.filter((p) =>
    p.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.monarchyTag}>TAKHTA DIRAJA PUTRAJAYA</Text>
            <Text style={styles.title}>Panel Titah & Kawalan Admin</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Exclusive Monarchy Party Status */}
        <View style={styles.monarchyBanner}>
          <Text style={styles.monarchyTitle}>👑 {PUTRAJAYA_MONARCHY.name}</Text>
          <Text style={styles.monarchySubtitle}>
            Pemerintah: {PUTRAJAYA_MONARCHY.rulerTitle} (ID: {currentUserId})
          </Text>
          <View style={styles.lockedBadge}>
            <Text style={styles.lockedBadgeText}>PARTI TERTUTUP: TIADA SIAPA BOLEH SERTAI</Text>
          </View>
        </View>

        {/* Player Moderation List */}
        <Text style={styles.sectionHeading}>Kawalan Pemain Nusantara</Text>
        <TextInput
          style={styles.input}
          placeholder="Cari nama pemain..."
          placeholderTextColor="#71717A"
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.playerRow}>
              <View>
                <Text style={styles.playerName}>{item.username}</Text>
                <Text style={styles.playerStatus}>
                  Status:{' '}
                  <Text style={item.isBanned ? styles.textRed : styles.textGreen}>
                    {item.isBanned ? 'DIBAN' : 'AKTIF'}
                  </Text>{' '}
                  |{' '}
                  <Text style={item.isMuted ? styles.textYellow : styles.textGray}>
                    {item.isMuted ? 'DIMUTE' : 'SUARA AKTIF'}
                  </Text>
                </Text>
              </View>

              <View style={styles.actionGroup}>
                <TouchableOpacity
                  style={[styles.btnAction, item.isMuted ? styles.btnUnmute : styles.btnMute]}
                  onPress={() => toggleMute(item.id)}
                >
                  <Text style={styles.btnActionText}>{item.isMuted ? 'Unmute' : 'Mute'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnAction, item.isBanned ? styles.btnUnban : styles.btnBan]}
                  onPress={() => toggleBan(item.id)}
                >
                  <Text style={styles.btnActionText}>{item.isBanned ? 'Unban' : 'Ban'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalCard: {
    width: 600,
    maxHeight: '85%',
    backgroundColor: '#0A0C10',
    borderColor: '#F59E0B',
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    paddingBottom: 10,
  },
  monarchyTag: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  title: {
    color: '#FBBF24',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: '#A1A1AA',
    fontSize: 16,
  },
  monarchyBanner: {
    backgroundColor: '#1E1B13',
    borderColor: '#78350F',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  monarchyTitle: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  monarchySubtitle: {
    color: '#D4D4D8',
    fontSize: 11,
    marginTop: 2,
  },
  lockedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#451A03',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  lockedBadgeText: {
    color: '#FCD34D',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  sectionHeading: {
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#18181B',
    borderColor: '#27272A',
    borderWidth: 1,
    borderRadius: 4,
    color: '#FAFAFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    marginBottom: 12,
  },
  list: {
    maxHeight: 280,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#11131A',
    padding: 10,
    borderRadius: 4,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#1F2430',
  },
  playerName: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: 'bold',
  },
  playerStatus: {
    color: '#71717A',
    fontSize: 10,
    marginTop: 2,
  },
  textRed: { color: '#EF4444', fontWeight: 'bold' },
  textGreen: { color: '#10B981', fontWeight: 'bold' },
  textYellow: { color: '#F59E0B', fontWeight: 'bold' },
  textGray: { color: '#71717A' },
  actionGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  btnAction: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  btnActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnBan: { backgroundColor: '#DC2626' },
  btnUnban: { backgroundColor: '#2563EB' },
  btnMute: { backgroundColor: '#D97706' },
  btnUnmute: { backgroundColor: '#4B5563' },
});