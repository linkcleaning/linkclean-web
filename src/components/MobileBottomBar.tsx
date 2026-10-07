import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, CalendarCheck, ArrowUp, Home, MessageCircle } from 'lucide-react';

/**
 * 네이버 톡톡 상담 주소.
 * 톡톡 파트너센터 → 계정 정보의 "톡톡 URL"(예: https://talk.naver.com/ct/w4abcd)을 넣으세요.
 * 비어 있으면 톡톡 버튼은 숨겨집니다.
 */
export const NAVER_TALK_URL = '';

export const MobileBottomBar: React.FC = () => {
  const { goToReservationWithService, currentView, setCurrentView } = useApp();
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
      <div className="max-w-md mx-auto flex items-center gap-1.5">
        {/* 전화문의 */}
        <a
          href="tel:064-763-4545"
          className="h-10 flex items-center justify-center gap-1 px-2.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-bold text-[11px] shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
          id="mobile-fixed-call-btn"
          title="064-763-4545 전화 걸기"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>전화</span>
        </a>

        {/* 견적 예약 (짧게) */}
        <button
          onClick={() => goToReservationWithService('move-in')}
          className="h-10 flex-1 min-w-0 flex items-center justify-center gap-1 px-2 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-[11px] shadow-md active:scale-95 transition-all cursor-pointer"
          id="mobile-fixed-reserve-btn"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-white shrink-0" />
          <span className="truncate">견적 예약</span>
        </button>

        {/* 카카오톡 문의 (아이콘) */}
        <a
          href="https://pf.kakao.com/_xfxdrxmM?from=qr"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="카카오톡 문의"
          title="카카오톡 문의"
          className="w-10 h-10 shrink-0 rounded-xl bg-[#FEE500] flex items-center justify-center active:scale-95 transition-all shadow-xs"
          id="mobile-fixed-kakao-btn"
        >
          <MessageCircle className="w-5 h-5 text-[#3A1D1D] fill-[#3A1D1D]" />
        </a>

        {/* 네이버 톡톡 문의 (아이콘) */}
        {NAVER_TALK_URL && (
          <a
            href={NAVER_TALK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="네이버 톡톡 문의"
            title="네이버 톡톡 문의"
            className="w-10 h-10 shrink-0 rounded-xl bg-[#03C75A] flex flex-col items-center justify-center active:scale-95 transition-all shadow-xs text-white leading-none"
            id="mobile-fixed-naver-talk-btn"
          >
            <span className="text-[13px] font-black">N</span>
            <span className="text-[8px] font-black mt-0.5">톡톡</span>
          </a>
        )}

        {/* 홈이 아닌 페이지에서는 [홈] 버튼, 홈에서는 [맨위로] 버튼 */}
        {currentView !== 'home' ? (
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0 });
            }}
            className="h-10 flex items-center justify-center gap-1 px-2.5 rounded-xl border border-[#38BDF8]/50 bg-[#38BDF8]/15 text-[#38BDF8] font-bold text-xs active:scale-95 transition-all shrink-0 cursor-pointer"
            id="mobile-fixed-home-btn"
            title="홈으로 가기"
          >
            <Home className="w-3.5 h-3.5" />
            <span>홈</span>
          </button>
        ) : (
        <button
          onClick={scrollToTop}
          className={`h-10 flex items-center justify-center gap-1 px-2.5 rounded-xl border font-bold text-[11px] active:scale-95 transition-all shrink-0 cursor-pointer ${
            hasScrolled
              ? 'border-amber-400/50 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 ring-1 ring-amber-400/30'
              : 'border-slate-700/80 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
          id="mobile-fixed-top-btn"
          title="페이지 최상단으로 바로 이동"
        >
          <ArrowUp className={`w-3.5 h-3.5 ${hasScrolled ? 'text-amber-400 animate-bounce' : 'text-slate-400'}`} />
          <span>위로</span>
        </button>
        )}
      </div>
    </aside>
  );
};

