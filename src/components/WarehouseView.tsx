import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Package, TrendingUp, DollarSign, ArrowRightLeft } from 'lucide-react-native';
import { PlayerWarehouse, ResourceId } from '../types/politics';
import { TAKHTA_FACTORY_CATALOG } from '../systems/FactoryCatalog';

interface WarehouseViewProps {
  warehouse: PlayerWarehouse;
  playerGold: number;
  onSellResource: (resourceId: ResourceId, amount: number, unitPrice: number) => void;
  onBack: () => void;
}

// Anggaran harga pasaran semasa untuk setiap unit sumber (RM)
const RESOURCE_MARKET_PRICES: Record<ResourceId, number> = {
  BERLIAN: 450,
  KULIT: 35,
  EMAS: 180,
  MINYAK: 60,
  MINYAK_DITAPIS: 120,
  NTE: 250,
  BAUKSIT: 45,
  KAYU_CENDANA: 30,
  KOPI: 20,
  GANDUM: 15,
};

export function WarehouseView({
  warehouse,
  playerGold,
  onSellResource,
  onBack,
}: WarehouseViewProps) {
  const [selectedRes, setSelectedRes] = useState<ResourceId>('BERLIAN');
  const [sellAmount, setSellAmount] = useState<string>('10');

  const availableStock = warehouse[selectedRes] || 0;
  const currentUnitPrice = RESOURCE_MARKET_PRICES[selectedRes] || 20;
  const numToSell = Math.min(Math.max(0, parseInt(sellAmount, 10) || 0), availableStock);
  const totalSaleValue = numToSell * currentUnitPrice;

  const handleSell = () => {
    if (numToSell <= 0) return;
    onSellResource(selectedRes, numToSell, currentUnitPrice);
    setSellAmount('10');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Header Halaman Gudang */}
      <View style={styles.headerBanner}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Package size={26} color="#F3CE65" />
          <View>
            <Text style={styles.headerTitle}>GEDUNG SIMPANAN PERIBADI</Text>
            <Text style={styles.headerSub}>Pengurusan 10 Bahan Mentah & Penjualan Pasaran</Text>
          </View>
        </View>
        <View style={styles.goldBadge}>
          <Text style={styles.goldVal}>💰 ${playerGold.toLocaleString()}</Text>
          <Text style={styles.goldLbl}>BAKI TUNAI</Text>
        </View>
      </View>

      {/* Grid 10 Komoditi Simpanan */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>KOMODITI DALAM SIMPANAN</Text>
        <Text style={styles.cardDesc}>Pilih mana-mana komoditi untuk melihat sebut harga atau menjual ke pasaran borong:</Text>

        <View style={styles.grid}>
          {Object.entries(warehouse).map(([key, amount]) => {
            const resKey = key as ResourceId;
            const isSelected = selectedRes === resKey;
            const catalogItem = Object.values(TAKHTA_FACTORY_CATALOG).find(
              (f) => f.resourceId === resKey
            );
            const icon = catalogItem?.icon || '📦';
            const unitPrice = RESOURCE_MARKET_PRICES[resKey] || 20;

            return (
              <TouchableOpacity
                key={resKey}
                style={[styles.cell, isSelected && styles.cellSelected]}
                onPress={() => {
                  setSelectedRes(resKey);
                  setSellAmount('10');
                }}
              >
                <Text style={{ fontSize: 22 }}>{icon}</Text>
                <Text style={[styles.cellName, isSelected && { color: '#F3CE65' }]} numberOfLines={1}>
                  {resKey.replace('_', ' ')}
                </Text>
                <Text style={styles.cellAmount}>{amount.toLocaleString()}</Text>
                <Text style={styles.cellPrice}>${unitPrice}/unit</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Panel Dagangan Pasaran Terpilih */}
      <View style={styles.tradeCard}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.tradeTitle}>PASARAN BORONG: {selectedRes.replace('_', ' ')}</Text>
            <Text style={styles.tradeSub}>
              Stok Tersedia: <Text style={styles.whiteBold}>{availableStock.toLocaleString()} Unit</Text>
            </Text>
          </View>
          <View style={styles.pricePill}>
            <Text style={styles.pricePillTxt}>${currentUnitPrice} / unit</Text>
          </View>
        </View>

        <View style={styles.sellActionBox}>
          <Text style={styles.inputLbl}>Kuantiti Jualan:</Text>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={sellAmount}
              onChangeText={setSellAmount}
            />
            <TouchableOpacity
              style={styles.btnMax}
              onPress={() => setSellAmount(availableStock.toString())}
            >
              <Text style={styles.btnMaxTxt}>MAKS</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.rowBetween, { marginTop: 12 }]}>
            <Text style={styles.totalValueTxt}>
              Nilai Pulangan: <Text style={styles.goldHighlight}>+${totalSaleValue.toLocaleString()} RM</Text>
            </Text>
            <TouchableOpacity
              disabled={numToSell <= 0}
              style={[styles.btnSell, numToSell <= 0 && { opacity: 0.5 }]}
              onPress={handleSell}
            >
              <DollarSign size={14} color="#07090E" />
              <Text style={styles.btnSellTxt}>JUAL KE PASARAN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090E', paddingHorizontal: 12 },
  headerBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0D131C',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2B3E',
    padding: 14,
    marginVertical: 10,
  },
  headerTitle: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 },
  headerSub: { color: '#64748B', fontSize: 9, marginTop: 2 },
  goldBadge: {
    backgroundColor: '#16121E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#332446',
    alignItems: 'flex-end',
  },
  goldVal: { color: '#F59E0B', fontSize: 13, fontWeight: 'bold' },
  goldLbl: { color: '#64748B', fontSize: 7, fontWeight: 'bold', marginTop: 1 },
  card: {
    backgroundColor: '#0E0B14',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3D311F',
    padding: 12,
    marginBottom: 10,
  },
  sectionTitle: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  cardDesc: { color: '#888', fontSize: 10, marginVertical: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  cell: {
    width: '31.5%',
    backgroundColor: '#140F1D',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#251D30',
    alignItems: 'center',
  },
  cellSelected: { borderColor: '#F3CE65', backgroundColor: '#21182B' },
  cellName: { color: '#94A3B8', fontSize: 8, fontWeight: 'bold', marginTop: 4 },
  cellAmount: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  cellPrice: { color: '#10B981', fontSize: 8, marginTop: 2 },
  tradeCard: {
    backgroundColor: '#0D131C',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1F2B3E',
    padding: 14,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tradeTitle: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold' },
  tradeSub: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  whiteBold: { color: '#FFF', fontWeight: 'bold' },
  pricePill: { backgroundColor: '#131A26', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#2B3950' },
  pricePillTxt: { color: '#10B981', fontSize: 10, fontWeight: 'bold' },
  sellActionBox: { backgroundColor: '#07090E', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#1A2433', marginTop: 10 },
  inputLbl: { color: '#94A3B8', fontSize: 9, fontWeight: 'bold', marginBottom: 4 },
  input: {
    flex: 1,
    backgroundColor: '#0D131C',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 4,
    color: '#FFF',
    paddingHorizontal: 10,
    height: 36,
    fontSize: 12,
  },
  btnMax: { backgroundColor: '#1E293B', paddingHorizontal: 12, height: 36, justifyContent: 'center', borderRadius: 4 },
  btnMaxTxt: { color: '#F3CE65', fontSize: 10, fontWeight: 'bold' },
  totalValueTxt: { color: '#94A3B8', fontSize: 10 },
  goldHighlight: { color: '#F59E0B', fontWeight: 'bold', fontSize: 12 },
  btnSell: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3CE65', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 4 },
  btnSellTxt: { color: '#07090E', fontSize: 10, fontWeight: 'bold' },
});