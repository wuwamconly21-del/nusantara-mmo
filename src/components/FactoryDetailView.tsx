import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { ChevronLeft, ArrowUpCircle, Clock } from 'lucide-react-native';
import { TAKHTA_FACTORY_CATALOG } from '../systems/FactoryCatalog';
import { AdvancedFactoryData } from '../types/politics';

interface FactoryDetailViewProps {
  factory: AdvancedFactoryData;
  playerGold: number;
  currentPlayerId: string;
  currentRegionId: string;
  isHomeRegion: boolean;
  taxRatePercent: number;
  lastWorkTimestamp: number; // Masa terakhir bekerja (milisaat)
  onBack: () => void;
  onWorkInFactory: (factoryId: string) => void;
  onSaveWage: (factoryId: string, type: 'PERCENTAGE' | 'FIXED', rate: number) => void;
  onDepositTreasury: (factoryId: string, amount: number) => void;
  onWithdrawTreasury: (factoryId: string, amount: number) => void;
  onUpgradeFactory: (factoryId: string, cost: number) => void;
  onCloseFactory: (factoryId: string) => void;
  onTravelToRegion: (regionId: string, regionName: string) => void;
}

const WORK_COOLDOWN_MS = 10 * 60 * 1000; // 10 Minit (600,000 ms)

