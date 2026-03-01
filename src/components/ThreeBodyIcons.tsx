import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, Line, LinearGradient, Path, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg';
import type { SectionIconId } from '../types/sectionIcon';

const VIEW_BOX = '0 0 200 200';

/** 1. Orbital System (white bg) */
function IconOrbital({ width = 40, height = 40 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox={VIEW_BOX}>
      <Rect width="200" height="200" fill="#ffffff" />
      <Defs>
        <RadialGradient id="orbital-g1" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#ffd700" />
          <Stop offset="100%" stopColor="#ff6600" />
        </RadialGradient>
        <RadialGradient id="orbital-g2" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#00cfff" />
          <Stop offset="100%" stopColor="#0055ff" />
        </RadialGradient>
        <RadialGradient id="orbital-g3" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#ff66aa" />
          <Stop offset="100%" stopColor="#cc0066" />
        </RadialGradient>
      </Defs>
      <Ellipse cx="100" cy="100" rx="70" ry="40" fill="none" stroke="#ffd70044" strokeWidth={1} transform="rotate(-20 100 100)" />
      <Ellipse cx="100" cy="100" rx="60" ry="50" fill="none" stroke="#00cfff44" strokeWidth={1} transform="rotate(40 100 100)" />
      <Ellipse cx="100" cy="100" rx="55" ry="45" fill="none" stroke="#ff66aa44" strokeWidth={1} transform="rotate(100 100 100)" />
      <Line x1="65" y1="55" x2="140" y2="80" stroke="#ffffff20" strokeWidth={1} strokeDasharray="4,4" />
      <Line x1="140" y1="80" x2="85" y2="150" stroke="#ffffff20" strokeWidth={1} strokeDasharray="4,4" />
      <Line x1="85" y1="150" x2="65" y2="55" stroke="#ffffff20" strokeWidth={1} strokeDasharray="4,4" />
      <Circle cx="65" cy="55" r="14" fill="url(#orbital-g1)" />
      <Circle cx="65" cy="55" r="18" fill="none" stroke="#ffd70033" strokeWidth={2} />
      <Circle cx="140" cy="80" r="11" fill="url(#orbital-g2)" />
      <Circle cx="140" cy="80" r="15" fill="none" stroke="#00cfff33" strokeWidth={2} />
      <Circle cx="85" cy="150" r="12" fill="url(#orbital-g3)" />
      <Circle cx="85" cy="150" r="16" fill="none" stroke="#ff66aa33" strokeWidth={2} />
    </Svg>
  );
}

/** 2. Gravitational Triangle (white bg) */
function IconTriangle({ width = 40, height = 40 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox={VIEW_BOX}>
      <Rect width="200" height="200" fill="#ffffff" />
      <Defs>
        <LinearGradient id="triangle-lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#6366f1" />
          <Stop offset="100%" stopColor="#a855f7" />
        </LinearGradient>
      </Defs>
      <Polygon points="100,35 160,150 40,150" fill="none" stroke="url(#triangle-lg1)" strokeWidth={2} opacity={0.5} />
      <Path d="M100,35 Q130,90 160,150" fill="none" stroke="#6366f155" strokeWidth={1} />
      <Path d="M160,150 Q100,140 40,150" fill="none" stroke="#a855f755" strokeWidth={1} />
      <Path d="M40,150 Q70,90 100,35" fill="none" stroke="#818cf855" strokeWidth={1} />
      <Circle cx="100" cy="35" r="20" fill="none" stroke="#6366f133" strokeWidth={1} />
      <Circle cx="160" cy="150" r="20" fill="none" stroke="#a855f733" strokeWidth={1} />
      <Circle cx="40" cy="150" r="20" fill="none" stroke="#818cf833" strokeWidth={1} />
      <Circle cx="100" cy="35" r="10" fill="#6366f1" />
      <Circle cx="160" cy="150" r="10" fill="#a855f7" />
      <Circle cx="40" cy="150" r="10" fill="#818cf8" />
    </Svg>
  );
}

