import React, { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * 모바일(sm 미만)에서만 내용을 접어두고 버튼으로 펼치는 래퍼.
 * sm 이상(태블릿·PC)에서는 버튼이 숨겨지고 내용이 항상 펼쳐져 기존과 동일하게 보입니다.
 */
interface MobileCollapseProps {
  /** 접혀 있을 때 버튼에 보이는 문구 (예: "견적 기준 자세히 보기") */
  label: string;
  /** 어두운 배경 섹션이면 'dark' */
  tone?: 'light' | 'dark';
  className?: string;
  children: React.ReactNode;
}

export const MobileCollapse: React.FC<MobileCollapseProps> = ({
  label,
  tone = 'light',
  className = '',
  children,
}) => {
  const [open, setOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const btnStyle =
    tone === 'dark'
      ? 'bg-white/10 text-white border-white/15 active:bg-white/15'
      : 'bg-white text-[#0A1D37] border-slate-200 shadow-2xs active:bg-slate-50';

  const collapseFromBottom = () => {
    setOpen(false);
    // 아래쪽 접기 버튼을 눌렀을 때 섹션 위치로 되돌아가기
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div ref={topRef} className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`sm:hidden w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl border text-xs font-bold transition-colors cursor-pointer ${btnStyle}`}
      >
        <span>{open ? '접기' : label}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#38BDF8] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out sm:grid-rows-[1fr] ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden sm:overflow-visible">
          <div className={`pt-4 sm:pt-0 transition-opacity duration-300 sm:opacity-100 ${open ? 'opacity-100' : 'opacity-0'}`}>
            {children}
            <button
              type="button"
              onClick={collapseFromBottom}
              className={`sm:hidden mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border text-xs font-bold cursor-pointer ${btnStyle}`}
            >
              <span>접기</span>
              <ChevronDown className="w-4 h-4 text-[#38BDF8] rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
