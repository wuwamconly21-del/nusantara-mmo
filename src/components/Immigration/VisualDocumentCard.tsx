import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

interface VisualDocumentProps {
  type: 'VISA' | 'WORK_PERMIT' | 'RESIDENCE';
  playerName: string;
  nationality: string;
  passportNo: string;
  position?: string;
  employer?: string;
  validFrom: string;
  validTo: string;
  remarks?: string;
}

export function VisualDocumentCard({
  type,
  playerName,
  nationality,
  passportNo,
  position = 'Pelawat / Pekerja Sektor Awam',
  employer = 'Kerajaan Wilayah Tempatan',
  validFrom,
  validTo,
  remarks = 'Diluluskan oleh Pentadbiran Rasmi',
}: VisualDocumentProps) {
  
  // Dokumen 1: Visa Stamp Layout
  if (type === 'VISA') {
    return (
      <ImageBackground
        source={{ uri: '/assets/visa_stamp_bg.png' }} // Gantikan dengan laluan fail gambar 1
        style={styles.visaContainer}
        resizeMode="stretch"
      >
        <View style={styles.visaOverlay}>
          <Text style={[styles.docText, { top: 22, left: 160 }]}>PROFIL: {playerName}</Text>
          <Text style={[styles.docText, { top: 44, left: 160 }]}>NEGARA: {nationality}</Text>
          <Text style={[styles.docText, { top: 66, left: 160 }]}>SAH: {validFrom} ➔ {validTo}</Text>
        </View>
      </ImageBackground>
    );
  }

  // Dokumen 2 & 3: Work Permit & Residence Request Layout
  const bgSource =
    type === 'WORK_PERMIT'
      ? '/assets/work_permit_bg.png' // Gambar 2
      : '/assets/residence_request_bg.png'; // Gambar 3

  return (
    <ImageBackground
      source={{ uri: bgSource }}
      style={styles.fullCardContainer}
      resizeMode="contain"
    >
      <View style={styles.cardOverlay}>
        {/* NAMA PEMAIN */}
        <Text style={[styles.cardValueText, { top: 128 }]}>{playerName.toUpperCase()}</Text>

        {/* KEWARGANEGARAAN */}
        <Text style={[styles.cardValueText, { top: 168 }]}>{nationality.toUpperCase()}</Text>

        {/* NOMBOR PASPORT */}
        <Text style={[styles.cardValueText, { top: 206 }]}>{passportNo}</Text>

        {/* JAWATAN / POSITION */}
        <Text style={[styles.cardValueText, { top: 246 }]}>{position}</Text>

        {/* MAJIKAN / EMPLOYER */}
        <Text style={[styles.cardValueText, { top: 284 }]}>{employer}</Text>

        {/* TEMPOH SAH / STAY DURATION */}
        <View style={{ position: 'absolute', top: 324, left: 220, flexDirection: 'row', gap: 60 }}>
          <Text style={styles.cardValueTextInline}>{validFrom}</Text>
          <Text style={styles.cardValueTextInline}>{validTo}</Text>
        </View>

        {/* CATATAN / REMARKS */}
        <Text style={[styles.cardValueText, { top: 362, color: '#F59E0B' }]}>{remarks}</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  visaContainer: {
    width: 600,
    height: 150,
    position: 'relative',
    marginVertical: 10,
  },
  visaOverlay: {
    flex: 1,
    position: 'relative',
  },
  docText: {
    position: 'absolute',
    color: '#2E1A05',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  fullCardContainer: {
    width: 650,
    height: 420,
    position: 'relative',
    marginVertical: 12,
  },
  cardOverlay: {
    flex: 1,
    position: 'relative',
  },
  cardValueText: {
    position: 'absolute',
    left: 220,
    color: '#1E1103',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  cardValueTextInline: {
    color: '#1E1103',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});