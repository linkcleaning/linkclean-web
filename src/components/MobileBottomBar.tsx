import React from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, CalendarCheck } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const { goToReservationWithService, currentView } = useApp();

  // If already on the reservation view, keep it subtle or allow immediate access
  return (
    <aside aria-label="모바일 빠른 예약 바" className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A1D37]/95 backdrop-blur-md border-t border-slate-800 px-3 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
      <div className="max-w-md mx-auto grid grid-cols-2 gap-2.5">
        {/* 전화문의 */}
        <a
          href="tel:064-763-4545"
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-full border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-bold text-xs shadow-xs active:scale-95 transition-all"
          id="mobile-fixed-call-btn"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>전화문의</span>
        </a>

        {/* 방문 견적 예약 */}
        <button
          onClick={() => goToReservationWithService('move-in')}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-full text-white font-bold text-xs shadow-md active:scale-95 transition-all ${
            currentView === 'reservation'
              ? 'bg-[#38BDF8] ring-2 ring-white/50'
              : 'bg-[#38BDF8] hover:bg-[#0EA5E9] shadow-blue-400/20'
          }`}
          id="mobile-fixed-reserve-btn"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-white" />
          <span>방문 견적 예약</span>
        </button>
      </div>
    </aside>
  );
};