/** 3. Chaotic Motion (white bg) */
function IconChaotic({ width = 40, height = 40 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox={VIEW_BOX}>
      <Rect width="200" height="200" fill="#ffffff" />
      <Path d="M60,60 C90,30 150,50 130,90 S70,130 100,150 S160,140 140,100 S50,80 60,60Z" fill="none" stroke="#ff6b6b" strokeWidth={1.5} opacity={0.6} />
      <Path d="M140,50 C110,70 60,40 80,100 S130,160 100,140 S40,120 70,90 S150,40 140,50Z" fill="none" stroke="#4ecdc4" strokeWidth={1.5} opacity={0.6} />
      <Path d="M80,160 C120,130 170,150 130,110 S50,60 90,70 S150,100 120,130 S60,170 80,160Z" fill="none" stroke="#ffe66d" strokeWidth={1.5} opacity={0.6} />
      <Circle cx="60" cy="60" r="12" fill="#ff6b6b" opacity={0.2} />
      <Circle cx="60" cy="60" r="8" fill="#ff6b6b" />
      <Circle cx="140" cy="50" r="12" fill="#4ecdc4" opacity={0.2} />
      <Circle cx="140" cy="50" r="8" fill="#4ecdc4" />
      <Circle cx="80" cy="160" r="12" fill="#ffe66d" opacity={0.2} />
      <Circle cx="80" cy="160" r="8" fill="#ffe66d" />
    </Svg>
  );
}

/** 4. Figure-8 Solution (white bg) */
function IconFigure8({ width = 40, height = 40 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox={VIEW_BOX}>
      <Rect width="200" height="200" fill="#ffffff" />
      <Defs>
        <LinearGradient id="fig8-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#06b6d4" />
          <Stop offset="50%" stopColor="#8b5cf6" />
          <Stop offset="100%" stopColor="#06b6d4" />
        </LinearGradient>
      </Defs>
      <Path d="M100,100 C100,55 155,40 160,85 S130,130 100,100 S40,55 40,85 C40,130 100,145 100,100Z" fill="none" stroke="url(#fig8-grad)" strokeWidth={2.5} opacity={0.7} />
      <Circle cx="55" cy="75" r="13" fill="#06b6d4" opacity={0.15} />
      <Circle cx="55" cy="75" r="9" fill="#06b6d4" />
      <Circle cx="145" cy="75" r="13" fill="#8b5cf6" opacity={0.15} />
      <Circle cx="145" cy="75" r="9" fill="#8b5cf6" />
      <Circle cx="100" cy="130" r="13" fill="#22d3ee" opacity={0.15} />
      <Circle cx="100" cy="130" r="9" fill="#22d3ee" />
    </Svg>
  );
}

/** 5. Solar system: central sun + 3 orbits, 3 planets only (white bg) */
function IconApp({ width = 40, height = 40 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox={VIEW_BOX}>
      <Rect width="200" height="200" fill="#ffffff" />
      {/* Central sun */}
      <Circle cx="100" cy="100" r="22" fill="#f97316" />
      <Circle cx="100" cy="100" r="26" fill="none" stroke="#ea580c" strokeWidth={1} opacity={0.6} />
      {/* 3 orbital paths */}
      <Ellipse cx="100" cy="100" rx="48" ry="28" fill="none" stroke="#dc2626" strokeWidth={1.2} transform="rotate(-15 100 100)" />
      <Ellipse cx="100" cy="100" rx="62" ry="36" fill="none" stroke="#16a34a" strokeWidth={1.2} transform="rotate(25 100 100)" />
      <Ellipse cx="100" cy="100" rx="78" ry="42" fill="none" stroke="#2563eb" strokeWidth={1.2} transform="rotate(70 100 100)" />
      {/* 3 planets (only 3 circles) */}
      <Circle cx="100" cy="72" r="8" fill="#b91c1c" />
      <Circle cx="138" cy="118" r="10" fill="#15803d" />
      <Circle cx="62" cy="142" r="11" fill="#1d4ed8" />
    </Svg>
  );
}

