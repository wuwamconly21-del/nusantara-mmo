import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Alert } from 'react-native';
import { VisaType, ImmigrationApplication } from '../../services/immigrationEngine';

interface ImmigrationDrawerProps {
  visible: boolean;
  targetRegion: { code: string; name: string; country: string };
  onApply: (app: Partial<ImmigrationApplication>) => void;
  onClose: () => void;
}

export function ImmigrationDrawer({ visible, targetRegion, onApply, onClose }: ImmigrationDrawerProps) {
  const [selectedType, setSelectedType] = useState<VisaType>('WORK_PERMIT');
  const [reasonText, setReasonText] = useState('');

  if (!visible) return null;

  const handleSubmit = () => {
    if (!reasonText.trim()) {
      const msg = 'Sila nyatakan alasan permohonan visa/kewarganegaraan anda.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Borang Tak Lengkap', msg);
      return;
    }

    onApply({
      type: selectedType,
      targetRegionCode: targetRegion.code,
      targetRegionName: targetRegion.name,
      targetCountry: targetRegion.country,
      reason: reasonText,
    });

    setReasonText('');
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>📜 BORANG PERMOHONAN DOKUMEN IMIGRESEN</Text>
          <TouchableOpacity onPress={onClose}><Text style={styles.closeTxt}>✕</Text></TouchableOpacity>
        </View>

        <Text style={styles.subTitle}>DESTINASI: <Text style={{ color: '#FBBF24' }}>{targetRegion.name} ({targetRegion.country})</Text></Text>

        {/* TAB PILIHAN VISA */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, selectedType === 'WORK_PERMIT' && styles.tabBtnActive]}
            onPress={() => setSelectedType('WORK_PERMIT')}
          >
            <Text style={[styles.tabTxt, selectedType === 'WORK_PERMIT' && styles.tabTxtActive]}>🛠️ PERMIT KERJA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, selectedType === 'RESIDENTIAL' && styles.tabBtnActive]}
            onPress={() => setSelectedType('RESIDENTIAL')}
          >
            <Text style={[styles.tabTxt, selectedType === 'RESIDENTIAL' && styles.tabTxtActive]}>🏛️ KEWARGANEGARAAN</Text>
          </TouchableOpacity>
        </View>

        {/* INPUT ALASAN PERMOHONAN */}
        <Text style={styles.fieldLabel}>ALASAN PERMOHONAN (UNTUK SEMAKAN SULTAN / KABINET):</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Tuliskan tujuan anda bekerja atau memohon kerakyatan di sini..."
          placeholderTextColor="#64748B"
          value={reasonText}
          onChangeText={setReasonText}
        />

        <Text style={styles.noteTxt}>
          ⚠️ Permohonan anda akan dihantar terus kepada Sultan, Diktator, atau Menteri Dalam Negeri wilayah ini untuk diluluskan.
        </Text>

        {/* BUTANG HANTAR */}
        <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
          <Text style={styles.btnSubmitTxt}>HANTAR PERMOHONAN RASMI ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(5, 8, 15, 0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 120 },
  modalCard: { width: 440, backgroundColor: '#0F172A', borderWidth: 1.5, borderColor: '#D97706', borderRadius: 8, padding: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { color: '#F59E0B', fontSize: 12, fontWeight: 'bold' },
  closeTxt: { color: '#94A3B8', fontSize: 16, fontWeight: 'bold' },
  subTitle: { color: '#94A3B8', fontSize: 11, marginBottom: 14 },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tabBtn: { flex: 1, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  tabBtnActive: { borderColor: '#F59E0B', backgroundColor: '#2E2315' },
  tabTxt: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold' },
  tabTxtActive: { color: '#FBBF24' },
  fieldLabel: { color: '#64748B', fontSize: 9, fontWeight: 'bold', marginBottom: 6 },
  textArea: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', borderRadius: 6, color: '#F8FAFC', padding: 10, fontSize: 11, textAlignVertical: 'top', height: 80, marginBottom: 10 },
  noteTxt: { color: '#D97706', fontSize: 8, fontStyle: 'italic', marginBottom: 14 },
  btnSubmit: { backgroundColor: '#D97706', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  btnSubmitTxt: { color: '#0F172A', fontSize: 11, fontWeight: 'bold' },
});