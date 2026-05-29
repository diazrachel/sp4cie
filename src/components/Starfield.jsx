import { useMemo } from "react";
export default function Starfield() {
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      dur: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      size: Math.random() > 0.9 ? 3 : Math.random() > 0.7 ? 2 : 1,
    })), []
  );
  return (
    <div className="starfield" aria-hidden>
      {stars.map(s => (
        <div key={s.id} className="star" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          '--dur': `${s.dur}s`, '--delay': `${s.delay}s`,
        }} />
      ))}
    </div>
  );
}
