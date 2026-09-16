import React from 'react';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

interface Seat {
  id: number;
  color: string;
}

interface Props {
  totalSeats?: number;
  seatData?: Seat[];
}

export const ParliamentHemicircle: React.FC<Props> = ({ totalSeats = 50 }) => {
  const rows = 4; // Jumlah barisan melengkung
  const radiusBase = 60;
  const radiusStep = 18;
  const seats: { x: number; y: number; color: string }[] = [];

  let count = 0;
  for (let r = 0; r < rows; r++) {
    const currentRadius = radiusBase + r * radiusStep;
    const seatsInRow = Math.floor(8 + r * 5); // Bilangan kerusi makin luar makin banyak
    
    for (let i = 0; i < seatsInRow; i++) {
      if (count >= totalSeats) break;
      // Sudut dari 180 (kiri) ke 0 (kanan)
      const angle = Math.PI - (i / (seatsInRow - 1)) * Math.PI;
      const x = 150 + currentRadius * Math.cos(angle);
      const y = 140 - currentRadius * Math.sin(angle);
      
      // Susun warna parti contoh (kuning dominan)
      const color = count === 48 ? '#EF4444' : count === 49 ? '#38BDF8' : '#F59E0B';
      seats.push({ x, y, color });
      count++;
    }
  }

  return (
    <Svg height="170" width="300" viewBox="0 0 300 170" style={{ alignSelf: 'center' }}>
      <G>
        {/* Ikon Bangunan Parlimen di Tengah */}
        <Circle cx="150" cy="135" r="18" fill="#181320" stroke="#F3CE65" strokeWidth="1.5" />
        
        {/* Kerusi-kerusi Ahli Parlimen */}
        {seats.map((seat, idx) => (
          <Circle
            key={idx}
            cx={seat.x}
            cy={seat.y}
            r="4"
            fill={seat.color}
          />
        ))}
      </G>
    </Svg>
  );
};