export function FactoryDetailView({
  factory,
  playerGold,
  currentPlayerId,
  currentRegionId,
  isHomeRegion,
  taxRatePercent,
  lastWorkTimestamp,
  onBack,
  onWorkInFactory,
  onSaveWage,
  onDepositTreasury,
  onWithdrawTreasury,
  onUpgradeFactory,
  onCloseFactory,
  onTravelToRegion,
}: FactoryDetailViewProps) {
  const isOwner = factory.ownerId === currentPlayerId;
  const isAtThisRegion = currentRegionId === factory.regionId;
  const bp = TAKHTA_FACTORY_CATALOG[factory.factoryType] || TAKHTA_FACTORY_CATALOG['Kilang Berlian'];

  const [wageType, setWageType] = useState<'PERCENTAGE' | 'FIXED'>(factory.wageType);
  const [wageRateInput, setWageRateInput] = useState<string>(factory.wageRate.toString());
  const [depositInput, setDepositInput] = useState<string>('');
  const [withdrawInput, setWithdrawInput] = useState<string>('');
  const [now, setNow] = useState<number>(Date.now());

  // Jam randik pengira saat baki masa sejuk
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeElapsed = now - lastWorkTimestamp;
  const cooldownRemaining = Math.max(0, WORK_COOLDOWN_MS - timeElapsed);
  const isCooldownActive = cooldownRemaining > 0;

  const formatCooldown = (ms: number) => {
    const totalSecs = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const upgradeCost = factory.level * 35000;
  const rawOutput = bp.baseOutput * factory.level;
  const stateTaxShare = Math.floor(rawOutput * (taxRatePercent / 100));
  const workerResourceShare = rawOutput - stateTaxShare;

  const estimatedGold = isHomeRegion
    ? Math.floor(4500 * (factory.wageRate / 100) * 1.25)
    : Math.floor(4500 * (factory.wageRate / 100));

  const handleSaveWage = () => {
    const val = parseInt(wageRateInput, 10);
    if (isNaN(val) || val < 0) return;
    if (wageType === 'PERCENTAGE' && val > 100) {
      alert('Kadar peratusan tidak boleh melebihi 100%');
      return;
    }
    onSaveWage(factory.id, wageType, val);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      {/* 1. Header Navigasi */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={16} color="#F3CE65" />
          <Text style={styles.backBtnText}>KEMBALI</Text>
        </TouchableOpacity>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>Tahap {factory.level}</Text>
        </View>
      </View>

      {/* 2. Kad Kilang */}
      <View style={styles.bannerCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 24 }}>{bp.icon}</Text>
          <View>
            <Text style={styles.factoryTitle}>{factory.name}</Text>
            <Text style={styles.factorySubTitle}>{bp.category.toUpperCase()} • HASIL: {bp.outputName}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>👤 {factory.ownerName}</Text>
          <Text style={styles.metaItem}>🏛 {factory.stateName}</Text>
          <Text style={styles.metaItem}>📍 {factory.regionName}</Text>
        </View>

        {/* Agihan Cukai Negeri vs Gudang Pemain */}
        <View style={styles.taxSplitCard}>
          <Text style={styles.taxSplitTitle}>AGIHAN HASIL (CUKAI WILAYAH {taxRatePercent}%)</Text>
          <View style={styles.taxSplitRow}>
            <Text style={styles.taxSplitTxt}>Kutipan Cukai Wilayah: <Text style={styles.goldTxt}>+{stateTaxShare} {bp.outputName}</Text></Text>
            <Text style={styles.taxSplitTxt}>Masuk Gudang Peribadi: <Text style={styles.greenTxt}>+{workerResourceShare} {bp.outputName}</Text></Text>
          </View>
        </View>

        {/* 4 Statistik Utama */}
        <View style={styles.metricsQuad}>
          <View style={styles.metricCell}>
            <Text style={styles.metricNum}>{factory.workerCount}/{factory.maxWorkers}</Text>
            <Text style={styles.metricLbl}>PEKERJA</Text>
          </View>
          <View style={styles.metricCell}>
            <Text style={styles.metricNum}>${factory.treasury.toLocaleString()}</Text>
            <Text style={styles.metricLbl}>PERBENDAHARAAN</Text>
          </View>
          <View style={styles.metricCell}>
            <Text style={styles.metricNum}>%{factory.wageRate}</Text>
            <Text style={styles.metricLbl}>GAJI</Text>
          </View>
          <View style={styles.metricCell}>
            <Text style={styles.metricNum}>{isHomeRegion ? '390 XP' : '300 XP'}</Text>
            <Text style={styles.metricLbl}>XP</Text>
          </View>
        </View>

        {/* Jangkaan Pendapatan */}
        <View style={styles.incomeBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.incomeLbl}>JANGKAAN PENDAPATAN TUNAI</Text>
            {isHomeRegion && (
              <View style={styles.homeBadge}>
                <Text style={styles.homeBadgeTxt}>★ BONUS WILAYAH SENDIRI (+25%)</Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Text style={styles.incomeVal}>💰 ${estimatedGold.toLocaleString()}</Text>
            <View style={styles.xpMiniPill}><Text style={styles.xpMiniTxt}>{isHomeRegion ? '+45 XP' : '+30 XP'}</Text></View>
            <View style={styles.stockMiniPill}><Text style={styles.stockMiniTxt}>+{workerResourceShare} {bp.outputName}</Text></View>
          </View>
        </View>

        {/* Butang Bekerja dengan Pemasa Sejuk 10 Minit */}
        {isAtThisRegion ? (
          <TouchableOpacity
            disabled={isCooldownActive}
            style={[styles.btnWorkNow, isCooldownActive && styles.btnWorkDisabled]}
            onPress={() => onWorkInFactory(factory.id)}
          >
            {isCooldownActive ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Clock size={15} color="#94A3B8" />
                <Text style={styles.btnWorkDisabledTxt}>
                  BEREHAT SEBENTAR (BAKI {formatCooldown(cooldownRemaining)})
                </Text>
              </View>
            ) : (
              <Text style={styles.btnWorkNowTxt}>BEKERJA DI SINI (-10 HP)</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.travelNoticeBox}>
            <Text style={styles.travelNoticeTxt}>
              ⚠ Anda berada di zon lain! Bekerja di kilang ini memerlukan anda berpindah ke {factory.regionName}.
            </Text>
            <TouchableOpacity
              style={styles.btnTravel}
              onPress={() => onTravelToRegion(factory.regionId, factory.regionName)}
            >
              <Text style={styles.btnTravelTxt}>✈ PINDAH KE {factory.regionName.toUpperCase()} SEKARANG</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 3. Panel Kawalan Pemilik */}
      {isOwner && (
        <View style={styles.ownerPanel}>
          <Text style={styles.panelTitle}>PANEL PENTADBIRAN KILANG</Text>

          <Text style={styles.fieldLbl}>KAEDAH UPAH PEKERJA</Text>
          <View style={styles.wageToggleRow}>
            <TouchableOpacity
              style={[styles.wageToggleBtn, wageType === 'PERCENTAGE' && styles.wageToggleBtnActive]}
              onPress={() => setWageType('PERCENTAGE')}
            >
              <Text style={[styles.wageToggleTxt, wageType === 'PERCENTAGE' && styles.wageToggleTxtActive]}>
                PERATUS (%)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.wageToggleBtn, wageType === 'FIXED' && styles.wageToggleBtnActive]}
              onPress={() => setWageType('FIXED')}
            >
              <Text style={[styles.wageToggleTxt, wageType === 'FIXED' && styles.wageToggleTxtActive]}>
                TETAP ($)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputActionRow}>
            <Text style={styles.fieldLbl}>KADAR GAJI ({wageType === 'PERCENTAGE' ? '%' : 'RM'}):</Text>
            <View style={{ flexDirection: 'row', gap: 6, flex: 1, justifyContent: 'flex-end' }}>
              <TextInput
                style={styles.smallInput}
                keyboardType="numeric"
                value={wageRateInput}
                onChangeText={setWageRateInput}
              />
              <TouchableOpacity style={styles.btnSimpan} onPress={handleSaveWage}>
                <Text style={styles.btnSimpanTxt}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.fieldLbl, { marginTop: 14 }]}>
            PERBENDAHARAAN KILANG: ${factory.treasury.toLocaleString()}
          </Text>

          <View style={styles.depositRow}>
            <TextInput
              style={styles.mainInput}
              placeholder="Jumlah deposit..."
              placeholderTextColor="#555"
              keyboardType="numeric"
              value={depositInput}
              onChangeText={setDepositInput}
            />
            <TouchableOpacity
              style={styles.btnDeposit}
              onPress={() => {
                const val = parseInt(depositInput, 10);
                if (!isNaN(val) && val > 0 && playerGold >= val) {
                  onDepositTreasury(factory.id, val);
                  setDepositInput('');
                } else {
                  alert('Emas tidak mencukupi.');
                }
              }}
            >
              <Text style={styles.btnDepositTxt}>DEPOSIT</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.depositRow}>
            <TextInput
              style={styles.mainInput}
              placeholder="Jumlah keluaran..."
              placeholderTextColor="#555"
              keyboardType="numeric"
              value={withdrawInput}
              onChangeText={setWithdrawInput}
            />
            <TouchableOpacity
              style={styles.btnWithdraw}
              onPress={() => {
                const val = parseInt(withdrawInput, 10);
                if (!isNaN(val) && val > 0 && factory.treasury >= val) {
                  onWithdrawTreasury(factory.id, val);
                  setWithdrawInput('');
                } else {
                  alert('Dana kilang tidak cukup.');
                }
              }}
            >
              <Text style={styles.btnWithdrawTxt}>KELUARKAN</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.upgradeSection}>
            <Text style={styles.fieldLbl}>NAIK TARAF INDUSTRI</Text>
            <TouchableOpacity
              style={styles.btnUpgrade}
              onPress={() => onUpgradeFactory(factory.id, upgradeCost)}
            >
              <ArrowUpCircle size={15} color="#07090E" />
              <Text style={styles.btnUpgradeTxt}>
                NAIK KE TAHAP {factory.level + 1} ({upgradeCost.toLocaleString()} EMAS)
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnCloseFactory} onPress={() => onCloseFactory(factory.id)}>
            <Text style={styles.btnCloseFactoryTxt}>TUTUP KILANG</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090E', paddingHorizontal: 12 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtnText: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold' },
  levelBadge: { backgroundColor: '#131A26', borderWidth: 1, borderColor: '#2B3950', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  levelBadgeText: { color: '#E2E8F0', fontSize: 11, fontWeight: 'bold' },
  bannerCard: { backgroundColor: '#0D131C', borderRadius: 8, borderWidth: 1, borderColor: '#1F2B3E', padding: 14, marginBottom: 12 },
  factoryTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold' },
  factorySubTitle: { color: '#64748B', fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: 12, marginVertical: 8 },
  metaItem: { color: '#38BDF8', fontSize: 10 },
  taxSplitCard: { backgroundColor: '#0A1017', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#1E2B3D', marginVertical: 6 },
  taxSplitTitle: { color: '#F59E0B', fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 },
  taxSplitRow: { marginTop: 4 },
  taxSplitTxt: { color: '#94A3B8', fontSize: 10 },
  goldTxt: { color: '#FBBF24', fontWeight: 'bold' },
  greenTxt: { color: '#10B981', fontWeight: 'bold' },
  metricsQuad: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#080C12', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, marginVertical: 8, borderWidth: 1, borderColor: '#192433' },
  metricCell: { alignItems: 'center' },
  metricNum: { color: '#F8FAFC', fontSize: 13, fontWeight: 'bold' },
  metricLbl: { color: '#64748B', fontSize: 8, marginTop: 2 },
  incomeBox: { backgroundColor: '#0B1522', borderRadius: 6, padding: 10, borderWidth: 1, borderColor: '#1E3A5F', marginVertical: 8 },
  incomeLbl: { color: '#64748B', fontSize: 8, fontWeight: 'bold' },
  incomeVal: { color: '#34D399', fontSize: 14, fontWeight: 'bold' },
  homeBadge: { backgroundColor: '#064E3B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
  homeBadgeTxt: { color: '#6EE7B7', fontSize: 8, fontWeight: 'bold' },
  xpMiniPill: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  xpMiniTxt: { color: '#38BDF8', fontSize: 9, fontWeight: 'bold' },
  stockMiniPill: { backgroundColor: '#142E1F', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#10B981' },
  stockMiniTxt: { color: '#10B981', fontSize: 9, fontWeight: 'bold' },
  btnWorkNow: { backgroundColor: '#D97706', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  btnWorkNowTxt: { color: '#07090E', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  btnWorkDisabled: { backgroundColor: '#131A26', borderWidth: 1, borderColor: '#334155' },
  btnWorkDisabledTxt: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  travelNoticeBox: { backgroundColor: '#2B1417', borderWidth: 1, borderColor: '#EF4444', padding: 10, borderRadius: 6, marginTop: 8 },
  travelNoticeTxt: { color: '#FCA5A5', fontSize: 10, marginBottom: 8, lineHeight: 14 },
  btnTravel: { backgroundColor: '#DC2626', paddingVertical: 8, borderRadius: 4, alignItems: 'center' },
  btnTravelTxt: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  ownerPanel: { backgroundColor: '#0A0F17', borderRadius: 8, borderWidth: 1, borderColor: '#1E2B3D', padding: 14, marginBottom: 12 },
  panelTitle: { color: '#F59E0B', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 8 },
  fieldLbl: { color: '#94A3B8', fontSize: 10, fontWeight: 'bold', marginTop: 6 },
  wageToggleRow: { flexDirection: 'row', gap: 8, marginVertical: 6 },
  wageToggleBtn: { flex: 1, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155', paddingVertical: 8, alignItems: 'center', borderRadius: 4 },
  wageToggleBtnActive: { backgroundColor: '#B45309', borderColor: '#F59E0B' },
  wageToggleTxt: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold' },
  wageToggleTxtActive: { color: '#FFF' },
  inputActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  smallInput: { width: 70, backgroundColor: '#05070A', borderWidth: 1, borderColor: '#334155', color: '#FFF', borderRadius: 4, height: 32, textAlign: 'center', fontSize: 11 },
  btnSimpan: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#475569', paddingHorizontal: 10, justifyContent: 'center', borderRadius: 4 },
  btnSimpanTxt: { color: '#CBD5E1', fontSize: 10, fontWeight: 'bold' },
  depositRow: { flexDirection: 'row', gap: 8, marginVertical: 4 },
  mainInput: { flex: 1, backgroundColor: '#05070A', borderWidth: 1, borderColor: '#334155', borderRadius: 4, color: '#FFF', paddingHorizontal: 10, height: 36, fontSize: 11 },
  btnDeposit: { backgroundColor: '#065F46', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 4 },
  btnDepositTxt: { color: '#A7F3D0', fontSize: 10, fontWeight: 'bold' },
  btnWithdraw: { backgroundColor: '#7F1D1D', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 4 },
  btnWithdrawTxt: { color: '#FECACA', fontSize: 10, fontWeight: 'bold' },
  upgradeSection: { borderTopWidth: 1, borderColor: '#1E293B', paddingTop: 10, marginTop: 12 },
  btnUpgrade: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#D97706', paddingVertical: 10, borderRadius: 6, marginTop: 6 },
  btnUpgradeTxt: { color: '#07090E', fontSize: 11, fontWeight: 'bold' },
  btnCloseFactory: { backgroundColor: '#1A0E12', borderWidth: 1, borderColor: '#EF4444', paddingVertical: 8, borderRadius: 6, alignItems: 'center', marginTop: 14 },
  btnCloseFactoryTxt: { color: '#EF4444', fontSize: 10, fontWeight: 'bold' },
});