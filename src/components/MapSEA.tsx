import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { Swords } from 'lucide-react-native';

export interface WilayahPeta {
  id: string;
  nama: string;
  negara: string;
  mata_wang: string;
  sistem_pentadbiran: string;
  pendidikan: number;
  ketenteraan: number;
  pembangunan: number;
  kesihatan: number;
  perjanjian_autonomi: string;
  x?: number;
  y?: number;
}

interface MapSEAProps {
  senaraiWilayah: WilayahPeta[];
  wilayahDipilih: WilayahPeta;
  onPilihWilayah: (w: WilayahPeta) => void;
  onPergiKeWilayah?: () => void;
}

export const WAR_ADJACENCY_SEA: Record<string, string[]> = {
  'Kuala Lumpur': ['Singapura', 'Sabah', 'Sarawak', 'Krung Thep (Bangkok)'],
  'Singapura': ['Kuala Lumpur', 'DKI Jakarta'],
  'Sabah': ['Sarawak', 'Kuala Lumpur', 'Manila'],
  'Sarawak': ['Sabah', 'Kuala Lumpur', 'Bandar Seri Begawan'],
  'DKI Jakarta': ['Singapura', 'Aceh Serambi Mekah'],
  'Aceh Serambi Mekah': ['Kuala Lumpur', 'DKI Jakarta'],
  'Bandar Seri Begawan': ['Sarawak', 'Sabah'],
  'Manila': ['Sabah'],
  'Krung Thep (Bangkok)': ['Kuala Lumpur'],
};

// Koordinat tepat mengikut peta geografi Asia Tenggara (viewBox 1000 x 500)
const KOORDINAT_SEA: Record<string, { x: number; y: number; kod: string }> = {
  bkk: { x: 440, y: 190, kod: 'TH' },   // Bangkok / Siam
  kl: { x: 420, y: 310, kod: 'MY' },    // Semenanjung Malaysia
  sgp: { x: 445, y: 355, kod: 'SG' },   // Singapura
  aceh: { x: 340, y: 290, kod: 'ID' },  // Aceh / Sumatera Utara
  jkt: { x: 490, y: 430, kod: 'ID' },   // DKI Jakarta / Jawa
  srwk: { x: 550, y: 330, kod: 'MY' },  // Sarawak
  brn: { x: 605, y: 285, kod: 'BN' },   // Brunei
  sbh: { x: 640, y: 265, kod: 'MY' },   // Sabah
  mnl: { x: 670, y: 160, kod: 'PH' },   // Manila / Luzon
};

type MapMode = 'countries' | 'education' | 'military' | 'development' | 'health' | 'war' | 'bloc';

