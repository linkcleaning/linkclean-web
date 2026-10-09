import React, { useState } from 'react';
import { PhoneCall, Sparkles, Smartphone, CreditCard, ShieldCheck } from 'lucide-react';

/**
 * 첫 화면(히어로) 안에 들어가는 "제주에 없어도 안심 4단계" 요약.
 * 예전에는 아래쪽에 따로 있던 4단계 진행 과정 섹션을 위로 합친 것입니다.
 */
const STEPS = [
  {
    no: '1',
    title: '견적 신청',
    desc: '평수·지역·현장 사진 3~5장을 보내주시면 방문 없이도 빠르게 견적을 안내해 드립니다.',
    icon: PhoneCall,
  },
  {
    no: '2',
    title: '현장 실측 & 청소',
    desc: '약속한 시간에 전용 장비·친환경 약품을 갖춘 청소팀이 방문해 오염도를 보고 작업합니다.',
    icon: Sparkles,
  },
  {
    no: '3',
    title: '전·후 사진 리포트',
    desc: '현장에 안 계셔도 괜찮아요. 주방·욕실·창틀 등 구역별 전/후 사진을 휴대폰으로 보내드립니다.',
    icon: Smartphone,
    highlight: true,
  },
  {
    no: '4',
    title: '검수 후 잔금 결제',
    desc: '예약 시 예약금만 받고, 사진 리포트 확인 또는 현장 검수 후 잔금을 결제합니다.',
    icon: CreditCard,
  },
];

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
            제주에 없어도 안심되는 4단계
          </span>
          <span className="text-[9px] text-slate-400">눌러서 설명 보기</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {STEPS.map((s) => {
            const on = open === s.no;
            return (
              <button
                key={s.no}
                type="button"
                onClick={() => setOpen(on ? null : s.no)}
                aria-expanded={on}
                className={`flex items-center gap-1.5 rounded-xl border px-2 py-2 text-left cursor-pointer transition-colors ${
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
                <span className="flex-1 min-w-0 text-[11px] font-extrabold truncate">{s.title}</span>
                <span className={`text-[9px] transition-transform ${on ? 'rotate-180' : ''}`}>▾</span>
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
        제주에 없어도 안심되는 4단계 진행
      </div>

      <ol className={desktop ? 'grid grid-cols-2 lg:grid-cols-4 gap-2.5' : 'space-y-1.5'}>
        {STEPS.map((s) => (
          <li
            key={s.no}
            className={`flex gap-2.5 rounded-xl border ${desktop ? 'p-3' : 'p-2.5'} ${
              s.highlight ? 'bg-[#38BDF8]/10 border-[#38BDF8]/50' : 'bg-white/5 border-white/10'
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
                  <span className="text-[9px] font-black bg-amber-400 text-[#0A1D37] px-1.5 py-0.5 rounded-full">육지 고객 인기</span>
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