/** 6. Three gradient circles only – three-body style (white bg) */
function IconSuns({ width = 40, height = 40 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox={VIEW_BOX}>
      <Rect width="200" height="200" fill="#ffffff" />
      <Defs>
        <LinearGradient id="suns-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#fbbf24" />
          <Stop offset="100%" stopColor="#f97316" />
        </LinearGradient>
        <LinearGradient id="suns-g2" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#a855f7" />
          <Stop offset="100%" stopColor="#6366f1" />
        </LinearGradient>
        <LinearGradient id="suns-g3" x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#22d3ee" />
          <Stop offset="100%" stopColor="#06b6d4" />
        </LinearGradient>
      </Defs>
      {/* Only 3 inside circles */}
      <Circle cx="70" cy="65" r="24" fill="url(#suns-g1)" />
      <Circle cx="70" cy="65" r="28" fill="none" stroke="#f59e0b" strokeWidth={1.5} opacity={0.4} />
      <Circle cx="130" cy="60" r="20" fill="url(#suns-g2)" />
      <Circle cx="130" cy="60" r="24" fill="none" stroke="#7c3aed" strokeWidth={1.5} opacity={0.4} />
      <Circle cx="100" cy="135" r="22" fill="url(#suns-g3)" />
      <Circle cx="100" cy="135" r="26" fill="none" stroke="#0891b2" strokeWidth={1.5} opacity={0.4} />
    </Svg>
  );
}

/** 7. Blueprint orbital: central dot + 3 arcs + 3 circles in 3 colors (white bg) */
function IconBlueprint({ width = 40, height = 40 }: { width?: number; height?: number }) {
  const blue = '#2563eb';
  const emerald = '#059669';
  const violet = '#7c3aed';
  return (
    <Svg width={width} height={height} viewBox={VIEW_BOX}>
      <Rect width="200" height="200" fill="#ffffff" />
      {/* Central origin dot */}
      <Circle cx="100" cy="100" r="4" fill={violet} />
      {/* 3 orbital arcs – blueprint style, dashed */}
      <Ellipse cx="100" cy="100" rx="72" ry="42" fill="none" stroke={blue} strokeWidth={1.2} strokeDasharray="4,3" transform="rotate(-25 100 100)" />
      <Ellipse cx="100" cy="100" rx="58" ry="38" fill="none" stroke={emerald} strokeWidth={1.2} strokeDasharray="4,3" transform="rotate(35 100 100)" />
      <Ellipse cx="100" cy="100" rx="45" ry="32" fill="none" stroke={violet} strokeWidth={1.2} strokeDasharray="4,3" transform="rotate(95 100 100)" />
      {/* 3 circles (bodies) in 3 colors */}
      <Circle cx="72" cy="62" r="12" fill={blue} />
      <Circle cx="72" cy="62" r="14" fill="none" stroke={blue} strokeWidth={1} opacity={0.5} />
      <Circle cx="132" cy="98" r="11" fill={emerald} />
      <Circle cx="132" cy="98" r="13" fill="none" stroke={emerald} strokeWidth={1} opacity={0.5} />
      <Circle cx="78" cy="138" r="12" fill={violet} />
      <Circle cx="78" cy="138" r="14" fill="none" stroke={violet} strokeWidth={1} opacity={0.5} />
    </Svg>
  );
}

const ICON_COMPONENTS: Record<SectionIconId, React.FC<{ width?: number; height?: number }>> = {
  orbital: IconOrbital,
  triangle: IconTriangle,
  chaotic: IconChaotic,
  figure8: IconFigure8,
  app: IconApp,
  suns: IconSuns,
  fireside: IconOrbital,
  blueprint: IconBlueprint,
};

export interface SectionIconProps {
  iconId: SectionIconId;
  size?: number;
}

export function SectionIcon({ iconId, size = 40 }: SectionIconProps) {
  const Icon = ICON_COMPONENTS[iconId];
  if (!Icon) return null;
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: '#ffffff',
        borderRadius: size * 0.2,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Icon width={size} height={size} />
    </View>
  );
}
