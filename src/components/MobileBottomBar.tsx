import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, CalendarCheck, ArrowUp } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const { goToReservationWithService, currentView } = useApp();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <aside
      aria-label="모바일 빠른 예약 및 상단 이동 바"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A1D37]/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
    >
      <div className="max-w-md mx-auto flex items-center gap-2">
        {/* 전화문의 */}
        <a
          href="tel:064-763-4545"
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-bold text-xs shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
          id="mobile-fixed-call-btn"
          title="064-763-4545 전화 걸기"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>전화문의</span>
        </a>

        {/* 방문 견적 예약 */}
        <button
          onClick={() => goToReservationWithService('move-in')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-white font-bold text-xs shadow-md active:scale-95 transition-all cursor-pointer ${
            currentView === 'reservation'
              ? 'bg-[#38BDF8] ring-2 ring-white/50'
              : 'bg-[#38BDF8] hover:bg-[#0EA5E9] shadow-blue-400/25'
          }`}
          id="mobile-fixed-reserve-btn"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-white" />
          <span className="truncate">방문 견적 예약</span>
        </button>

        {/* 스마트폰 맨 위로 가기 (TOP) 원터치 버튼 */}
        <button
          onClick={scrollToTop}
          className={`flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl border font-bold text-xs active:scale-95 transition-all shrink-0 cursor-pointer ${
            hasScrolled
              ? 'border-amber-400/50 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 ring-1 ring-amber-400/30'
              : 'border-slate-700/80 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
          id="mobile-fixed-top-btn"
          title="페이지 최상단으로 바로 이동"
        >
          <ArrowUp className={`w-3.5 h-3.5 ${hasScrolled ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
          <span>맨위로</span>
        </button>
      </div>
    </aside>
  );
};

