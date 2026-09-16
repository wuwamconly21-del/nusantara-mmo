import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { VisaStatusModal } from './Immigration/VisaStatusModal';

interface SidebarMenuProps {
  visible: boolean;
  playerName: string;
  userGold: number;
  userGems: number;
  onNavigate: (screen: 'MAP' | 'PARLIAMENT' | 'PARTY' | 'ELECTIONS' | 'PROFILE') => void;
  onClose: () => void;
}

export function SidebarMenu({
  visible,
  playerName,
  userGold,
  userGems,
  onNavigate,
  onClose,
}: SidebarMenuProps) {
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sidebarContainer}>
        {/* HEADER PROFIL SIDEBAR */}
        <View style={styles.header}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarTxt}>{playerName.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.playerName}>{playerName}</Text>
            <Text style={styles.subText}>📍 Putrajaya, Malaysia</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* BAKI EMAS & PERMATA */}
        <View style={styles.currencyRow}>
          <Text style={styles.goldTxt}>💰 RM {userGold.toLocaleString()}</Text>
          <Text style={styles.gemTxt}>💎 {userGems}</Text>
        </View>

        <ScrollView style={styles.menuList}>
          {/* SEKSYEN TEROKA */}
          <Text style={styles.sectionTitle}>TEROKA</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onNavigate('MAP');
              onClose();
            }}
          >
            <Text style={styles.menuIcon}>🗺️</Text>
            <Text style={styles.menuLabel}>Peta Dunia</Text>
          </TouchableOpacity>

          {/* SEKSYEN PENTADBIRAN & GEOPOLITIK */}
          <Text style={styles.sectionTitle}>PENTADBIRAN & NEGERI</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onNavigate('PARLIAMENT');
              onClose();
            }}
          >
            <Text style={styles.menuIcon}>🏛️</Text>
            <Text style={styles.menuLabel}>Parlimen</Text>
          </TouchableOpacity>

          {/* TAB PARTI (KINI AKTIF) */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onNavigate('PARTY');
              onClose();
            }}
          >
            <Text style={styles.menuIcon}>🚩</Text>
            <Text style={styles.menuLabel}>Parti Politik</Text>
          </TouchableOpacity>

          {/* TAB PILIHAN RAYA (KINI AKTIF) */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onNavigate('ELECTIONS');
              onClose();
            }}
          >
            <Text style={styles.menuIcon}>🗳️</Text>
            <Text style={styles.menuLabel}>Pilihan Raya (PRU / PRN)</Text>
          </TouchableOpacity>

          {/* TAB PASPORT & VISA REGALE (DARI VIDEO ABANG) */}
          <TouchableOpacity
            style={[styles.menuItem, styles.visaHighlight]}
            onPress={() => setIsVisaModalOpen(true)}
          >
            <Image
              source={{ uri: '/assets/visa_regale_icon.png' }}
              style={styles.visaIconImg}
              resizeMode="contain"
            />
            <Text style={[styles.menuLabel, { color: '#F59E0B', fontWeight: 'bold' }]}>
              Pasport & Dokumen Visa
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* MODAL STATUS PASPORT & VISA REGALE */}
      <VisaStatusModal
        visible={isVisaModalOpen}
        playerName={playerName}
        currentRegion="Putrajaya"
        currentCountry="Malaysia"
        visaStatus="TOURIST"
        applications={[]}
        onClose={() => setIsVisaModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 200,
  },
  sidebarContainer: {
    width: 280,
    height: '100%',
    backgroundColor: '#0F172A',
    borderLeftWidth: 1.5,
    borderColor: '#D97706',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 12,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTxt: { color: '#F59E0B', fontSize: 16, fontWeight: 'bold' },
  playerName: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold' },
  subText: { color: '#64748B', fontSize: 9, marginTop: 1 },
  closeBtn: { color: '#94A3B8', fontSize: 16, fontWeight: 'bold', padding: 4 },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#182234',
    padding: 10,
    borderRadius: 6,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  goldTxt: { color: '#F59E0B', fontSize: 11, fontWeight: 'bold' },
  gemTxt: { color: '#38BDF8', fontSize: 11, fontWeight: 'bold' },
  menuList: { flex: 1 },
  sectionTitle: { color: '#64748B', fontSize: 9, fontWeight: 'bold', marginTop: 12, marginBottom: 6, letterSpacing: 1 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  visaHighlight: {
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.4)',
    marginTop: 6,
  },
  menuIcon: { fontSize: 16, marginRight: 10 },
  visaIconImg: { width: 20, height: 20, marginRight: 10 },
  menuLabel: { color: '#CBD5E1', fontSize: 12 },
});