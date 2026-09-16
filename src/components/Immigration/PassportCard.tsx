import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VisaStatus } from '../../services/visaEngine';

interface PassportCardProps {
  playerName: string;
  currentRegionName: string;
  currentCountry: string;
  visaStatus: VisaStatus;
  onApplyWorkPermit: () => void;
  onApplyResidency: () => void;
}

export function PassportCard({
  playerName,
  currentRegionName,
  currentCountry,
  visaStatus,
  onApplyWorkPermit,
  onApplyResidency,
}: PassportCardProps) {
  const getStatusBadge = () => {
    switch (visaStatus) {
      case 'RESIDENTIAL':
        return { label: 'PENDUDUK TETAP (RESIDENT)', color: '#10B981', icon: '🏛️' };
      case 'WORK_PERMIT':
        return { label: 'PERMIT KERJA (WORK PERMIT)', color: '#38BDF8', icon: '🛠️' };
      default:
        return { label: 'VISA PELANCONG (TOURIST)', color: '#F59E0B', icon: '✈️' };
    }
  };

  const badge = getStatusBadge();

  return (
    <View style={styles.passportContainer}>
      {/* HEADER PASPORT */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛂 PASPORT GEOPOLITIK ANTARABANGSA</Text>
        <Text style={styles.headerSub}>{currentCountry.toUpperCase()}</Text>
      </View>

      {/* BUTIRAN PEMAIN */}
      <View style={styles.body}>
        <View style={styles.avatarBox}>
          <Text style={{ fontSize: 32 }}>👤</Text>
        </View>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.label}>NAMA PEMAIN</Text>
          <Text style={styles.valName}>{playerName}</Text>

          <Text style={[styles.label, { marginTop: 6 }]}>WILAYAH SEMASA</Text>
          <Text style={styles.valRegion}>{currentRegionName}</Text>
        </View>
      </View>

      {/* STATUS VISA */}
      <View style={[styles.statusBox, { borderColor: badge.color }]}>
        <Text style={{ fontSize: 16, marginRight: 6 }}>{badge.icon}</Text>
        <Text style={[styles.statusTxt, { color: badge.color }]}>{badge.label}</Text>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.btnRow}>
        {visaStatus === 'TOURIST' && (
          <TouchableOpacity style={styles.btnWork} onPress={onApplyWorkPermit}>
            <Text style={styles.btnTxt}>MOHON PERMIT KERJA</Text>
          </TouchableOpacity>
        )}

        {visaStatus !== 'RESIDENTIAL' && (
          <TouchableOpacity style={styles.btnResidency} onPress={onApplyResidency}>
            <Text style={styles.btnTxt}>MOHON KERSI / RESIDENCY</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  passportContainer: {
    width: 360,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#D97706',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  header: { borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 8, marginBottom: 12 },
  headerTitle: { color: '#F59E0B', fontSize: 11, fontWeight: 'bold' },
  headerSub: { color: '#94A3B8', fontSize: 9, marginTop: 2 },
  body: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarBox: { width: 50, height: 60, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#475569', justifyContent: 'center', alignItems: 'center', borderRadius: 4 },
  label: { color: '#64748B', fontSize: 8, fontWeight: 'bold' },
  valName: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold' },
  valRegion: { color: '#FBBF24', fontSize: 11, fontWeight: 'bold' },
  statusBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderWidth: 1, padding: 8, borderRadius: 6, marginBottom: 12 },
  statusTxt: { fontSize: 10, fontWeight: 'bold' },
  btnRow: { flexDirection: 'row', gap: 8 },
  btnWork: { flex: 1, backgroundColor: '#0284C7', paddingVertical: 8, borderRadius: 4, alignItems: 'center' },
  btnResidency: { flex: 1, backgroundColor: '#059669', paddingVertical: 8, borderRadius: 4, alignItems: 'center' },
  btnTxt: { color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' },
});