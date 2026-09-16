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
  Vote,
  Map as MapIcon,
  LogIn,
  LogOut,
  FileText,
} from 'lucide-react-native';
import { supabase } from './supabase';
import { AuthModal } from './src/components/AuthModal';
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
import { CustomWarCampaign } from './src/types/military';
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
    paddingHorizontal: 10,
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
  headerTitle: { fontSize: 11, fontWeight: 'bold', color: '#F3CE65', letterSpacing: 0.5 },
  menuButton: { padding: 4 },
  authBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E1826',
    borderWidth: 1,
    borderColor: '#F3CE65',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  authBtnTxt: { color: '#F3CE65', fontSize: 9, fontWeight: 'bold' },
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
  toastBox: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#1E1826',
    borderColor: '#F3CE65',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastTitle: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold' },
  toastDesc: { color: '#FFF', fontSize: 10, marginTop: 2, textAlign: 'center' },
  shortcutGrid: { flexDirection: 'row', gap: 8, marginBottom: 10 },
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
  shortcutText: { color: '#F3CE65', fontSize: 9, fontWeight: 'bold', marginTop: 4, textAlign: 'center' },
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

export default function App() {
  const [sesi, setSesi] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [tabAktif, setTabAktif] = useState<TabUtama>('utama');
  const [drawerBuka, setDrawerBuka] = useState(false);
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [memuatkan, setMemuatkan] = useState(true);

  // In-Game Notification Toast System
  const [toast, setToast] = useState<{ visible: boolean; title: string; desc: string }>({
    visible: false,
    title: '',
    desc: '',
  });

  const tunjukNotifikasi = (title: string, desc: string) => {
    setToast({ visible: true, title, desc });
    setTimeout(() => {
      setToast({ visible: false, title: '', desc: '' });
    }, 3000);
  };

  const [wilayahSemasa, setWilayahSemasa] = useState<string>('Kuala Lumpur');
  const [negaraSemasa] = useState<string>('Federation of Mahawangsa');
  const [onlineCount] = useState<number>(1);

  const [pemainId, setPemainId] = useState<string | null>(null);
  const [namaPemain, setNamaPemain] = useState('Tetamu (Guest)');
  const [tahap, setTahap] = useState(1);
  const [xp, setXp] = useState(0);
  const [hp, setHp] = useState(100);
  const [wang, setWang] = useState(6050);
  const [nilam, setNilam] = useState(0);

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

  const [playerBarracks] = useState<PlayerBarracks>({
    level: 1,
    maxCapacity: 500,
    units: { INFANTRI: 5, KERETA_KEBAL: 0, DRON_SERANGAN: 0, JET_PEJUANG: 0, SUBMARINE: 0, STEALTH_BOMBER: 0, KAPAL_PERANG: 0, PELURU_BERPANDU: 0 },
    totalMilitaryPower: 50,
  });

  const [activeEventWar] = useState<CustomWarCampaign>({
    id: 'WAR_MALAYA_01',
    title: 'Pertempuran Selat Melaka',
    regionName: 'Melaka',
    warCategory: 'EVENT_WAR',
    attackerName: 'Pemberontak Laut',
    defenderName: 'Tentera Persekutuan',
    attackerTotalDamage: 45000,
    defenderTotalDamage: 62000,
    timeRemaining: '04:12:30',
  });

  const [senaraiKilang, setSenaraiKilang] = useState<AdvancedFactoryData[]>([]);
  const [selectedFactoryId, setSelectedFactoryId] = useState<string | null>(null);
  const [modalBinaKilang, setModalBinaKilang] = useState(false);
  const [kilangDipilih, setKilangDipilih] = useState<string>('Kilang Berlian');

  const [userPartyId, setUserPartyId] = useState<string | null>(null);
  const [detailedParties] = useState<DetailedParty[]>([]);

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
    treasuryGold: 100000,
    taxRatePercent: 5,
    isEstablished: true,
    populationCount: 1500,
    resources: { BERLIAN: 10, KULIT: 50, EMAS: 200, MINYAK: 500, MINYAK_DITAPIS: 100, NTE: 0, BAUKSIT: 0, KAYU_CENDANA: 0, KOPI: 0, GANDUM: 0 },
    activeBills: [],
    controlledTerritories: ['Kuala Lumpur'],
  });

  const [putrajayaElection] = useState<ElectionCycleState>({
    stateCode: 'Putrajaya_MY',
    phase: 'PEACE_TIME' as PoliticalPhase,
    currentTerm: 1,
    parties: [],
    voterLedger: {},
    nextDissolutionDate: '2026-10-01',
    nextElectionDate: '2026-10-05',
  });

  const [centralBank] = useState<StateCentralBank>({
    stateCode: 'Putrajaya_MY',
    stateName: 'Federation of Mahawangsa',
    treasuryGold: 500000,
    reserveGold: 1000000,
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

  const syncUserData = (user: any) => {
    if (user) {
      setPemainId(user.id);
      const name = user.user_metadata?.username || user.email?.split('@')[0] || 'Pendekar';
      setNamaPemain(name);
    } else {
      setPemainId(null);
      setNamaPemain('Tetamu (Guest)');
    }
  };

  const handleLogKeluar = async () => {
    try { await supabase.auth.signOut(); } catch (e) {}
    setSesi(null);
    syncUserData(null);
    tunjukNotifikasi('Log Keluar', 'Anda telah kembali ke status Tetamu.');
  };

  const handleWorkInFactory = () => {
    if (hp < 10) {
      tunjukNotifikasi('Tenaga Lemah', 'Memerlukan sekurang-kurangnya 10 HP!');
      return;
    }
    setHp((h) => Math.max(0, h - 10));
    const result = LevelSystem.addXp(tahap, xp, 50, wang + 1500);
    setTahap(result.newLevel);
    setXp(result.newXp);
    setWang(result.newGold);
    tunjukNotifikasi('Kerja Berjaya', '+50 EXP & +$1,500 RM ditambah ke akaun!');
  };

  const handleSendTroops = (campaignId: string, side: string, power: number) => {
    if (hp < 15) {
      tunjukNotifikasi('Tenaga Kurang', 'Perlu 15 HP untuk menyerang!');
      return;
    }
    setHp((h) => Math.max(0, h - 15));
    const expGained = 150;
    const goldGained = 2500;
    const result = LevelSystem.addXp(tahap, xp, expGained, wang + goldGained);
    setTahap(result.newLevel);
    setXp(result.newXp);
    setWang(result.newGold);

    tunjukNotifikasi('Gempuran Berjaya!', `Menyerang ${side}! (+${expGained} EXP, +$${goldGained.toLocaleString()} RM).`);
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

    setDisciplines((prev) => ({ ...prev, [key]: targetLvl }));
    setActiveStudySession(null);
    tunjukNotifikasi('Khatam Ilmu!', `Tahniah! ${key} meningkat ke Tahap ${targetLvl}!`);
  };

  // PEMASA SKILL TIMER LATAR BELAKANG (PERKIRAAN SETIAP SAAT)
  useEffect(() => {
    const timer = setInterval(() => {
      if (activeStudySession) {
        const remaining = activeStudySession.endTime - Date.now();
        if (remaining <= 0) {
          handleCompleteStudy();
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeStudySession]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSesi(session);
      syncUserData(session?.user);
      setMemuatkan(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSesi(session);
      syncUserData(session?.user);
    });

    return () => authListener.subscription.unsubscribe();
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

      {/* CUSTOM TOAST SYSTEM */}
      {toast.visible && (
        <View style={styles.toastBox}>
          <Text style={styles.toastTitle}>✨ {toast.title}</Text>
          <Text style={styles.toastDesc}>{toast.desc}</Text>
        </View>
      )}

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
            <Text style={styles.onlineText}>{onlineCount} online • 📍 {wilayahSemasa}</Text>
          </View>
        )}

        <Text style={styles.headerTitle}>TAKHTA: NUSANTARA</Text>

        {sesi ? (
          <TouchableOpacity style={styles.authBtn} onPress={handleLogKeluar}>
            <LogOut size={12} color="#F3CE65" />
            <Text style={styles.authBtnTxt}>LOG KELUAR</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.authBtn} onPress={() => setIsAuthOpen(true)}>
            <LogIn size={12} color="#F3CE65" />
            <Text style={styles.authBtnTxt}>LOG MASUK</Text>
          </TouchableOpacity>
        )}

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
          if (screen === 'BANK') setTabAktif('bank');
          if (screen === 'FACTORY') setTabAktif('perniagaan');
          if (screen === 'WAR') setTabAktif('peperangan');
          if (screen === 'WAREHOUSE') setTabAktif('gudang');
          if (screen === 'VISA') setIsVisaModalOpen(true);
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
            userParty={null}
            activeStudySession={activeStudySession}
            onNavigate={(tab) => setTabAktif(tab as any)}
            onQuickWork={handleWorkInFactory}
            onQuickTrain={() => setTabAktif('berek')}
            onSendChatMessage={() => {}}
          />
        </ScrollView>
      ) : tabAktif === 'peperangan' ? (
        <WarHubView
          campaign={activeEventWar}
          realWarCampaigns={[]}
          playerBarracks={playerBarracks}
          playerGold={wang}
          onSendTroops={(cId, side, pwr) => handleSendTroops(cId, side, pwr)}
          onOpenBarracks={() => setTabAktif('berek')}
        />
      ) : tabAktif === 'perniagaan' ? (
        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          <View style={styles.cardGoldenBorder}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.sectionHeaderTitle}>KILANG & INDUSTRI WILAYAH</Text>
                <Text style={styles.cardDesc}>Jumlah kilang beroperasi: {senaraiKilang.length}</Text>
              </View>
              <TouchableOpacity style={styles.btnMiniGold} onPress={() => setModalBinaKilang(true)}>
                <Plus size={14} color="#07060A" />
                <Text style={styles.btnMiniGoldText}>+ BINA KILANG</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : tabAktif === 'peta' ? (
        <View style={{ flex: 1 }}>
          <PetaInteraktif
            onNavigateToRegion={(regionCode) => {
              setWilayahSemasa(regionCode);
              setTabAktif('wilayah');
              tunjukNotifikasi('Lokasi Tukar', `Anda kini berada di ${regionCode}.`);
            }}
            onNavigateToNation={() => setTabAktif('negara_view')}
          />
        </View>
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
            onAllocatePassive={(key) => setPassivePoints((p) => Math.max(0, p - 1))}
          />
        </ScrollView>
      ) : tabAktif === 'parlimen' ? (
        <ParliamentView nationName={negaraSemasa} onBack={() => setTabAktif('utama')} />
      ) : tabAktif === 'gudang' ? (
        <WarehouseView warehouse={playerWarehouse} playerGold={wang} onSellResource={() => {}} onBack={() => setTabAktif('utama')} />
      ) : tabAktif === 'parti' ? (
        <PartiesScreen
          currentPlayerId={pemainId || 'PLAYER_01'}
          currentPlayerName={namaPemain}
          userPartyId={userPartyId}
          parties={detailedParties}
          playerGold={wang}
          onApplyParty={(partyId) => setUserPartyId(partyId)}
          onCreateParty={() => {}}
          onDonateGold={() => {}}
          onLeaveParty={() => setUserPartyId(null)}
          onBack={() => setTabAktif('utama')}
        />
      ) : tabAktif === 'pilihanraya' ? (
        <ElectionsScreen
          {...({ election: putrajayaElection } as any)}
          userPartyId={userPartyId}
          onCastVote={() => tunjukNotifikasi('Undi Diterima', 'Undian dimasukkan!')}
          onBack={() => setTabAktif('utama')}
        />
      ) : tabAktif === 'bank' ? (
        <CentralBankView
          bank={centralBank}
          ledger={playerBankLedger}
          shares={[]}
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
      ) : tabAktif === 'kilang_detail' && activeFactory ? (
        <FactoryDetailView
          factory={activeFactory}
          playerGold={wang}
          currentPlayerId={pemainId || 'PLAYER_01'}
          currentRegionId={wilayahSemasa}
          isHomeRegion={true}
          taxRatePercent={putrajayaGov.taxRatePercent}
          lastWorkTimestamp={0}
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

      {/* AUTH POPUP MODAL */}
      <AuthModal
        visible={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => syncUserData(user)}
      />

      {/* BINA KILANG MODAL */}
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
                    <Text style={[styles.whiteBold, isSelected && { color: '#F3CE65' }]}>{item.name}</Text>
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
                regionId: wilayahSemasa,
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

      {/* VISA DOKUMEN MODAL */}
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