export default function MapSEA({
  senaraiWilayah,
  wilayahDipilih,
  onPilihWilayah,
  onPergiKeWilayah,
}: MapSEAProps) {
  const [mode, setMode] = useState<MapMode>('countries');

  const dapatkanWarnaTitik = (w: WilayahPeta) => {
    if (mode === 'war') {
      if (w.id === wilayahDipilih.id) return '#22C55E';
      const jiran = WAR_ADJACENCY_SEA[wilayahDipilih.nama] || [];
      if (jiran.includes(w.nama)) return '#EAB308';
      return '#475569';
    }
    if (mode === 'education') {
      return w.pendidikan >= 8 ? '#10B981' : w.pendidikan >= 6 ? '#F59E0B' : '#EF4444';
    }
    if (mode === 'military') {
      return w.ketenteraan >= 8 ? '#10B981' : w.ketenteraan >= 6 ? '#F59E0B' : '#EF4444';
    }
    if (mode === 'development') {
      return w.pembangunan >= 8 ? '#10B981' : w.pembangunan >= 6 ? '#F59E0B' : '#EF4444';
    }
    if (mode === 'health') {
      return w.kesihatan >= 8 ? '#10B981' : w.kesihatan >= 6 ? '#F59E0B' : '#EF4444';
    }
    if (mode === 'bloc') {
      return w.negara === 'Malaysia' ? '#F3CE65' : w.negara === 'Indonesia' ? '#EF4444' : '#60A5FA';
    }
    return w.id === wilayahDipilih.id ? '#F3CE65' : '#D1D5DB';
  };

  const senaraiJiran = WAR_ADJACENCY_SEA[wilayahDipilih.nama] || [];

  return (
    <View style={styles.container}>
      {/* 1. BAR ATAS: 7 MOD PILIHAN MAP */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topFilterBar}>
        <FilterTab tajuk="NEGARA" aktif={mode === 'countries'} onPress={() => setMode('countries')} />
        <FilterTab tajuk="PENDIDIKAN" aktif={mode === 'education'} onPress={() => setMode('education')} />
        <FilterTab tajuk="KETENTERAAN" aktif={mode === 'military'} onPress={() => setMode('military')} />
        <FilterTab tajuk="PEMBANGUNAN" aktif={mode === 'development'} onPress={() => setMode('development')} />
        <FilterTab tajuk="KESIHATAN" aktif={mode === 'health'} onPress={() => setMode('health')} />
        <FilterTab tajuk="PERANG" aktif={mode === 'war'} isWar onPress={() => setMode('war')} />
        <FilterTab tajuk="BLOK" aktif={mode === 'bloc'} onPress={() => setMode('bloc')} />
      </ScrollView>

      {/* 2. PETA VEKTOR BENUA NUSANTARA / SEA */}
      <View style={styles.mapCanvas}>
        <svg
          viewBox="0 0 1000 500"
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          {/* Garis Grid Biru Gelap Navigasi */}
          <line x1="0" y1="125" x2="1000" y2="125" stroke="rgba(201, 168, 76, 0.08)" strokeWidth="1" />
          <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(201, 168, 76, 0.08)" strokeWidth="1" />
          <line x1="0" y1="375" x2="1000" y2="375" stroke="rgba(201, 168, 76, 0.08)" strokeWidth="1" />
          <line x1="333" y1="0" x2="333" y2="500" stroke="rgba(201, 168, 76, 0.08)" strokeWidth="1" />
          <line x1="666" y1="0" x2="666" y2="500" stroke="rgba(201, 168, 76, 0.08)" strokeWidth="1" />

          {/* Siluet Daratan Luar (Asia / Australia / India) - Inert */}
          <path
            d="M 120 180 L 260 140 L 320 180 L 280 260 L 220 280 Z"
            fill="#121824"
            stroke="#080E18"
            strokeWidth="1"
          />
          <path
            d="M 280 40 L 520 20 L 680 50 L 560 140 L 380 140 Z"
            fill="#121824"
            stroke="#080E18"
            strokeWidth="1"
          />
          <path
            d="M 720 420 L 920 380 L 960 480 L 760 500 Z"
            fill="#121824"
            stroke="#080E18"
            strokeWidth="1"
          />

          {/* Vektor Pulau-pulau Utama Nusantara (Aktif & Bercahaya) */}
          {/* Tanah Melayu & Indochina */}
          <path
            d="M 390 150 L 460 150 L 480 220 L 430 260 L 410 330 L 430 355 L 400 330 L 400 240 Z"
            fill="#1F2A38"
            stroke="#2E3F54"
            strokeWidth="1.5"
          />
          {/* Pulau Sumatera */}
          <path
            d="M 310 260 L 370 290 L 440 370 L 460 410 L 430 420 L 350 340 L 300 270 Z"
            fill="#1F2A38"
            stroke="#2E3F54"
            strokeWidth="1.5"
          />
          {/* Pulau Borneo (Sabah, Sarawak, Brunei, Kalimantan) */}
          <path
            d="M 520 290 L 610 240 L 660 250 L 670 300 L 620 380 L 540 380 L 510 320 Z"
            fill="#1F2A38"
            stroke="#2E3F54"
            strokeWidth="1.5"
          />
          {/* Pulau Jawa */}
          <path
            d="M 450 425 L 610 425 L 600 445 L 460 445 Z"
            fill="#1F2A38"
            stroke="#2E3F54"
            strokeWidth="1.5"
          />
          {/* Kepulauan Filipina */}
          <path
            d="M 660 120 L 700 130 L 680 210 L 720 270 L 670 300 L 640 250 Z"
            fill="#1F2A38"
            stroke="#2E3F54"
            strokeWidth="1.5"
          />
          {/* Pulau Sulawesi */}
          <path
            d="M 680 320 L 740 310 L 710 370 L 730 400 L 690 400 Z"
            fill="#1F2A38"
            stroke="#2E3F54"
            strokeWidth="1.5"
          />
        </svg>

        {/* Titik Interaktif Wilayah */}
        {senaraiWilayah.map((w) => {
          const pos = KOORDINAT_SEA[w.id] || { x: 500, y: 250, kod: 'SEA' };
          const aktif = wilayahDipilih.id === w.id;
          const warna = dapatkanWarnaTitik(w);

          return (
            <TouchableOpacity
              key={w.id}
              style={[
                styles.nodeMarker,
                { left: `${(pos.x / 1000) * 100}%`, top: `${(pos.y / 500) * 100}%` },
                aktif && styles.nodeMarkerActive,
              ]}
              onPress={() => onPilihWilayah(w)}
            >
              <View style={[styles.nodeDot, { backgroundColor: warna, borderColor: aktif ? '#FFF' : '#07060A' }]} />
              <Text style={[styles.nodeLabel, aktif && styles.nodeLabelActive]}>
                {w.nama.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. KAD MAKLUMAT WILAYAH PERSIS DIPLOMACIA */}
      <View style={styles.infoCard}>
        <View style={styles.cornerTL} /><View style={styles.cornerTR} />
        <View style={styles.cornerBL} /><View style={styles.cornerBR} />

        <View style={styles.infoMainRow}>
          <View style={styles.coatBox}>
            <Text style={{ fontSize: 24 }}>🏛️</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.infoLabel}>WILAYAH</Text>
            <Text style={styles.infoProvince}>{wilayahDipilih.nama}</Text>
            <Text style={styles.infoCountry}>
              🛡 {wilayahDipilih.negara.toUpperCase()} • {wilayahDipilih.sistem_pentadbiran}
            </Text>
          </View>
        </View>

        {mode === 'war' && (
          <View style={styles.warNoticeBox}>
            <Swords size={12} color="#EF4444" />
            <Text style={styles.warNoticeText}>
              {senaraiJiran.length} wilayah yang boleh dicapai untuk perang: {senaraiJiran.join(', ') || 'Tiada'}
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btnAction} onPress={onPergiKeWilayah}>
            <Text style={styles.btnActionText}>↗ PERGI KE WILAYAH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function FilterTab({
  tajuk,
  aktif,
  isWar,
  onPress,
}: {
  tajuk: string;
  aktif: boolean;
  isWar?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.filterTab,
        aktif && !isWar && styles.filterTabActive,
        aktif && isWar && styles.filterTabWarActive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterTabText,
          aktif && !isWar && styles.filterTabTextActive,
          aktif && isWar && styles.filterTabTextWarActive,
        ]}
      >
        {tajuk}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  topFilterBar: { flexDirection: 'row', marginBottom: 8 },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(10, 12, 15, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.25)',
    borderRadius: 3,
    marginRight: 4,
  },
  filterTabActive: { borderColor: '#F3CE65', backgroundColor: '#1E1826' },
  filterTabWarActive: { borderColor: '#22C55E', backgroundColor: '#0F291E' },
  filterTabText: { fontSize: 9, fontFamily: 'serif', color: '#8A7A5A', fontWeight: 'bold', letterSpacing: 0.5 },
  filterTabTextActive: { color: '#F3CE65' },
  filterTabTextWarActive: { color: '#22C55E' },

  mapCanvas: {
    height: 380,
    backgroundColor: '#0A1118',
    borderWidth: 1,
    borderColor: '#263242',
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 10,
  },
  nodeMarker: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    padding: 6,
    zIndex: 5,
  },
  nodeMarkerActive: { zIndex: 10 },
  nodeDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2 },
  nodeLabel: { fontSize: 9, color: '#A3A3A3', fontWeight: 'bold', marginTop: 2, fontFamily: 'serif' },
  nodeLabelActive: { color: '#F3CE65', fontSize: 10 },

  infoCard: {
    backgroundColor: '#0A0C0F',
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.4)',
    borderRadius: 4,
    padding: 10,
    position: 'relative',
  },
  cornerTL: { position: 'absolute', top: 3, left: 3, width: 8, height: 8, borderTopWidth: 1.5, borderLeftWidth: 1.5, borderColor: '#F3CE65' },
  cornerTR: { position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderTopWidth: 1.5, borderRightWidth: 1.5, borderColor: '#F3CE65' },
  cornerBL: { position: 'absolute', bottom: 3, left: 3, width: 8, height: 8, borderBottomWidth: 1.5, borderLeftWidth: 1.5, borderColor: '#F3CE65' },
  cornerBR: { position: 'absolute', bottom: 3, right: 3, width: 8, height: 8, borderBottomWidth: 1.5, borderRightWidth: 1.5, borderColor: '#F3CE65' },
  infoMainRow: { flexDirection: 'row', alignItems: 'center' },
  coatBox: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.3)',
    backgroundColor: 'rgba(201, 168, 76, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: { fontSize: 7, color: 'rgba(201, 168, 76, 0.6)', letterSpacing: 2, fontWeight: 'bold' },
  infoProvince: { fontSize: 15, fontWeight: 'bold', color: '#E8DCC4', fontFamily: 'serif' },
  infoCountry: { fontSize: 9, color: '#C9A84C', letterSpacing: 1, marginTop: 2 },
  warNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E0E12',
    padding: 6,
    borderRadius: 4,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#7F1D1D',
  },
  warNoticeText: { color: '#EF4444', fontSize: 9 },
  divider: { height: 1, backgroundColor: 'rgba(201, 168, 76, 0.15)', marginVertical: 8 },
  actionRow: { flexDirection: 'row', gap: 6 },
  btnAction: {
    flex: 1,
    backgroundColor: 'rgba(201, 168, 76, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(201, 168, 76, 0.4)',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActionText: { color: '#F3CE65', fontSize: 9, fontFamily: 'serif', fontWeight: 'bold', letterSpacing: 1.5 },
});