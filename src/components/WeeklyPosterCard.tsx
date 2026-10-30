import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, PhoneCall, X } from 'lucide-react';
import { WEEKLY_POSTERS, weeklyPosterIndex } from '../data/weeklyPosters';

/**
 * 이번 주 링크클린 포스터 — 매주 월요일 자동으로 바뀝니다.
 * 카드를 누르면 크게 보이고, 좌우로 다른 포스터도 넘겨볼 수 있어요.
 */
export const WeeklyPosterCard: React.FC = () => {
  const week = weeklyPosterIndex();
  const poster = WEEKLY_POSTERS[week];
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(week);
  const n = WEEKLY_POSTERS.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => {
          setI(week);
          setOpen(true);
        }}
        className="w-full text-left rounded-2xl sm:rounded-3xl border-2 border-[#0A1D37] bg-[#FFD400] shadow-[5px_5px_0_#0A1D37] hover:-translate-y-0.5 transition-all p-3 sm:p-4 flex items-center gap-3 sm:gap-5 cursor-pointer"
      >
        <span className="relative w-16 h-[86px] sm:w-20 sm:h-[106px] shrink-0 rounded-lg overflow-hidden border-2 border-[#0A1D37] bg-white">
          <img src={poster.src} alt={poster.alt} loading="lazy" className="w-full h-full object-cover" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[10px] sm:text-xs font-black text-rose-600 tracking-wider">THIS WEEK · 이번 주 링크클린</span>
          <span className="block text-base sm:text-xl font-black text-[#0A1D37] leading-snug">{poster.title}</span>
          <span className="block text-[11px] sm:text-sm text-[#0A1D37]/70">매주 월요일 새 포스터로 바뀌어요</span>
        </span>
        <span className="shrink-0 px-3 py-2 rounded-xl bg-[#0A1D37] text-white text-xs sm:text-sm font-black">크게 보기</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-[#0A1D37]/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-label="링크클린 포스터 크게 보기"
        >
          <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="닫기"
              className="absolute -top-11 right-0 w-9 h-9 rounded-full bg-white/15 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={WEEKLY_POSTERS[i].src}
              alt={WEEKLY_POSTERS[i].alt}
              className="w-full max-h-[78vh] object-contain rounded-xl shadow-2xl bg-white"
            />
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="이전 포스터"
              className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 text-white flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="다음 포스터"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 text-white flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-white/70 text-xs font-bold tabular-nums">
                {i + 1} / {n} {i === week && <span className="ml-1 px-1.5 py-0.5 rounded bg-rose-500 text-white">이번 주</span>}
              </span>
              <a
                href="tel:064-763-4545"
                className="ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFD400] text-[#0A1D37] text-sm font-black"
              >
                <PhoneCall className="w-4 h-4" /> 064-763-4545 전화하기
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
