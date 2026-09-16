import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import {
  User,
  Shield,
  Heart,
  Award,
  Coins,
  Gem,
  FileBadge,
  MapPin,
  Flame,
  Plus,
  Compass,
} from 'lucide-react-native';
import { VisaStatusModal } from './Immigration/VisaStatusModal';

interface ProfileViewProps {
  nama: string;
  pangkat: string;
  tahap: number;
  xp: number;
  hp: number;
  wang: number;
  nilam: number;
  wilayah: string;
  negara: string;
  mataWang: string;
  onGunaPil: () => void;
  onTukarWilayah: () => void;
}

export default function ProfileView({
  nama,
  pangkat,
  tahap,
  xp,
  hp,
  wang,
  nilam,
  wilayah,
  negara,
  mataWang,
  onGunaPil,
  onTukarWilayah,
}: ProfileViewProps) {
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const xpMaksimum = (tahap + 1) * 100;
  const peratusXp = Math.min(Math.round((xp / xpMaksimum) * 100), 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. KAD IDENTITI UTAMA */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarInitial}>{nama.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.characterName}>[MAHA] {nama}</Text>
            <Text style={styles.rankSub}>
              ⚔ {pangkat} • TAHAP {tahap}
            </Text>
            <View style={styles.locationRow}>
              <MapPin size={11} color="#60A5FA" />
              <Text style={styles.locationText}>
                {wilayah}, {negara}
              </Text>
            </View>
          </View>

          {/* BUTANG VISA REGALE KOMPAK KANAN ATAS */}
          <TouchableOpacity
            style={styles.visaRegaleBtn}
            onPress={() => setIsVisaModalOpen(true)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: '/assets/visa_regale_icon.png' }}
              style={styles.visaRegaleImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* BAR KEMAJUAN XP */}
        <View style={styles.xpTrackBox}>
          <View style={[styles.xpTrackFill, { width: `${peratusXp}%` }]} />
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.subTextDim}>{xp} / {xpMaksimum} XP</Text>
          <Text style={styles.goldSmall}>{peratusXp}% ke Tahap {tahap + 1}</Text>
        </View>

        {/* SEKSYEN KESIHATAN & PIL RAWATAN */}
        <View style={styles.hpBox}>
          <View style={styles.rowBetween}>
            <View style={styles.hpLabelRow}>
              <Heart size={13} color="#EF4444" />
              <Text style={styles.hpLabel}>Tenaga Batin (HP)</Text>
            </View>
            <Text style={styles.hpValue}>{hp} / 100</Text>
          </View>
          <View style={styles.hpBarTrack}>
            <View style={[styles.hpBarFill, { width: `${hp}%` }]} />
          </View>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <Text style={styles.pillAvailableText}>💊 6,158 pil herba tersedia</Text>
            <TouchableOpacity style={styles.btnUsePill} onPress={onGunaPil}>
              <Plus size={11} color="#FFF" />
              <Text style={styles.btnUsePillText}>PULIH (+20 HP)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 2. INVENTORI SUMBER & DANA PERSEKUTUAN */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>GEDUNG SIMPANAN KOMODITI</Text>
        <Text style={styles.subTextDim}>Sumber strategik yang disimpan dalam perbendaharaan peribadi:</Text>
        
        <View style={styles.resourceGrid}>
          <View style={styles.resourcePill}>
            <Coins size={14} color="#F3CE65" />
            <View>
              <Text style={styles.resourceLabel}>Perbendaharaan</Text>
              <Text style={styles.resourceValue}>{mataWang} {wang.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.resourcePill}>
            <Gem size={14} color="#60A5FA" />
            <View>
              <Text style={styles.resourceLabel}>Permata Nilam</Text>
              <Text style={styles.resourceValue}>{nilam} Butir</Text>
            </View>
          </View>
          <View style={styles.resourcePill}>
            <Award size={14} color="#F59E0B" />
            <View>
              <Text style={styles.resourceLabel}>Bijih Timah</Text>
              <Text style={styles.resourceValue}>1,469 Tan</Text>
            </View>
          </View>
          <View style={styles.resourcePill}>
            <Flame size={14} color="#EF4444" />
            <View>
              <Text style={styles.resourceLabel}>Minyak Mentah</Text>
              <Text style={styles.resourceValue}>800 Tong</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. DOKUMEN KEWARGANEGARAAN & KEDUDUKAN */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>PASPORT & KEDAULATAN NEGERI</Text>
        
        <View style={styles.docRow}>
          <View style={styles.docIconBox}>
            <FileBadge size={16} color="#F3CE65" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.docName}>Kewarganegaraan Persekutuan</Text>
            <Text style={styles.subTextDim}>Wilayah Kelahiran: {wilayah}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.btnCheckVisa} 
            onPress={() => setIsVisaModalOpen(true)}
          >
            <Text style={styles.btnCheckVisaTxt}>📜 DOKUMEN</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnRelocate} onPress={onTukarWilayah}>
          <Compass size={14} color="#60A5FA" />
          <Text style={styles.btnRelocateText}>MOHON PERPINDAHAN MASTAUTIN</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL STATUS PASPORT & VISA REGALE */}
      <VisaStatusModal
        visible={isVisaModalOpen}
        playerName={`[MAHA] ${nama}`}
        currentRegion={wilayah}
        currentCountry={negara}
        visaStatus="TOURIST"
        applications={[]}
        onClose={() => setIsVisaModalOpen(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 24 },
  card: {
    backgroundColor: '#0E0B14',
    borderWidth: 1,
    borderColor: '#3D311F',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F3CE65',
    backgroundColor: '#181320',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: '#F3CE65', fontSize: 22, fontWeight: 'bold' },
  headerMeta: { flex: 1, marginLeft: 12 },
  characterName: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  rankSub: { fontSize: 10, color: '#F3CE65', marginTop: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locationText: { fontSize: 10, color: '#60A5FA' },
  visaRegaleBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#0F172A',
    borderWidth: 1.2,
    borderColor: '#D97706',
    borderRadius: 6,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visaRegaleImg: { width: '100%', height: '100%' },
  xpTrackBox: {
    height: 4,
    backgroundColor: '#262016',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  xpTrackFill: { height: '100%', backgroundColor: '#F3CE65' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subTextDim: { fontSize: 9, color: '#777', marginTop: 3 },
  goldSmall: { fontSize: 9, color: '#F3CE65' },
  hpBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#1E1826',
  },
  hpLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  hpLabel: { fontSize: 10, color: '#AAA' },
  hpValue: { fontSize: 11, fontWeight: 'bold', color: '#EF4444' },
  hpBarTrack: { height: 4, backgroundColor: '#2B1417', borderRadius: 2, marginTop: 4, overflow: 'hidden' },
  hpBarFill: { height: '100%', backgroundColor: '#EF4444' },
  pillAvailableText: { fontSize: 9, color: '#C084FC' },
  btnUsePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#3B1219',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  btnUsePillText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  cardTitle: { fontSize: 11, fontWeight: 'bold', color: '#F3CE65', letterSpacing: 0.8, marginBottom: 2 },
  resourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  resourcePill: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#14101A',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#261F2E',
  },
  resourceLabel: { fontSize: 8, color: '#888' },
  resourceValue: { fontSize: 11, fontWeight: 'bold', color: '#EEE', marginTop: 1 },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#1E1826',
    marginTop: 6,
  },
  docIconBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#1A1424',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docName: { fontSize: 11, fontWeight: 'bold', color: '#EEE' },
  btnCheckVisa: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#D97706',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  btnCheckVisaTxt: { color: '#F59E0B', fontSize: 9, fontWeight: 'bold' },
  btnRelocate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(96, 165, 250, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.4)',
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 10,
  },
  btnRelocateText: { color: '#60A5FA', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
});