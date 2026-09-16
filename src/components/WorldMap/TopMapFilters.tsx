import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export type MapFilterLayer =
  | 'NEGARA'
  | 'PENDIDIKAN'
  | 'KETENTERAAN'
  | 'PENGANGKUTAN'
  | 'KESIHATAN'
  | 'PERANG'
  | 'BLOK';

interface TopMapFiltersProps {
  activeLayer: MapFilterLayer;
  onSelectLayer: (layer: MapFilterLayer) => void;
}

const LAYERS: { id: MapFilterLayer; label: string; indicatorColor: string }[] = [
  { id: 'NEGARA', label: 'NEGARA', indicatorColor: '#10B981' },
  { id: 'PENDIDIKAN', label: 'PENDIDIKAN', indicatorColor: '#38BDF8' },
  { id: 'KETENTERAAN', label: 'KETENTERAAN', indicatorColor: '#EF4444' },
  { id: 'PENGANGKUTAN', label: 'PENGANGKUTAN', indicatorColor: '#F59E0B' },
  { id: 'KESIHATAN', label: 'KESIHATAN', indicatorColor: '#EC4899' },
  { id: 'PERANG', label: 'PERANG', indicatorColor: '#DC2626' },
  { id: 'BLOK', label: 'BLOK', indicatorColor: '#8B5CF6' },
];

export function TopMapFilters({ activeLayer, onSelectLayer }: TopMapFiltersProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {LAYERS.map((layer) => {
          const isActive = activeLayer === layer.id;
          return (
            <TouchableOpacity
              key={layer.id}
              style={[styles.filterBtn, isActive && styles.filterBtnActive]}
              onPress={() => onSelectLayer(layer.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.indicatorDot, { backgroundColor: layer.indicatorColor }]} />
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {layer.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 42,
    backgroundColor: 'rgba(7, 9, 14, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2430',
    zIndex: 50,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 3,
    backgroundColor: '#0F131D',
    borderWidth: 1,
    borderColor: '#1E2536',
    gap: 6,
  },
  filterBtnActive: {
    backgroundColor: '#1C2333',
    borderColor: '#D97706',
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  filterTextActive: {
    color: '#F4F4F5',
  },
});