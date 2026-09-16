import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { supabase } from '../../supabase';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const notify = (title: string, msg: string) => {
    if (Platform.OS === 'web') window.alert(`${title}: ${msg}`);
    else Alert.alert(title, msg);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      notify('Ralat', 'Sila isi e-mel dan kata laluan.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        // 1. Daftar akaun baru dalam Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username || 'Pendekar Nusantara' },
          },
        });

        if (error) throw error;

        // 2. Cipta profil pemain dalam database jika berjaya
        if (data.user) {
          await supabase.from('profiles').upsert([
            {
              id: data.user.id,
              username: username || 'Pendekar Nusantara',
              gold: 1000,
              level: 1,
            },
          ]);
        }

        notify('Pendaftaran Berjaya', 'Akaun anda telah dicipta! Mengakses permainan...');
        onAuthSuccess(data.user);
        onClose();
      } else {
        // Log Masuk Akaun Sedia Ada
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        notify('Selamat Kembali', `Log masuk berjaya!`);
        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      notify('Gagal', err.message || 'Ralat semasa log masuk/daftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>🏛️ NUSANTARA MMO</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'DAFTAR AKAUN PENDEKAR BARU' : 'LOG MASUK AKAUN'}
          </Text>

          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Nama Pendekar / Username"
              placeholderTextColor="#666"
              value={username}
              onChangeText={setUsername}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Alamat E-Mel"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Kata Laluan"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.btnPrimary} onPress={handleAuth} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#07060A" />
            ) : (
              <Text style={styles.btnPrimaryText}>{isSignUp ? 'DAFTAR AKAUN' : 'LOG MASUK'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 14 }}>
            <Text style={styles.switchText}>
              {isSignUp ? 'Dah ada akaun? Log Masuk di sini' : 'Belum ada akaun? Daftar Sekarang'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 16 }}>
            <Text style={styles.closeText}>Tutup (Teruskan Sebagai Tetamu)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#120F17',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3CE65',
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#F3CE65', marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#9CA3AF', marginBottom: 16, letterSpacing: 0.5 },
  input: {
    width: '100%',
    backgroundColor: '#18141F',
    borderWidth: 1,
    borderColor: '#2B2035',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 12,
    marginBottom: 10,
  },
  btnPrimary: {
    width: '100%',
    backgroundColor: '#F3CE65',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  btnPrimaryText: { color: '#07060A', fontSize: 11, fontWeight: 'bold' },
  switchText: { color: '#38BDF8', fontSize: 11, textDecorationLine: 'underline' },
  closeText: { color: '#64748B', fontSize: 10 },
});
