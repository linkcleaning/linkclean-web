import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight > 0) {
        const percent = Math.min(100, Math.round((scrollY / docHeight) * 100));
        setScrollPercent(percent);
      }

      // Show button after scrolling down 220px
      setIsVisible(scrollY > 220);
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

  if (!isVisible) return null;

  // SVG Circular progress math
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  return (
    <div
      className="hidden sm:flex fixed right-6 bottom-6 z-50 items-center select-none animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <button
        type="button"
        onClick={scrollToTop}
        id="quick-scroll-to-top-btn"
        className="group relative w-12 h-12 rounded-full bg-[#0A1D37]/95 hover:bg-[#0F172A] text-white shadow-xl hover:shadow-2xl border border-slate-700/80 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-md"
        aria-label="페이지 맨 위로 이동"
        title={`페이지 맨 위로 이동 (${scrollPercent}% 읽음)`}
      >
        {/* Circular Progress Ring */}
        <svg
          className="absolute inset-0 w-12 h-12 -rotate-90 pointer-events-none p-0.5"
          viewBox="0 0 40 40"
        >
          {/* Background circle */}
          <circle
            cx="20"
            cy="20"
            r={radius}
            className="stroke-slate-700/40 fill-none"
            strokeWidth="2.5"
          />
          {/* Active progress stroke */}
          <circle
            cx="20"
            cy="20"
            r={radius}
            className="stroke-[#38BDF8] fill-none transition-all duration-150"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Arrow & Text */}
        <div className="flex flex-col items-center justify-center relative z-10 -space-y-0.5">
          <ArrowUp className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[9px] font-black text-sky-200 leading-none">TOP</span>
        </div>

        {/* Desktop Tooltip */}
        <span className="hidden sm:group-hover:block absolute right-full mr-2.5 px-2.5 py-1 bg-[#0A1D37] text-white text-[11px] font-bold rounded-lg shadow-lg whitespace-nowrap border border-slate-700">
          맨 위로 ({scrollPercent}%)
        </span>
      </button>
    </div>
  );
};
