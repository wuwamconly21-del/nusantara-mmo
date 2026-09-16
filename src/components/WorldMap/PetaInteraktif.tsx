import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native';
import GenericSVGMap from './GenericSVGMap';
import { TopMapFilters, MapFilterLayer } from './TopMapFilters';
import { DiplomaciaBottomBar } from './DiplomaciaBottomBar';
import { TravelDrawer, TravelProgressBar } from './TravelDrawer';
import { TravelSession, isPlayerInTransit } from '../../services/travelEngine';

export interface PetaInteraktifProps {
  onNavigateToRegion?: (regionCode: string, regionName: string) => void;
  onNavigateToNation?: (nationName: string) => void;
}

const REGION_DATABASE = [
  // Malaysia
  { code: 'Putrajaya_MY', name: 'Putrajaya', nationName: 'Takhta Berdaulat Putrajaya (Admin Core)', country: 'Malaysia' },
  { code: 'MY_16', name: 'Putrajaya', nationName: 'Takhta Berdaulat Putrajaya (Admin Core)', country: 'Malaysia' },
  { code: 'Selangor_MY', name: 'Selangor', nationName: 'Kesultanan Selangor', country: 'Malaysia' },
  { code: 'Kuala_Lumpur_MY', name: 'Kuala Lumpur', nationName: 'Wilayah Persekutuan KL', country: 'Malaysia' },
  { code: 'Johor_MY', name: 'Johor', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Malaysia' },
  { code: 'Terengganu_MY', name: 'Terengganu', nationName: 'Daulat Terengganu', country: 'Malaysia' },
  { code: 'Kelantan_MY', name: 'Kelantan', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Malaysia' },
  { code: 'Negeri_Sembilan_MY', name: 'Negeri Sembilan', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Malaysia' },
  { code: 'Pahang_MY', name: 'Pahang', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Malaysia' },
  { code: 'Perak_MY', name: 'Perak', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Malaysia' },
  { code: 'Kedah_MY', name: 'Kedah', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Malaysia' },
  { code: 'Pulau_Pinang_MY', name: 'Pulau Pinang', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Malaysia' },
  { code: 'Perlis_MY', name: 'Perlis', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Malaysia' },
  { code: 'Melaka_MY', name: 'Melaka', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Malaysia' },
  { code: 'Sabah_MY', name: 'Sabah', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Malaysia' },
  { code: 'Sarawak_MY', name: 'Sarawak', nationName: 'Kerajaan Sarawak', country: 'Malaysia' },

  // Asia Tenggara & Sekitar
  { code: 'Jakarta_ID', name: 'DKI Jakarta', nationName: 'Republik Jakarta Raya', country: 'Indonesia' },
  { code: 'West_Java_ID', name: 'Jawa Barat', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Indonesia' },
  { code: 'Central_Java_ID', name: 'Jawa Tengah', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Indonesia' },
  { code: 'East_Java_ID', name: 'Jawa Timur', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Indonesia' },
  { code: 'Bali_ID', name: 'Bali', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Indonesia' },
  { code: 'North_Sumatra_ID', name: 'Sumatera Utara', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Indonesia' },
  { code: 'Bangkok_TH', name: 'Bangkok', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Thailand' },
  { code: 'Singapore_SG', name: 'Singapura', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Singapura' },
  { code: 'Bandar_Seri_Begawan_BN', name: 'Brunei Muara', nationName: 'Kesultanan Brunei', country: 'Brunei' },
  { code: 'Manila_PH', name: 'Manila', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Filipina' },
  { code: 'Hanoi_VN', name: 'Hanoi', nationName: 'Wilayah Bebas (Unclaimed)', country: 'Vietnam' },
  { code: 'Tokyo_JP', name: 'Tokyo', nationName: 'Empayar Jepun', country: 'Jepun' },
  { code: 'Beijing_CN', name: 'Beijing', nationName: 'Republik China', country: 'China' },
];

export function PetaInteraktif({ onNavigateToRegion, onNavigateToNation }: PetaInteraktifProps) {
  const [activeFilter, setActiveFilter] = useState<MapFilterLayer>('NEGARA');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Status Pangkalan Pemain Semasa
  const [currentLocation, setCurrentLocation] = useState({
    code: 'Kuala_Lumpur_MY',
    name: 'Kuala Lumpur',
    country: 'Malaysia',
  });

  const [selectedRegion, setSelectedRegion] = useState<{
    code: string;
    name: string;
    nationName: string;
    country: string;
  } | null>(null);

  const [isTravelDrawerOpen, setIsTravelDrawerOpen] = useState(false);
  const [activeTravelSession, setActiveTravelSession] = useState<TravelSession | null>(null);

  // Semak Rekod Perjalanan Latar Belakang (Background Persistence)
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('active_travel_session');
      if (savedSession) {
        const parsed: TravelSession = JSON.parse(savedSession);
        if (Date.now() < parsed.arrivalTime) {
          setActiveTravelSession(parsed);
        } else {
          // Jika perjalanan tamat semasa skrin/browser ditutup
          setCurrentLocation({
            code: parsed.targetCode,
            name: parsed.targetName,
            country: parsed.targetCountry,
          });
          localStorage.removeItem('active_travel_session');
        }
      }
    } catch (e) {
      localStorage.removeItem('active_travel_session');
    }
  }, []);

  // Lejar Wilayah Daulat & Warna Faksi
  const territoryLedger: Record<string, { nationName: string; color: string; country: string }> = {
    'Putrajaya_MY': { nationName: 'Takhta Berdaulat Putrajaya (Admin Core)', color: '#F59E0B', country: 'Malaysia' },
    'MY_16': { nationName: 'Takhta Berdaulat Putrajaya (Admin Core)', color: '#F59E0B', country: 'Malaysia' },
    'MY-16': { nationName: 'Takhta Berdaulat Putrajaya (Admin Core)', color: '#F59E0B', country: 'Malaysia' },
    'Selangor_MY': { nationName: 'Kesultanan Selangor', color: '#1E3A8A', country: 'Malaysia' },
    'Terengganu_MY': { nationName: 'Daulat Terengganu', color: '#065F46', country: 'Malaysia' },
    'Sarawak_MY': { nationName: 'Kerajaan Sarawak', color: '#7C2D12', country: 'Malaysia' },
    'Jakarta_ID': { nationName: 'Republik Jakarta Raya', color: '#DC2626', country: 'Indonesia' },
    'Bandar_Seri_Begawan_BN': { nationName: 'Kesultanan Brunei', color: '#D97706', country: 'Brunei' },
    'Tokyo_JP': { nationName: 'Empayar Jepun', color: '#3B82F6', country: 'Jepun' },
    'Beijing_CN': { nationName: 'Republik China', color: '#EF4444', country: 'China' },
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return REGION_DATABASE.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.nationName.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const handleSelectRegion = (code: string, name: string) => {
    if (!code) return;
    const claim = territoryLedger[code] || territoryLedger[code.replace('_', '-')] || territoryLedger[code.replace('-', '_')];
    
    const matchedDb = REGION_DATABASE.find((r) => r.code === code);
    const countryName = claim ? claim.country : matchedDb ? matchedDb.country : (code.includes('ID') ? 'Indonesia' : 'Malaysia');
    const regionName = name || (matchedDb ? matchedDb.name : code);

    setSelectedRegion({
      code,
      name: regionName,
      nationName: claim ? claim.nationName : 'Wilayah Bebas (Unclaimed)',
      country: countryName,
    });
    setIsSearchOpen(false);
  };

  // Mula Sesi Transit & Simpan ke Storage Latar Belakang
  const handleStartTravelSession = (session: TravelSession) => {
    setActiveTravelSession(session);
    try {
      localStorage.setItem('active_travel_session', JSON.stringify(session));
    } catch (e) {
      // Fallback untuk persekitaran bukan web
    }
    setIsTravelDrawerOpen(false);
    setSelectedRegion(null);
  };

  const inTransit = isPlayerInTransit(activeTravelSession);

  return (
    <View style={localStyles.rootContainer}>
      {/* 1. Bar Penapis Lapisan Atas */}
      <TopMapFilters
        activeLayer={activeFilter}
        onSelectLayer={(layer) => setActiveFilter(layer)}
      />

      {/* Bar Status Pemain (Tunjuk Lokasi atau Status Transit) */}
      <View style={localStyles.playerStatusBadge}>
        <Text style={localStyles.playerStatusTxt}>
          🟢 1 DALAM TALIAN |{' '}
          {inTransit ? (
            <Text style={{ color: '#EF4444' }}>
              🚗 {activeTravelSession?.isReturning ? 'BERPATAH BALIK KE ' : 'TRANSIT KE '}
              {activeTravelSession?.targetName.toUpperCase()}
            </Text>
          ) : (
            <>📍 PANGKALAN: <Text style={{ color: '#FBBF24' }}>{currentLocation.name}</Text> ({currentLocation.country})</>
          )}
        </Text>
      </View>

      {/* 2. Bar Carian Geopolitik Pintar */}
      <View style={localStyles.searchContainer}>
        <View style={localStyles.searchBarWrapper}>
          <Text style={localStyles.searchIcon}>🔍</Text>
          <TextInput
            style={localStyles.searchInput}
            placeholder="Cari negara, negeri atau wilayah..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
            >
              <Text style={localStyles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dropdown Hasil Carian */}
        {isSearchOpen && searchResults.length > 0 && (
          <View style={localStyles.dropdownResults}>
            <ScrollView keyboardShouldPersistTaps="handled">
              {searchResults.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={localStyles.resultRow}
                  onPress={() => {
                    handleSelectRegion(item.code, item.name);
                    setSearchQuery(item.name);
                    setIsSearchOpen(false);
                  }}
                >
                  <View>
                    <Text style={localStyles.resultTitle}>{item.name}</Text>
                    <Text style={localStyles.resultSub}>
                      🚩 {item.country} • <Text style={localStyles.resultNation}>{item.nationName}</Text>
                    </Text>
                  </View>
                  <Text style={localStyles.resultArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* 3. Kanvas Peta Dunia Vektor 4K */}
      <View style={localStyles.mapArea}>
        <GenericSVGMap
          svgUrl="/maps/world_subdivisions.svg"
          colorMap={Object.fromEntries(
            Object.entries(territoryLedger).map(([k, v]) => [k, v.color])
          )}
          defaultActiveColor="#2D3748"
          selectedKey={selectedRegion?.code ?? null}
          onSelectRegion={handleSelectRegion}
        />
      </View>

      {/* 4. Bar Bawah Diplomacia */}
      {selectedRegion && !isTravelDrawerOpen && !activeTravelSession && (
        <DiplomaciaBottomBar
          regionCode={selectedRegion.code}
          regionName={selectedRegion.name}
          nationName={selectedRegion.nationName}
          onNavigateRegion={() => setIsTravelDrawerOpen(true)}
          onNavigateNation={(nation) => {
            if (onNavigateToNation) {
              onNavigateToNation(nation);
            } else {
              alert(`Lembaran Profil Kerajaan: ${nation}`);
            }
          }}
          onClose={() => setSelectedRegion(null)}
        />
      )}

      {/* 5. Modal Borang Perjalanan */}
      {isTravelDrawerOpen && selectedRegion && (
        <TravelDrawer
          currentRegion={currentLocation}
          targetRegion={{
            code: selectedRegion.code,
            name: selectedRegion.name,
            country: selectedRegion.country,
          }}
          userBalance={3844639}
          onStartTravel={handleStartTravelSession}
          onClose={() => setIsTravelDrawerOpen(false)}
        />
      )}

      {/* 6. Pemasa Progress Perjalanan masa nyata dengan butang Berpatah Balik */}
      {activeTravelSession && (
        <TravelProgressBar
          session={activeTravelSession}
          onArrivalComplete={() => {
            setCurrentLocation({
              code: activeTravelSession.targetCode,
              name: activeTravelSession.targetName,
              country: activeTravelSession.targetCountry,
            });
            setActiveTravelSession(null);
            try {
              localStorage.removeItem('active_travel_session');
            } catch (e) {}
          }}
          onCancelTravel={(returningSession) => {
            setActiveTravelSession(returningSession);
            try {
              localStorage.setItem('active_travel_session', JSON.stringify(returningSession));
            } catch (e) {}
          }}
        />
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#102338',
    position: 'relative',
    overflow: 'hidden',
  },
  playerStatusBadge: {
    position: 'absolute',
    top: 52,
    left: 24,
    zIndex: 70,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  playerStatusTxt: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: 'bold',
  },
  mapArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingTop: 42,
    overflow: 'hidden',
  },
  searchContainer: {
    position: 'absolute',
    top: 52,
    right: 24,
    zIndex: 70,
    width: 320,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 18, 29, 0.95)',
    borderWidth: 1.2,
    borderColor: '#D97706',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 12,
  },
  clearBtn: {
    color: '#94A3B8',
    fontSize: 14,
    paddingHorizontal: 4,
  },
  dropdownResults: {
    marginTop: 6,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    maxHeight: 250,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  resultTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: 'bold',
  },
  resultSub: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  resultNation: {
    color: '#F59E0B',
  },
  resultArrow: {
    color: '#D97706',
    fontSize: 16,
  },
});