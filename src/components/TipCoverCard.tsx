import React from 'react';
import { TipCover, TipCoverTone } from '../types';

/**
 * 청소 팁 글의 표지 카드.
 * 연출된 사진 대신 "핵심 한 줄"을 크게 보여주는 정보 카드 형태로, 블로그 썸네일처럼 보입니다.
 */
const TONES: Record<TipCoverTone, { bg: string; text: string; sub: string; dot: string }> = {
  sky: { bg: 'from-sky-50 via-white to-sky-100', text: 'text-sky-950', sub: 'text-sky-700', dot: 'bg-sky-500' },
  teal: { bg: 'from-teal-50 via-white to-cyan-100', text: 'text-teal-950', sub: 'text-teal-700', dot: 'bg-teal-500' },
  amber: { bg: 'from-amber-50 via-white to-orange-100', text: 'text-amber-950', sub: 'text-amber-700', dot: 'bg-amber-500' },
  indigo: { bg: 'from-indigo-50 via-white to-blue-100', text: 'text-indigo-950', sub: 'text-indigo-700', dot: 'bg-indigo-500' },
  rose: { bg: 'from-rose-50 via-white to-pink-100', text: 'text-rose-950', sub: 'text-rose-700', dot: 'bg-rose-500' },
  emerald: { bg: 'from-emerald-50 via-white to-green-100', text: 'text-emerald-950', sub: 'text-emerald-700', dot: 'bg-emerald-500' },
  orange: { bg: 'from-orange-50 via-white to-amber-100', text: 'text-orange-950', sub: 'text-orange-700', dot: 'bg-orange-500' },
  navy: { bg: 'from-[#0A1D37] via-[#0E294E] to-[#123764]', text: 'text-white', sub: 'text-sky-300', dot: 'bg-amber-400' },
};

interface Props {
  cover: TipCover;
  size?: 'card' | 'detail';
}

export const TipCoverCard: React.FC<Props> = ({ cover, size = 'card' }) => {
  const tone = TONES[cover.tone] || TONES.sky;
  const lines = cover.headline.split('\n');
  const big = size === 'detail';

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${tone.bg} overflow-hidden flex flex-col justify-end ${big ? 'p-6 sm:p-8' : 'p-4 sm:p-5'}`}>
      {/* 큰 이모지 (오른쪽 위, 배경처럼) */}
      <span
        aria-hidden="true"
        className={`absolute select-none leading-none ${big ? 'right-5 top-4 text-7xl sm:text-8xl' : 'right-3 top-9 text-5xl sm:text-6xl'} opacity-90 drop-shadow-sm`}
      >
        {cover.emoji}
      </span>
      {/* 은은한 줄무늬 (노트 느낌) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 22px)' }}
      />

      <div className="relative">
        <div className={`flex items-center gap-1.5 mb-1.5 ${tone.sub}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
          <span className="text-[10px] font-black tracking-wider">LINKCLEAN 청소 노트</span>
        </div>
        <p className={`font-black leading-tight tracking-tight ${tone.text} ${big ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
          {lines.map((l, i) => (
            <span key={i} className="block">
              {l}
            </span>
          ))}
        </p>
        {cover.sub && <p className={`mt-1.5 font-bold ${tone.sub} ${big ? 'text-sm' : 'text-[11px] sm:text-xs'}`}>{cover.sub}</p>}
      </div>
    </div>
  );
};
