import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Building2,
  Swords,
  Factory,
  User,
  Menu,
  ChevronLeft,
  Landmark,
  Plus,
  Package,
  Globe2,
  MapPin,
  Vote,
  Map as MapIcon,
} from 'lucide-react-native';
import { supabase } from './supabase';
import { SidebarMenu } from './src/components/SidebarMenu';
import { PetaInteraktif } from './src/components/WorldMap/PetaInteraktif';

import { StateGovernment, ElectionCycleState, PlayerWarehouse, AdvancedFactoryData, PoliticalPhase } from './src/types/politics';
import { DetailedParty } from './src/types/party';
import { PlayerDisciplines, PassiveTalents, ActiveStudySession } from './src/types/skills';
import { StateCentralBank, BankShareAsset, PlayerBankLedger } from './src/types/banking';
import { DisciplineEngine } from './src/services/DisciplineEngine';
import { LevelSystem } from './src/services/LevelSystem';
import { HomeScreen } from './src/screens/HomeScreen';
import { ElectionsScreen } from './src/screens/ElectionsScreen';
import { PartiesScreen } from './src/screens/PartiesScreen';
import { ParliamentView } from './src/components/Parliament/ParliamentView';
import { TAKHTA_FACTORY_CATALOG } from './src/systems/FactoryCatalog';
import { FactoryDetailView } from './src/components/FactoryDetailView';
import { WarehouseView } from './src/components/WarehouseView';
import { MILITARY_CATALOG, MilitaryUnitType, PlayerBarracks } from './src/types/military';
import { WarHubView } from './src/components/WarHubView';
import { CustomWarCampaign, WarType } from './src/types/military';
import { DetailedProfileView } from './src/components/DetailedProfileView';
import { CentralBankView } from './src/components/CentralBankView';
import { VisaStatusModal } from './src/components/Immigration/VisaStatusModal';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07060A' },
  centerView: { justifyContent: 'center', alignItems: 'center', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#09070D',
    borderBottomWidth: 1,
    borderColor: '#1E1826',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backBtnText: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold' },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  greenDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#10B981' },
  onlineText: { fontSize: 10, color: '#9CA3AF' },
  headerTitle: { fontSize: 12, fontWeight: 'bold', color: '#F3CE65', letterSpacing: 0.5 },
  menuButton: { padding: 4 },
  body: { flex: 1 },
  bodyContent: { padding: 12, paddingBottom: 24 },
  cardGoldenBorder: {
    backgroundColor: '#0E0B14',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3D311F',
    padding: 12,
    marginBottom: 10,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionHeaderTitle: { fontSize: 11, fontWeight: 'bold', color: '#F3CE65', letterSpacing: 1 },
  cardDesc: { fontSize: 9, color: '#888', marginTop: 2 },
  goldSmall: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold', marginTop: 2 },
  whiteBold: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  mutedSmall: { color: '#64748B', fontSize: 8, marginTop: 2 },
  bottomNav: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#07050A',
    borderTopWidth: 1,
    borderColor: '#1E1826',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bottomNavItem: { alignItems: 'center', justifyContent: 'center', paddingVertical: 6, flex: 1 },
  bottomNavItemActive: { borderTopWidth: 2, borderTopColor: '#F3CE65' },
  bottomNavText: { fontSize: 9, color: '#777', marginTop: 3 },
  bottomNavTextActive: { color: '#F3CE65', fontWeight: 'bold' },
  avatarLetter: {
    width: 44,
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F3CE65',
    backgroundColor: '#181320',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerName: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  playerSub: { fontSize: 10, color: '#F3CE65', marginTop: 1 },
  btnMiniGold: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3CE65',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  btnMiniGoldText: { color: '#07060A', fontSize: 9, fontWeight: 'bold' },
  factoryItemCard: {
    backgroundColor: '#14101B',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2B2035',
    marginTop: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#120F17',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3CE65',
    padding: 16,
  },
  catalogItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#18141F',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2B2035',
    marginBottom: 6,
  },
  catalogItemActive: { borderColor: '#F3CE65', backgroundColor: '#22192D' },
  btnTravel: {
    backgroundColor: '#1E1826',
    borderWidth: 1,
    borderColor: '#F3CE65',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnTravelTxt: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold' },
  wilayahStatBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#130F1A',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#22192D',
  },
  shortcutGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: '#120E1A',
    borderWidth: 1,
    borderColor: '#3D311F',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutText: {
    color: '#F3CE65',
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
});

