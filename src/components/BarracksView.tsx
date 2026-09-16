import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Shield, Plus, Lock } from 'lucide-react-native';
import { MILITARY_CATALOG, MilitaryUnitType, PlayerBarracks } from '../types/military';
import { PlayerWarehouse } from '../types/politics';

interface BarracksViewProps {
  barracks: PlayerBarracks;
  warehouse: PlayerWarehouse;
  playerGold: number;
  onTrainUnit: (unitType: MilitaryUnitType) => void;
  onUpgradeBarracks: () => void;
}

export function BarracksView({
  barracks,
  warehouse,
  playerGold,
  onTrainUnit,
  onUpgradeBarracks,
}: BarracksViewProps) {
  const currentTotalUnits = Object.values(barracks.units).reduce((a, b) => a + b, 0);
  const capacityPercent = Math.min((currentTotalUnits / barracks.maxCapacity) * 100, 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.banner}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Shield size={28} color="#EF4444" />
          <View>
            <Text style={styles.title}>BEREK TENTERA KEDAULATAN</Text>
            <Text style={styles.sub}>Tahap Berek: {barracks.level} • Kuasa Tempur: {barracks.totalMilitaryPower.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statVal}>{currentTotalUnits} / {barracks.maxCapacity}</Text>
          <Text style={styles.statLbl}>KAPASITI</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.secTitle}>PENGGUNAAN RUANG BEREK</Text>
          <Text style={styles.goldTxt}>{capacityPercent.toFixed(1)}% Penuh</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${capacityPercent}%` as any }]} />
        </View>
        <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgradeBarracks}>
          <Text style={styles.upgradeBtnTxt}>⬆ NAIK TARAF BEREK (+$35,000 EMAS)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.secTitle}>UNIT KETENTERAAN (TERTAKLUK TAHAP BEREK)</Text>
        <Text style={styles.cardDesc}>Tingkatkan tahap berek untuk membuka unit berkuasa tinggi:</Text>

        {Object.values(MILITARY_CATALOG).map((unit) => {
          const isLocked = barracks.level < unit.minBarracksLevel;
          const ownedCount = barracks.units[unit.type] || 0;
          const requiredResource = unit.trainingCost.resource;
          const availableStock = warehouse[requiredResource] || 0;
          const hasEnoughRes = availableStock >= unit.trainingCost.amount;
          const hasEnoughGold = playerGold >= unit.trainingCost.gold;
          const canTrain = !isLocked && hasEnoughRes && hasEnoughGold && currentTotalUnits < barracks.maxCapacity;

          return (
            <View key={unit.type} style={[styles.unitCard, isLocked && styles.unitCardLocked]}>
              <View style={styles.rowBetween}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 24, opacity: isLocked ? 0.4 : 1 }}>{unit.icon}</Text>
                  <View>
                    <Text style={[styles.unitName, isLocked && { color: '#64748B' }]}>{unit.name}</Text>
                    <Text style={styles.unitPower}>Kekuatan: +{unit.power} DMG</Text>
                    {!isLocked ? (
                      <Text style={styles.unitOwned}>Dimiliki: <Text style={styles.whiteBold}>{ownedCount} Unit</Text></Text>
                    ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Lock size={12} color="#EF4444" />
                        <Text style={styles.lockTxt}>Memerlukan Berek Tahap {unit.minBarracksLevel}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {!isLocked ? (
                  <TouchableOpacity
                    disabled={!canTrain}
                    style={[styles.trainBtn, !canTrain && { opacity: 0.4, backgroundColor: '#1E293B' }]}
                    onPress={() => onTrainUnit(unit.type)}
                  >
                    <Plus size={14} color="#07090E" />
                    <Text style={styles.trainBtnTxt}>LATIH</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.lockedBadge}>
                    <Text style={styles.lockedBadgeTxt}>TERKUNCI</Text>
                  </View>
                )}
              </View>

              {!isLocked && (
                <View style={styles.costRow}>
                  <Text style={styles.costItem}>Kos: <Text style={styles.goldTxt}>{unit.trainingCost.amount} {requiredResource}</Text></Text>
                  <Text style={styles.costItem}>Emas: <Text style={styles.goldTxt}>${unit.trainingCost.gold.toLocaleString()}</Text></Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090E', paddingHorizontal: 12 },
  banner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0D131C', borderRadius: 8, borderWidth: 1, borderColor: '#8B111A', padding: 14, marginVertical: 10 },
  title: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold' },
  sub: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  statBox: { backgroundColor: '#16121E', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#332446', alignItems: 'flex-end' },
  statVal: { color: '#EF4444', fontSize: 13, fontWeight: 'bold' },
  statLbl: { color: '#64748B', fontSize: 7, fontWeight: 'bold' },
  card: { backgroundColor: '#0E0B14', borderRadius: 8, borderWidth: 1, borderColor: '#3D311F', padding: 12, marginBottom: 10 },
  secTitle: { color: '#EF4444', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  cardDesc: { color: '#888', fontSize: 10, marginVertical: 4 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goldTxt: { color: '#F59E0B', fontWeight: 'bold' },
  whiteBold: { color: '#FFF', fontWeight: 'bold' },
  track: { height: 6, backgroundColor: '#262016', borderRadius: 3, marginTop: 6, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#EF4444', borderRadius: 3 },
  upgradeBtn: { backgroundColor: '#B45309', paddingVertical: 8, borderRadius: 4, alignItems: 'center', marginTop: 10 },
  upgradeBtnTxt: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  unitCard: { backgroundColor: '#130F1A', borderRadius: 6, borderWidth: 1, borderColor: '#2B1E3B', padding: 10, marginTop: 8 },
  unitCardLocked: { opacity: 0.6, borderColor: '#1F2937', backgroundColor: '#0B0F17' },
  unitName: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold' },
  unitPower: { color: '#38BDF8', fontSize: 10, marginTop: 1 },
  unitOwned: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  lockTxt: { color: '#EF4444', fontSize: 9, fontWeight: 'bold' },
  trainBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4 },
  trainBtnTxt: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  lockedBadge: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  lockedBadgeTxt: { color: '#64748B', fontSize: 9, fontWeight: 'bold' },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#1E1826', paddingTop: 6, marginTop: 8 },
  costItem: { color: '#64748B', fontSize: 9 },
});