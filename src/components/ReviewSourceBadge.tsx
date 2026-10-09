import React from 'react';
import { ReviewItem } from '../types';

/** 실제 후기 출처 표시 (네이버 플레이스 / 당근마켓) */
export const ReviewSourceBadge: React.FC<{ rev: ReviewItem }> = ({ rev }) => {
  if (rev.source === 'naver') {
    return (
      <a
        href={rev.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-[#03C75A] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"
      >
        <span className="w-3.5 h-3.5 rounded-sm bg-[#03C75A] text-white flex items-center justify-center text-[8px] leading-none">N</span>
        네이버 플레이스 실제 후기
      </a>
    );
  }
  if (rev.source === 'daangn') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-[#FF6F0F] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
        🥕 당근 실제 후기{rev.rating ? ` · ★${rev.rating.toFixed(1)}` : ''}
      </span>
    );
  }
  return null;
};
