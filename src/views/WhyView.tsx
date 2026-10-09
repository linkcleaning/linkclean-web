import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Eye,
  DollarSign,
  Search,
  Star,
  ChevronRight,
  ChevronLeft,
  Clock,
  PhoneCall,
  Gift,
  MessageCircle
} from 'lucide-react';

/**
 * "링크클린은 다릅니다" 페이지
 * 예전 첫 화면에 있던 3개 섹션(고객의 고민 / 깨끗함의 기준 / 어렵게 생각하지 마세요)을 한 페이지로 모았습니다.
 */
export const WhyView: React.FC = () => {
  const { goToReservationWithService, setCurrentView } = useApp();

  return (
    <div className="space-y-8 sm:space-y-14 py-6 sm:py-12 bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          WHY LINKCLEAN
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0A1D37] tracking-tight mt-2">링크클린은 다릅니다</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          고객님의 고민부터 링크클린의 원칙, 간단한 진행 순서까지 한 번에 확인하세요.
        </p>
      </div>

      {/* =========================================================================
          SECTION 04 — 고객의 고민
          Bento Card Grid: "청소업체, 아무 곳이나 선택하고 싶지는 않으니까."
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-blue-100">
            고객님의 고민과 불안
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-2 sm:mt-3">
            청소업체, 아무 곳이나 선택하고 싶지는 않으니까.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            청소를 맡기고 싶어도 어떤 업체를 선택해야 할지 고민되시죠?
          </p>
        </div>

        {/* 4 Problem Cards — 모바일에서는 접어둠 */}
        <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {[
            {
              id: 'c-1',
              num: '01',
              icon: Eye,
              title: '사진만 보고 받은 견적,\n실제와 다를까 불안하신가요?',
              desc: '현장 환경은 평수만으로 알 수 없습니다. 창문 개수, 샷시 노후도, 오염도를 무시한 비대면 견적은 위험합니다.'
            },
            {
              id: 'c-2',
              num: '02',
              icon: DollarSign,
              title: '청소 당일 갑작스러운\n추가금 요구가 걱정되시나요?',
              desc: '현장에서 "기름때가 심하다, 베란다가 넓다"며 강요하는 불쾌한 당일 추가금을 원천 차단합니다.'
            },
            {
              id: 'c-3',
              num: '03',
              icon: Search,
              title: '눈에 보이는 곳만\n대충 닦을까 봐 불안하신가요?',
              desc: '서랍장 탈거 안쪽, 후드 필터 내부, 걸레받이 하부 분진 등 손 닿기 힘든 구석까지 정밀 청소합니다.'
            },
            {
              id: 'c-4',
              num: '04',
              icon: HelpCircle,
              title: '내 공간에 어떤 청소가\n필요한지 막막하신가요?',
              desc: '신축 분진 제거, 찌든 기름때 박리, 바닥 코팅 등 최적의 솔루션을 전문가가 직접 진단합니다.'
            }
          ].map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-slate-100 shadow-2xs hover:shadow-md hover:border-[#38BDF8]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <span className="text-[11px] sm:text-xs font-black text-slate-300 font-mono tracking-wider">{item.num}</span>
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 text-[#38BDF8] flex items-center justify-center">
                    <item.icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  </div>
                </div>
                <h3 className="text-xs sm:text-base font-bold text-[#0A1D37] leading-tight sm:leading-snug mb-1 sm:mb-2.5 whitespace-pre-line">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        </>

        {/* Section 02 Bento Solution Block */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#0A1D37] text-white p-5 sm:p-10 text-center relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-[#38BDF8] font-bold text-[10px] uppercase tracking-wider bg-[#38BDF8]/20 px-2.5 py-0.5 rounded-full">
              링크클린의 해답
            </span>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white">
              링크클린은 다르게 시작합니다.
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              공간의 상태를 직접 확인하고 필요한 작업을 꼼꼼하게 살펴본 후 고객에게 꼭 맞는 청소를 안내합니다.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 — 링크클린의 차별점
          "깨끗함의 기준을 높이겠습니다." (Bento 4개 카드 -> 모바일 2x2 그리드)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-blue-100">
            WHY LINKCLEAN
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-2 sm:mt-3">
            깨끗함의 기준을 높이겠습니다.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            고객님이 믿고 맡기실 수 있도록 4가지 원칙을 철저히 지킵니다.
          </p>
        </div>

        <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {[
            {
              num: '01',
              title: '꼼꼼한 현장 확인',
              desc: '공간마다 오염도와 작업 환경이 다릅니다. 현장 상태를 직접 확인하고 정직한 범위를 산정합니다.'
            },
            {
              num: '02',
              title: '합리적인 견적',
              desc: '불필요한 공정을 권하지 않고, 꼭 필요한 작업을 기준으로 투명하고 합리적인 견적을 냅니다.'
            },
            {
              num: '03',
              title: '디테일한 청소',
              desc: '손이 자주 닿는 곳뿐 아니라 서랍 안쪽, 후드 안, 틈새 구석까지 세심하게 케어합니다.'
            },
            {
              num: '04',
              title: '끝까지 책임지는 케어',
              desc: '예약부터 방문 견적, 청소 시공 및 고객 검수까지 불편함 없도록 밀착 안내합니다.'
            }
          ].map((card) => (
            <div
              key={card.num}
              className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-slate-100 shadow-2xs hover:shadow-md hover:border-[#38BDF8]/40 transition-all relative overflow-hidden group"
            >
              <div className="text-xl sm:text-4xl font-black text-[#38BDF8] font-mono transition-colors mb-1.5 sm:mb-4">
                {card.num}
              </div>
              <h3 className="text-xs sm:text-base font-bold text-[#0A1D37] mb-1 sm:mb-2">
                {card.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
        </>
      </section>

      {/* =========================================================================
          SECTION 05 — 작업 프로세스 (모바일 가로 스크롤 / 데스크톱 5열 그리드)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A1D37] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-12 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8] opacity-10 rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/20 px-2.5 py-0.5 rounded-full border border-[#38BDF8]/30">
                  STEP BY STEP PROCESS
                </span>
                <span className="sm:hidden text-[10px] text-blue-200 bg-white/10 px-2 py-0.5 rounded-full font-medium">
                  옆으로 넘기기 👈 👉
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
                어렵게 생각하지 마세요.<br />
                링크클린이 처음부터 안내해드립니다.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                신청부터 청소 완료까지 투명하고 체계적인 5단계 프로세스를 진행합니다.
              </p>
            </div>

            {/* Mobile: 1-row scroll / Desktop: 5-col grid */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-2.5 pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-5 sm:gap-3 sm:overflow-visible no-scrollbar">
              {[
                {
                  step: 'STEP 01',
                  title: '방문 견적 신청',
                  desc: '원하는 날짜와 시간을 선택하고 간단한 정보를 입력해주세요.'
                },
                {
                  step: 'STEP 02',
                  title: '현장 방문',
                  desc: '담당자가 직접 방문하여 공간의 상태와 필요한 작업을 확인합니다.'
                },
                {
                  step: 'STEP 03',
                  title: '견적 안내',
                  desc: '현장 상태를 바탕으로 필요한 청소 범위와 견적을 안내합니다.'
                },
                {
                  step: 'STEP 04',
                  title: '청소 진행',
                  desc: '협의된 작업 내용을 기준으로 꼼꼼하게 청소를 진행합니다.'
                },
                {
                  step: 'STEP 05',
                  title: '깨끗해진 공간',
                  desc: '청소 전과 달라진 공간을 직접 확인해보세요.'
                }
              ].map((p, index) => (
                <div
                  key={p.step}
                  className="w-[175px] sm:w-auto shrink-0 snap-start bg-slate-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-700/80 hover:border-[#38BDF8] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="font-mono text-[10px] font-black text-[#38BDF8] bg-[#38BDF8]/20 px-2 py-0.5 rounded border border-[#38BDF8]/30">
                        {p.step}
                      </span>
                      <span className="text-slate-500 text-[11px] sm:text-xs font-bold">0{index + 1}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white mb-1">{p.title}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      <section className="max-w-3xl mx-auto px-4">
        <div className="bg-[#0A1D37] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center space-y-4">
          <p className="text-lg sm:text-2xl font-black">직접 확인하고 약속하는 링크클린의 청소</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => goToReservationWithService('move-in')}
              className="px-6 py-3 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A1D37] font-black text-sm cursor-pointer"
            >
              견적 예약하기
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0 });
              }}
              className="px-6 py-3 rounded-xl border border-white/30 text-white font-bold text-sm cursor-pointer"
            >
              홈으로
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
