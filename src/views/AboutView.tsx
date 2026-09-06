import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, ShieldCheck, Award, Users, FileCheck } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { goToReservationWithService } = useApp();

  return (
    <div className="py-10 sm:py-16 space-y-10 sm:space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Brand Hero Bento Header */}
      <div className="bg-[#0A1D37] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
            <Sparkles className="w-3.5 h-3.5" />
            ABOUT LINKCLEAN
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            청소는 꼼꼼하게,<br className="sm:hidden" />
            견적은 정확하게.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            링크클린은 공간의 상태를 직접 확인하고 고객에게 꼭 필요한 맞춤 청소 솔루션을 정직하게 제안합니다.
          </p>
        </div>
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white/10 border border-white/20 p-2 flex items-center justify-center shrink-0 backdrop-blur-xs shadow-inner">
          <img
            src="/logo.png?v=2"
            alt="링크클린 공식 마스코트"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Brand Story & Philosophy - Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            링크클린의 설립 철학
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1D37] leading-snug">
            “왜 청소업체를 부를 때마다<br />
            불안하고 추가금을 걱정해야 할까요?”
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              많은 고객님들이 전화나 사진 몇 장만으로 대략적인 견적을 받고 안심했다가, 시공 당일 현장에서 온갖 이유로 수십만 원의 추가금을 요구받는 불편한 경험을 겪습니다.
            </p>
            <p>
              링크클린은 이러한 불합리한 관행을 끊어내기 위해 시작되었습니다. 우리는 <strong className="text-[#0A1D37]">사전 방문 실측</strong>을 통해 공간의 창호 상태, 오염 강도, 자재 특성을 전문가가 눈으로 확인하고, 약속된 견적서 그대로 정직하게 시공합니다.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-[#0A1D37] font-bold text-xs sm:text-sm">
              고객님이 문을 열고 들어섰을 때 느끼는 깨끗함과 안도감, 그것이 링크클린이 일하는 기준입니다.
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl p-3 border border-slate-100 shadow-sm overflow-hidden flex">
          <div className="rounded-2xl overflow-hidden w-full h-full min-h-[280px]">
            <img
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
              alt="링크클린 청소 현장"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 4 Core Service Principles - Bento 4 Grid */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-extrabold text-[#38BDF8] uppercase tracking-wider">OUR VALUES</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-1">
            링크클린의 4대 서비스 원칙
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            고객과의 신뢰를 지키기 위해 타협하지 않는 링크클린의 약속입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: FileCheck,
              title: '100% 실측 정찰제',
              desc: '공간의 오염도와 작업 범위를 사전 실측하여 현장 추가금 없이 확정 견적을 제공합니다.'
            },
            {
              icon: ShieldCheck,
              title: '인체 무해 친환경 약품',
              desc: '독한 화학 락스 대신 생분해성 친환경 세제와 140℃ 고온 스팀 살균 장비를 기본 사용합니다.'
            },
            {
              icon: Users,
              title: '본사 정규직 전문가 투입',
              desc: '하청이나 일용직 파견이 아닌, 본사 정기 교육과 기술 인증을 수료한 전문 마스터가 시공합니다.'
            },
            {
              icon: Award,
              title: '사후 A/S 무상 보증',
              desc: '시공 후 미비한 부분이 있을 경우 24시간 내 무상 재시공을 책임지는 사후 보증제를 실시합니다.'
            }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:border-[#38BDF8]/40 transition-all flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#38BDF8] flex items-center justify-center mb-5 border border-blue-100">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#0A1D37] mb-2">{item.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Action CTA - Bento Card */}
      <div className="bg-[#0A1D37] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-3">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            직접 확인하고 약속하는 링크클린의 청소,<br />
            지금 방문 견적을 신청해보세요.
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm">
            원하시는 날짜와 시간을 직접 선택하시면 전문 상담사가 현장을 찾아 친절하게 견적을 산출해 드립니다.
          </p>
        </div>
        <div>
          <button
            onClick={() => goToReservationWithService('move-in')}
            className="px-8 py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-extrabold text-sm shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            id="about-reserve-btn"
          >
            <Calendar className="w-4 h-4" />
            방문 견적 예약하기
          </button>
        </div>
      </div>
    </div>
  );
};
