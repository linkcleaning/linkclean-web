import React from 'react';
import { useApp } from '../context/AppContext';
import { MobileCollapse } from './MobileCollapse';
import { Camera, PhoneCall, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Smartphone, CreditCard } from 'lucide-react';

export const FourStepProcessSection: React.FC = () => {
  const { goToReservationWithService } = useApp();

  const steps = [
    {
      step: '01',
      badge: '1단계 • 간편 견적',
      title: '무료 견적 신청',
      desc: '평수, 지역, 현장 사진(3~5장)을 보내주시면 방문 없이도 10분 내 합리적인 견적을 안내해드립니다.',
      icon: PhoneCall,
      accent: 'from-blue-500 to-sky-400',
    },
    {
      step: '02',
      badge: '2단계 • 현장 방문',
      title: '전문팀 현장 실측 & 청소',
      desc: '약속된 시간에 전용 장비와 친환경 약품을 갖춘 전문 청소팀이 공간에 투입되어 오염도를 정밀 진단합니다.',
      icon: Sparkles,
      accent: 'from-sky-500 to-teal-400',
    },
    {
      step: '03',
      badge: '3단계 • 안심 사진 리포트',
      title: '청소 전·후 실시간 사진 전송',
      desc: '제주 현장에 계시지 않아도 괜찮습니다! 주방, 욕실, 창틀 등 구역별 전/후 고화질 사진을 스마트폰으로 즉시 보고드립니다.',
      icon: Smartphone,
      accent: 'from-amber-500 to-orange-400',
      highlight: true,
    },
    {
      step: '04',
      badge: '4단계 • 확인 후 결제',
      title: '고객 검수 후 잔금 결제',
      desc: '예약 시 예약금을 받고, 비대면 사진 리포트 확인 또는 현장 검수 후 잔금을 결제합니다.',
      icon: CreditCard,
      accent: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section id="process-4step-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-10">
      <div className="bg-[#0A1D37] text-white rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-xl border border-slate-800">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8] opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400 opacity-5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/20 px-3 py-1 rounded-full border border-[#38BDF8]/30">
              REMOTE-FRIENDLY WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-2.5">
              제주에 없어도 안심되는 4단계 진행 과정
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              육지에서 이사 오시거나 타지에 계셔도 실시간 사진 리포트와 검수 후 잔금 결제로 믿고 맡기실 수 있습니다.
            </p>
          </div>

          {/* 4 Steps Grid — 모바일에서는 접어둠 */}
          <MobileCollapse label="4단계 진행 과정 자세히 보기" tone="dark">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 sm:pt-0">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between relative group ${
                  item.highlight
                    ? 'bg-gradient-to-b from-[#132A4D] to-[#0D213D] border-2 border-[#38BDF8] shadow-lg shadow-blue-500/10'
                    : 'bg-slate-800/70 border border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {item.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#38BDF8] text-[#0A1D37] text-[10px] font-black px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                    ⭐ 육지 고객 인기 1위 안심 포인트
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-white/40">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-[#38BDF8] flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#38BDF8]" />
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider mb-1.5">
                    {item.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{index === 3 ? '작업 완료' : '다음 단계로'}</span>
                  {index < 3 && <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />}
                </div>
              </div>
            ))}
          </div>
          </MobileCollapse>

          {/* Bottom Action Card */}
          <div className="mt-5 sm:mt-12 bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">현장 불만족 시 무상 당일 A/S 보장</h4>
                <p className="text-xs text-slate-400 mt-0.5">미흡한 구역이 발견되면 즉각 보완 후 사진을 다시 전송해 드립니다.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
