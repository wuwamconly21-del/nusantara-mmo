import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import {
  User,
  Bell,
  Globe,
  Shield,
  LogOut,
  ChevronRight,
  Check,
  Flag,
  BookOpen,
} from 'lucide-react-native';

interface SettingsViewProps {
  playerName: string;
  language: 'ms' | 'en';
  onUpdateName: (newName: string) => void;
  onChangeLanguage: (lang: 'ms' | 'en') => void;
  onLogKeluar: () => void;
  onBack: () => void;
}

export function SettingsView({
  playerName,
  language,
  onUpdateName,
  onChangeLanguage,
  onLogKeluar,
  onBack,
}: SettingsViewProps) {
  const [nameInput, setNameInput] = useState(playerName);
  const [bioInput, setBioInput] = useState('');
  const [religion, setReligion] = useState('Islam');
  const [ideology, setIdeology] = useState('Monarkisme');

  // Suis Notifikasi
  const [notifWar, setNotifWar] = useState(true);
  const [notifElection, setNotifElection] = useState(true);
  const [notifParliament, setNotifParliament] = useState(true);
  const [notifParty, setNotifParty] = useState(false);

  const t = {
    ms: {
      title: 'TETAPAN',
      profileSec: 'PROFIL',
      editName: 'Nama Pengguna',
      save: 'SUNTING',
      bio: 'Biografi',
      bioPlaceholder: 'Belum ada biografi ditambah.',
      religion: 'Agama',
      ideology: 'Politik',
      notifSec: 'PEMBERITAHUAN',
      nWar: 'Pemberitahuan perang',
      nElec: 'Pemberitahuan pilihan raya',
      nParl: 'Pemberitahuan parlimen',
      nParty: 'Pemberitahuan parti',
      langSec: 'BAHASA',
      logout: 'LOG KELUAR',
    },
    en: {
      title: 'SETTINGS',
      profileSec: 'PROFILE',
      editName: 'Username',
      save: 'EDIT',
      bio: 'Biography',
      bioPlaceholder: 'No biography added yet.',
      religion: 'Religion',
      ideology: 'Politics',
      notifSec: 'NOTIFICATIONS',
      nWar: 'War alerts',
      nElec: 'Election alerts',
      nParl: 'Parliament alerts',
      nParty: 'Party alerts',
      langSec: 'LANGUAGE',
      logout: 'LOG OUT',
    },
  }[language];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.title}</Text>
      </View>

      {/* Bahagian Profil */}
      <Text style={styles.sectionHeader}>{t.profileSec}</Text>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>{t.editName}</Text>
            <TextInput
              style={styles.input}
              value={nameInput}
              onChangeText={setNameInput}
            />
          </View>
          <TouchableOpacity
            style={styles.btnSmall}
            onPress={() => onUpdateName(nameInput)}
          >
            <Text style={styles.btnSmallTxt}>{t.save}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.rowBetween, { marginTop: 12 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fieldLabel}>{t.bio}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.bioPlaceholder}
              placeholderTextColor="#555"
              value={bioInput}
              onChangeText={setBioInput}
            />
          </View>
          <TouchableOpacity style={styles.btnSmall}>
            <Text style={styles.btnSmallTxt}>{t.save}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.selectRow}>
          <Text style={styles.selectLabel}>☪ {t.religion}</Text>
          <Text style={styles.selectVal}>{religion} ➔</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.selectRow}>
          <Text style={styles.selectLabel}>🏛 {t.ideology}</Text>
          <Text style={styles.selectVal}>{ideology} ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Bahagian Pemberitahuan */}
      <Text style={styles.sectionHeader}>{t.notifSec}</Text>
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>⚔ {t.nWar}</Text>
          <Switch
            value={notifWar}
            onValueChange={setNotifWar}
            thumbColor={notifWar ? '#F59E0B' : '#64748B'}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>🗳 {t.nElec}</Text>
          <Switch
            value={notifElection}
            onValueChange={setNotifElection}
            thumbColor={notifElection ? '#F59E0B' : '#64748B'}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>🏛 {t.nParl}</Text>
          <Switch
            value={notifParliament}
            onValueChange={setNotifParliament}
            thumbColor={notifParliament ? '#F59E0B' : '#64748B'}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>🚩 {t.nParty}</Text>
          <Switch
            value={notifParty}
            onValueChange={setNotifParty}
            thumbColor={notifParty ? '#F59E0B' : '#64748B'}
          />
        </View>
      </View>

      {/* Bahagian Bahasa (Bahasa Melayu & English) */}
      <Text style={styles.sectionHeader}>{t.langSec}</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={[styles.langItem, language === 'ms' && styles.langItemActive]}
          onPress={() => onChangeLanguage('ms')}
        >
          <Text style={[styles.langTxt, language === 'ms' && styles.langTxtActive]}>
            🇲🇾 Bahasa Melayu
          </Text>
          {language === 'ms' && <Check size={16} color="#10B981" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.langItem, language === 'en' && styles.langItemActive]}
          onPress={() => onChangeLanguage('en')}
        >
          <Text style={[styles.langTxt, language === 'en' && styles.langTxtActive]}>
            🇬🇧 English
          </Text>
          {language === 'en' && <Check size={16} color="#10B981" />}
        </TouchableOpacity>
      </View>

      {/* Log Keluar */}
      <TouchableOpacity style={styles.btnLogout} onPress={onLogKeluar}>
        <LogOut size={16} color="#EF4444" />
        <Text style={styles.btnLogoutTxt}>{t.logout}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07090E', paddingHorizontal: 14 },
  header: { paddingVertical: 12 },
  headerTitle: { color: '#F3CE65', fontSize: 13, fontWeight: 'bold', letterSpacing: 1 },
  sectionHeader: { color: '#64748B', fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginTop: 14, marginBottom: 6 },
  card: { backgroundColor: '#0E0B14', borderRadius: 8, borderWidth: 1, borderColor: '#261F14', padding: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  fieldLabel: { color: '#888', fontSize: 9, marginBottom: 4 },
  input: { backgroundColor: '#07090E', borderWidth: 1, borderColor: '#2B2035', borderRadius: 4, color: '#FFF', paddingHorizontal: 8, height: 34, fontSize: 11 },
  btnSmall: { backgroundColor: '#1E1B13', borderWidth: 1, borderColor: '#F3CE65', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, alignSelf: 'flex-end' },
  btnSmallTxt: { color: '#F3CE65', fontSize: 9, fontWeight: 'bold' },
  selectRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderColor: '#1A1424', marginTop: 8 },
  selectLabel: { color: '#CCC', fontSize: 11 },
  selectVal: { color: '#F59E0B', fontSize: 11, fontWeight: 'bold' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  toggleLabel: { color: '#CCC', fontSize: 11 },
  langItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#1A1424' },
  langItemActive: { backgroundColor: '#14111C' },
  langTxt: { color: '#888', fontSize: 11 },
  langTxtActive: { color: '#FFF', fontWeight: 'bold' },
  btnLogout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1B0E12', borderWidth: 1, borderColor: '#7F1D1D', paddingVertical: 12, borderRadius: 6, marginTop: 24 },
  btnLogoutTxt: { color: '#EF4444', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
});