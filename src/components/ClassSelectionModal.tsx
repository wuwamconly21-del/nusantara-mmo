import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';

interface ClassSelectionProps {
  visible: boolean;
  onSelectClass: (className: string) => void;
}

const CLASSES = [
  { id: 'PANGLIMA', title: '⚔️ PANGLIMA', desc: 'Fokus Peperangan (+20% Kuata Tentera)' },
  { id: 'SAUDAGAR', title: '💰 SAUDAGAR', desc: 'Fokus Perusahaan (+25% Hasil Kilang & Emas)' },
  { id: 'DIPLOMAT', title: '🏛️ DIPLOMAT', desc: 'Fokus Politik Parlimen (+15% Pengaruh Undi)' },
  { id: 'STRATEGIS', title: '📜 STRATEGIS', desc: 'Fokus Cabang Ilmu (+30% Kelajuan Bertapa)' },
];

export const ClassSelectionModal: React.FC<ClassSelectionProps> = ({ visible, onSelectClass }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>PILIH HALUAN PENDEKAR</Text>
          <Text style={styles.subtitle}>Pilih peranan utama anda dalam arena Takhta Nusantara:</Text>

          {CLASSES.map((c) => (
            <TouchableOpacity key={c.id} style={styles.classCard} onPress={() => onSelectClass(c.id)}>
              <Text style={styles.classTitle}>{c.title}</Text>
              <Text style={styles.classDesc}>{c.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', padding: 16, zIndex: 99999 },
  card: { width: '100%', maxWidth: 400, backgroundColor: '#120F17', borderRadius: 8, borderWidth: 1, borderColor: '#F3CE65', padding: 20 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#F3CE65', textAlign: 'center' },
  subtitle: { fontSize: 10, color: '#9CA3AF', textAlign: 'center', marginBottom: 16, marginTop: 4 },
  classCard: { backgroundColor: '#18141F', borderWidth: 1, borderColor: '#3D311F', borderRadius: 6, padding: 12, marginBottom: 10 },
  classTitle: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  classDesc: { color: '#888', fontSize: 10, marginTop: 2 },
});
