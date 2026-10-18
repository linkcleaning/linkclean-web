import React, { useState } from 'react';
import { CalendarCheck, PhoneCall, MapPin, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { BOOKING_STEPS } from '../data/bookingProcess';

/**
 * 첫 화면(히어로) 안의 "청소 예약 진행 순서" 요약.
 * 내용은 src/data/bookingProcess.ts 의 BOOKING_STEPS 를 그대로 씁니다.
 */
const ICONS = [CalendarCheck, PhoneCall, MapPin, CreditCard, Sparkles];
const STEPS = BOOKING_STEPS.map((s, i) => ({
  no: String(s.no),
  title: s.title,
  short: s.short,
  desc: s.desc,
  optional: !!s.optional,
  icon: ICONS[i] || Sparkles,
  highlight: i === 0,
}));

export const HeroProcessSteps: React.FC<{ variant?: 'mobile' | 'desktop' }> = ({ variant = 'mobile' }) => {
  const desktop = variant === 'desktop';
  const [open, setOpen] = useState<string | null>(null);

  // 휴대폰: 단계 이름만 2×2로 보여주고, 누르면 설명이 펼쳐짐
  if (!desktop) {
    const active = STEPS.find((s) => s.no === open);
    return (
      <div className="mb-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1.5 text-[11px] font-black text-[#38BDF8]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            청소 예약 진행 순서
          </span>
          <span className="text-[9px] text-slate-400">눌러서 설명 보기</span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {STEPS.map((s) => {
            const on = open === s.no;
            return (
              <button
                key={s.no}
                type="button"
                onClick={() => setOpen(on ? null : s.no)}
                aria-expanded={on}
                className={`flex flex-col items-center gap-1 rounded-xl border px-0.5 py-1.5 text-center cursor-pointer transition-colors ${
                  on
                    ? 'bg-[#38BDF8] border-[#38BDF8] text-[#0A1D37]'
                    : s.highlight
                    ? 'bg-[#38BDF8]/10 border-[#38BDF8]/50 text-white'
                    : 'bg-white/5 border-white/10 text-white'
                }`}
              >
                <span
                  className={`w-5 h-5 shrink-0 rounded-full text-[10px] font-black flex items-center justify-center ${
                    on ? 'bg-[#0A1D37] text-white' : s.highlight ? 'bg-[#38BDF8] text-[#0A1D37]' : 'bg-white/15 text-white'
                  }`}
                >
                  {s.no}
                </span>
                <span className="w-full text-[10px] font-extrabold leading-tight whitespace-nowrap">{s.short}</span>
                {s.optional && <span className={`text-[8px] leading-none ${on ? 'text-[#0A1D37]' : 'text-slate-400'}`}>필요시</span>}
              </button>
            );
          })}
        </div>
        {active && (
          <p className="mt-1.5 rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-[11px] text-slate-200 leading-snug animate-in fade-in duration-150">
            <b className="text-white">{active.no}. {active.title}</b> — {active.desc}
          </p>
        )}
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-300 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          현장 불만족 시 무상 A/S 보장
        </p>
      </div>
    );
  }

  return (
    <div className={desktop ? '' : 'mb-3.5'}>
      <div className={`flex items-center gap-1.5 font-black text-[#38BDF8] ${desktop ? 'text-xs mb-3' : 'text-[11px] mb-2'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        청소 예약 진행 순서 · 제주에 안 계셔도 사진 리포트로 확인
      </div>

      <ol className={desktop ? 'grid grid-cols-2 lg:grid-cols-5 gap-2.5' : 'space-y-1.5'}>
        {STEPS.map((s) => (
          <li
            key={s.no}
            className={`flex gap-2.5 rounded-xl border ${desktop ? 'p-3' : 'p-2.5'} ${
              s.highlight ? 'bg-[#38BDF8]/10 border-[#38BDF8]/50' : s.optional ? 'bg-white/5 border-white/20 border-dashed' : 'bg-white/5 border-white/10'
            }`}
          >
            <span
              className={`shrink-0 rounded-full font-black flex items-center justify-center ${
                desktop ? 'w-7 h-7 text-xs' : 'w-6 h-6 text-[11px]'
              } ${s.highlight ? 'bg-[#38BDF8] text-[#0A1D37]' : 'bg-white/15 text-white'}`}
            >
              {s.no}
            </span>
            <div className="min-w-0">
              <div className={`font-extrabold text-white flex items-center gap-1.5 ${desktop ? 'text-sm' : 'text-xs'}`}>
                <s.icon className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                {s.title}
                {s.highlight && (
                  <span className="text-[9px] font-black bg-amber-400 text-[#0A1D37] px-1.5 py-0.5 rounded-full">먼저!</span>
                )}
              </div>
              <p className={`text-slate-300 leading-snug mt-0.5 ${desktop ? 'text-xs' : 'text-[11px]'}`}>{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className={`mt-2 flex items-start gap-2 rounded-xl bg-emerald-500/10 border border-emerald-400/30 ${desktop ? 'p-3' : 'p-2.5'}`}>
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className={`text-slate-200 leading-snug ${desktop ? 'text-xs' : 'text-[11px]'}`}>
          <b className="text-white">현장 불만족 시 무상 A/S 보장</b> — 미흡한 구역은 바로 보완하고 사진을 다시 보내드립니다.
        </p>
      </div>
    </div>
  );
};
