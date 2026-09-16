import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { calculateTravelOptions, TravelOption, TravelSession } from '../../services/travelEngine';

export interface TravelDrawerProps {
  currentRegion: { code: string; name: string; country: string };
  targetRegion: { code: string; name: string; country: string };
  userBalance: number;
  onStartTravel: (session: TravelSession) => void;
  onClose: () => void;
}

export function TravelDrawer({
  currentRegion,
  targetRegion,
  userBalance,
  onStartTravel,
  onClose,
}: TravelDrawerProps) {
  const travelOptions = calculateTravelOptions(
    currentRegion.country,
    targetRegion.country,
    currentRegion.country !== targetRegion.country
  );

  const [selectedMode, setSelectedMode] = useState<TravelOption>(travelOptions[0]);
  const totalCost = selectedMode.ticketCost + selectedMode.tourismTax;

  const handleConfirmTravel = () => {
    if (userBalance < totalCost) {
      const msg = `Baki dana tidak mencukupi! Kos keseluruhan ialah RM ${totalCost.toLocaleString()}`;
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Dana Tidak Cukup', msg);
      return;
    }

    const now = Date.now();
    const durationMs = selectedMode.durationMinutes * 60 * 1000;

    const session: TravelSession = {
      originCode: currentRegion.code,
      targetCode: targetRegion.code,
      targetName: targetRegion.name,
      targetCountry: targetRegion.country,
      mode: selectedMode.mode,
      startTime: now,
      arrivalTime: now + durationMs,
      totalCost,
    };

    onStartTravel(session);
  };

  return (
    <View style={styles.overlayContainer}>
      <View style={styles.drawerCard}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>✈️ SISTEM TRANSIT & PERJALANAN</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeTxt}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* LOKASI ASAL & DESTINASI */}
        <View style={styles.routeBox}>
          <View style={styles.routeNode}>
            <Text style={styles.routeLabel}>LOKASI SEMASA</Text>
            <Text style={styles.routeName}>{currentRegion.name}</Text>
          </View>
          <Text style={styles.routeArrow}>
            {selectedMode.mode === 'CAR' ? '🚗' : selectedMode.mode === 'TRAIN' ? '🚆' : selectedMode.mode === 'FLIGHT' ? '✈️' : '🛳️'}
          </Text>
          <View style={styles.routeNode}>
            <Text style={styles.routeLabel}>DESTINASI</Text>
            <Text style={styles.routeName}>{targetRegion.name}</Text>
          </View>
        </View>

        {/* SENARAI MOD PENGANGKUTAN */}
        <Text style={styles.secLabel}>PILIH Kenderaan Transit:</Text>
        <ScrollView style={styles.optionsList}>
          {travelOptions.map((opt) => {
            const isSelected = selectedMode.mode === opt.mode;
            return (
              <TouchableOpacity
                key={opt.mode}
                style={[styles.optCard, isSelected && styles.optCardSelected]}
                onPress={() => setSelectedMode(opt)}
              >
                <Text style={styles.optIcon}>{opt.icon}</Text>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.optName, isSelected && styles.optNameSelected]}>{opt.name}</Text>
                  <Text style={styles.optTime}>⏱ Masa: {opt.durationMinutes} Minit</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.optPrice}>RM {opt.ticketCost}</Text>
                  <Text style={styles.optTax}>+ RM {opt.tourismTax} Cukai</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* KOS & CUKAI */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.sumLabel}>Cukai Pelancongan Negeri:</Text>
            <Text style={styles.sumValTax}>RM {selectedMode.tourismTax}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderColor: '#334155' }]}>
            <Text style={styles.totalLabel}>JUMLAH KESELURUHAN:</Text>
            <Text style={styles.totalVal}>RM {totalCost.toLocaleString()}</Text>
          </View>
        </View>

        {/* BUTANG BERGERAK */}
        <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirmTravel}>
          <Text style={styles.btnConfirmTxt}>MULAKAN PERJALANAN (BERGERAK) ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Komponen Bar Progress Masa Nyata (Jam : Minit : Saat) - Dieksport Rasmi
