import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export function WorkView() {
  const [energy, setEnergy] = useState(100);
  const [dinar, setDinar] = useState(5000);
  const [isWorking, setIsWorking] = useState(false);

  const handleWork = (energyCost: number, wage: number, resourceName: string) => {
    if (energy < energyCost) {
      alert('Tenaga anda tidak mencukupi! Sila berehat atau ambil minuman tenaga.');
      return;
    }
    setIsWorking(true);
    setTimeout(() => {
      setEnergy((prev) => prev - energyCost);
      setDinar((prev) => prev + wage);
      setIsWorking(false);
      alert(`Selesai bekerja di lombong ${resourceName}! Anda menerima gaji RM ${wage}.`);
    }, 600);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SEKTOR PEKERJAAN & INDUSTRI</Text>
        <Text style={styles.subtitle}>Bekerja di kilang wilayah semasa anda untuk menjana hasil dan dinar.</Text>
      </View>

      {/* Bar Tenaga & Baki */}
      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Baki Simpanan</Text>
          <Text style={styles.statValueDinar}>RM {dinar.toLocaleString()}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Tenaga (HP)</Text>
          <Text style={styles.statValueEnergy}>{energy} / 100</Text>
        </View>
      </View>

      {/* Senarai Sektor Kilang */}
      <View style={styles.factoryList}>
        <View style={styles.factoryCard}>
          <View style={styles.factoryInfo}>
            <Text style={styles.factoryName}>🛢️ Loji Penapisan Minyak Mentah</Text>
            <Text style={styles.factorySub}>Gaji: RM 250 | Kos: 10 Tenaga</Text>
          </View>
          <TouchableOpacity
            style={styles.btnWork}
            disabled={isWorking}
            onPress={() => handleWork(10, 250, 'Minyak')}
          >
            <Text style={styles.btnWorkText}>BEKERJA</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.factoryCard}>
          <View style={styles.factoryInfo}>
            <Text style={styles.factoryName}>⛏️ Lombong Emas Wilayah</Text>
            <Text style={styles.factorySub}>Gaji: RM 500 | Kos: 20 Tenaga</Text>
          </View>
          <TouchableOpacity
            style={styles.btnWork}
            disabled={isWorking}
            onPress={() => handleWork(20, 500, 'Emas')}
          >
            <Text style={styles.btnWorkText}>BEKERJA</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.factoryCard}>
          <View style={styles.factoryInfo}>
            <Text style={styles.factoryName}>🏭 Industri Pembuatan Senjata</Text>
            <Text style={styles.factorySub}>Gaji: RM 750 | Kos: 30 Tenaga</Text>
          </View>
          <TouchableOpacity
            style={styles.btnWork}
            disabled={isWorking}
            onPress={() => handleWork(30, 750, 'Senjata')}
          >
            <Text style={styles.btnWorkText}>BEKERJA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07090E',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#71717A',
    fontSize: 12,
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#0F121A',
    borderColor: '#1E2433',
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statValueDinar: {
    color: '#10B981',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statValueEnergy: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  factoryList: {
    gap: 12,
  },
  factoryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0D1017',
    borderColor: '#1F2430',
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
  },
  factoryInfo: {
    flex: 1,
  },
  factoryName: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: 'bold',
  },
  factorySub: {
    color: '#A1A1AA',
    fontSize: 11,
    marginTop: 4,
  },
  btnWork: {
    backgroundColor: '#B45309',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  btnWorkText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
});