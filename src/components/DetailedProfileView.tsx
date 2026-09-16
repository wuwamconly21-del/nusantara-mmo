import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { 
  Shield, 
  Swords, 
  Wrench, 
  Factory, 
  Coins, 
  Compass, 
  Sparkles, 
  Clock, 
  Gem, 
  Hourglass,
  Heart,
  Hammer,
  TrendingUp,
  Flame,
  Settings as SettingsGear,
  ChevronLeft,
  Check,
  LogOut,
  UserCheck,
} from 'lucide-react-native';
import { PlayerDisciplines, PassiveTalents, ActiveStudySession } from '../types/skills';
import { DisciplineEngine } from '../services/DisciplineEngine';

interface DetailedProfileViewProps {
  playerName: string;
  level: number;
  rankTitle: string;
  rankColor: string;
  partyName: string;
  regionName: string;
  gold: number;
  diamonds: number;
  disciplines: PlayerDisciplines;
  passives: PassiveTalents;
  passivePoints: number;
  barracksLevel: number;
  militaryPower: number;
  activeSession: ActiveStudySession | null;
  onUpdateName: (newName: string) => void;
  onLogKeluar: () => void;
  onStartStudy: (key: keyof PlayerDisciplines, method: 'WANG' | 'NILAM') => void;
  onCompleteStudy: () => void;
  onCancelStudy: () => void;
  onAllocatePassive: (key: keyof PassiveTalents) => void;
}

const NAME_CHANGE_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 Hari Cooldown

