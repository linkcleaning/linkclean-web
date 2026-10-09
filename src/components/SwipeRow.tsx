import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 휴대폰에서 옆으로 넘기는 카드 줄.
 * 좌우 화살표 + 오른쪽 흐림 + 점 표시로 "옆에 더 있다"는 걸 알려줍니다. (PC에서는 표시 없음)
 */
interface Props {
  count: number;
  /** 스크롤 영역 클래스 (PC 그리드 포함) */
  className: string;
  /** 화살표 세로 위치 */
  arrowTop?: string;
  children: React.ReactNode;
}

export const SwipeRow: React.FC<Props> = ({ count, className, arrowTop = '50%', children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const step = () => {
    const card = ref.current?.firstElementChild as HTMLElement | null;
    return card ? card.offsetWidth + 12 : 260;
  };
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setIdx(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / step()))));
  };
  const go = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * step(), behavior: 'smooth' });

  return (
    <div>
      <div className="relative">
        <div ref={ref} onScroll={onScroll} className={className}>
          {children}
        </div>
        {count > 1 && idx > 0 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="이전"
            style={{ top: arrowTop }}
            className="sm:hidden absolute left-0 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 border border-slate-200 shadow-md text-[#0A1D37] flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {count > 1 && idx < count - 1 && (
          <>
            <div className="sm:hidden pointer-events-none absolute right-[-16px] top-1 bottom-3 w-10 bg-gradient-to-l from-[#F8FAFC] to-transparent" />
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="다음"
              style={{ top: arrowTop }}
              className="sm:hidden absolute right-0 -translate-y-1/2 w-9 h-9 rounded-full bg-[#38BDF8] text-white shadow-lg flex items-center justify-center animate-pulse"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="sm:hidden flex items-center justify-center gap-1.5 mt-1">
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-[#38BDF8]' : 'w-1.5 bg-slate-300'}`} />
          ))}
          <span className="ml-1.5 text-[10px] font-bold text-slate-400">
            {idx + 1} / {count} · 옆으로 밀어보세요
          </span>
        </div>
      )}
    </div>
  );
};
