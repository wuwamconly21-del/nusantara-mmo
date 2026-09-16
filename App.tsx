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
  Vote,
  Map as MapIcon,
  LogIn,
  LogOut,
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

export default function App() {
  const [sesi, setSesi] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [tabAktif, setTabAktif] = useState<TabUtama>('utama');
  const [drawerBuka, setDrawerBuka] = useState(false);
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [memuatkan, setMemuatkan] = useState(true);

  const [wilayahSemasa, setWilayahSemasa] = useState<string>('Kuala Lumpur');
  const [negaraSemasa] = useState<string>('Federation of Mahawangsa');
  const [onlineCount] = useState<number>(1);

  const [pemainId, setPemainId] = useState<string | null>(null);
  const [namaPemain, setNamaPemain] = useState('Tetamu (Guest)');
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

  const [playerBarracks] = useState<PlayerBarracks>({
    level: 1,
    maxCapacity: 500,
    units: { INFANTRI: 0, KERETA_KEBAL: 0, DRON_SERANGAN: 0, JET_PEJUANG: 0, SUBMARINE: 0, STEALTH_BOMBER: 0, KAPAL_PERANG: 0, PELURU_BERPANDU: 0 },
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

  const [senaraiKilang, setSenaraiKilang] = useState<AdvancedFactoryData[]>([]);
  const [modalBinaKilang, setModalBinaKilang] = useState(false);
  const [kilangDipilih, setKilangDipilih] = useState<string>('Kilang Berlian');

  const [userPartyId, setUserPartyId] = useState<string | null>(null);
  const [detailedParties, setDetailedParties] = useState<DetailedParty[]>([]);

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

  const tunjukNotifikasi = (tajuk: string, mesej: string) => {
    if (Platform.OS === 'web') window.alert(`${tajuk}: ${mesej}`);
    else Alert.alert(tajuk, mesej);
  };

  const handleLogKeluar = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setSesi(null);
    setPemainId(null);
    setNamaPemain('Tetamu (Guest)');
    tunjukNotifikasi('Log Keluar', 'Anda telah log keluar.');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSesi(session);
        setPemainId(session.user.id);
        setNamaPemain(session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Pendekar');
      }
      setMemuatkan(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSesi(session);
      if (session?.user) {
        setPemainId(session.user.id);
        setNamaPemain(session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Pendekar');
      } else {
        setPemainId(null);
        setNamaPemain('Tetamu (Guest)');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const currentRank = LevelSystem.getRankForLevel(tahap);

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
            onNavigate={(tab) => setTabAktif(tab as any)}
            onQuickWork={() => {}}
            onQuickTrain={() => {}}
            onSendChatMessage={() => {}}
          />
        </ScrollView>
      ) : tabAktif === 'peta' ? (
        <View style={{ flex: 1 }}>
          <PetaInteraktif
            onNavigateToRegion={(regionCode) => {
              if (regionCode.includes('Putrajaya') || regionCode === 'MY_16') {
                setTabAktif('parlimen');
              } else {
                setWilayahSemasa(regionCode);
                setTabAktif('wilayah');
              }
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
            onStartStudy={() => {}}
            onCompleteStudy={() => {}}
            onCancelStudy={() => {}}
            onAllocatePassive={() => {}}
          />
        </ScrollView>
      ) : tabAktif === 'parlimen' ? (
        <ParliamentView nationName={negaraSemasa} onBack={() => setTabAktif('utama')} />
      ) : tabAktif === 'gudang' ? (
        <WarehouseView warehouse={playerWarehouse} playerGold={wang} onSellResource={() => {}} onBack={() => setTabAktif('utama')} />
      ) : null}

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.bottomNavItem, tabAktif === 'utama' && styles.bottomNavItemActive]} onPress={() => setTabAktif('utama')}>
          <Building2 size={18} color={tabAktif === 'utama' ? '#F3CE65' : '#777'} />
          <Text style={[styles.bottomNavText, tabAktif === 'utama' && styles.bottomNavTextActive]}>Utama</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bottomNavItem, tabAktif === 'peperangan' && styles.bottomNavItemActive]} onPress={() => setTabAktif('peperangan')}>
          <Swords size={18} color={tabAktif === 'peperangan' ? '#EF4444' : '#777'} />
          <Text style={[styles.bottomNavText, tabAktif === 'peperangan' && { color: '#EF4444' }]}>Perang</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bottomNavItem, tabAktif === 'gudang' && styles.bottomNavItemActive]} onPress={() => setTabAktif('gudang')}>
          <Package size={18} color={tabAktif === 'gudang' ? '#38BDF8' : '#777'} />
          <Text style={[styles.bottomNavText, tabAktif === 'gudang' && { color: '#38BDF8' }]}>Gudang</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bottomNavItem, tabAktif === 'profil' && styles.bottomNavItemActive]} onPress={() => setTabAktif('profil')}>
          <User size={18} color={tabAktif === 'profil' ? '#F3CE65' : '#777'} />
          <Text style={[styles.bottomNavText, tabAktif === 'profil' && styles.bottomNavTextActive]}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL AUTHENTICATION (LOGIN & REGISTER) */}
      <AuthModal
        visible={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          if (user) {
            setPemainId(user.id);
            setNamaPemain(user.user_metadata?.username || user.email?.split('@')[0] || 'Pendekar');
          }
        }}
      />
    </SafeAreaView>
  );
}
