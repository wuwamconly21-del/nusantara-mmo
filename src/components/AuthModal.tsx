import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { supabase } from '../../supabase';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any, isNewUser?: boolean) => void;
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

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: Platform.OS === 'web' ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      notify('Ralat Google Auth', err.message);
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      notify('Ralat', 'Sila isi e-mel dan kata laluan.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username: username || 'Pendekar' } },
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from('profiles').upsert([
            { id: data.user.id, username: username || 'Pendekar', gold: 1000, level: 1 },
          ]);
        }
        onAuthSuccess(data.user, true);
        onClose();
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthSuccess(data.user, false);
        onClose();
      }
    } catch (err: any) {
      notify('Ralat', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>🏛️ NUSANTARA MMO</Text>
          <Text style={styles.subtitle}>{isSignUp ? 'DAFTAR PENDEKAR BARU' : 'LOG MASUK AKAUN'}</Text>

          {/* GOOGLE AUTH BUTTON */}
          <TouchableOpacity style={styles.btnGoogle} onPress={handleGoogleAuth}>
            <Text style={styles.btnGoogleText}>🌐 LOG MASUK GUNA GOOGLE</Text>
          </TouchableOpacity>

          <Text style={{ color: '#64748B', fontSize: 10, marginVertical: 8 }}>— ATAU GUNA E-MEL —</Text>

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
            {loading ? <ActivityIndicator color="#07060A" /> : <Text style={styles.btnPrimaryText}>{isSignUp ? 'DAFTAR' : 'LOG MASUK'}</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 12 }}>
            <Text style={styles.switchText}>{isSignUp ? 'Dah ada akaun? Log Masuk' : 'Belum ada akaun? Daftar Sekarang'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16, zIndex: 99999 },
  card: { width: '100%', maxWidth: 360, backgroundColor: '#120F17', borderRadius: 8, borderWidth: 1, borderColor: '#F3CE65', padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#F3CE65', marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#9CA3AF', marginBottom: 12 },
  btnGoogle: { width: '100%', backgroundColor: '#4285F4', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginBottom: 6 },
  btnGoogleText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  input: { width: '100%', backgroundColor: '#18141F', borderWidth: 1, borderColor: '#2B2035', borderRadius: 6, padding: 10, color: '#FFF', fontSize: 12, marginBottom: 8 },
  btnPrimary: { width: '100%', backgroundColor: '#F3CE65', borderRadius: 6, paddingVertical: 11, alignItems: 'center', marginTop: 4 },
  btnPrimaryText: { color: '#07060A', fontSize: 11, fontWeight: 'bold' },
  switchText: { color: '#38BDF8', fontSize: 10, textDecorationLine: 'underline' },
});
