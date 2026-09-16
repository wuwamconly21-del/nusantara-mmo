import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export type VisaStatus = 'TOURIST' | 'WORK_PERMIT' | 'RESIDENTIAL';

export interface ResidencyApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  targetRegionCode: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: number;
}

export interface VisaStatusModalProps {
  visible: boolean;
  playerName: string;
  currentRegion: string;
  currentCountry: string;
  visaStatus: VisaStatus;
  applications?: ResidencyApplication[];
  onClose: () => void;
}

export function VisaStatusModal({
  visible,
  playerName,
  currentRegion,
  currentCountry,
  visaStatus,
  applications = [],
  onClose,
}: VisaStatusModalProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        {/* HEADER MODAL */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📜 DOKUMEN IMIGRESEN & VISA REGALE</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* KAD PASPORT PEMAIN */}
        <View style={styles.passportCard}>
          <Text style={styles.label}>PEMEGANG PASPORT RASMI</Text>
          <Text style={styles.valName}>{playerName}</Text>

          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>LOKASI WILAYAH</Text>
              <Text style={styles.valSub}>
                {currentRegion} ({currentCountry})
              </Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.label}>STATUS HAK POLITIK/KERJA</Text>
              <Text
                style={[
                  styles.valBadge,
                  {
                    color:
                      visaStatus === 'RESIDENTIAL'
                        ? '#10B981'
                        : visaStatus === 'WORK_PERMIT'
                        ? '#38BDF8'
                        : '#F59E0B',
                  },
                ]}
              >
                {visaStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* SEJARAH PERMOHONAN */}
        <Text style={styles.secTitle}>SEJARAH PERMOHONAN KERAKYATAN / WORK PERMIT:</Text>

        <ScrollView style={styles.listArea}>
          {applications.length === 0 ? (
            <Text style={styles.emptyTxt}>Tiada rekod permohonan aktif buat masa ini.</Text>
          ) : (
            applications.map((app) => (
              <View key={app.id} style={styles.appCard}>
                <View style={styles.flexOne}>
                  <Text style={styles.appName}>Permohonan Kerakyatan / Residency</Text>
                  <Text style={styles.appRegion}>Wilayah: {app.targetRegionCode}</Text>
                  <Text style={styles.appDate}>
                    Mohon pada: {new Date(app.appliedAt).toLocaleDateString()}
                  </Text>
                </View>

                {/* BADGE KELULUSAN */}
                <View style={styles.alignRight}>
                  {app.status === 'APPROVED' && (
                    <View style={[styles.badge, { backgroundColor: '#065F46' }]}>
                      <Text style={[styles.badgeTxt, { color: '#34D399' }]}>✓ DILULUSKAN</Text>
                    </View>
                  )}
                  {app.status === 'PENDING' && (
                    <View style={[styles.badge, { backgroundColor: '#78350F' }]}>
                      <Text style={[styles.badgeTxt, { color: '#FBBF24' }]}>⏳ MENUNGGU KELULUSAN</Text>
                    </View>
                  )}
                  {app.status === 'REJECTED' && (
                    <View style={[styles.badge, { backgroundColor: '#7F1D1D' }]}>
                      <Text style={[styles.badgeTxt, { color: '#FCA5A5' }]}>✕ DITOLAK</Text>
                    </View>
                  )}
                  <Text style={styles.approverTxt}>
                    {app.status === 'PENDING' ? 'Dalam semakan Sultan/Diktator' : 'Keputusan Rasmi'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.btnClose} onPress={onClose}>
          <Text style={styles.btnCloseTxt}>TUTUP DOKUMEN</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: 'rgba(5, 8, 15, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalBox: {
    width: 440,
    maxHeight: '80%',
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#D97706',
    borderRadius: 8,
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 10,
    marginBottom: 12,
  },
  headerTitle: { color: '#F59E0B', fontSize: 12, fontWeight: 'bold' },
  closeBtn: { color: '#94A3B8', fontSize: 16, fontWeight: 'bold' },
  passportCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    borderRadius: 6,
    marginBottom: 14,
  },
  label: { color: '#64748B', fontSize: 8, fontWeight: 'bold' },
  valName: { color: '#F8FAFC', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  valSub: { color: '#CBD5E1', fontSize: 10, fontWeight: 'bold' },
  valBadge: { fontSize: 10, fontWeight: 'bold' },
  alignRight: { alignItems: 'flex-end' },
  secTitle: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold', marginBottom: 8 },
  listArea: { maxHeight: 180, marginBottom: 14 },
  emptyTxt: { color: '#64748B', fontSize: 10, textAlign: 'center', marginVertical: 20 },
  appCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#182234',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  flexOne: { flex: 1 },
  appName: { color: '#F8FAFC', fontSize: 11, fontWeight: 'bold' },
  appRegion: { color: '#38BDF8', fontSize: 9, marginTop: 2 },
  appDate: { color: '#64748B', fontSize: 8, marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeTxt: { fontSize: 8, fontWeight: 'bold' },
  approverTxt: { color: '#64748B', fontSize: 7, marginTop: 3 },
  btnClose: { backgroundColor: '#D97706', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  btnCloseTxt: { color: '#0F172A', fontSize: 11, fontWeight: 'bold' },
});