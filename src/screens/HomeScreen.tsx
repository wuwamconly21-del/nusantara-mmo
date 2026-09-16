import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {
  Swords,
  Factory,
  ShieldAlert,
  Send,
  ScrollText,
  Briefcase,
  Flame,
  Globe2,
} from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface HomeScreenProps {
  playerName: string;
  level: number;
  xp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  gold: number;
  diamonds: number;
  regionName: string;
  countryName: string;
  disciplines: any;
  activeCampaign?: any;
  userParty?: any;
  activeStudySession?: any;
  onNavigate: (tab: string) => void;
  onQuickWork: () => void;
  onQuickTrain: () => void;
  onSendChatMessage?: (msg: string, channel: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  playerName,
  level,
  xp,
  maxXp,
  hp,
  maxHp,
  gold,
  diamonds,
  regionName,
  countryName,
  activeCampaign,
  onNavigate,
  onQuickWork,
  onQuickTrain,
}) => {
  const [chatInput, setChatInput] = React.useState('');
  const [chatTab, setChatTab] = React.useState<'DUNIA' | 'PARTI' | 'WILAYAH'>('DUNIA');

  const handleNavigateWithAnimation = (tab: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onNavigate(tab);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* STATUS BAR HP & EXP */}
      <View style={styles.statusBarBox}>
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>TENAGA (HP): {hp}/{maxHp}</Text>
          <Text style={styles.barPercent}>{Math.round((hp / maxHp) * 100)}%</Text>
        </View>
        <View style={styles.trackBar}>
          <View style={[styles.fillHp, { width: `${(hp / maxHp) * 100}%` }]} />
        </View>

        <View style={[styles.barRow, { marginTop: 8 }]}>
          <Text style={styles.barLabel}>TAHAP {level} (EXP): {xp}/{maxXp}</Text>
          <Text style={styles.barPercent}>{Math.round((xp / maxXp) * 100)}%</Text>
        </View>
        <View style={styles.trackBar}>
          <View style={[styles.fillXp, { width: `${(xp / maxXp) * 100}%` }]} />
        </View>
      </View>

      {/* GRID UTAMA */}
      <View style={styles.mainGrid}>
        {/* PEPERANGAN & TINDAKAN PANTAS */}
        <View style={styles.columnLeft}>
          <View style={styles.cardGolden}>
            <View style={styles.cardHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Flame size={16} color="#EF4444" />
                <Text style={styles.cardTitleRed}>PERANG TERDEKAT</Text>
              </View>
              <TouchableOpacity onPress={() => handleNavigateWithAnimation('peperangan')}>
                <Text style={styles.linkGold}>Lihat →</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.warName}>{activeCampaign?.title || 'Pertempuran Selat Melaka'}</Text>
            <Text style={styles.warRegion}>📍 {activeCampaign?.regionName || regionName}</Text>

            <View style={styles.warBarRow}>
              <Text style={{ color: '#38BDF8', fontSize: 10, fontWeight: 'bold' }}>
                {activeCampaign?.attackerName || 'Penyerang'}
              </Text>
              <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: 'bold' }}>
                {activeCampaign?.defenderName || 'Pertahanan'}
              </Text>
            </View>
            <View style={styles.trackBar}>
              <View style={[styles.fillHp, { width: '55%', backgroundColor: '#38BDF8' }]} />
            </View>

            <TouchableOpacity style={styles.btnGempur} onPress={() => handleNavigateWithAnimation('peperangan')}>
              <Swords size={14} color="#FFF" />
              <Text style={styles.btnGempurTxt}>GEMPUR SEKARANG</Text>
            </TouchableOpacity>
          </View>

          {/* TINDAKAN PANTAS */}
          <View style={styles.cardGolden}>
            <Text style={styles.cardTitle}>TINDAKAN PANTAS</Text>
            <TouchableOpacity style={styles.actionBtn} onPress={onQuickWork}>
              <Factory size={16} color="#F3CE65" />
              <Text style={styles.actionBtnTxt}>Bekerja Di Kilang (+RM / +EXP)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={onQuickTrain}>
              <ShieldAlert size={16} color="#F3CE65" />
              <Text style={styles.actionBtnTxt}>Latih Unit Tentera Berek</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleNavigateWithAnimation('profil')}>
              <Briefcase size={16} color="#F3CE65" />
              <Text style={styles.actionBtnTxt}>Dalami Cabang Ilmu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PERUTUSAN & CHAT SALURAN */}
        <View style={styles.columnCenter}>
          <View style={styles.cardAnnouncement}>
            <Text style={styles.announcementTitle}>👑 PERUTUSAN RASMI PERDANA MENTERI</Text>
            <Text style={styles.announcementBody}>
              "Seluruh barisan kabinet menyeru para peniaga dan pemilik kilang untuk melabur dalam sektor pembinaan aset infrastruktur baharu demi memperkasakan pertahanan tanah air."
            </Text>
          </View>

          <View style={styles.cardGolden}>
            <View style={styles.chatHeader}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {(['DUNIA', 'PARTI', 'WILAYAH'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.chatTabBtn, chatTab === t && styles.chatTabBtnActive]}
                    onPress={() => setChatTab(t)}
                  >
                    <Text style={[styles.chatTabTxt, chatTab === t && styles.chatTabTxtActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.liveBadge}>• LIVE</Text>
            </View>

            <ScrollView style={styles.chatBox}>
              <View style={styles.chatMsg}>
                <Text style={styles.chatUser}>Pendekar_01 <Text style={styles.tagBadge}>WARISAN</Text></Text>
                <Text style={styles.chatText}>Perhatian semua warga, PRN Selangor akan bermula hujung minggu ini.</Text>
              </View>
              <View style={styles.chatMsg}>
                <Text style={styles.chatUser}>Pahlawan_SEA <Text style={styles.tagBadge}>SELAT</Text></Text>
                <Text style={styles.chatText}>Sektor perkilangan berlian di KL memerlukan lebih ramai tenaga kerja!</Text>
              </View>
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder={`Mesej di saluran #${chatTab.toLowerCase()}...`}
                placeholderTextColor="#666"
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity style={styles.btnSend}>
                <Send size={14} color="#07060A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* DASHBOARD KAWASAN (SEA, CHINA, JAPAN) */}
        <View style={styles.columnRight}>
          <View style={styles.cardGolden}>
            <Text style={styles.cardTitle}>DASHBOARD REGION (SEA, CHINA, JAPAN)</Text>
            <View style={styles.dashGrid}>
              <View style={styles.dashItem}>
                <Text style={styles.dashVal}>208</Text>
                <Text style={styles.dashLbl}>WILAYAH</Text>
              </View>
              <View style={styles.dashItem}>
                <Text style={styles.dashVal}>-</Text>
                <Text style={styles.dashLbl}>PERANG</Text>
              </View>
              <View style={styles.dashItem}>
                <Text style={styles.dashVal}>-</Text>
                <Text style={styles.dashLbl}>NEGARA</Text>
              </View>
              <View style={styles.dashItem}>
                <Text style={styles.dashVal}>-</Text>
                <Text style={styles.dashLbl}>PARTI</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardGolden}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>AKHBAR & BERITA DUNIA</Text>
              <TouchableOpacity onPress={() => handleNavigateWithAnimation('parlimen')}>
                <Text style={styles.linkGold}>Semua →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.newsItem}>
              <Text style={styles.newsTag}>GENCATAN SENJATA</Text>
              <Text style={styles.newsText}>Perjanjian damai Selat Melaka ditandatangani oleh Gabungan Wilayah.</Text>
            </View>
            <View style={styles.newsItem}>
              <Text style={styles.newsTag}>PASARAN SAHAM</Text>
              <Text style={styles.newsText}>Sektor logistik maritim mencatatkan peningkatan pertumbuhan di rantau SEA.</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07060A', padding: 12 },
  statusBarBox: {
    backgroundColor: '#0E0B14',
    borderWidth: 1,
    borderColor: '#2B2035',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  barLabel: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  barPercent: { color: '#F3CE65', fontSize: 10, fontWeight: 'bold' },
  trackBar: { height: 8, backgroundColor: '#18141F', borderRadius: 4, overflow: 'hidden' },
  fillHp: { height: '100%', backgroundColor: '#EF4444' },
  fillXp: { height: '100%', backgroundColor: '#10B981' },
  mainGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  columnLeft: { flex: 1, minWidth: 280 },
  columnCenter: { flex: 2, minWidth: 320 },
  columnRight: { flex: 1, minWidth: 260 },
  cardGolden: {
    backgroundColor: '#0E0B14',
    borderWidth: 1,
    borderColor: '#3D311F',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: { color: '#F3CE65', fontSize: 11, fontWeight: 'bold', marginBottom: 8, letterSpacing: 0.5 },
  cardTitleRed: { color: '#EF4444', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  linkGold: { color: '#F3CE65', fontSize: 10, fontWeight: 'bold' },
  warName: { color: '#FFF', fontSize: 13, fontWeight: 'bold', marginTop: 4 },
  warRegion: { color: '#9CA3AF', fontSize: 10, marginVertical: 4 },
  warBarRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 4 },
  btnGempur: {
    backgroundColor: '#991B1B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 12,
  },
  btnGempurTxt: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#18141F',
    borderWidth: 1,
    borderColor: '#2B2035',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  actionBtnTxt: { color: '#FFF', fontSize: 11 },
  cardAnnouncement: {
    backgroundColor: '#120E1A',
    borderWidth: 1,
    borderColor: '#F3CE65',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  announcementTitle: { color: '#F3CE65', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  announcementBody: { color: '#CBD5E1', fontSize: 10, fontStyle: 'italic', lineHeight: 14 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  chatTabBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, backgroundColor: '#18141F' },
  chatTabBtnActive: { backgroundColor: '#F3CE65' },
  chatTabTxt: { color: '#9CA3AF', fontSize: 9, fontWeight: 'bold' },
  chatTabTxtActive: { color: '#07060A' },
  liveBadge: { color: '#10B981', fontSize: 9, fontWeight: 'bold' },
  chatBox: { maxHeight: 160, marginBottom: 10 },
  chatMsg: { marginBottom: 8, backgroundColor: '#14101B', padding: 8, borderRadius: 4 },
  chatUser: { color: '#F3CE65', fontSize: 10, fontWeight: 'bold' },
  tagBadge: { color: '#38BDF8', fontSize: 8 },
  chatText: { color: '#FFF', fontSize: 10, marginTop: 2 },
  chatInputRow: { flexDirection: 'row', gap: 6 },
  chatInput: {
    flex: 1,
    backgroundColor: '#18141F',
    borderWidth: 1,
    borderColor: '#2B2035',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    color: '#FFF',
    fontSize: 10,
  },
  btnSend: { backgroundColor: '#F3CE65', paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  dashGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dashItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#18141F',
    borderWidth: 1,
    borderColor: '#2B2035',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  dashVal: { color: '#F3CE65', fontSize: 16, fontWeight: 'bold' },
  dashLbl: { color: '#64748B', fontSize: 8, marginTop: 2 },
  newsItem: { backgroundColor: '#14101B', padding: 8, borderRadius: 4, marginBottom: 6 },
  newsTag: { color: '#EF4444', fontSize: 8, fontWeight: 'bold' },
  newsText: { color: '#CBD5E1', fontSize: 9, marginTop: 2 },
});
