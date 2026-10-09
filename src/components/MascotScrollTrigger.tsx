import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Sparkles, X, ChevronRight, Volume2 } from 'lucide-react';
import mascotImg from '../assets/images/cleaning_master_mascot_1788782482073.png';
import { cleaningAudio } from '../utils/cleaningAudio';

export const MascotScrollTrigger: React.FC = () => {
  const { setCurrentView } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasScrolledPastMid, setHasScrolledPastMid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show mascot once user scrolls down by 250px or halfway through viewport
      const scrollPosition = window.scrollY;
      if (scrollPosition > 220) {
        setIsVisible(true);
        setHasScrolledPastMid(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isDismissed || !isVisible) {
    return null;
  }

  const handleMascotClick = () => {
    cleaningAudio.playFloorWipeSound();
    setCurrentView('event');
  };

  return (
    <aside
      aria-label="링크클린 마스코트 깜짝 선물 이벤트"
      className="fixed left-3 sm:left-7 bottom-16 sm:bottom-7 z-40 flex flex-col items-start select-none animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      <div className="relative group flex flex-col items-center">
        {/* Close / Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          title="이벤트 알림 닫기"
          className="absolute -top-2 -right-2 z-20 w-5 h-5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center text-xs shadow-md cursor-pointer transition-colors border border-white/20"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Floating Speech Bubble */}
        <div
          onClick={handleMascotClick}
          className="relative mb-1.5 sm:mb-2.5 bg-gradient-to-r from-red-600 via-red-500 to-rose-500 text-white px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl border border-red-300/60 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-98 max-w-[165px] sm:max-w-[240px]"
        >
          <div className="flex items-center gap-1 sm:gap-1.5 text-yellow-200 text-[10px] sm:text-[11px] font-extrabold tracking-tight mb-0.5">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-yellow-200 shrink-0" />
            <span className="truncate">깜짝 선물 이벤트 발견!</span>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-white leading-tight sm:leading-snug">
            <span className="hidden sm:inline">마스코트를 눌러 선물을 확인하세요!</span>
            <span className="sm:hidden">터치하여 선물 확인!</span>
          </p>
          <div className="mt-1 pt-1 border-t border-white/30 flex items-center justify-between text-[9px] sm:text-[10px] text-red-50">
            <span className="text-yellow-200 font-semibold flex items-center gap-0.5 sm:gap-1">
              <Gift className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-200 shrink-0" />
              <span>선물 준비중</span>
            </span>
            <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>

          {/* Speech bubble beak / arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-1 sm:-bottom-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 border-r border-b border-red-300/60 rotate-45"
            aria-hidden="true"
          />
        </div>

        {/* Mascot Character Interactive Button */}
        <button
          onClick={handleMascotClick}
          id="mascot-event-trigger-btn"
          title="클릭하고 특별 선물 이벤트 페이지로 이동하기"
          className="relative block w-13 h-13 sm:w-20 sm:h-20 rounded-full p-0.5 sm:p-1 bg-gradient-to-tr from-[#38BDF8] via-sky-300 to-amber-200 shadow-lg sm:shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/45 cursor-pointer transform transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#38BDF8]/40"
        >
          {/* Animated Glow Halo */}
          <div className="absolute inset-0 rounded-full bg-[#38BDF8]/30 blur-sm sm:blur-md animate-pulse -z-10" />

          {/* Mascot Image Circle */}
          <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white shadow-inner flex items-center justify-center relative">
            <img
              src={mascotImg}
              alt="링크클린 청소 마스터"
              referrerPolicy="no-referrer"
              className="w-[78%] h-[78%] -mt-2 sm:-mt-3 object-contain transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
            />

            {/* Gift Badge Pill */}
            <span className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[7.5px] sm:text-[10px] font-black py-0.2 sm:py-0.5 text-center shadow-xs">
              EVENT 🎁
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
