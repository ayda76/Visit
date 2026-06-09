import { Star } from 'lucide-react';

export default function Stars({ value = 0, max = 5, size = 14 }) {
  const rounded = Math.round(value);
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < rounded ? '#f0a800' : 'none'}
          stroke={i < rounded ? '#f0a800' : '#c8d4e3'}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
