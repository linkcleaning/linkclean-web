import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Sparkles, X, ChevronRight, Volume2 } from 'lucide-react';
import mascotImg from '../assets/images/cleaning_master_mascot_1788782482073.jpg';
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
      className="fixed left-4 sm:left-7 bottom-20 sm:bottom-7 z-40 flex flex-col items-start select-none animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      <div className="relative group">
        {/* Close / Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          title="이벤트 알림 닫기"
          className="absolute -top-2.5 -right-2.5 z-20 w-5 h-5 rounded-full bg-slate-800/80 hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center text-xs shadow-md cursor-pointer transition-colors border border-white/20"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Floating Speech Bubble */}
        <div
          onClick={handleMascotClick}
          className="mb-2.5 bg-gradient-to-r from-[#0A1D37] via-[#0F284E] to-[#0A1D37] text-white px-3.5 py-2.5 rounded-2xl shadow-2xl border border-[#38BDF8]/40 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-98 max-w-[210px] sm:max-w-[240px]"
        >
          <div className="flex items-center gap-1.5 text-[#38BDF8] text-[11px] font-extrabold tracking-wide mb-0.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#38BDF8]" />
            <span>깜짝 선물 이벤트 발견!</span>
          </div>
          <p className="text-xs font-bold text-white leading-snug flex items-center gap-1">
            <span>마스코트를 눌러 선물을 확인하세요!</span>
          </p>
          <div className="mt-1.5 pt-1 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-300">
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <Gift className="w-3 h-3 text-amber-300" />
              선물 준비중 (Coming Soon)
            </span>
            <ChevronRight className="w-3 h-3 text-[#38BDF8] group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Speech bubble beak / arrow */}
          <div
            className="absolute left-6 -bottom-1.5 w-3 h-3 bg-[#0A1D37] border-r border-b border-[#38BDF8]/40 rotate-45"
            aria-hidden="true"
          />
        </div>

        {/* Mascot Character Interactive Button */}
        <button
          onClick={handleMascotClick}
          id="mascot-event-trigger-btn"
          title="클릭하고 특별 선물 이벤트 페이지로 이동하기"
          className="relative block w-18 h-18 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-[#38BDF8] via-sky-300 to-amber-200 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/45 cursor-pointer transform transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#38BDF8]/40"
        >
          {/* Animated Glow Halo */}
          <div className="absolute inset-0 rounded-full bg-[#38BDF8]/30 blur-md animate-pulse -z-10" />

          {/* Mascot Image Circle */}
          <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-white shadow-inner flex items-center justify-center relative">
            <img
              src={mascotImg}
              alt="링크클린 청소 마스터"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform group-hover:scale-115 group-hover:rotate-3 transition-transform duration-300"
            />

            {/* Gift Badge Pill */}
            <span className="absolute bottom-0 inset-x-0 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] sm:text-[10px] font-black py-0.5 text-center shadow-xs">
              EVENT 🎁
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
};
