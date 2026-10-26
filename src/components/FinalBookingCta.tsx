import React, { useMemo } from 'react';
import { Calendar, PhoneCall, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TEAMS_PER_DAY, getScheduledTeams, BOOKING_FLOW_TEXT } from '../data/bookingProcess';
import { checkSonEopNeunNal } from '../utils/lunarCalendar';

/**
 * 홈 맨 아래 마무리 칸 — "앞으로 2주 남은 청소 날짜"를 보여주고, 누르면 그 날짜로 바로 예약.
 * 예약 화면 달력과 같은 규칙(하루 2팀)을 씁니다.
 */
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const pad = (n: number) => String(n).padStart(2, '0');

export const FinalBookingCta: React.FC<{ onReserve: () => void }> = ({ onReserve }) => {
  const { reservations, timeSlotConfigs } = useApp();

  const days = useMemo(() => {
    const out: { date: string; d: number; dow: number; left: number; son: boolean }[] = [];
    const base = new Date();
    for (let i = 1; i <= 14; i++) {
      const t = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      const date = `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
      const son = checkSonEopNeunNal(t.getFullYear(), t.getMonth() + 1, t.getDate()).isSonEopNeunNal;
      const cfg = timeSlotConfigs[date];
      const mine = reservations.filter((r) => r.visit_date === date && r.status !== 'CANCELLED').length;
      const left = cfg?.isHoliday || cfg?.isClosed ? 0 : Math.max(0, TEAMS_PER_DAY - getScheduledTeams(date, son) - mine);
      out.push({ date, d: t.getDate(), dow: t.getDay(), left, son });
    }
    return out;
  }, [reservations, timeSlotConfigs]);

  const openCount = days.filter((x) => x.left > 0).length;

  const pick = (date: string) => {
    try {
      sessionStorage.setItem('linkclean_preselected_date', date);
    } catch {
      // ignore
    }
    onReserve();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl sm:rounded-3xl bg-[#0A1D37] text-white p-4 sm:p-8 relative overflow-hidden shadow-sm border border-slate-800">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-4 lg:gap-8 items-center">
          {/* 왼쪽: 문구 + 버튼 */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-2 sm:space-y-3">
            <span className="inline-block text-[#38BDF8] font-bold text-[10px] tracking-wider bg-[#38BDF8]/20 px-2.5 py-0.5 rounded-full">
              하루 2팀만 · 청소 경력 12년 링크클린
            </span>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-snug">
              원하는 날짜,
              <br className="hidden lg:block" /> 비어 있을 때 먼저 잡으세요.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              앞으로 2주 중 <b className="text-white">{openCount}일</b> 예약 가능해요. 날짜를 누르면 바로 예약으로 이어집니다.
              <span className="block text-[11px] text-slate-400 mt-1">신청만으로는 비용이 없고, 확인 전화 후 계약금 입금 시 확정돼요.</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1">
              <button
                type="button"
                onClick={onReserve}
                className="py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A1D37] font-black text-xs sm:text-sm inline-flex items-center justify-center gap-1 cursor-pointer"
                id="final-cta-reserve-btn"
              >
                <Calendar className="w-4 h-4" /> 청소 예약
              </button>
              <a
                href="tel:064-763-4545"
                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1"
              >
                <PhoneCall className="w-4 h-4 text-[#38BDF8]" /> 전화
              </a>
              <a
                href="https://pf.kakao.com/_xfxdrxmM?from=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-xl bg-[#FEE500] text-[#371D1E] font-black text-xs sm:text-sm inline-flex items-center justify-center gap-1"
              >
                <MessageCircle className="w-4 h-4 fill-[#371D1E]" /> 카톡
              </a>
            </div>
          </div>

          {/* 오른쪽: 2주 날짜 현황 */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {days.map((x) => {
                const full = x.left <= 0;
                return (
                  <button
                    key={x.date}
                    type="button"
                    disabled={full}
                    onClick={() => pick(x.date)}
                    className={`relative rounded-lg sm:rounded-xl py-1.5 sm:py-2 flex flex-col items-center leading-none border transition-colors ${
                      full
                        ? 'bg-white/5 border-white/5 text-slate-500 cursor-not-allowed'
                        : 'bg-white text-[#0A1D37] border-white hover:bg-sky-100 cursor-pointer'
                    }`}
                  >
                    {x.son && (
                      <span className="absolute top-0.5 right-0.5 text-[7px] font-black px-0.5 rounded-sm bg-amber-400 text-slate-950">손</span>
                    )}
                    <span className={`text-[9px] font-bold ${x.dow === 0 ? 'text-red-400' : x.dow === 6 ? 'text-blue-400' : full ? '' : 'text-slate-400'}`}>
                      {DOW[x.dow]}
                    </span>
                    <span className="text-sm sm:text-base font-black mt-0.5">{x.d}</span>
                    <span
                      className={`mt-1 text-[8px] sm:text-[10px] font-bold whitespace-nowrap ${
                        full ? 'text-slate-500' : x.left === 1 ? 'text-orange-500' : 'text-emerald-600'
                      }`}
                    >
                      {full ? '마감' : x.left === 1 ? '1팀' : '2팀'}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-center lg:text-right text-[10px] text-slate-400">{BOOKING_FLOW_TEXT}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
