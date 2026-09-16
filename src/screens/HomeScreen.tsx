import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  Swords,
  Shield,
  Pickaxe,
  BookOpen,
  Crown,
  Flame,
  Send,
} from 'lucide-react-native';
import { PlayerDisciplines, ActiveStudySession } from '../types/skills';
import { DetailedParty } from '../types/party';
import { WarCampaign } from '../types/military';

const { width } = Dimensions.get('window');
const isDesktop = width >= 900;

export interface ChatMessage {
  id: string;
  senderName: string;
  partyTag?: string;
  partyColor?: string;
  message: string;
  timestamp: string;
  isOfficial?: boolean;
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
  disciplines: PlayerDisciplines;
  activeCampaign: WarCampaign;
  userParty: DetailedParty | null;
  activeStudySession: ActiveStudySession | null;
  onNavigate: (tab: any) => void;
  onQuickWork: () => void;
  onQuickTrain: () => void;
  onSendChatMessage: (msg: string, channel: 'DUNIA' | 'PARTI' | 'WILAYAH') => void;
}

export function HomeScreen({
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
  disciplines,
  activeCampaign,
  userParty,
  activeStudySession,
  onNavigate,
  onQuickWork,
  onQuickTrain,
  onSendChatMessage,
}: HomeScreenProps) {
  const [chatChannel, setChatChannel] = useState<'DUNIA' | 'PARTI' | 'WILAYAH'>('DUNIA');
  const [inputText, setInputText] = useState('');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderName: 'Zenith Aurelius',
      partyTag: 'WARISAN',
      partyColor: '#F59E0B',
      message: 'Perhatian semua warga, PRN Selangor akan bermula hujung minggu ini.',
      timestamp: '10:42 AM',
      isOfficial: true,
    },
    {
      id: '2',
      senderName: 'Megat Seri Rama',
      partyTag: 'SELAT',
      partyColor: '#3B82F6',
      message: 'Sektor perkilangan berlian di KL memerlukan lebih ramai tenaga kerja!',
      timestamp: '10:44 AM',
    },
    {
      id: '3',
      senderName: 'Tan Sri Lokman',
      partyTag: 'WARISAN',
      partyColor: '#F59E0B',
      message: 'Gencatan senjata di Selat Melaka nampaknya semakin menghampiri penghujung.',
      timestamp: '10:45 AM',
    },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderName: playerName,
      partyTag: userParty?.tag || 'BEBAS',
      partyColor: userParty?.bannerColor || '#94A3B8',
      message: inputText.trim(),
      timestamp: 'Baru saja',
    };
    setChatMessages((prev) => [...prev, newMsg]);
    onSendChatMessage(inputText.trim(), chatChannel);
    setInputText('');
  };

  const xpPercent = Math.min(100, Math.floor((xp / maxXp) * 100));
  const hpPercent = Math.min(100, Math.floor((hp / maxHp) * 100));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. TOP HERO DASHBOARD */}
      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.avatarGlow}>
              <Text style={styles.avatarTxt}>{playerName.charAt(0)}</Text>
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.playerNameTxt}>{playerName}</Text>
                {userParty && (
                  <View style={[styles.partyBadge, { backgroundColor: userParty.bannerColor }]}>
                    <Text style={styles.partyBadgeTxt}>{userParty.tag}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.locationTxt}>📍 {regionName}, {countryName}</Text>
            </View>
          </View>

          <View style={styles.currencyGroup}>
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyLbl}>EMAS</Text>
              <Text style={styles.goldTxt}>${gold.toLocaleString()} RM</Text>
            </View>
            <View style={styles.currencyBadge}>
              <Text style={styles.currencyLbl}>NILAM</Text>
              <Text style={styles.gemTxt}>{diamonds.toLocaleString()} 💎</Text>
            </View>
          </View>
        </View>

        {/* Meter HP & EXP */}
        <View style={styles.meterContainer}>
          <View style={styles.meterCell}>
            <View style={styles.meterHeader}>
              <Text style={styles.meterLbl}>TENAGA (HP): {hp}/{maxHp}</Text>
              <Text style={styles.meterVal}>{hpPercent}%</Text>
            </View>
            <View style={styles.trackBar}>
              <View style={[styles.fillBar, { width: `${hpPercent}%`, backgroundColor: '#EF4444' }]} />
            </View>
          </View>

          <View style={styles.meterCell}>
            <View style={styles.meterHeader}>
              <Text style={styles.meterLbl}>TAHAP {level} (EXP): {xp}/{maxXp}</Text>
              <Text style={styles.meterVal}>{xpPercent}%</Text>
            </View>
            <View style={styles.trackBar}>
              <View style={[styles.fillBar, { width: `${xpPercent}%`, backgroundColor: '#F3CE65' }]} />
            </View>
          </View>
        </View>
      </View>

      {/* 2. DASHBOARD 3 LAJUR */}
      <View style={[styles.mainGrid, isDesktop && styles.desktopGrid]}>
        {/* LAJUR KIRI */}
        <View style={styles.columnLeft}>
          <View style={styles.cardBoxDark}>
            <View style={styles.cardHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Flame size={16} color="#EF4444" />
                <Text style={styles.cardHeaderTitle}>PERANG TERDEKAT</Text>
              </View>
              <TouchableOpacity onPress={() => onNavigate('peperangan')}>
                <Text style={styles.linkTxt}>Lihat ➔</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.campaignTitle}>{activeCampaign.title}</Text>
            <Text style={styles.campaignSub}>{activeCampaign.regionName}</Text>

            <View style={{ marginVertical: 10 }}>
              <View style={styles.rowBetween}>
                <Text style={{ color: '#60A5FA', fontSize: 10, fontWeight: 'bold' }}>{activeCampaign.attackerName}</Text>
                <Text style={{ color: '#EF4444', fontSize: 10, fontWeight: 'bold' }}>{activeCampaign.defenderName}</Text>
              </View>
              <View style={styles.towTrack}>
                <View style={[styles.towFillAttacker, { width: '54%' }]} />
                <View style={[styles.towFillDefender, { width: '46%' }]} />
              </View>
            </View>

            <TouchableOpacity style={styles.btnFight} onPress={() => onNavigate('peperangan')}>
              <Swords size={14} color="#FFF" />
              <Text style={styles.btnFightTxt}>GEMPUR SEKARANG</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardBoxDark}>
            <Text style={styles.cardHeaderTitle}>TINDAKAN PANTAS</Text>
            <View style={{ gap: 6, marginTop: 8 }}>
              <TouchableOpacity style={styles.btnQuickAction} onPress={onQuickWork}>
                <Pickaxe size={14} color="#F59E0B" />
                <Text style={styles.btnQuickTxt}>Bekerja Di Kilang (+RM / +EXP)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnQuickAction} onPress={onQuickTrain}>
                <Shield size={14} color="#3B82F6" />
                <Text style={styles.btnQuickTxt}>Latih Unit Tentera Berek</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnQuickAction} onPress={() => onNavigate('profil')}>
                <BookOpen size={14} color="#10B981" />
                <Text style={styles.btnQuickTxt}>
                  {activeStudySession ? `Bertapa: ${activeStudySession.disciplineKey}` : 'Dalami Cabang Ilmu'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* LAJUR TENGAH */}
        <View style={styles.columnCenter}>
          <View style={styles.decreeBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Crown size={14} color="#F3CE65" />
              <Text style={styles.decreeTitle}>PERUTUSAN RASMI PERDANA MENTERI</Text>
            </View>
            <Text style={styles.decreeBody}>
              "Seluruh barisan kabinet menyeru para peniaga dan pemilik kilang untuk melabur dalam sektor pembinaan aset infrastruktur baharu demi memperkasakan pertahanan tanah air."
            </Text>
          </View>

          <View style={[styles.cardBoxDark, { flex: 1 }]}>
            <View style={styles.chatNavHeader}>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {(['DUNIA', 'PARTI', 'WILAYAH'] as const).map((ch) => (
                  <TouchableOpacity
                    key={ch}
                    style={[styles.chatTabBtn, chatChannel === ch && styles.chatTabBtnActive]}
                    onPress={() => setChatChannel(ch)}
                  >
                    <Text style={[styles.chatTabTxt, chatChannel === ch && styles.chatTabTxtActive]}>{ch}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.liveIndicator}>● LIVE</Text>
            </View>

            <ScrollView style={styles.chatScroll} contentContainerStyle={{ gap: 8 }}>
              {chatMessages.map((msg) => (
                <View key={msg.id} style={styles.msgRow}>
                  <View style={styles.msgHeader}>
                    <Text style={styles.msgSender}>{msg.senderName}</Text>
                    {msg.partyTag && (
                      <View style={[styles.msgTag, { backgroundColor: msg.partyColor || '#334155' }]}>
                        <Text style={styles.msgTagTxt}>{msg.partyTag}</Text>
                      </View>
                    )}
                    <Text style={styles.msgTime}>{msg.timestamp}</Text>
                  </View>
                  <Text style={[styles.msgContent, msg.isOfficial && styles.msgOfficial]}>{msg.message}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder={`Mesej di saluran #${chatChannel.toLowerCase()}...`}
                placeholderTextColor="#64748B"
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity style={styles.btnSend} onPress={handleSend}>
                <Send size={14} color="#07090E" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* LAJUR KANAN */}
        <View style={styles.columnRight}>
          <View style={styles.cardBoxDark}>
            <Text style={styles.cardHeaderTitle}>DASHBOARD NEGERI</Text>
            <View style={styles.gridStats}>
              <TouchableOpacity style={styles.statCell} onPress={() => onNavigate('peperangan')}>
                <Text style={[styles.statVal, { color: '#EF4444' }]}>1</Text>
                <Text style={styles.statLbl}>PERANG</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statCell} onPress={() => onNavigate('wilayah')}>
                <Text style={[styles.statVal, { color: '#10B981' }]}>208</Text>
                <Text style={styles.statLbl}>WILAYAH</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statCell} onPress={() => onNavigate('diplomasi')}>
                <Text style={[styles.statVal, { color: '#60A5FA' }]}>82</Text>
                <Text style={styles.statLbl}>NEGARA</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statCell} onPress={() => onNavigate('parti')}>
                <Text style={[styles.statVal, { color: '#F3CE65' }]}>14</Text>
                <Text style={styles.statLbl}>PARTI</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.cardBoxDark}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>AKHBAR & BERITA DUNIA</Text>
              <TouchableOpacity onPress={() => onNavigate('akhbar')}>
                <Text style={styles.linkTxt}>Semua ➔</Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 8, marginTop: 6 }}>
              <View style={styles.newsItem}>
                <Text style={styles.newsCategory}>GENCATAN SENJATA</Text>
                <Text style={styles.newsTxt}>Perjanjian damai Selat Melaka ditandatangani oleh Gabungan Wilayah.</Text>
                <Text style={styles.newsTime}>2 jam lalu</Text>
              </View>
              <View style={styles.newsItem}>
                <Text style={[styles.newsCategory, { color: '#F59E0B' }]}>PASARAN SAHAM</Text>
                <Text style={styles.newsTxt}>Saham Nusantara Marine Logistics (NMLC) melonjak +2.8% hari ini.</Text>
                <Text style={styles.newsTime}>4 jam lalu</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07060A' },
  content: { padding: 12, paddingBottom: 30 },
  heroCard: {
    backgroundColor: '#0F0C16',
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#3D311F',
    padding: 14,
    marginBottom: 12,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  avatarGlow: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#1E1826',
    borderWidth: 1.5,
    borderColor: '#F3CE65',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: { color: '#F3CE65', fontSize: 18, fontWeight: 'bold' },
  playerNameTxt: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  locationTxt: { color: '#94A3B8', fontSize: 10, marginTop: 2 },
  partyBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
  partyBadgeTxt: { color: '#07090E', fontSize: 8, fontWeight: 'bold' },
  currencyGroup: { flexDirection: 'row', gap: 6 },
  currencyBadge: {
    backgroundColor: '#161220',
    borderWidth: 1,
    borderColor: '#2D2338',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'flex-end',
  },
  currencyLbl: { color: '#64748B', fontSize: 7, fontWeight: 'bold' },
  goldTxt: { color: '#F59E0B', fontSize: 11, fontWeight: 'bold' },
  gemTxt: { color: '#38BDF8', fontSize: 11, fontWeight: 'bold' },
  meterContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#1E1826',
    paddingTop: 10,
  },
  meterCell: { flex: 1 },
  meterHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  meterLbl: { color: '#94A3B8', fontSize: 9, fontWeight: 'bold' },
  meterVal: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  trackBar: { height: 6, backgroundColor: '#1A1524', borderRadius: 3, overflow: 'hidden' },
  fillBar: { height: '100%', borderRadius: 3 },
  mainGrid: { gap: 10 },
  desktopGrid: { flexDirection: 'row', alignItems: 'flex-start' },
  columnLeft: { flex: 1, gap: 10 },
  columnCenter: { flex: 2, gap: 10 },
  columnRight: { flex: 1, gap: 10 },
  cardBoxDark: {
    backgroundColor: '#0E0B14',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#251D30',
    padding: 12,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardHeaderTitle: { color: '#F3CE65', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.8 },
  linkTxt: { color: '#F3CE65', fontSize: 9 },
  campaignTitle: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  campaignSub: { color: '#64748B', fontSize: 9 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  towTrack: { height: 8, backgroundColor: '#1A1423', borderRadius: 4, flexDirection: 'row', overflow: 'hidden', marginTop: 4 },
  towFillAttacker: { backgroundColor: '#3B82F6' },
  towFillDefender: { backgroundColor: '#EF4444' },
  btnFight: {
    backgroundColor: '#8B111A',
    borderColor: '#DC2626',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Pembetulan ralat: justifyContent, bukannya justify
    gap: 6,
    marginTop: 6,
  },
  btnFightTxt: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  btnQuickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#140F1D',
    borderWidth: 1,
    borderColor: '#231B2D',
    padding: 8,
    borderRadius: 4,
  },
  btnQuickTxt: { color: '#CBD5E1', fontSize: 9 },
  decreeBox: {
    backgroundColor: '#161109',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#854D0E',
    padding: 10,
  },
  decreeTitle: { color: '#F59E0B', fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 },
  decreeBody: { color: '#CBD5E1', fontSize: 9, fontStyle: 'italic', marginTop: 2, lineHeight: 13 },
  chatNavHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  chatTabBtn: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 3, backgroundColor: '#140F1D' },
  chatTabBtnActive: { backgroundColor: '#1E1826', borderWidth: 1, borderColor: '#F3CE65' },
  chatTabTxt: { color: '#64748B', fontSize: 8, fontWeight: 'bold' },
  chatTabTxtActive: { color: '#F3CE65' },
  liveIndicator: { color: '#10B981', fontSize: 8, fontWeight: 'bold' },
  chatScroll: { height: 180 },
  msgRow: { backgroundColor: '#120E1A', padding: 6, borderRadius: 4, borderWidth: 1, borderColor: '#1E1729' },
  msgHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  msgSender: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  msgTag: { paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2 },
  msgTagTxt: { color: '#07090E', fontSize: 7, fontWeight: 'bold' },
  msgTime: { color: '#64748B', fontSize: 7, marginLeft: 'auto' },
  msgContent: { color: '#94A3B8', fontSize: 9, marginTop: 2 },
  msgOfficial: { color: '#F3CE65', fontWeight: '500' },
  chatInputRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  chatInput: {
    flex: 1,
    backgroundColor: '#07050A',
    borderWidth: 1,
    borderColor: '#251D30',
    borderRadius: 4,
    color: '#FFF',
    paddingHorizontal: 8,
    height: 32,
    fontSize: 9,
  },
  btnSend: { backgroundColor: '#F3CE65', width: 32, height: 32, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  gridStats: { flexDirection: 'row', gap: 6, marginTop: 6 },
  statCell: { flex: 1, backgroundColor: '#130F1A', paddingVertical: 8, alignItems: 'center', borderRadius: 4, borderWidth: 1, borderColor: '#22192D' },
  statVal: { fontSize: 14, fontWeight: 'bold' },
  statLbl: { color: '#64748B', fontSize: 7, marginTop: 2, fontWeight: 'bold' },
  newsItem: { backgroundColor: '#130F1A', padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#1E1728' },
  newsCategory: { color: '#EF4444', fontSize: 7, fontWeight: 'bold' },
  newsTxt: { color: '#CBD5E1', fontSize: 9, marginTop: 2 },
  newsTime: { color: '#64748B', fontSize: 7, marginTop: 4 },
});