type TabUtama =
  | 'utama'
  | 'peperangan'
  | 'perniagaan'
  | 'akhbar'
  | 'profil'
  | 'peta'
  | 'wilayah'
  | 'parlimen'
  | 'diplomasi'
  | 'parti'
  | 'pilihanraya'
  | 'kilang_detail'
  | 'gudang'
  | 'berek'
  | 'bank'
  | 'negara_view';

interface WilayahInfo {
  id: string;
  nama: string;
  negara: string;
  mataWang: string;
  penduduk: number;
  kilang: number;
  berek: number;
  parti: number;
  gabenor: string;
  perbendaharaan: number;
  sumberUtama: { nama: string; jumlah: number }[];
}

export default function App() {
  const [sesi, setSesi] = useState<any>(null);
  const [tabAktif, setTabAktif] = useState<TabUtama>('utama');
  const [drawerBuka, setDrawerBuka] = useState(false);
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [memuatkan, setMemuatkan] = useState(true);

  const [wilayahSemasa, setWilayahSemasa] = useState<string>('Kuala Lumpur');
  const [negaraSemasa, setNegaraSemasa] = useState<string>('Federation of Mahawangsa');
  const [onlineCount] = useState<number>(1);

  // Penjana Dinamik untuk menyokong mana-mana daripada 208 wilayah Peta Interaktif
  const getOrCreateRegionData = (name: string): WilayahInfo => {
    return {
      id: name.toLowerCase().replace(/\s+/g, '_'),
      nama: name,
      negara: 'Federation of Mahawangsa',
      mataWang: 'RM',
      penduduk: 0,
      kilang: 0,
      berek: 0,
      parti: 0,
      gabenor: 'Tiada',
      perbendaharaan: 0,
      sumberUtama: [],
    };
  };

  const infoWilayahAktif = getOrCreateRegionData(wilayahSemasa);

  // Clean state (tiada data dummy)
  const [pemainId, setPemainId] = useState<string | null>(null);
  const [namaPemain, setNamaPemain] = useState('Pemain Baru');
  const [tahap, setTahap] = useState(1);
  const [xp, setXp] = useState(0);
  const [hp, setHp] = useState(100);
  const [wang, setWang] = useState(1000);
  const [nilam, setNilam] = useState(0);
  const [lastWorkTimestamp, setLastWorkTimestamp] = useState<number>(0);

  const [disciplines, setDisciplines] = useState<PlayerDisciplines>({
    ilmuKetenteraan: 1,
    ilmuKejuruteraan: 1,
    ilmuPerusahaan: 1,
    ilmuPerbendaharaan: 1,
    ilmuFirasat: 1,
  });

  const [activeStudySession, setActiveStudySession] = useState<ActiveStudySession | null>(null);

  const [passives, setPassives] = useState<PassiveTalents>({
    pengaruhDaulat: 0,
    pakarUpeti: 0,
    langkahPantas: 0,
    gedungSaujana: 0,
    ketahananBatin: 0,
    cekapBahan: 0,
    bungaWang: 0,
    semangatWaja: 0,
  });
  const [passivePoints, setPassivePoints] = useState<number>(0);

  const [playerWarehouse, setPlayerWarehouse] = useState<PlayerWarehouse>({
    BERLIAN: 0,
    KULIT: 0,
    EMAS: 0,
    MINYAK: 0,
    MINYAK_DITAPIS: 0,
    NTE: 0,
    BAUKSIT: 0,
    KAYU_CENDANA: 0,
    KOPI: 0,
    GANDUM: 0,
  });

  const calculateMilitaryPower = (units: Partial<Record<MilitaryUnitType, number>>, warSkill: number) => {
    let basePower = 0;
    (Object.keys(MILITARY_CATALOG) as MilitaryUnitType[]).forEach((uKey) => {
      const qty = units[uKey] || 0;
      basePower += qty * MILITARY_CATALOG[uKey].power;
    });
    const skillMultiplier = 1 + (warSkill * 0.5) / 100;
    return Math.floor(basePower * skillMultiplier);
  };

  const [playerBarracks, setPlayerBarracks] = useState<PlayerBarracks>({
    level: 1,
    maxCapacity: 500,
    units: {
      INFANTRI: 0,
      KERETA_KEBAL: 0,
      DRON_SERANGAN: 0,
      JET_PEJUANG: 0,
      SUBMARINE: 0,
      STEALTH_BOMBER: 0,
      KAPAL_PERANG: 0,
      PELURU_BERPANDU: 0,
    },
    totalMilitaryPower: 0,
  });

  const [activeEventWar] = useState<CustomWarCampaign>({
    id: 'WAR_EMPTY',
    title: 'Tiada Perang Aktif',
    regionName: 'Keamanan Global',
    warCategory: 'EVENT_WAR',
    attackerName: '-',
    defenderName: '-',
    attackerTotalDamage: 0,
    defenderTotalDamage: 0,
    timeRemaining: '00:00:00',
  });
  const [realWars] = useState<CustomWarCampaign[]>([]);

  const [senaraiKilang, setSenaraiKilang] = useState<AdvancedFactoryData[]>([]);
  const [selectedFactoryId, setSelectedFactoryId] = useState<string | null>(null);
  const [modalBinaKilang, setModalBinaKilang] = useState(false);
  const [kilangDipilih, setKilangDipilih] = useState<string>('Kilang Berlian');

  const [userPartyId, setUserPartyId] = useState<string | null>(null);
  const [detailedParties, setDetailedParties] = useState<DetailedParty[]>([]);

  const [putrajayaGov] = useState<StateGovernment>({
    stateCode: 'Putrajaya_MY',
    stateName: 'Federation of Mahawangsa',
    regimeType: 'DEMOKRASI_PARLIMEN',
    totalSeats: 50,
    rulingPartyId: '',
    rulingPartyName: 'Tiada',
    rulingLeaderId: '',
    rulingLeaderName: 'Tiada',
    rulingLeaderTitle: 'Tiada',
    themeColor: '#F3CE65',
    treasuryGold: 0,
    taxRatePercent: 5,
    isEstablished: true,
    populationCount: 0,
    resources: {
      BERLIAN: 0,
      KULIT: 0,
      EMAS: 0,
      MINYAK: 0,
      MINYAK_DITAPIS: 0,
      NTE: 0,
      BAUKSIT: 0,
      KAYU_CENDANA: 0,
      KOPI: 0,
      GANDUM: 0,
    },
    activeBills: [],
    controlledTerritories: ['Kuala Lumpur'],
  });

  const [putrajayaElection, setPutrajayaElection] = useState<ElectionCycleState>({
    stateCode: 'Putrajaya_MY',
    phase: 'PEACE_TIME' as PoliticalPhase,
    currentTerm: 1,
    parties: [],
    voterLedger: {},
    nextDissolutionDate: 'TBA',
    nextElectionDate: 'TBA',
  });

  const [centralBank] = useState<StateCentralBank>({
    stateCode: 'Putrajaya_MY',
    stateName: 'Federation of Mahawangsa',
    treasuryGold: 0,
    reserveGold: 0,
    depositInterestRate: 3.0,
    loanInterestRate: 6.0,
    totalDepositedByPlayers: 0,
    totalLoansIssued: 0,
    isNationalized: true,
  });

  const [playerBankLedger] = useState<PlayerBankLedger>({
    playerId: 'PLAYER_01',
    savingsBalance: 0,
    activeLoanAmount: 0,
    loanDueTimestamp: 0,
    ownedShares: [],
  });

  const [bankShares] = useState<BankShareAsset[]>([]);

  const tunjukNotifikasi = (tajuk: string, mesej: string) => {
    if (Platform.OS === 'web') window.alert(`${tajuk}: ${mesej}`);
    else Alert.alert(tajuk, mesej);
  };

  const handleLogKeluar = async () => {
    try { await supabase.auth.signOut(); } catch (e) {}
    setSesi(null);
    setPemainId(null);
    setDrawerBuka(false);
    setTabAktif('utama');
  };

  const handleAllocatePassive = (key: keyof PassiveTalents) => {
    if (passivePoints <= 0) {
      tunjukNotifikasi('Mata Kurang', 'Tiada Baki Mata Pasif tersisa.');
      return;
    }
    setPassivePoints((p) => p - 1);
    setPassives((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    tunjukNotifikasi('Kemahiran Ditambah', '1 Mata dimasukkan ke dalam talenta pasif.');
  };

  const handleStartStudy = (key: keyof PlayerDisciplines, method: 'WANG' | 'NILAM') => {
    if (activeStudySession) {
      tunjukNotifikasi('Sedang Bertapa', 'Hanya 1 cabang ilmu boleh didalami pada satu-satu masa!');
      return;
    }

    const currentLvl = disciplines[key];
    const goldCost = DisciplineEngine.getGoldCost(currentLvl);
    const gemCost = DisciplineEngine.getGemsCost(currentLvl);
    const durationSecs = DisciplineEngine.getDurationSeconds(currentLvl, method);
    const durationMs = durationSecs * 1000;
    const now = Date.now();

    if (method === 'WANG') {
      if (wang < goldCost) {
        tunjukNotifikasi('Wang Tidak Cukup', `Perlu $${goldCost.toLocaleString()} RM.`);
        return;
      }
      setWang((w) => w - goldCost);
    } else {
      if (nilam < gemCost) {
        tunjukNotifikasi('Nilam Tidak Cukup', `Perlu ${gemCost} Permata Nilam.`);
        return;
      }
      setNilam((n) => n - gemCost);
    }

    setActiveStudySession({
      disciplineKey: key,
      method,
      targetLevel: currentLvl + 1,
      startTime: now,
      durationMs,
      endTime: now + durationMs,
    });

    tunjukNotifikasi('Mula Bertapa', `Latihan dimulakan! Baki masa: ${DisciplineEngine.formatTime(durationSecs)}.`);
  };

  const handleCompleteStudy = () => {
    if (!activeStudySession) return;
    const key = activeStudySession.disciplineKey;
    const targetLvl = activeStudySession.targetLevel;

    setDisciplines((prev) => {
      const updated = { ...prev, [key]: targetLvl };
      if (key === 'ilmuKetenteraan' || key === 'ilmuKejuruteraan') {
        const newPower = calculateMilitaryPower(playerBarracks.units, updated.ilmuKetenteraan);
        setPlayerBarracks((b) => ({
          ...b,
          level: Math.floor(updated.ilmuKetenteraan / 10) + 1,
          maxCapacity: 500 + updated.ilmuKejuruteraan * 20,
          totalMilitaryPower: newPower,
        }));
      }
      return updated;
    });

    setActiveStudySession(null);
    tunjukNotifikasi('Khatam Ilmu!', `Tahniah! ${key} meningkat ke Tahap ${targetLvl}!`);
  };

  const handleTrainUnit = (unitType: MilitaryUnitType) => {
    const bp = MILITARY_CATALOG[unitType];
    if (!bp) return;

    if (disciplines.ilmuKetenteraan < bp.reqSkillWar || disciplines.ilmuKejuruteraan < bp.reqSkillEng) {
      tunjukNotifikasi(
        'Syarat Ilmu Tidak Cukup',
        `Memerlukan Ilmu Ketenteraan Lvl ${bp.reqSkillWar} & Kejuruteraan Lvl ${bp.reqSkillEng}!`
      );
      return;
    }

    const materialDiscount = 1 - (passives.cekapBahan * 1.5) / 100;
    const finalAmount = Math.max(1, Math.floor(bp.trainingCost.amount * materialDiscount));
    const reqRes = bp.trainingCost.resource;

    if ((playerWarehouse[reqRes] || 0) < finalAmount || wang < bp.trainingCost.gold) {
      tunjukNotifikasi('Sumber Kurang', 'Semak baki gudang dan simpanan emas anda.');
      return;
    }

    setPlayerWarehouse((prev) => ({ ...prev, [reqRes]: prev[reqRes] - finalAmount }));
    setWang((w) => w - bp.trainingCost.gold);
    setPlayerBarracks((prev) => {
      const u = { ...prev.units, [unitType]: (prev.units[unitType] || 0) + 1 };
      return { ...prev, units: u, totalMilitaryPower: calculateMilitaryPower(u, disciplines.ilmuKetenteraan) };
    });
    tunjukNotifikasi('Latihan Selesai', `1x ${bp.name} siap ditugaskan!`);
  };

  const handleSendTroops = (campaignId: string, side: 'ATTACK' | 'DEFENSE', power: number, warCategory: WarType) => {
    if (power <= 0) return;
    const critBonus = 1 + (passives.semangatWaja * 1.2) / 100;
    const finalPower = Math.floor(power * critBonus);

    const expGained = Math.floor(120 + disciplines.ilmuKetenteraan * 2.5);
    const goldGained = Math.floor(5000 + disciplines.ilmuFirasat * 50);
    const result = LevelSystem.addXp(tahap, xp, expGained, wang + goldGained);
    setTahap(result.newLevel);
    setXp(result.newXp);
    setWang(result.newGold);

    tunjukNotifikasi('Gempuran Berjaya!', `+${finalPower.toLocaleString()} DMG disumbangkan! (+${expGained} EXP, +$${goldGained.toLocaleString()} RM).`);
  };

  const handleWorkInFactory = (factoryId: string) => {
    const WORK_COOLDOWN_MS = 10 * 60 * 1000;
    const currentMs = Date.now();

    if (currentMs - lastWorkTimestamp < WORK_COOLDOWN_MS) {
      tunjukNotifikasi('Perlu Berehat', 'Sila tunggu masa rehat kilang tamat.');
      return;
    }

    if (hp < 10) {
      tunjukNotifikasi('Tenaga Lemah', 'Perlu 10 HP untuk bekerja!');
      return;
    }

    setLastWorkTimestamp(currentMs);
    setHp((h) => h - 10);

    const result = LevelSystem.addXp(tahap, xp, 45, wang + 4000);
    setTahap(result.newLevel);
    setXp(result.newXp);
    setWang(result.newGold);
    tunjukNotifikasi('Kerja Selesai', '+45 EXP dan +$4,000 RM diperoleh!');
  };

  const handleTravelToWilayah = (targetWilayah: string) => {
    setWilayahSemasa(targetWilayah);
    setTabAktif('wilayah');
    tunjukNotifikasi('Tiba di Wilayah', `Anda kini berada di ${targetWilayah}.`);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesi(session);
      if (session?.user) setPemainId(session.user.id);
      setMemuatkan(false);
    });
  }, []);

  const currentRank = LevelSystem.getRankForLevel(tahap);
  const activeFactory = senaraiKilang.find((f) => f.id === selectedFactoryId);

  if (memuatkan) {
    return (
      <SafeAreaView style={[styles.container, styles.centerView]}>
        <ActivityIndicator size="large" color="#F3CE65" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07060A" />

      {/* HEADER BAR */}
      <View style={styles.header}>
        {tabAktif !== 'utama' ? (
          <TouchableOpacity style={styles.backBtn} onPress={() => setTabAktif('utama')}>
            <ChevronLeft size={18} color="#F3CE65" />
            <Text style={styles.backBtnText}>KEMBALI</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.onlineBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.onlineText}>{onlineCount} dalam talian • 📍 {wilayahSemasa}</Text>
          </View>
        )}

        <Text style={styles.headerTitle}>
          {tabAktif === 'profil' ? 'REKOD PENDEKAR & ILMU' :
           tabAktif === 'peperangan' ? 'MEDAN PEPERANGAN' :
           tabAktif === 'berek' ? 'BEREK TENTERA & ARSENAL' :
           tabAktif === 'gudang' ? 'GEDUNG SIMPANAN' :
           tabAktif === 'bank' ? 'BANK PUSAT & SAHAM' :
           tabAktif === 'parti' ? 'DEWAN PARTI POLITIK' :
           tabAktif === 'pilihanraya' ? 'PILIHAN RAYA (PRU / PRN)' :
           tabAktif === 'perniagaan' ? 'SEKTOR INDUSTRI' :
           tabAktif === 'parlimen' ? 'DEWAN PERUNDANGAN' :
           tabAktif === 'peta' ? 'PETA ASIA TENGGARA' :
           tabAktif === 'wilayah' ? `WILAYAH ${wilayahSemasa.toUpperCase()}` :
           tabAktif === 'negara_view' ? `NEGARA ${negaraSemasa.toUpperCase()}` : 'TAKHTA'}
        </Text>

        <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerBuka(true)}>
          <Menu size={22} color="#F3CE65" />
        </TouchableOpacity>
      </View>

      <SidebarMenu
        visible={drawerBuka}
        playerName={namaPemain}
        userGold={wang}
        userGems={nilam}
        onNavigate={(screen: string) => {
          if (screen === 'MAP') setTabAktif('peta');
          if (screen === 'PARLIAMENT') setTabAktif('parlimen');
          if (screen === 'PARTY') setTabAktif('parti');
          if (screen === 'ELECTIONS') setTabAktif('pilihanraya');
          if (screen === 'PROFILE') setTabAktif('profil');
        }}
        onClose={() => setDrawerBuka(false)}
      />

      {tabAktif === 'utama' ? (
        <ScrollView style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 12, paddingTop: 10 }}>
            <View style={styles.shortcutGrid}>
              <TouchableOpacity style={styles.shortcutCard} onPress={() => setTabAktif('peta')}>
                <MapIcon size={20} color="#F3CE65" />
                <Text style={styles.shortcutText}>PETA DUNIA</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcutCard} onPress={() => setTabAktif('pilihanraya')}>
                <Vote size={20} color="#10B981" />
                <Text style={styles.shortcutText}>PRU / PRN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcutCard} onPress={() => setTabAktif('negara_view')}>
                <Globe2 size={20} color="#38BDF8" />
                <Text style={styles.shortcutText}>BLOK GEOPOLITIK</Text>
              </TouchableOpacity>
            </View>
          </View>

          <HomeScreen
            playerName={namaPemain}
            level={tahap}
            xp={xp}
            maxXp={tahap * 1000}
            hp={hp}
            maxHp={100}
            gold={wang}
            diamonds={nilam}
            regionName={wilayahSemasa}
            countryName={negaraSemasa}
            disciplines={disciplines}
            activeCampaign={activeEventWar as any}
            userParty={detailedParties.find((p) => p.id === userPartyId) || null}
            activeStudySession={activeStudySession}
            onNavigate={(tab) => {
              if (tab === 'wilayah') setTabAktif('wilayah');
              else setTabAktif(tab as any);
            }}
            onQuickWork={() => {
              if (senaraiKilang.length > 0) handleWorkInFactory(senaraiKilang[0].id);
            }}
            onQuickTrain={() => handleTrainUnit('INFANTRI')}
            onSendChatMessage={(msg, channel) => console.log(`[Chat #${channel}] ${msg}`)}
          />
        </ScrollView>
      ) : tabAktif === 'peta' ? (
        <View style={{ flex: 1 }}>
          <PetaInteraktif
            onNavigateToRegion={(regionCode) => {
              if (regionCode.includes('Putrajaya') || regionCode === 'MY_16') {
                setTabAktif('parlimen');
              } else {
                handleTravelToWilayah(regionCode);
              }
            }}
            onNavigateToNation={() => setTabAktif('negara_view')}
          />
        </View>
      ) : tabAktif === 'wilayah' ? (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          <View style={styles.cardGoldenBorder}>
            <View style={styles.rowBetween}>
              <View style={styles.avatarLetter}><Landmark size={22} color="#F3CE65" /></View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.playerName}>{infoWilayahAktif.nama}</Text>
                <Text style={styles.playerSub}>{infoWilayahAktif.negara} • 📍 Lokasi Semasa</Text>
              </View>
              <TouchableOpacity style={styles.btnMiniGold} onPress={() => setTabAktif('negara_view')}>
                <Globe2 size={14} color="#07060A" />
                <Text style={styles.btnMiniGoldText}>PERGI KE NEGARA</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.wilayahStatBar}>
              <View style={{ alignItems: 'center' }}><Text style={styles.whiteBold}>{infoWilayahAktif.penduduk}</Text><Text style={styles.mutedSmall}>PENDUDUK</Text></View>
              <View style={{ alignItems: 'center' }}><Text style={styles.whiteBold}>{infoWilayahAktif.kilang}</Text><Text style={styles.mutedSmall}>KILANG</Text></View>
              <View style={{ alignItems: 'center' }}><Text style={styles.whiteBold}>{infoWilayahAktif.berek}</Text><Text style={styles.mutedSmall}>BEREK</Text></View>
              <View style={{ alignItems: 'center' }}><Text style={styles.whiteBold}>{infoWilayahAktif.parti}</Text><Text style={styles.mutedSmall}>PARTI</Text></View>
            </View>
          </View>
        </ScrollView>
      ) : tabAktif === 'negara_view' ? (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          <View style={styles.cardGoldenBorder}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.playerName}>🏛️ {negaraSemasa}</Text>
                <Text style={styles.playerSub}>Sistem Demokrasi Parlimen</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : tabAktif === 'parlimen' ? (
        <ParliamentView
          nationName={negaraSemasa}
          onBack={() => setTabAktif('utama')}
        />
      ) : tabAktif === 'parti' ? (
        <PartiesScreen
          currentPlayerId={pemainId || 'PLAYER_01'}
          currentPlayerName={namaPemain}
          userPartyId={userPartyId}
          parties={detailedParties}
          playerGold={wang}
          onApplyParty={(partyId: string) => {
            setUserPartyId(partyId);
            tunjukNotifikasi('Permohonan Dihantar', 'Permohonan menyertai parti telah dihantar!');
          }}
          onCreateParty={(newParty: DetailedParty) => {
            setDetailedParties((prev) => [...prev, newParty]);
            setUserPartyId(newParty.id);
            tunjukNotifikasi('Parti Didirikan', 'Parti politik anda telah selamat didaftarkan!');
          }}
          onDonateGold={(partyId: string, amount: number) => {
            if (wang < amount) {
              tunjukNotifikasi('Kurang Emas', 'Baki wang tidak mencukupi.');
              return;
            }
            setWang((w) => w - amount);
            setDetailedParties((prev) =>
              prev.map((p) => (p.id === partyId ? { ...p, treasuryGold: p.treasuryGold + amount } : p))
            );
          }}
          {...({
            onAcceptApplicant: () => {},
            onRejectApplicant: () => {},
            onAcceptApplication: () => {},
            onRejectApplication: () => {},
          } as any)}
          onLeaveParty={() => setUserPartyId(null)}
          onBack={() => setTabAktif('utama')}
        />
      ) : tabAktif === 'pilihanraya' ? (
        <ElectionsScreen
          {...({
            election: putrajayaElection,
            electionCycle: putrajayaElection,
            electionState: putrajayaElection,
            state: putrajayaElection,
          } as any)}
          userPartyId={userPartyId}
          onCastVote={(partyId: string) => {
            setPutrajayaElection((prev) => ({
              ...prev,
              parties: prev.parties.map((p) => (p.partyId === partyId ? { ...p, totalVotes: p.totalVotes + 1 } : p)),
            }));
            tunjukNotifikasi('Undi Diterima', 'Undian anda telah selamat dimasukkan!');
          }}
          onBack={() => setTabAktif('utama')}
        />
      ) : tabAktif === 'profil' ? (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          <DetailedProfileView
            playerName={namaPemain}
            level={tahap}
            rankTitle={currentRank.title}
            rankColor={currentRank.color}
            partyName="Tiada"
            regionName={wilayahSemasa}
            gold={wang}
            diamonds={nilam}
            disciplines={disciplines}
            passives={passives}
            passivePoints={passivePoints}
            barracksLevel={playerBarracks.level}
            militaryPower={playerBarracks.totalMilitaryPower}
            activeSession={activeStudySession}
            onUpdateName={(newName) => setNamaPemain(newName)}
            onLogKeluar={handleLogKeluar}
            onStartStudy={handleStartStudy}
            onCompleteStudy={handleCompleteStudy}
            onCancelStudy={() => setActiveStudySession(null)}
            onAllocatePassive={handleAllocatePassive}
          />
        </ScrollView>
      ) : tabAktif === 'peperangan' ? (
        <WarHubView
          campaign={activeEventWar}
          realWarCampaigns={realWars}
          playerBarracks={playerBarracks}
          playerGold={wang}
          onSendTroops={handleSendTroops}
          onOpenBarracks={() => setTabAktif('berek')}
        />
      ) : tabAktif === 'berek' ? (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          <View style={styles.cardGoldenBorder}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.sectionHeaderTitle}>BEREK TENTERA & ARSENAL VISUAL</Text>
                <Text style={styles.cardDesc}>Tahap Berek: Lvl {playerBarracks.level}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : tabAktif === 'gudang' ? (
        <WarehouseView
          warehouse={playerWarehouse}
          playerGold={wang}
          onSellResource={(resId, amt, price) => {
            setPlayerWarehouse((prev) => ({ ...prev, [resId]: prev[resId] - amt }));
            setWang((w) => w + amt * price);
          }}
          onBack={() => setTabAktif('utama')}
        />
      ) : tabAktif === 'bank' ? (
        <CentralBankView
          bank={centralBank}
          ledger={playerBankLedger}
          shares={bankShares}
          playerGold={wang}
          isCabinetMinister={false}
          onDeposit={(amt) => setWang((w) => w - amt)}
          onWithdraw={(amt) => setWang((w) => w + amt)}
          onTakeLoan={(amt) => setWang((w) => w + amt)}
          onRepayLoan={(amt) => setWang((w) => w - amt)}
          onBuyShares={() => {}}
          onSellShares={() => {}}
          onBack={() => setTabAktif('utama')}
        />
      ) : tabAktif === 'perniagaan' ? (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          <View style={styles.cardGoldenBorder}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.sectionHeaderTitle}>KILANG & INDUSTRI WILAYAH</Text>
              </View>
              <TouchableOpacity style={styles.btnMiniGold} onPress={() => setModalBinaKilang(true)}>
                <Plus size={14} color="#07060A" />
                <Text style={styles.btnMiniGoldText}>+ BINA KILANG</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : tabAktif === 'kilang_detail' && activeFactory ? (
        <FactoryDetailView
          factory={activeFactory}
          playerGold={wang}
          currentPlayerId={pemainId || 'PLAYER_01'}
          currentRegionId={infoWilayahAktif.id}
          isHomeRegion={true}
          taxRatePercent={putrajayaGov.taxRatePercent}
          lastWorkTimestamp={lastWorkTimestamp}
          onBack={() => setTabAktif('perniagaan')}
          onWorkInFactory={handleWorkInFactory}
          onSaveWage={() => {}}
          onDepositTreasury={() => {}}
          onWithdrawTreasury={() => {}}
          onUpgradeFactory={() => {}}
          onCloseFactory={() => {}}
          onTravelToRegion={() => {}}
        />
      ) : null}

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.bottomNavItem, tabAktif === 'utama' && styles.bottomNavItemActive]} onPress={() => setTabAktif('utama')}>
          <Building2 size={18} color={tabAktif === 'utama' ? '#F3CE65' : '#777'} />
          <Text style={[styles.bottomNavText, tabAktif === 'utama' && styles.bottomNavTextActive]}>Utama</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bottomNavItem, tabAktif === 'peperangan' && styles.bottomNavItemActive]} onPress={() => setTabAktif('peperangan')}>
          <Swords size={18} color={tabAktif === 'peperangan' ? '#EF4444' : '#777'} />
          <Text style={[styles.bottomNavText, tabAktif === 'peperangan' && { color: '#EF4444', fontWeight: 'bold' }]}>Perang</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bottomNavItem, tabAktif === 'perniagaan' && styles.bottomNavItemActive]} onPress={() => setTabAktif('perniagaan')}>
          <Factory size={18} color={tabAktif === 'perniagaan' ? '#F3CE65' : '#777'} />
          <Text style={[styles.bottomNavText, tabAktif === 'perniagaan' && styles.bottomNavTextActive]}>Kilang</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bottomNavItem, tabAktif === 'gudang' && styles.bottomNavItemActive]} onPress={() => setTabAktif('gudang')}>
          <Package size={18} color={tabAktif === 'gudang' ? '#38BDF8' : '#777'} />
          <Text style={[styles.bottomNavText, tabAktif === 'gudang' && { color: '#38BDF8', fontWeight: 'bold' }]}>Gudang</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bottomNavItem, tabAktif === 'profil' && styles.bottomNavItemActive]} onPress={() => setTabAktif('profil')}>
          <User size={18} color={tabAktif === 'profil' ? '#F3CE65' : '#777'} />
          <Text style={[styles.bottomNavText, tabAktif === 'profil' && styles.bottomNavTextActive]}>Profil</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalBinaKilang} animationType="fade" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionHeaderTitle}>BINA KILANG BARU</Text>
              <TouchableOpacity onPress={() => setModalBinaKilang(false)}>
                <Text style={{ color: '#888', fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300, marginVertical: 10 }}>
              {Object.keys(TAKHTA_FACTORY_CATALOG).map((fName) => {
                const item = TAKHTA_FACTORY_CATALOG[fName];
                const isSelected = kilangDipilih === fName;
                return (
                  <TouchableOpacity key={item.id} style={[styles.catalogItem, isSelected && styles.catalogItemActive]} onPress={() => setKilangDipilih(fName)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                      <View>
                        <Text style={[styles.whiteBold, isSelected && { color: '#F3CE65' }]}>{item.name}</Text>
                        <Text style={styles.mutedSmall}>{item.desc}</Text>
                      </View>
                    </View>
                    <Text style={styles.goldSmall}>${item.buildCostRM.toLocaleString()}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity style={styles.btnTravel} onPress={() => {
              const bp = TAKHTA_FACTORY_CATALOG[kilangDipilih];
              if (wang < bp.buildCostRM) {
                tunjukNotifikasi('Dana Kurang', 'Wang tidak mencukupi.');
                return;
              }
              const newFac: AdvancedFactoryData = {
                id: `FAC_${Date.now()}`,
                name: `${bp.name} ${wilayahSemasa}`,
                factoryType: bp.name,
                resourceId: bp.resourceId,
                level: 1,
                ownerId: pemainId || 'PLAYER_01',
                ownerName: namaPemain,
                regionId: infoWilayahAktif.id,
                regionName: wilayahSemasa,
                stateName: negaraSemasa,
                wageType: 'PERCENTAGE',
                wageRate: 100,
                treasury: 5000,
                workerCount: 0,
                maxWorkers: 10,
                stock: 50,
                isWorkingHere: false,
              };
              setWang((w) => w - bp.buildCostRM);
              setSenaraiKilang((prev) => [newFac, ...prev]);
              setModalBinaKilang(false);
              tunjukNotifikasi('Berjaya', 'Kilang didirikan!');
            }}>
              <Text style={styles.btnTravelTxt}>SAHKAN & BINA KILANG</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <VisaStatusModal
        visible={isVisaModalOpen}
        playerName={namaPemain}
        currentRegion={wilayahSemasa}
        currentCountry={negaraSemasa}
        visaStatus="TOURIST"
        applications={[]}
        onClose={() => setIsVisaModalOpen(false)}
      />
    </SafeAreaView>
  );
}