export function TravelProgressBar({ session, onArrivalComplete }: { session: TravelSession; onArrivalComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  useEffect(() => {
    const totalDuration = session.arrivalTime - session.startTime;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = session.arrivalTime - now;

      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setProgressPercent(100);
        onArrivalComplete();
      } else {
        setTimeLeft(remaining);
        const elapsed = now - session.startTime;
        const pct = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
        setProgressPercent(pct);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const formattedTime = `${hours > 0 ? `${hours}j ` : ''}${minutes < 10 ? '0' : ''}${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
  const iconMap: Record<string, string> = { CAR: '🚗', TRAIN: '🚆', FLIGHT: '✈️', SHIP: '🛳️' };

  return (
    <View style={barStyles.container}>
      <View style={barStyles.headerRow}>
        <Text style={barStyles.title}>
          {iconMap[session.mode] || '✈️'} DALAM PERJALANAN KE <Text style={{ color: '#FBBF24' }}>{session.targetName.toUpperCase()}</Text>
        </Text>
        <Text style={barStyles.timerTxt}>{timeLeft > 0 ? formattedTime : 'TIBA!'}</Text>
      </View>

      <View style={barStyles.track}>
        <View style={[barStyles.fill, { width: `${progressPercent}%` }]} />
      </View>
      <Text style={barStyles.subTxt}>Sila tunggu sehingga kenderaan sampai ke destinasi...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  drawerCard: { width: 420, backgroundColor: '#0F172A', borderWidth: 1.2, borderColor: '#D97706', borderRadius: 8, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  title: { color: '#F59E0B', fontSize: 13, fontWeight: 'bold' },
  closeTxt: { color: '#94A3B8', fontSize: 16, fontWeight: 'bold' },
  routeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1E293B', padding: 12, borderRadius: 6, marginBottom: 14 },
  routeNode: { alignItems: 'center', flex: 1 },
  routeLabel: { color: '#64748B', fontSize: 8, fontWeight: 'bold' },
  routeName: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  routeArrow: { fontSize: 22, marginHorizontal: 8 },
  secLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold', marginBottom: 8 },
  optionsList: { maxHeight: 180, marginBottom: 12 },
  optCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', padding: 10, borderRadius: 6, marginBottom: 8 },
  optCardSelected: { borderColor: '#F59E0B', backgroundColor: '#2E2315' },
  optNameSelected: { color: '#FBBF24' },
  optIcon: { fontSize: 22 },
  optName: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold' },
  optTime: { color: '#94A3B8', fontSize: 9, marginTop: 2 },
  optPrice: { color: '#10B981', fontSize: 12, fontWeight: 'bold' },
  optTax: { color: '#F59E0B', fontSize: 8 },
  summaryBox: { backgroundColor: '#182234', padding: 10, borderRadius: 6, marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  sumLabel: { color: '#94A3B8', fontSize: 10 },
  sumValTax: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold' },
  totalLabel: { color: '#F59E0B', fontSize: 11, fontWeight: 'bold' },
  totalVal: { color: '#10B981', fontSize: 14, fontWeight: 'bold' },
  btnConfirm: { backgroundColor: '#D97706', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  btnConfirmTxt: { color: '#0F172A', fontSize: 12, fontWeight: 'bold' },
});

const barStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: '20%',
    right: '20%',
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderWidth: 1.5,
    borderColor: '#D97706',
    borderRadius: 8,
    padding: 14,
    zIndex: 90,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { color: '#F8FAFC', fontSize: 11, fontWeight: 'bold' },
  timerTxt: { color: '#38BDF8', fontSize: 13, fontWeight: 'bold', fontFamily: 'monospace' },
  track: { height: 8, backgroundColor: '#1E293B', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  fill: { height: '100%', backgroundColor: '#10B981' },
  subTxt: { color: '#64748B', fontSize: 9, textAlign: 'center' },
});