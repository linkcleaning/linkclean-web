import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { PressMention } from '../types';

// 언론 보도 카드 — 기사 본문·사진은 신문사 저작권이므로 싣지 않고,
// 링크클린이 직접 쓴 소개 문장 + 원문 링크만 보여줍니다.
export const PressMentionCard: React.FC<{ press: PressMention; className?: string }> = ({ press, className = '' }) => (
  <div className={`bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm ${className}`}>
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-[#0A1D37] flex items-center justify-center shrink-0 border border-slate-200">
        <Newspaper className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-extrabold text-[#0A1D37]">언론 보도</span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-slate-600">{press.outlet}</span>
          <span className="text-slate-400">{press.date}</span>
        </div>
        <h3 className="text-base sm:text-lg font-extrabold text-[#0A1D37] leading-snug break-keep">
          {press.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-keep">{press.summary}</p>
        <a
          href={press.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0A1D37] underline underline-offset-4 decoration-slate-300 hover:decoration-[#38BDF8]"
        >
          기사 원문 보기 ({press.outlet})
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </div>
);
