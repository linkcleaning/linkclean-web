import React, { useId } from 'react';

/** 색이 들어간 날씨 그림 (맑음 / 흐림 / 비 / 바람 / 안개) */
type Condition = 'sunny' | 'cloudy' | 'rain' | 'windy' | 'fog';

export const WeatherIcon: React.FC<{ condition: Condition; className?: string }> = ({ condition, className = 'w-5 h-5' }) => {
  const id = useId().replace(/:/g, '');
  const sun = `sun${id}`;
  const cloud = `cloud${id}`;

  const defs = (
    <defs>
      <radialGradient id={sun} cx="40%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#FFF3A3" />
        <stop offset="55%" stopColor="#FFC93C" />
        <stop offset="100%" stopColor="#FF9F1C" />
      </radialGradient>
      <linearGradient id={cloud} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#D6E4F0" />
      </linearGradient>
    </defs>
  );

  const Cloud = ({ y = 0, x = 0 }: { y?: number; x?: number }) => (
    <path
      transform={`translate(${x} ${y})`}
      d="M9 27h17a6 6 0 0 0 .8-11.95A8.5 8.5 0 0 0 10.3 13.6 6.7 6.7 0 0 0 9 27z"
      fill={`url(#${cloud})`}
      stroke="#9DB7CF"
      strokeWidth="0.8"
    />
  );

  const SunRays = ({ cx, cy, r, ray }: { cx: number; cy: number; r: number; ray: number }) => (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * (r + 1.8)}
            y1={cy + Math.sin(a) * (r + 1.8)}
            x2={cx + Math.cos(a) * (r + 1.8 + ray)}
            y2={cy + Math.sin(a) * (r + 1.8 + ray)}
            stroke="#FFB22C"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${sun})`} />
    </g>
  );

  let body: React.ReactNode;
  switch (condition) {
    case 'sunny':
      body = <SunRays cx={18} cy={18} r={7.5} ray={3.5} />;
      break;
    case 'cloudy':
      body = (
        <>
          <SunRays cx={24} cy={12} r={5} ray={2.3} />
          <Cloud y={3} x={-2} />
        </>
      );
      break;
    case 'rain':
      body = (
        <>
          <Cloud y={-4} />
          {[11, 17, 23].map((x, i) => (
            <path key={x} d={`M${x} ${25 + (i % 2) * 2.5}q-2.6 4.2 0 6q2.6-1.8 0-6z`} fill="#3BA3F5" />
          ))}
        </>
      );
      break;
    case 'windy':
      body = (
        <>
          <Cloud y={-5} x={2} />
          <path d="M5 26h16a3 3 0 1 0-3-3" fill="none" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 31h11a2.4 2.4 0 1 1-2.4 2.4" fill="none" stroke="#5EEAD4" strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
      break;
    case 'fog':
    default:
      body = (
        <>
          <Cloud y={-5} />
          {[26, 30, 34].map((y, i) => (
            <line key={y} x1={7 + i * 2} y1={y} x2={29 - i * 2} y2={y} stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          ))}
        </>
      );
  }

  return (
    <svg viewBox="0 0 36 36" className={`${className} drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]`} aria-hidden="true">
      {defs}
      {body}
    </svg>
  );
};
