import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Landmark, Building, Factory, Shield, Coins, Pickaxe } from 'lucide-react-native';

interface WilayahDetailViewProps {
  regionName: string;
  countryName: string;
  treasuryGold: number;
  onBack: () => void;
}

export const WilayahDetailView: React.FC<WilayahDetailViewProps> = ({
  regionName,
  countryName,
  treasuryGold,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      {/* HEADER TOP BAR */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={16} color="#F3CE65" />
          <Text style={styles.backBtnTxt}>KEMBALI</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WILAYAH {regionName.toUpperCase()}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12 }}>
        {/* CARD TOP SUMMARY */}
        <View style={styles.cardGolden}>
          <Text style={styles.regionTitle}>{regionName}</Text>
          <Text style={styles.countrySub}>{countryName}</Text>

          {/* INFRASTRUKTUR WILAYAH STATS */}
          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>🏗️ INFRASTRUKTUR WILAYAH</Text>
          <View style={styles.infraGrid}>
            <View style={styles.infraBox}>
              <Landmark size={18} color="#F3CE65" />
              <Text style={styles.infraNum}>5 / 10</Text>
              <Text style={styles.infraSub}>PENTADBIRAN</Text>
            </View>
            <View style={styles.infraBox}>
              <Shield size={18} color="#EF4444" />
              <Text style={styles.infraNum}>5 / 10</Text>
              <Text style={styles.infraSub}>KETENTERAAN</Text>
            </View>
            <View style={styles.infraBox}>
              <Factory size={18} color="#38BDF8" />
              <Text style={styles.infraNum}>6 / 10</Text>
              <Text style={styles.infraSub}>PERUSAHAAN</Text>
            </View>
            <View style={styles.infraBox}>
              <Building size={18} color="#10B981" />
              <Text style={styles.infraNum}>7 / 10</Text>
              <Text style={styles.infraSub}>KESIHATAN</Text>
            </View>
          </View>
        </View>

        {/* PERBENDAHARAAN & CUKAI WILAYAH */}
        <View style={styles.cardGolden}>
          <Text style={styles.sectionTitle}>💰 PERBENDAHARAAN WILAYAH</Text>
          <Text style={styles.goldBigText}>${treasuryGold.toLocaleString()} RM</Text>

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>📊 CUKAI WILAYAH</Text>
          <View style={styles.taxRow}>
            <View style={styles.taxBox}><Text style={styles.taxPercent}>10%</Text><Text style={styles.taxLabel}>BERLIAN</Text></View>
            <View style={styles.taxBox}><Text style={styles.taxPercent}>10%</Text><Text style={styles.taxLabel}>EMAS</Text></View>
            <View style={styles.taxBox}><Text style={styles.taxPercent}>10%</Text><Text style={styles.taxLabel}>MINYAK</Text></View>
            <View style={styles.taxBox}><Text style={styles.taxPercent}>10%</Text><Text style={styles.taxLabel}>NTE</Text></View>
          </View>
        </View>

        {/* SUMBER & BONUS WILAYAH */}
        <View style={styles.cardGolden}>
          <Text style={styles.sectionTitle}>📦 KADAR SUMBER WILAYAH</Text>
          <View style={styles.resourceGrid}>
            <View style={styles.resourceItem}>
              <Pickaxe size={14} color="#F59E0B" />
              <Text style={styles.whiteTxt}>Berlian: 800</Text>
            </View>
            <View style={styles.resourceItem}>
              <Coins size={14} color="#F59E0B" />
              <Text style={styles.whiteTxt}>Emas: 800</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07060A' },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#09070D',
    borderBottomWidth: 1,
    borderColor: '#1E1826',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backBtnTxt: { color: '#F3CE65', fontSize: 10, fontWeight: 'bold' },
  headerTitle: { color: '#F3CE65', fontSize: 12, fontWeight: 'bold', marginLeft: 12 },
  cardGolden: {
    backgroundColor: '#0E0B14',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3D311F',
    padding: 12,
    marginBottom: 10,
  },
  regionTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  countrySub: { color: '#F3CE65', fontSize: 10, marginTop: 2 },
  sectionTitle: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  infraGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  infraBox: {
    backgroundColor: '#181320',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2B2035',
    padding: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  infraNum: { color: '#FFF', fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  infraSub: { color: '#64748B', fontSize: 7, marginTop: 2 },
  goldBigText: { color: '#F59E0B', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  taxRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  taxBox: { flex: 1, backgroundColor: '#14101B', padding: 8, borderRadius: 4, alignItems: 'center', borderWidth: 1, borderColor: '#2B2035' },
  taxPercent: { color: '#10B981', fontSize: 12, fontWeight: 'bold' },
  taxLabel: { color: '#64748B', fontSize: 8, marginTop: 2 },
  resourceGrid: { marginTop: 8, gap: 6 },
  resourceItem: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#14101B', padding: 8, borderRadius: 4 },
  whiteTxt: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
});