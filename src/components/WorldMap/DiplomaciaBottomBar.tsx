import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DiplomaciaBottomBarProps {
  regionCode: string;
  regionName: string;
  nationName: string;
  flagUrl?: string;
  onNavigateRegion: (code: string) => void;
  onNavigateNation: (nationName: string) => void;
  onClose: () => void;
}

export function DiplomaciaBottomBar({
  regionCode,
  regionName,
  nationName,
  onNavigateRegion,
  onNavigateNation,
  onClose,
}: DiplomaciaBottomBarProps) {
  return (
    <View style={styles.barContainer}>
      {/* Jata Wilayah & Label */}
      <View style={styles.identityGroup}>
        <View style={styles.crestBox}>
          <Text style={styles.crestIcon}>🏛️</Text>
        </View>

        <View style={styles.textGroup}>
          <Text style={styles.regionLabel}>WILAYAH</Text>
          <Text style={styles.regionTitle}>{regionName}</Text>
          <TouchableOpacity onPress={() => onNavigateNation(nationName)} activeOpacity={0.7}>
            <Text style={styles.nationSubTitle}>
              👑 {nationName} <Text style={styles.linkArrow}>›</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Butang Navigasi */}
      <View style={styles.actionGroup}>
        <TouchableOpacity
          style={styles.btnAction}
          onPress={() => onNavigateRegion(regionCode)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnActionText}>› PERGI KE WILAYAH</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnAction}
          onPress={() => onNavigateNation(nationName)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnActionText}>› PERGI KE NEGARA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnClose} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.btnCloseText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: '#07090E',
    borderTopWidth: 1.5,
    borderTopColor: '#78350F',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  identityGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  crestBox: {
    width: 48,
    height: 48,
    backgroundColor: '#11141D',
    borderWidth: 1,
    borderColor: '#D97706',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crestIcon: {
    fontSize: 22,
  },
  textGroup: {
    justifyContent: 'center',
  },
  regionLabel: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  regionTitle: {
    color: '#F4F4F5',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  nationSubTitle: {
    color: '#D4AF37',
    fontSize: 11,
    marginTop: 2,
  },
  linkArrow: {
    color: '#F59E0B',
    fontSize: 12,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnAction: {
    backgroundColor: '#131824',
    borderWidth: 1,
    borderColor: '#272F45',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 3,
  },
  btnActionText: {
    color: '#E4E4E7',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  btnClose: {
    padding: 8,
    marginLeft: 6,
  },
  btnCloseText: {
    color: '#71717A',
    fontSize: 16,
  },
});