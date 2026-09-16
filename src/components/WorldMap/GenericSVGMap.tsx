import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './MapCommon.module.css';

export interface GenericSVGMapProps {
  svgUrl: string;
  colorMap?: Record<string, string>;
  defaultActiveColor?: string;
  selectedKey?: string | null;
  onSelectRegion?: (regionKey: string, name: string) => void;
}

// Zon Aktif Sahaja (Asia Tenggara + China + Jepun)
const ALLOWED_ASIA_PREFIXES = [
  'MY', 'ID', 'TH', 'SG', 'BN', 'PH', 'VN', 'KH', 'LA', 'MM', 'TL', 'JP', 'CN'
];

export default function GenericSVGMap({
  svgUrl,
  colorMap = {},
  defaultActiveColor = '#2D3748',
  selectedKey = null,
  onSelectRegion,
}: GenericSVGMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hovered, setHovered] = useState<{ name: string; key: string; x: number; y: number } | null>(null);

  const baseVbRef = useRef<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 1220, h: 614.98 });
  const cameraRef = useRef<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 1220, h: 614.98 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; camX: number; camY: number }>({ mouseX: 0, mouseY: 0, camX: 0, camY: 0 });

  const applyViewBox = useCallback(() => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg#map') || containerRef.current.querySelector('svg');
    if (!svgEl) return;
    const { x, y, w, h } = cameraRef.current;
    svgEl.setAttribute('viewBox', `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);

    const cleanUrl = svgUrl.startsWith('/') ? svgUrl : `/${svgUrl}`;

    fetch(cleanUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Gagal memuat turun fail ${cleanUrl}`);
        return res.text();
      })
      .then((svgText) => {
        if (!active || !containerRef.current) return;

        containerRef.current.innerHTML = svgText;
        const svgEl = containerRef.current.querySelector('svg');
        if (!svgEl) throw new Error('Format fail peta tidak sah.');

        const bgRect = svgEl.querySelector('#svg-background') || svgEl.querySelector('rect[fill="#ffffff"]');
        if (bgRect) bgRect.remove();
        svgEl.style.backgroundColor = 'transparent';

        const targetSvg = svgEl.querySelector('svg#map') || svgEl;
        const rawVb = (targetSvg.getAttribute('viewBox') ?? '0 0 1220 614.98').split(/[\s,]+/).map(Number);
        const originalW = rawVb[2] || 1220;
        const originalH = rawVb[3] || 614.98;

        baseVbRef.current = { x: 0, y: 0, w: originalW, h: originalH };

        const initialW = originalW * 0.45;
        const initialH = originalH * 0.45;
        cameraRef.current = {
          x: originalW * 0.65,
          y: originalH * 0.35,
          w: initialW,
          h: initialH,
        };

        svgEl.classList.remove('speed-optimized');
        svgEl.setAttribute('shape-rendering', 'geometricPrecision');
        svgEl.setAttribute('width', '100%');
        svgEl.setAttribute('height', '100%');
        svgEl.style.width = '100%';
        svgEl.style.height = '100%';
        svgEl.style.display = 'block';

        const allPaths = svgEl.querySelectorAll('path, polygon');

        allPaths.forEach((path) => {
          const el = path as SVGGraphicsElement;
          const rawId =
            el.getAttribute('id') ??
            el.getAttribute('data-id') ??
            el.getAttribute('data-code') ??
            '';

          if (!rawId || rawId.startsWith('pattern') || rawId.includes('attribution') || rawId.includes('legend')) {
            return;
          }

          el.setAttribute('vector-effect', 'non-scaling-stroke');
          el.setAttribute('shape-rendering', 'geometricPrecision');

          const name =
            el.getAttribute('data-info') ??
            el.getAttribute('data-name') ??
            el.getAttribute('title') ??
            rawId;

          const isAsiaRegion = ALLOWED_ASIA_PREFIXES.some((prefix) => {
            const upperId = rawId.toUpperCase();
            return (
              upperId.endsWith(`_${prefix}`) ||
              upperId.startsWith(`${prefix}_`) ||
              upperId.startsWith(`${prefix}-`) ||
              upperId === prefix
            );
          });

          // Mengunci Rantau Luar Asia Tenggara, China & Jepun
          if (!isAsiaRegion) {
            el.setAttribute('fill', '#0B111A');
            el.setAttribute('stroke', '#060A10');
            el.setAttribute('stroke-width', '0.4');
            el.style.pointerEvents = 'none';
            el.style.opacity = '0.35';
            return;
          }

          el.style.transition = 'fill 0.15s ease, stroke 0.15s ease';
          el.style.cursor = 'pointer';
          el.style.pointerEvents = 'auto';

          el.onclick = (e) => {
            e.stopPropagation();
            onSelectRegion?.(rawId, name);
          };

          el.onmouseenter = (e) => {
            el.style.filter = 'brightness(1.25)';
            const rect = mapWrapperRef.current?.getBoundingClientRect();
            if (rect) {
              setHovered({
                name,
                key: rawId,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
            }
          };

          el.onmouseleave = () => {
            el.style.filter = 'none';
            setHovered(null);
          };
        });

        setLoading(false);
        applyViewBox();
      })
      .catch((err: Error) => {
        if (active) {
          setLoadError(err.message);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [svgUrl, applyViewBox]);

  useEffect(() => {
    if (!containerRef.current || loading) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    const allPaths = svgEl.querySelectorAll('path, polygon');
    allPaths.forEach((path) => {
      const el = path as SVGGraphicsElement;
      const rawId = el.getAttribute('id') ?? el.getAttribute('data-id') ?? '';
      if (!rawId) return;

      const isAsiaRegion = ALLOWED_ASIA_PREFIXES.some((prefix) => {
        const upperId = rawId.toUpperCase();
        return (
          upperId.endsWith(`_${prefix}`) ||
          upperId.startsWith(`${prefix}_`) ||
          upperId.startsWith(`${prefix}-`) ||
          upperId === prefix
        );
      });

      if (!isAsiaRegion) return;

      const matchedColor =
        colorMap[rawId] ??
        colorMap[rawId.replace('_', '-')] ??
        colorMap[rawId.replace('-', '_')];

      el.setAttribute('fill', matchedColor || defaultActiveColor);

      const isSelected =
        selectedKey &&
        (rawId === selectedKey ||
          rawId.replace('_', '-') === selectedKey.replace('_', '-') ||
          rawId.replace('-', '_') === selectedKey.replace('-', '_'));

      if (isSelected) {
        el.setAttribute('stroke', '#F59E0B');
        el.setAttribute('stroke-width', '2');
        el.parentElement?.appendChild(el);
      } else {
        el.setAttribute('stroke', '#101C2B');
        el.setAttribute('stroke-width', '0.5');
      }
    });
  }, [colorMap, selectedKey, defaultActiveColor, loading]);

  useEffect(() => {
    if (!selectedKey || !containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    const cleanKey = selectedKey.toLowerCase();
    const candidatePaths = Array.from(svgEl.querySelectorAll('path, polygon')) as SVGGraphicsElement[];

    const targetEl = candidatePaths.find((el) => {
      const id = (el.getAttribute('id') ?? '').toLowerCase();
      const info = (el.getAttribute('data-info') ?? '').toLowerCase();
      const title = (el.getAttribute('title') ?? '').toLowerCase();
      return (
        id === cleanKey ||
        id === cleanKey.replace('_', '-') ||
        id === cleanKey.replace('-', '_') ||
        info.includes(cleanKey.split('_')[0]) ||
        title.includes(cleanKey.split('_')[0])
      );
    });

    if (targetEl && typeof targetEl.getBBox === 'function') {
      try {
        const bbox = targetEl.getBBox();
        const padding = Math.max(bbox.width, bbox.height) * 1.5;
        const targetW = Math.max(bbox.width + padding, 120);
        const targetH = targetW * (baseVbRef.current.h / baseVbRef.current.w);

        const targetX = bbox.x + bbox.width / 2 - targetW / 2;
        const targetY = bbox.y + bbox.height / 2 - targetH / 2;

        cameraRef.current = { x: targetX, y: targetY, w: targetW, h: targetH };
        applyViewBox();
      } catch (e) {}
    }
  }, [selectedKey, applyViewBox]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!mapWrapperRef.current) return;

    const factor = e.deltaY < 0 ? 0.85 : 1.18;
    const current = cameraRef.current;
    const base = baseVbRef.current;

    const minW = 40;
    const maxW = base.w * 1.2;

    const newW = Math.min(Math.max(current.w * factor, minW), maxW);
    const newH = newW * (base.h / base.w);

    const rect = mapWrapperRef.current.getBoundingClientRect();
    const mouseRatioX = (e.clientX - rect.left) / rect.width;
    const mouseRatioY = (e.clientY - rect.top) / rect.height;

    const newX = current.x + (current.w - newW) * mouseRatioX;
    const newY = current.y + (current.h - newH) * mouseRatioY;

    cameraRef.current = { x: newX, y: newY, w: newW, h: newH };
    applyViewBox();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      camX: cameraRef.current.x,
      camY: cameraRef.current.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !mapWrapperRef.current) return;
    const deltaMouseX = e.clientX - dragStartRef.current.mouseX;
    const deltaMouseY = e.clientY - dragStartRef.current.mouseY;

    const rect = mapWrapperRef.current.getBoundingClientRect();
    const scaleFactorX = cameraRef.current.w / rect.width;
    const scaleFactorY = cameraRef.current.h / rect.height;

    cameraRef.current.x = dragStartRef.current.camX - deltaMouseX * scaleFactorX;
    cameraRef.current.y = dragStartRef.current.camY - deltaMouseY * scaleFactorY;
    applyViewBox();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={mapWrapperRef}
      className={styles.wrapper}
      style={{
        overflow: 'hidden',
        contain: 'paint',
        cursor: isDraggingRef.current ? 'grabbing' : 'grab',
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#102338',
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={controlStyles.zoomBox}>
        <button
          onClick={() => {
            const current = cameraRef.current;
            const newW = Math.max(current.w * 0.75, 40);
            const newH = newW * (baseVbRef.current.h / baseVbRef.current.w);
            cameraRef.current = {
              x: current.x + (current.w - newW) / 2,
              y: current.y + (current.h - newH) / 2,
              w: newW,
              h: newH,
            };
            applyViewBox();
          }}
          style={controlStyles.zoomBtn}
        >
          +
        </button>
        <button
          onClick={() => {
            const current = cameraRef.current;
            const newW = Math.min(current.w * 1.35, baseVbRef.current.w * 1.2);
            const newH = newW * (baseVbRef.current.h / baseVbRef.current.w);
            cameraRef.current = {
              x: current.x + (current.w - newW) / 2,
              y: current.y + (current.h - newH) / 2,
              w: newW,
              h: newH,
            };
            applyViewBox();
          }}
          style={controlStyles.zoomBtn}
        >
          -
        </button>
        <button
          onClick={() => {
            const base = baseVbRef.current;
            cameraRef.current = {
              x: base.w * 0.65,
              y: base.h * 0.35,
              w: base.w * 0.45,
              h: base.h * 0.45,
            };
            applyViewBox();
          }}
          style={controlStyles.resetBtn}
        >
          RESET
        </button>
      </div>

      {loading && (
        <div className={`${styles.wrapper} ${styles.centered}`}>
          <p style={{ color: '#93C5FD', fontSize: 13 }}>Memuatkan zon geopolitik…</p>
        </div>
      )}

      {loadError && (
        <div className={`${styles.wrapper} ${styles.centered}`} style={{ padding: 20 }}>
          <p style={{ color: '#EF4444', fontSize: 13 }}>{loadError}</p>
        </div>
      )}

      <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {hovered && (
        <div
          style={{
            position: 'absolute',
            left: hovered.x,
            top: hovered.y - 45,
            pointerEvents: 'none',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid #D97706',
            borderRadius: 4,
            padding: '6px 12px',
            fontSize: 11,
            color: '#FBBF24',
            transform: 'translateX(-50%)',
            zIndex: 60,
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{hovered.name}</div>
          <div style={{ fontSize: 9, color: '#94A3B8' }}>{hovered.key}</div>
        </div>
      )}
    </div>
  );
}

const controlStyles = {
  zoomBox: {
    position: 'absolute' as const,
    right: 20,
    bottom: 96,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    zIndex: 40,
  },
  zoomBtn: {
    width: 36,
    height: 36,
    background: '#0F1E2E',
    border: '1px solid #D97706',
    color: '#FBBF24',
    fontSize: 18,
    fontWeight: 'bold' as const,
    borderRadius: 4,
    cursor: 'pointer',
  },
  resetBtn: {
    width: 36,
    height: 36,
    background: '#0F1E2E',
    border: '1px solid #475569',
    color: '#E2E8F0',
    fontSize: 8,
    fontWeight: 'bold' as const,
    borderRadius: 4,
    cursor: 'pointer',
  },
};