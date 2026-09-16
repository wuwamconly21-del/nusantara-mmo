import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { geoNaturalEarth1, geoPath, type GeoPath, type GeoPermissibleObjects } from 'd3-geo';
import { feature } from 'topojson-client';
import { SEA_COUNTRIES, isSEACountry, getSEAMeta, SEACountryMeta } from './seaCountries';

export interface CountryFeature {
  type: 'Feature';
  id: string;
  properties: { name: string };
  geometry: GeoPermissibleObjects;
}

export interface SEAWorldMapProps {
  countryColors?: Record<string, string>;
  selectedIsoNumeric?: string | null;
  onSelectCountry?: (isoNumeric: string, meta: SEACountryMeta) => void;
  width?: number;
  height?: number;
}

const DEFAULT_ACTIVE_FILL = '#B45309'; // Warna emas gangsa Nusantara aktif
const DEFAULT_INACTIVE_FILL = '#141824'; // Siluet gelap luar SEA

export default function SEAWorldMap({
  countryColors = {},
  selectedIsoNumeric = null,
  onSelectCountry,
  width = 900,
  height = 480,
}: SEAWorldMapProps) {
  const [countries, setCountries] = useState<CountryFeature[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [memuatkan, setMemuatkan] = useState(true);
  const [hovered, setHovered] = useState<{ id: string; x: number; y: number } | null>(null);

  useEffect(() => {
    let aktif = true;
    // Menggunakan CDN CDNJS rasmi yang stabil tanpa perlu salin fail manual ke public/
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then((topology: any) => {
        if (!aktif) return;
        const geo: any = feature(topology, topology.objects.countries);
        setCountries(geo.features);
      })
      .catch((err: Error) => {
        if (aktif) setLoadError(err.message);
      })
      .finally(() => {
        if (aktif) setMemuatkan(false);
      });

    return () => {
      aktif = false;
    };
  }, []);

  const pathGenerator: GeoPath | null = useMemo(() => {
    if (!countries) return null;
    const projection = geoNaturalEarth1().fitSize([width, height], {
      type: 'FeatureCollection',
      features: countries,
    } as GeoPermissibleObjects);
    return geoPath(projection);
  }, [countries, width, height]);

  const handleClick = useCallback(
    (c: CountryFeature) => {
      if (!isSEACountry(c.id)) return;
      const meta = getSEAMeta(c.id);
      if (meta) onSelectCountry?.(c.id, meta);
    },
    [onSelectCountry]
  );

  if (memuatkan) {
    return (
      <View style={[styles.wrapper, styles.center]}>
        <ActivityIndicator color="#F3CE65" size="small" />
        <Text style={styles.loadingText}>Menjana Peta Vektor Alam Melayu...</Text>
      </View>
    );
  }

  if (loadError || !countries || !pathGenerator) {
    return (
      <View style={[styles.wrapper, styles.center]}>
        <Text style={styles.errorText}>
          Peta radar satelit luar talian. Menggunakan grid navigasi alternatif.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: '100%', display: 'block' }}
        role="img"
      >
        <g>
          {countries.map((c) => {
            const aktif = isSEACountry(c.id);
            const d = pathGenerator(c.geometry as GeoPermissibleObjects) ?? undefined;

            if (!aktif) {
              return (
                <path
                  key={c.id}
                  d={d}
                  fill={DEFAULT_INACTIVE_FILL}
                  stroke="#080B11"
                  strokeWidth={0.5}
                  style={{ pointerEvents: 'none' }}
                />
              );
            }

            const dipilih = c.id === selectedIsoNumeric;
            const meta = getSEAMeta(c.id);
            const warnaIsi = countryColors[c.id] || DEFAULT_ACTIVE_FILL;

            return (
              <path
                key={c.id}
                d={d}
                fill={warnaIsi}
                stroke={dipilih ? '#FFF' : '#F3CE65'}
                strokeWidth={dipilih ? 2 : 0.8}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  filter: dipilih ? 'brightness(1.3)' : 'none',
                }}
                tabIndex={0}
                role="button"
                aria-label={meta?.nameMs}
                onClick={() => handleClick(c)}
                onMouseMove={(e: any) => {
                  const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  if (!rect) return;
                  setHovered({
                    id: c.id,
                    x: ((e.clientX - rect.left) / rect.width) * width,
                    y: ((e.clientY - rect.top) / rect.height) * height,
                  });
                }}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </g>
      </svg>

      {/* Tooltip Terapung */}
      {hovered && getSEAMeta(hovered.id) && (
        <View
          style={[
            styles.tooltip,
            {
              left: `${(hovered.x / width) * 100}%`,
              top: `${(hovered.y / height) * 100}%`,
            },
          ]}
        >
          <Text style={styles.tooltipTitle}>{getSEAMeta(hovered.id)?.nameMs}</Text>
          <Text style={styles.tooltipSub}>Ibu Kota: {getSEAMeta(hovered.id)?.capital}</Text>
        </View>
      )}

      {/* Petunjuk Warna (Legend) */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: DEFAULT_ACTIVE_FILL }]} />
          <Text style={styles.legendText}>Wilayah Berdaulat SEA (Aktif)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: DEFAULT_INACTIVE_FILL }]} />
          <Text style={styles.legendText}>Luar Nusantara (Inert)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#07090E',
    borderWidth: 1,
    borderColor: '#263242',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    color: '#8A9DB5',
    fontSize: 10,
    marginTop: 8,
    fontFamily: 'serif',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 10,
    textAlign: 'center',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#0E1118',
    borderWidth: 1,
    borderColor: '#F3CE65',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    transform: [{ translateX: -40 }, { translateY: -45 }],
    pointerEvents: 'none',
    zIndex: 100,
  },
  tooltipTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F3CE65',
  },
  tooltipSub: {
    fontSize: 8,
    color: '#CCC',
  },
  legend: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendBox: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 8,
    color: '#718096',
  },
});