export function DetailedProfileView({
  playerName,
  level,
  rankTitle,
  rankColor,
  partyName,
  regionName,
  gold,
  diamonds,
  disciplines,
  passives,
  passivePoints,
  barracksLevel,
  militaryPower,
  activeSession,
  onUpdateName,
  onLogKeluar,
  onStartStudy,
  onCompleteStudy,
  onCancelStudy,
  onAllocatePassive,
}: DetailedProfileViewProps) {
  // Suis Paparan Sub-Halaman Tetapan
  const [inSettingsPage, setInSettingsPage] = useState(false);

  // Sub-modal dalam Tetapan
  const [modalSubView, setModalSubView] = useState<'NONE' | 'KELAS' | 'AGAMA' | 'POLITIK'>('NONE');

  // Keadaan Suntingan Profil
  const [editNameMode, setEditNameMode] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);
  const [lastNameChangeDate, setLastNameChangeDate] = useState<number>(0);
  const [bioText, setBioText] = useState('Pendekar mempertahankan kedaulatan tanah watan.');
  const [editBioMode, setEditBioMode] = useState(false);
  const [bioInput, setBioInput] = useState(bioText);

  // Pilihan Lakonan Watak
  const [selectedClass, setSelectedClass] = useState<'Ketenteraan' | 'Birokrasi' | 'Keilmuan'>('Ketenteraan');
  const [selectedReligion, setSelectedReligion] = useState('Islam');
  const [selectedIdeology, setSelectedIdeology] = useState('Monarkisme');

  // Notifikasi
  const [notifWar, setNotifWar] = useState(true);
  const [notifElection, setNotifElection] = useState(true);
  const [notifParliament, setNotifParliament] = useState(true);
  const [notifParty, setNotifParty] = useState(true);

  // Modal Kemahiran
  const [modalPassive, setModalPassive] = useState(false);
  const [modalMethod, setModalMethod] = useState<{ open: boolean; key: keyof PlayerDisciplines | null }>({
    open: false,
    key: null,
  });
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);
      if (activeSession && now >= activeSession.endTime) {
        onCompleteStudy();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const handleSaveName = () => {
    const now = Date.now();
    const timeSinceLastChange = now - lastNameChangeDate;

    if (lastNameChangeDate > 0 && timeSinceLastChange < NAME_CHANGE_COOLDOWN_MS) {
      const daysLeft = Math.ceil((NAME_CHANGE_COOLDOWN_MS - timeSinceLastChange) / (24 * 3600 * 1000));
      Alert.alert('Penukaran Dikunci', `Anda perlu menunggu ${daysLeft} hari lagi untuk menukar nama pengguna.`);
      return;
    }

    if (!nameInput.trim() || nameInput.trim().length < 3) {
      Alert.alert('Ralat', 'Nama pengguna sekurang-kurangnya mengandungi 3 aksara.');
      return;
    }

    onUpdateName(nameInput.trim());
    setLastNameChangeDate(now);
    setEditNameMode(false);
    Alert.alert('Berjaya', 'Nama pengguna anda telah dikemaskini. Penukaran seterusnya dibuka selepas 7 hari.');
  };

  const DISCIPLINE_CONFIG: {
    key: keyof PlayerDisciplines;
    name: string;
    icon: any;
    desc: string;
    getBonusTxt: (lvl: number) => string;
  }[] = [
    {
      key: 'ilmuKetenteraan',
      name: 'Ilmu Ketenteraan',
      icon: Swords,
      desc: 'Memperhebat daya serang senjata tempur di medan perang.',
      getBonusTxt: (lvl) => `+${(lvl * 0.75).toFixed(1)}% Kerosakan Perang`,
    },
    {
      key: 'ilmuKejuruteraan',
      name: 'Ilmu Kejuruteraan',
      icon: Wrench,
      desc: 'Memperluas binaan kubu dan muatan had unit berek tentera.',
      getBonusTxt: (lvl) => `+${lvl * 15} Kapasiti Ruang Berek`,
    },
    {
      key: 'ilmuPerusahaan',
      name: 'Ilmu Perusahaan',
      icon: Factory,
      desc: 'Meningkatkan produktiviti perahan galian dan kuantiti lombong.',
      getBonusTxt: (lvl) => `+${(lvl * 0.5).toFixed(1)}% Hasil Lombong Kilang`,
    },
    {
      key: 'ilmuPerbendaharaan',
      name: 'Ilmu Perbendaharaan',
      icon: Coins,
      desc: 'Memantapkan diplomasi upeti dan pengurangan potongan cukai.',
      getBonusTxt: (lvl) => `+${(lvl * 0.4).toFixed(1)}% Kecekapan Dagang & Cukai`,
    },
    {
      key: 'ilmuFirasat',
      name: 'Ilmu Firasat',
      icon: Compass,
      desc: 'Mempercepatkan lonjakan pengalaman rohani dan minda.',
      getBonusTxt: (lvl) => `+${(lvl * 0.6).toFixed(1)}% Lonjakan Perolehan XP`,
    },
  ];

  const PASSIVE_LIST: {
    key: keyof PassiveTalents;
    title: string;
    max: number;
    desc: string;
    icon: any;
  }[] = [
    { key: 'pengaruhDaulat', title: 'Pengaruh Daulat', max: 30, desc: 'Menjimatkan masa pemulihan dan kos kerahan operasi tentera.', icon: Shield },
    { key: 'pakarUpeti', title: 'Pakar Upeti', max: 30, desc: 'Memotong diskaun 0.5% cukai negeri bagi setiap mata ketika bekerja di kilang.', icon: Coins },
    { key: 'langkahPantas', title: 'Langkah Pantas', max: 25, desc: 'Memendekkan tempoh sekatan masa penerbangan dan rentas sempadan wilayah.', icon: Compass },
    { key: 'gedungSaujana', title: 'Gedung Saujana', max: 25, desc: 'Meningkatkan muatan kapasiti gudang simpanan peribadi sebanyak +5% per mata.', icon: Factory },
    { key: 'ketahananBatin', title: 'Ketahanan Batin', max: 20, desc: 'Meningkatkan batas maksimum Tenaga Batin (HP) sebanyak +2 mata setiap peringkat.', icon: Heart },
    { key: 'cekapBahan', title: 'Cekap Bahan', max: 20, desc: 'Mengurangkan penggunaan sumber mentah semasa melatih unit sebanyak 1.5%.', icon: Hammer },
    { key: 'bungaWang', title: 'Bunga Wang', max: 20, desc: 'Menambah pulangan dividen harian pada simpanan perbankan persekutuan.', icon: TrendingUp },
    { key: 'semangatWaja', title: 'Semangat Waja', max: 25, desc: 'Meningkatkan kebarangkalian serangan kerosakan kritikal semasa kempen perang.', icon: Flame },
  ];

  const remainingSecs = activeSession
    ? Math.max(0, Math.ceil((activeSession.endTime - currentTime) / 1000))
    : 0;
  const progressPct = activeSession
    ? Math.min(100, Math.max(0, ((activeSession.durationMs - (activeSession.endTime - currentTime)) / activeSession.durationMs) * 100))
    : 0;

  // =========================================================
  // JIKA SEDANG MEMBUKA HALAMAN TETAPAN PENUH (SETTINGS VIEW)
  // =========================================================
  if (inSettingsPage) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 70 }}>
        {/* Butang Kembali Ke Profil */}
        <TouchableOpacity style={styles.backToProfileBar} onPress={() => setInSettingsPage(false)}>
          <ChevronLeft size={16} color="#F3CE65" />
          <Text style={styles.backToProfileTxt}>KEMBALI KE PROFIL</Text>
        </TouchableOpacity>

        <Text style={styles.settingsPageTitle}>TETAPAN</Text>

        {/* Bahagian Profil Pengguna */}
        <Text style={styles.settingSecHeader}>PROFIL</Text>
        <View style={styles.settingCard}>
          {/* Foto Profil */}
          <View style={styles.settingRow}>
            <View style={styles.settingAvatarCircle}>
              <Text style={styles.settingAvatarTxt}>{playerName.charAt(0)}</Text>
            </View>
            <TouchableOpacity style={styles.btnChoosePhoto}>
              <Text style={styles.btnChoosePhotoTxt}>PILIH DARIPADA GALERI</Text>
            </TouchableOpacity>
          </View>

          {/* Nama Pengguna & Sekatan Masa */}
          <View style={styles.settingDivider} />
          <View style={styles.settingRowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabelSmall}>NAMA PENGGUNA</Text>
              {!editNameMode ? (
                <Text style={styles.fieldValueBold}>{playerName}</Text>
              ) : (
                <TextInput
                  style={styles.settingInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder="Nama Pengguna Baru"
                  placeholderTextColor="#666"
                />
              )}
            </View>
            {!editNameMode ? (
              <TouchableOpacity style={styles.btnActionSetting} onPress={() => setEditNameMode(true)}>
                <Text style={styles.btnActionSettingTxt}>SUNTING</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity style={[styles.btnActionSetting, { borderColor: '#888' }]} onPress={() => setEditNameMode(false)}>
                  <Text style={[styles.btnActionSettingTxt, { color: '#888' }]}>BATAL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnActionSetting} onPress={handleSaveName}>
                  <Text style={styles.btnActionSettingTxt}>SIMPAN</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Kelas Watak */}
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingRowBetween} onPress={() => setModalSubView('KELAS')}>
            <View>
              <Text style={styles.fieldLabelSmall}>KELAS</Text>
              <Text style={styles.fieldValueBold}>{selectedClass}</Text>
            </View>
            <Text style={styles.goldArrow}>TUKAR ➔</Text>
          </TouchableOpacity>

          {/* Biografi */}
          <View style={styles.settingDivider} />
          <View style={styles.settingRowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabelSmall}>BIOGRAFI</Text>
              {!editBioMode ? (
                <Text style={styles.fieldValueMuted}>{bioText}</Text>
              ) : (
                <TextInput
                  style={[styles.settingInput, { height: 60 }]}
                  multiline
                  value={bioInput}
                  onChangeText={setBioInput}
                  placeholder="Perkenalkan diri anda secara ringkas..."
                  placeholderTextColor="#666"
                />
              )}
            </View>
            {!editBioMode ? (
              <TouchableOpacity style={styles.btnActionSetting} onPress={() => setEditBioMode(true)}>
                <Text style={styles.btnActionSettingTxt}>SUNTING</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity style={[styles.btnActionSetting, { borderColor: '#888' }]} onPress={() => setEditBioMode(false)}>
                  <Text style={[styles.btnActionSettingTxt, { color: '#888' }]}>BATAL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnActionSetting} onPress={() => { setBioText(bioInput); setEditBioMode(false); }}>
                  <Text style={styles.btnActionSettingTxt}>SIMPAN</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Bahagian Pandangan Peranan (Roleplay) */}
        <Text style={styles.settingSecHeader}>LAKONAN PERANAN</Text>
        <View style={styles.settingCard}>
          <TouchableOpacity style={styles.settingRowBetween} onPress={() => setModalSubView('AGAMA')}>
            <Text style={styles.fieldValueBold}>☪ AGAMA: {selectedReligion.toUpperCase()}</Text>
            <Text style={styles.goldArrow}>PILIH ➔</Text>
          </TouchableOpacity>

          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingRowBetween} onPress={() => setModalSubView('POLITIK')}>
            <Text style={styles.fieldValueBold}>🏛 POLITIK: {selectedIdeology.toUpperCase()}</Text>
            <Text style={styles.goldArrow}>PILIH ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Bahagian Pemberitahuan */}
        <Text style={styles.settingSecHeader}>PEMBERITAHUAN</Text>
        <View style={styles.settingCard}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>⚔ Pemberitahuan perang</Text>
            <Switch value={notifWar} onValueChange={setNotifWar} thumbColor={notifWar ? '#F59E0B' : '#64748B'} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>🗳 Pemberitahuan pilihan raya</Text>
            <Switch value={notifElection} onValueChange={setNotifElection} thumbColor={notifElection ? '#F59E0B' : '#64748B'} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>🏛 Pemberitahuan parlimen</Text>
            <Switch value={notifParliament} onValueChange={setNotifParliament} thumbColor={notifParliament ? '#F59E0B' : '#64748B'} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>🚩 Pemberitahuan parti</Text>
            <Switch value={notifParty} onValueChange={setNotifParty} thumbColor={notifParty ? '#F59E0B' : '#64748B'} />
          </View>
        </View>

        {/* Bahagian Bahasa - Fokus Bahasa Melayu Sahaja Buat Masa Ini */}
        <Text style={styles.settingSecHeader}>BAHASA</Text>
        <View style={styles.settingCard}>
          <View style={styles.langItemActiveBox}>
            <Text style={styles.langItemTxtActive}>🇲🇾 Bahasa Melayu (Lalai)</Text>
            <Check size={16} color="#10B981" />
          </View>
        </View>

        {/* Butang Log Keluar */}
        <TouchableOpacity style={styles.btnLogoutFull} onPress={onLogKeluar}>
          <LogOut size={16} color="#EF4444" />
          <Text style={styles.btnLogoutFullTxt}>LOG KELUAR AKAUN</Text>
        </TouchableOpacity>

        {/* Modal Pemilihan Kelas */}
        <Modal visible={modalSubView === 'KELAS'} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>PEMILIHAN KELAS WATAK</Text>
              <Text style={styles.cardDesc}>Pilih haluan utama yang memberi bonus tetap pada kedaulatan anda:</Text>

              <TouchableOpacity
                style={[styles.roleOptionCard, selectedClass === 'Ketenteraan' && styles.roleOptionCardActive]}
                onPress={() => { setSelectedClass('Ketenteraan'); setModalSubView('NONE'); }}
              >
                <Text style={styles.roleOptionTitle}>⚔ KETENTERAAN</Text>
                <Text style={styles.roleOptionDesc}>+50 Teknik Pertempuran • +20% Kerosakan Perang</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleOptionCard, selectedClass === 'Birokrasi' && styles.roleOptionCardActive]}
                onPress={() => { setSelectedClass('Birokrasi'); setModalSubView('NONE'); }}
              >
                <Text style={styles.roleOptionTitle}>🏛 BIROKRASI</Text>
                <Text style={styles.roleOptionDesc}>+50 Kemahiran Berek • +20% Pendapatan Kilang • +10% Sumber</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleOptionCard, selectedClass === 'Keilmuan' && styles.roleOptionCardActive]}
                onPress={() => { setSelectedClass('Keilmuan'); setModalSubView('NONE'); }}
              >
                <Text style={styles.roleOptionTitle}>📜 KEILMUAN</Text>
                <Text style={styles.roleOptionDesc}>+50 Kemahiran Saintis • -10% Masa Naik Taraf Kemahiran</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalSubView('NONE')}>
                <Text style={styles.modalCloseBtnTxt}>TUTUP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal Pemilihan Agama */}
        <Modal visible={modalSubView === 'AGAMA'} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>PANDANGAN AGAMA</Text>
              <Text style={styles.cardDesc}>Pilihan ini hanya untuk tujuan lakonan peranan (role-play):</Text>

              {['Islam', 'Kristian', 'Yahudi', 'Buddha', 'Hindu', 'Shinto', 'Tidak Menyatakan'].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.roleOptionCard, selectedReligion === item && styles.roleOptionCardActive]}
                  onPress={() => { setSelectedReligion(item); setModalSubView('NONE'); }}
                >
                  <Text style={styles.roleOptionTitle}>{item}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalSubView('NONE')}>
                <Text style={styles.modalCloseBtnTxt}>BATAL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal Pemilihan Politik */}
        <Modal visible={modalSubView === 'POLITIK'} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>PANDANGAN POLITIK</Text>
              <Text style={styles.cardDesc}>Tetapkan pendirian politik watak anda untuk tujuan lakonan:</Text>

              {['Monarkisme', 'Konservatisme', 'Demokrasi Sosial', 'Sosialisme', 'Nasionalisme', 'Liberalisme'].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.roleOptionCard, selectedIdeology === item && styles.roleOptionCardActive]}
                  onPress={() => { setSelectedIdeology(item); setModalSubView('NONE'); }}
                >
                  <Text style={styles.roleOptionTitle}>{item}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalSubView('NONE')}>
                <Text style={styles.modalCloseBtnTxt}>BATAL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  // =========================================================
  // PAPARAN BIASA PROFIL WATAK (PROFIL DASHBOARD)
  // =========================================================
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header Profil & Butang Gear Tetapan */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.rowBetween}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarTxt}>{playerName.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                <Text style={styles.playerName} numberOfLines={1}>[MAHA] {playerName}</Text>
                <View style={[styles.rankTag, { borderColor: rankColor }]}>
                  <Text style={[styles.rankTagTxt, { color: rankColor }]}>{rankTitle}</Text>
                </View>
              </View>
              {/* Butang Gear Tetapan Tetap Kekal Di Sini */}
              <TouchableOpacity style={styles.btnGear} onPress={() => setInSettingsPage(true)}>
                <SettingsGear size={18} color="#F3CE65" />
              </TouchableOpacity>
            </View>
            <Text style={styles.subMeta}>Dinasti: <Text style={styles.goldTxt}>{partyName}</Text> • 📍 {regionName}</Text>
            <Text style={styles.levelTxt}>Tahap Kedaulatan: <Text style={styles.goldTxt}>{level}</Text> / 999</Text>
          </View>
        </View>

        <View style={styles.fundsRow}>
          <View style={styles.fundCell}>
            <Text style={styles.fundLbl}>WANG TUNAI</Text>
            <Text style={styles.fundGold}>💰 ${gold.toLocaleString()}</Text>
          </View>
          <View style={styles.fundCell}>
            <Text style={styles.fundLbl}>PERMATA NILAM</Text>
            <Text style={styles.fundDiamond}>💎 {diamonds.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Banner Bertapa */}
      {activeSession && (
        <View style={styles.activeStudyCard}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Hourglass size={18} color="#FBBF24" />
              <View>
                <Text style={styles.activeStudyTitle}>
                  SEDANG BERTAPA: {DISCIPLINE_CONFIG.find((d) => d.key === activeSession.disciplineKey)?.name.toUpperCase()}
                </Text>
                <Text style={styles.activeStudySub}>
                  Menuju Tahap {activeSession.targetLevel} • Kaedah: {activeSession.method === 'NILAM' ? 'Permata Nilam (Pantas)' : 'Wang Tunai'}
                </Text>
              </View>
            </View>
            <Text style={styles.activeTimerTxt}>{DisciplineEngine.formatTime(remainingSecs)}</Text>
          </View>

          <View style={styles.activeProgressTrack}>
            <View style={[styles.activeProgressFill, { width: `${progressPct}%` as any }]} />
          </View>

          <View style={[styles.rowBetween, { marginTop: 6 }]}>
            <Text style={styles.activeNoticeTxt}>Latihan berjalan di latar belakang secara adil.</Text>
            <TouchableOpacity onPress={onCancelStudy}>
              <Text style={styles.cancelStudyTxt}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Status Berek & Kuasa */}
      <View style={styles.cardGolden}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.secTitle}>🎖 KEDUDUKAN TENTERA & BEREK</Text>
            <Text style={styles.cardDesc}>
              Berek Tahap {barracksLevel} • Kuasa Semasa: <Text style={styles.powerTxt}>{militaryPower.toLocaleString()} DMG</Text>
            </Text>
          </View>
          <View style={styles.badgeBarracks}>
            <Shield size={16} color="#EF4444" />
            <Text style={styles.badgeBarracksTxt}>Berek Thp. {barracksLevel}</Text>
          </View>
        </View>
      </View>

      {/* 5 Cabang Ilmu Kedaulatan */}
      <View style={styles.cardGolden}>
        <View style={styles.rowBetween}>
          <Text style={styles.secTitle}>📜 5 CABANG ILMU KEDAULATAN (HAD: 999)</Text>
          <Text style={styles.goldSmall}>Asas Permulaan: 50</Text>
        </View>
        <Text style={styles.cardDesc}>
          Tingkatkan ilmu menggunakan Wang Tunai atau Nilam. Kaedah Nilam menjimatkan separuh masa bertapa tetapi tidak membolehkan kenaikan segera:
        </Text>

        {DISCIPLINE_CONFIG.map((d) => {
          const IconComponent = d.icon;
          const currentVal = disciplines[d.key];
          const isStudyingThis = activeSession?.disciplineKey === d.key;
          const isMax = currentVal >= DisciplineEngine.MAX_LEVEL;

          return (
            <View key={d.key} style={[styles.disciplineRow, isStudyingThis && styles.disciplineRowActive]}>
              <View style={styles.discIconBox}>
                <IconComponent size={20} color={isStudyingThis ? '#FBBF24' : '#F3CE65'} />
              </View>

              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.discName}>{d.name}</Text>
                  <Text style={styles.discLevel}>Tahap {currentVal}</Text>
                </View>
                <Text style={styles.discBonus}>{d.getBonusTxt(currentVal)}</Text>
                <Text style={styles.discDesc}>{d.desc}</Text>
              </View>

              <TouchableOpacity
                disabled={isMax || !!activeSession}
                style={[
                  styles.btnUpgradeDisc,
                  (isMax || !!activeSession) && styles.btnUpgradeDiscDisabled,
                  isStudyingThis && styles.btnUpgradeDiscStudying,
                ]}
                onPress={() => setModalMethod({ open: true, key: d.key })}
              >
                {isStudyingThis ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} color="#FBBF24" />
                    <Text style={styles.btnStudyingTxt}>{DisciplineEngine.formatTime(remainingSecs)}</Text>
                  </View>
                ) : (
                  <Text style={styles.btnUpgradeDiscTxt}>
                    {isMax ? 'MAKS' : 'PERTINGKAT'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* 8 Hikmat Pasif */}
      <View style={styles.cardGolden}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.secTitle}>✨ 8 HIKMAT PASIF (BAKAT ALAM)</Text>
            <Text style={styles.cardDesc}>Mata Bakat: <Text style={styles.goldTxt}>{passivePoints} Mata Tersedia</Text></Text>
          </View>
          <TouchableOpacity style={styles.btnOpenPassive} onPress={() => setModalPassive(true)}>
            <Sparkles size={14} color="#F3CE65" />
            <Text style={styles.btnOpenPassiveTxt}>URUS BAKAT</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.passivePreviewGrid}>
          {PASSIVE_LIST.map((p) => (
            <View key={p.key} style={styles.passivePreviewCell}>
              <Text style={styles.passiveName} numberOfLines={1}>{p.title}</Text>
              <Text style={styles.passiveVal}>{passives[p.key]}/{p.max}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Modal Pemilihan Kaedah Wang vs Nilam */}
      <Modal visible={modalMethod.open} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            {modalMethod.key && (() => {
              const dKey = modalMethod.key;
              const currentLvl = disciplines[dKey];
              const nextLvl = currentLvl + 1;
              const goldCost = DisciplineEngine.getGoldCost(currentLvl);
              const gemCost = DisciplineEngine.getGemsCost(currentLvl);
              const goldTimeSecs = DisciplineEngine.getDurationSeconds(currentLvl, 'WANG');
              const gemTimeSecs = DisciplineEngine.getDurationSeconds(currentLvl, 'NILAM');

              return (
                <View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.modalTitle}>PILIH KAEDAH BERTAPA</Text>
                    <TouchableOpacity onPress={() => setModalMethod({ open: false, key: null })}>
                      <Text style={styles.closeModalTxt}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.cardDesc}>
                    Menaikkan ke <Text style={styles.goldTxt}>Tahap {nextLvl}</Text>. Tiada kaedah segera; Nilam menjimatkan 50% masa berbanding wang tunai.
                  </Text>

                  <TouchableOpacity
                    style={styles.methodCard}
                    onPress={() => {
                      if (gold < goldCost) {
                        Alert.alert('Ralat', 'Baki wang tunai tidak mencukupi.');
                        return;
                      }
                      onStartStudy(dKey, 'WANG');
                      setModalMethod({ open: false, key: null });
                    }}
                  >
                    <View style={styles.rowBetween}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Coins size={22} color="#F59E0B" />
                        <View>
                          <Text style={styles.methodTitle}>Kaedah Wang Tunai (Emas/RM)</Text>
                          <Text style={styles.methodCost}>Kos: ${goldCost.toLocaleString()} RM</Text>
                        </View>
                      </View>
                      <View style={styles.timeTag}>
                        <Clock size={12} color="#94A3B8" />
                        <Text style={styles.timeTagTxt}>{DisciplineEngine.formatTime(goldTimeSecs)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.methodCard, { borderColor: '#3B82F6' }]}
                    onPress={() => {
                      if (diamonds < gemCost) {
                        Alert.alert('Ralat', 'Baki permata nilam tidak mencukupi.');
                        return;
                      }
                      onStartStudy(dKey, 'NILAM');
                      setModalMethod({ open: false, key: null });
                    }}
                  >
                    <View style={styles.rowBetween}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Gem size={22} color="#60A5FA" />
                        <View>
                          <Text style={styles.methodTitle}>Kaedah Permata Nilam (50% Pantas)</Text>
                          <Text style={[styles.methodCost, { color: '#60A5FA' }]}>Kos: {gemCost} Nilam</Text>
                        </View>
                      </View>
                      <View style={[styles.timeTag, { borderColor: '#3B82F6' }]}>
                        <Clock size={12} color="#60A5FA" />
                        <Text style={[styles.timeTagTxt, { color: '#60A5FA' }]}>{DisciplineEngine.formatTime(gemTimeSecs)}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })()}
          </View>
        </View>
      </Modal>

      {/* Modal 8 Hikmat Pasif */}
      <Modal visible={modalPassive} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalBox, { maxHeight: '85%' }]}>
            <View style={styles.rowBetween}>
              <Text style={styles.modalTitle}>POHON 8 HIKMAT PASIF TAKHTA</Text>
              <TouchableOpacity onPress={() => setModalPassive(false)}>
                <Text style={styles.closeModalTxt}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardDesc}>
              Baki Mata Tersedia: <Text style={styles.goldTxt}>{passivePoints}</Text> (Diperoleh +1 setiap kenaikan tahap kedaulatan):
            </Text>

            <ScrollView style={{ marginTop: 8 }}>
              {PASSIVE_LIST.map((p) => {
                const cur = passives[p.key];
                const isMax = cur >= p.max;
                const canAlloc = passivePoints > 0 && !isMax;

                return (
                  <View key={p.key} style={styles.talentItem}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={styles.talentTitle}>{p.title} ({cur}/{p.max})</Text>
                      <Text style={styles.talentDesc}>{p.desc}</Text>
                    </View>
                    <TouchableOpacity
                      disabled={!canAlloc}
                      style={[styles.btnAlloc, !canAlloc && styles.btnAllocDisabled]}
                      onPress={() => onAllocatePassive(p.key)}
                    >
                      <Text style={styles.btnAllocTxt}>{isMax ? 'MAKS' : '+1'}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090E', paddingHorizontal: 12 },
  profileHeaderCard: { backgroundColor: '#0D131C', borderRadius: 8, borderWidth: 1, borderColor: '#1F2B3E', padding: 14, marginVertical: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avatarBox: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#181320', borderWidth: 1.5, borderColor: '#F3CE65', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: '#F3CE65', fontSize: 24, fontWeight: 'bold' },
  playerName: { color: '#F8FAFC', fontSize: 15, fontWeight: 'bold' },
  rankTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, backgroundColor: '#13111C' },
  rankTagTxt: { fontSize: 9, fontWeight: 'bold' },
  btnGear: { padding: 6, backgroundColor: '#171420', borderRadius: 6, borderWidth: 1, borderColor: '#3D311F' },
  subMeta: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  levelTxt: { color: '#94A3B8', fontSize: 10, marginTop: 1 },
  goldTxt: { color: '#F59E0B', fontWeight: 'bold' },
  powerTxt: { color: '#EF4444', fontWeight: 'bold' },
  fundsRow: { flexDirection: 'row', gap: 8, marginTop: 12, borderTopWidth: 1, borderColor: '#1E293B', paddingTop: 10 },
  fundCell: { flex: 1, backgroundColor: '#070A10', padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#1E293B' },
  fundLbl: { color: '#64748B', fontSize: 8, fontWeight: 'bold' },
  fundGold: { color: '#F59E0B', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  fundDiamond: { color: '#60A5FA', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  activeStudyCard: { backgroundColor: '#1A1408', borderRadius: 8, borderWidth: 1.2, borderColor: '#FBBF24', padding: 12, marginBottom: 10 },
  activeStudyTitle: { color: '#FBBF24', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  activeStudySub: { color: '#CBD5E1', fontSize: 9, marginTop: 1 },
  activeTimerTxt: { color: '#FBBF24', fontSize: 14, fontWeight: 'bold' },
  activeProgressTrack: { height: 6, backgroundColor: '#2D2310', borderRadius: 3, marginTop: 8, overflow: 'hidden' },
  activeProgressFill: { height: '100%', backgroundColor: '#FBBF24' },
  activeNoticeTxt: { color: '#94A3B8', fontSize: 9, fontStyle: 'italic' },
  cancelStudyTxt: { color: '#EF4444', fontSize: 10, fontWeight: 'bold' },
  cardGolden: { backgroundColor: '#0E0B14', borderRadius: 8, borderWidth: 1, borderColor: '#3D311F', padding: 12, marginBottom: 10 },
  secTitle: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  cardDesc: { color: '#888', fontSize: 10, marginVertical: 4 },
  badgeBarracks: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1E1B13', borderWidth: 1, borderColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeBarracksTxt: { color: '#EF4444', fontSize: 10, fontWeight: 'bold' },
  goldSmall: { color: '#F3CE65', fontSize: 9 },
  disciplineRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#130F1A', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#2B1E3B', marginTop: 8 },
  disciplineRowActive: { borderColor: '#FBBF24', backgroundColor: '#191512' },
  discIconBox: { width: 38, height: 38, borderRadius: 6, backgroundColor: '#1E1826', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#3D311F' },
  discName: { color: '#F8FAFC', fontSize: 11, fontWeight: 'bold' },
  discLevel: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold' },
  discBonus: { color: '#10B981', fontSize: 9, fontWeight: 'bold', marginTop: 1 },
  discDesc: { color: '#64748B', fontSize: 8, marginTop: 1 },
  btnUpgradeDisc: { backgroundColor: '#F3CE65', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 4, marginLeft: 8 },
  btnUpgradeDiscDisabled: { opacity: 0.5, backgroundColor: '#1E293B' },
  btnUpgradeDiscStudying: { backgroundColor: '#2E2210', borderWidth: 1, borderColor: '#FBBF24' },
  btnUpgradeDiscTxt: { color: '#07090E', fontSize: 9, fontWeight: 'bold' },
  btnStudyingTxt: { color: '#FBBF24', fontSize: 9, fontWeight: 'bold' },
  btnOpenPassive: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1E1B13', borderWidth: 1, borderColor: '#F3CE65', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4 },
  btnOpenPassiveTxt: { color: '#F3CE65', fontSize: 9, fontWeight: 'bold' },
  passivePreviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  passivePreviewCell: { width: '23%', backgroundColor: '#070A10', padding: 6, borderRadius: 6, borderWidth: 1, borderColor: '#1E293B', alignItems: 'center' },
  passiveName: { color: '#94A3B8', fontSize: 8, textAlign: 'center' },
  passiveVal: { color: '#F59E0B', fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalBox: { width: '100%', maxWidth: 400, backgroundColor: '#0E0B14', borderRadius: 8, borderWidth: 1.2, borderColor: '#F3CE65', padding: 16 },
  modalTitle: { color: '#F3CE65', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  closeModalTxt: { color: '#888', fontWeight: 'bold', fontSize: 14 },
  methodCard: { backgroundColor: '#130F1C', borderWidth: 1, borderColor: '#F59E0B', borderRadius: 6, padding: 12, marginTop: 10 },
  methodTitle: { color: '#F8FAFC', fontSize: 11, fontWeight: 'bold' },
  methodCost: { color: '#F59E0B', fontSize: 10, marginTop: 2, fontWeight: 'bold' },
  timeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#475569', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  timeTagTxt: { color: '#94A3B8', fontSize: 9, fontWeight: 'bold' },
  talentItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#130F1A', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#2B1E3B', marginVertical: 4 },
  talentTitle: { color: '#F8FAFC', fontSize: 11, fontWeight: 'bold' },
  talentDesc: { color: '#888', fontSize: 9, marginTop: 2 },
  btnAlloc: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  btnAllocDisabled: { backgroundColor: '#1E293B', opacity: 0.5 },
  btnAllocTxt: { color: '#07090E', fontSize: 10, fontWeight: 'bold' },

  // GAYA TETAPAN PENUH (SETTINGS)
  backToProfileBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  backToProfileTxt: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
  settingsPageTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  settingSecHeader: { color: '#64748B', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginTop: 14, marginBottom: 6 },
  settingCard: { backgroundColor: '#0E0B14', borderRadius: 8, borderWidth: 1, borderColor: '#2A2035', padding: 12 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingAvatarCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1426', borderWidth: 1.5, borderColor: '#F3CE65', alignItems: 'center', justifyContent: 'center' },
  settingAvatarTxt: { color: '#F3CE65', fontSize: 20, fontWeight: 'bold' },
  btnChoosePhoto: { backgroundColor: '#171422', borderWidth: 1, borderColor: '#4A3B60', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 4 },
  btnChoosePhotoTxt: { color: '#D8B4FE', fontSize: 10, fontWeight: 'bold' },
  settingDivider: { height: 1, backgroundColor: '#1C1628', marginVertical: 10 },
  fieldLabelSmall: { color: '#64748B', fontSize: 8, fontWeight: 'bold' },
  fieldValueBold: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  fieldValueMuted: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  goldArrow: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold' },
  btnActionSetting: { backgroundColor: '#171422', borderWidth: 1, borderColor: '#F59E0B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  btnActionSettingTxt: { color: '#F59E0B', fontSize: 9, fontWeight: 'bold' },
  settingInput: { backgroundColor: '#07090E', borderWidth: 1, borderColor: '#334155', borderRadius: 4, color: '#FFF', paddingHorizontal: 10, height: 36, fontSize: 11, marginTop: 4 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  toggleLabel: { color: '#CBD5E1', fontSize: 11 },
  langItemActiveBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  langItemTxtActive: { color: '#10B981', fontSize: 12, fontWeight: 'bold' },
  btnLogoutFull: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1A0E12', borderWidth: 1, borderColor: '#EF4444', paddingVertical: 12, borderRadius: 6, marginTop: 20 },
  btnLogoutFullTxt: { color: '#EF4444', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  roleOptionCard: { backgroundColor: '#120F1C', borderWidth: 1, borderColor: '#2B1E3B', borderRadius: 6, padding: 12, marginVertical: 4 },
  roleOptionCardActive: { borderColor: '#F59E0B', backgroundColor: '#1F1728' },
  roleOptionTitle: { color: '#F8FAFC', fontSize: 11, fontWeight: 'bold' },
  roleOptionDesc: { color: '#94A3B8', fontSize: 9, marginTop: 2 },
  modalCloseBtn: { backgroundColor: '#1E293B', paddingVertical: 10, borderRadius: 4, alignItems: 'center', marginTop: 10 },
  modalCloseBtnTxt: { color: '#CBD5E1', fontSize: 10, fontWeight: 'bold' },
});