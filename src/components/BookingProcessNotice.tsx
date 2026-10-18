import React from 'react';
import { BOOKING_STEPS } from '../data/bookingProcess';

/** 청소 예약 진행 순서 안내 (밝은 배경용). compact = 번호+짧은 이름 한 줄 */
export const BookingProcessNotice: React.FC<{ compact?: boolean; className?: string }> = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <ol className={`flex items-center justify-center flex-wrap gap-x-1 gap-y-1 text-[11px] sm:text-xs font-bold text-slate-600 ${className}`}>
        {BOOKING_STEPS.map((s, i) => (
          <li key={s.no} className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-[#38BDF8] text-white text-[9px] font-black flex items-center justify-center">{s.no}</span>
            <span className={s.optional ? 'text-slate-400' : ''}>
              {s.optional ? `(필요시) ${s.short}` : s.short}
            </span>
            {i < BOOKING_STEPS.length - 1 && <span className="text-slate-300 text-[9px] mx-0.5">›</span>}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className={`rounded-2xl border border-sky-200 bg-sky-50/70 p-3 sm:p-4 ${className}`}>
      <p className="text-xs sm:text-sm font-extrabold text-[#0A1D37] mb-2">
        📅 청소 예약은 이렇게 진행돼요
      </p>
      <ol className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 sm:gap-2">
        {BOOKING_STEPS.map((s) => (
          <li
            key={s.no}
            className={`flex sm:flex-col items-start gap-2 sm:gap-1 rounded-xl bg-white border px-2.5 py-2 ${
              s.optional ? 'border-dashed border-slate-300' : 'border-sky-100'
            }`}
          >
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="w-5 h-5 rounded-full bg-[#0A1D37] text-white text-[10px] font-black flex items-center justify-center">{s.no}</span>
              <span className="text-xs font-extrabold text-[#0A1D37] whitespace-nowrap">{s.title}</span>
            </span>
            <span className="text-[11px] text-slate-500 leading-snug">{s.desc}</span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-[11px] text-slate-500">
        ※ 예약 신청만으로는 비용이 들지 않아요. <b className="text-[#0A1D37]">계약금 입금 시점에 예약이 확정</b>됩니다.
      </p>
    </div>
  );
};
