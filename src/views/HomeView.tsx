import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { PortfolioCategory, ServiceType } from '../types';
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
  Clock,
  PhoneCall
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    portfolio,
    reviews,
    setCurrentView,
    goToServiceDetail,
    goToReservationWithService
  } = useApp();

  const [activeBeforeAfterCategory, setActiveBeforeAfterCategory] = useState<PortfolioCategory>('전체');

  // Filter portfolio items
  const filteredPortfolio = activeBeforeAfterCategory === '전체'
    ? portfolio
    : portfolio.filter((item) => item.category === activeBeforeAfterCategory);

  // Active item for the main featured comparison
  const featuredItem = filteredPortfolio[0] || portfolio[0];

  // Only visible reviews
  const visibleReviews = reviews.filter((r) => r.isVisible);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16 bg-[#F8FAFC]">
      {/* =========================================================================
          SECTION 01 — HERO (BENTO GRID THEME)
          Design HTML Bento Grid: 4 columns, modular cards, #0A1D37, #38BDF8
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Bento Cell 1: Main Brand Hero (col-span-2 row-span-2) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 bg-[#0A1D37] rounded-3xl p-8 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden shadow-sm min-h-[420px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full -mr-20 -mt-20 pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-block bg-[#38BDF8] text-white px-3 py-1 rounded-full text-[10px] font-bold mb-4 tracking-wider">
                PREMIUM CLEANING
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.15] mb-5 tracking-tight text-white">
                청소가 필요한 순간,<br />
                <span className="text-[#38BDF8]">링크클린</span>이 직접 찾아갑니다.
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-md leading-relaxed">
                내 집처럼 꼼꼼하게. 공간의 상태를 직접 확인하고<br className="hidden sm:block" />
                합리적인 방문 견적을 안내해 드립니다.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={() => goToReservationWithService('move-in')}
                  className="bg-white text-[#0A1D37] px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-slate-100 transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95"
                  id="hero-bento-reserve-btn"
                >
                  <Calendar className="w-4 h-4 text-[#0A1D37]" />
                  방문 견적 예약하기
                </button>
                <div className="text-xs text-slate-300 leading-tight">
                  원하는 날짜와 시간을<br className="hidden sm:block" /> 선택해 편하게 신청하세요.
                </div>
              </div>
            </div>

            {/* Trust Metrics footer in Cell 1 */}
            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-700/60 relative z-10 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-[11px] text-slate-400">현장 직접 실측</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#38BDF8]">0원</div>
                <div className="text-[11px] text-slate-400">불합리 추가금</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">4.9/5.0</div>
                <div className="text-[11px] text-slate-400">고객 만족도</div>
              </div>
            </div>
          </div>

          {/* Bento Cell 2: 맞춤 서비스 (col-span-1 row-span-2) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-2 bg-white rounded-3xl p-6 border border-slate-100 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#0A1D37]">
                <span className="w-1.5 h-6 bg-[#38BDF8] rounded-full" />
                맞춤 서비스
              </h3>
              <div className="space-y-3">
                <div
                  onClick={() => goToServiceDetail('move-in')}
                  className="group p-3.5 bg-slate-50 rounded-2xl hover:bg-[#38BDF8] hover:text-white transition-all cursor-pointer"
                >
                  <p className="text-[10px] font-bold mb-1 opacity-70 group-hover:text-white">STEP 01</p>
                  <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-white">입주 · 이사 청소</h4>
                </div>
                <div
                  onClick={() => goToServiceDetail('residential')}
                  className="group p-3.5 bg-slate-50 rounded-2xl hover:bg-[#38BDF8] hover:text-white transition-all cursor-pointer"
                >
                  <p className="text-[10px] font-bold mb-1 opacity-70 group-hover:text-white">STEP 02</p>
                  <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-white">거주 청소</h4>
                </div>
                <div
                  onClick={() => goToServiceDetail('commercial')}
                  className="group p-3.5 bg-slate-50 rounded-2xl hover:bg-[#38BDF8] hover:text-white transition-all cursor-pointer"
                >
                  <p className="text-[10px] font-bold mb-1 opacity-70 group-hover:text-white">STEP 03</p>
                  <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-white">상가 · 사무실 청소</h4>
                </div>
                <div
                  onClick={() => goToServiceDetail('partial')}
                  className="group p-3.5 bg-slate-50 rounded-2xl hover:bg-[#38BDF8] hover:text-white transition-all cursor-pointer"
                >
                  <p className="text-[10px] font-bold mb-1 opacity-70 group-hover:text-white">STEP 04</p>
                  <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-white">부분 · 특수 청소</h4>
                </div>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('services')}
              className="mt-4 w-full py-3 text-xs font-bold text-[#38BDF8] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer text-center"
            >
              전체 서비스 보기 →
            </button>
          </div>

          {/* Bento Cell 3: 꼼꼼한 현장 확인 (col-span-1 row-span-1) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[170px]">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#38BDF8]">
              <Sparkles className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A1D37] text-base mb-1">꼼꼼한 현장 확인</h4>
              <p className="text-xs text-slate-500 leading-relaxed">오염도에 따른 1:1 맞춤형<br />작업 범위를 산정합니다.</p>
            </div>
          </div>

          {/* Bento Cell 4: 전문가 매칭 100% (col-span-1 row-span-1) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1 bg-[#38BDF8] rounded-3xl p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-sm min-h-[170px]">
            <div className="absolute -bottom-4 -right-4 text-white opacity-20 pointer-events-none">
              <ShieldCheck className="w-24 h-24" />
            </div>
            <div className="z-10">
              <p className="text-xs font-bold mb-1 opacity-90">전문가 매칭</p>
              <h4 className="text-3xl font-black">100%</h4>
            </div>
            <p className="text-[11px] font-medium leading-tight opacity-95 z-10">
              숙련된 베테랑 팀장이 직접<br />모든 현장을 총괄합니다.
            </p>
          </div>

          {/* Bento Cell 5: 간편한 5단계 예약 프로세스 (col-span-2 row-span-1) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-1 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#0A1D37]">간편한 5단계 예약 프로세스</h3>
              <div className="flex gap-2 items-center mt-1">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-[#0A1D37] text-white text-[10px] flex items-center justify-center font-bold">1</div>
                  <span className="text-[10px] text-slate-500 font-medium">날짜선택</span>
                </div>
                <div className="w-4 sm:w-6 h-[1px] bg-slate-200 mb-4" />
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[10px] flex items-center justify-center font-bold">2</div>
                  <span className="text-[10px] text-slate-400">현장방문</span>
                </div>
                <div className="w-4 sm:w-6 h-[1px] bg-slate-200 mb-4" />
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[10px] flex items-center justify-center font-bold">3</div>
                  <span className="text-[10px] text-slate-400">확정견적</span>
                </div>
                <div className="w-4 sm:w-6 h-[1px] bg-slate-200 mb-4" />
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[10px] flex items-center justify-center font-bold">4</div>
                  <span className="text-[10px] text-slate-400">정밀청소</span>
                </div>
                <div className="w-4 sm:w-6 h-[1px] bg-slate-200 mb-4" />
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-[10px] flex items-center justify-center font-bold">5</div>
                  <span className="text-[10px] text-slate-400">검수완료</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => goToReservationWithService('move-in')}
              className="bg-[#F1F5F9] text-[#0A1D37] px-5 py-3 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer self-stretch sm:self-auto text-center shrink-0"
            >
              실시간 예약하기 →
            </button>
          </div>

          {/* Bento Cell 6: 결과로 증명하는 퀄리티 (col-span-2 row-span-1) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2 p-6 flex flex-col justify-center">
              <h4 className="font-bold text-[#0A1D37] text-base mb-1">결과로 증명하는 퀄리티</h4>
              <div className="flex gap-2 items-center text-[#38BDF8] text-xs font-bold mb-3">
                <span>BEFORE</span>
                <div className="w-6 h-[1px] bg-[#38BDF8]" />
                <span>AFTER</span>
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                주방 후드 찌든때부터 창틀 구석 먼지까지, 전문 장비로 완벽하게 제거합니다.
              </p>
              <button
                onClick={() => setCurrentView('portfolio')}
                className="text-[#0A1D37] text-xs font-bold underline underline-offset-4 cursor-pointer text-left hover:text-[#38BDF8] transition-colors"
              >
                청소사례 더보기 →
              </button>
            </div>
            <div className="w-full sm:w-1/2 h-36 sm:h-auto bg-slate-200 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
                alt="청소 시공 사례"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0A1D37]/20 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg text-[10px] font-bold text-[#0A1D37]">
                  청소사례 2,450건 돌파
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — 고객의 고민
          Bento Card Grid: "청소업체, 아무 곳이나 선택하고 싶지는 않으니까."
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            고객님의 고민과 불안
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-3">
            청소업체, 아무 곳이나 선택하고 싶지는 않으니까.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
            청소를 맡기고 싶어도 어떤 업체를 선택해야 할지 고민되시죠?
          </p>
        </div>

        {/* 4 Problem Cards in Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              id: 'c-1',
              num: '01',
              icon: Eye,
              title: '사진만 보고 받은 견적이 실제와 다를까 걱정되시나요?',
              desc: '현장 환경은 평수만으로 알 수 없습니다. 창문 개수, 샷시 노후도, 오염도를 무시한 비대면 견적은 위험합니다.'
            },
            {
              id: 'c-2',
              num: '02',
              icon: DollarSign,
              title: '처음 안내받은 금액과 실제 금액이 달라질까 걱정되시나요?',
              desc: '청소 당일 현장에서 "기름때가 심하다, 베란다가 넓다"며 갑작스러운 추가금을 청구받는 불쾌한 경험을 방지합니다.'
            },
            {
              id: 'c-3',
              num: '03',
              icon: Search,
              title: '눈에 보이는 곳만 대충 청소할까 걱정되시나요?',
              desc: '서랍장 안쪽, 후드 필터 내부, 걸레받이 하부 시공 분진 등 손 닿기 힘든 구석은 대충 넘길까 불안하셨죠?'
            },
            {
              id: 'c-4',
              num: '04',
              icon: HelpCircle,
              title: '내 공간에 어떤 청소가 필요한지 모르시겠나요?',
              desc: '신축 분진 제거, 찌든 기름때 박리, 바닥 왁스 코팅 등 어떤 작업이 최적의 솔루션인지 전문가가 직접 진단합니다.'
            }
          ].map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#38BDF8]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-slate-300 font-mono tracking-wider">{item.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#38BDF8] flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#0A1D37] leading-snug mb-2.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Section 02 Bento Solution Block */}
        <div className="rounded-3xl bg-[#0A1D37] text-white p-8 sm:p-10 text-center relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="text-[#38BDF8] font-bold text-[10px] uppercase tracking-wider bg-[#38BDF8]/20 px-3 py-1 rounded-full">
              링크클린의 해답
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              링크클린은 다르게 시작합니다.
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              공간의 상태를 직접 확인하고 필요한 작업을 꼼꼼하게 살펴본 후 고객에게 꼭 맞는 청소를 안내합니다.
            </p>
            <div className="pt-2">
              <button
                onClick={() => goToReservationWithService('move-in')}
                className="px-6 py-3 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                id="problem-cta-btn"
              >
                <Calendar className="w-4 h-4 text-white" />
                방문 견적 예약하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03 — 링크클린의 차별점
          "깨끗함의 기준을 높이겠습니다." (Bento 4개 카드)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            WHY LINKCLEAN
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-3">
            깨끗함의 기준을 높이겠습니다.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
            고객님이 믿고 맡기실 수 있도록 4가지 원칙을 철저히 지킵니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: '01',
              title: '꼼꼼한 현장 확인',
              desc: '공간마다 오염도와 필요한 작업은 다릅니다. 링크클린은 현장 상태를 직접 확인합니다.'
            },
            {
              num: '02',
              title: '합리적인 견적',
              desc: '불필요한 작업을 권하기보다 공간에 필요한 작업을 기준으로 정직한 견적을 안내합니다.'
            },
            {
              num: '03',
              title: '디테일한 청소',
              desc: '눈에 잘 보이는 곳뿐만 아니라 손이 자주 닿는 곳, 틈새와 구석까지 세심하게 확인합니다.'
            },
            {
              num: '04',
              title: '끝까지 책임지는 서비스',
              desc: '예약부터 방문 견적, 청소까지 고객이 불편하지 않도록 꼼꼼하게 안내합니다.'
            }
          ].map((card) => (
            <div
              key={card.num}
              className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#38BDF8]/40 transition-all relative overflow-hidden group"
            >
              <div className="text-3xl sm:text-4xl font-black text-[#38BDF8] font-mono transition-colors mb-4">
                {card.num}
              </div>
              <h3 className="text-base font-bold text-[#0A1D37] mb-2">
                {card.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — 서비스
          "공간에 맞는 청소를 선택하세요." (Bento 카드 라인업)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              OUR SERVICES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-2">
              공간에 맞는 청소를 선택하세요.
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              상황과 공간에 특화된 링크클린의 6대 전문 청소 라인업입니다.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('services')}
            className="self-start sm:self-auto text-xs font-bold text-[#38BDF8] hover:text-[#0EA5E9] flex items-center gap-1 cursor-pointer"
          >
            전체 서비스 목록 보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'move-in' as ServiceType,
              title: '입주·이사청소',
              desc: '새로운 공간에서 기분 좋은 시작을 할 수 있도록 생활 흔적과 먼지를 꼼꼼하게 정리합니다.',
              img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: 'residential' as ServiceType,
              title: '거주청소',
              desc: '생활하면서 쌓인 먼지와 오염을 정리하고 쾌적한 생활공간을 만들어드립니다.',
              img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: 'commercial' as ServiceType,
              title: '상가청소',
              desc: '고객에게 보여지는 공간인 만큼 청결하고 깔끔한 매장을 만들어드립니다.',
              img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: 'office' as ServiceType,
              title: '사무실청소',
              desc: '직원과 방문객 모두가 쾌적하게 느낄 수 있도록 업무공간을 깨끗하게 관리합니다.',
              img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: 'partial' as ServiceType,
              title: '부분청소',
              desc: '주방, 욕실, 창틀 등 필요한 구역만 골라 진행하는 알뜰하고 꼼꼼한 맞춤 청소입니다.',
              img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: 'trash' as ServiceType,
              title: '쓰레기집청소',
              desc: '혼자서 해결하기 힘든 방치된 대량 폐기물 분리 배출과 악취 탈취, 100% 비밀보장 특수 정리입니다.',
              img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
            }
          ].map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={svc.img}
                    alt={svc.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D37]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white font-bold text-lg">
                    {svc.title}
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {svc.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between gap-2">
                <button
                  onClick={() => goToServiceDetail(svc.id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  id={`service-card-detail-${svc.id}`}
                >
                  자세히 보기
                </button>
                <button
                  onClick={() => goToReservationWithService(svc.id)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#38BDF8] hover:bg-[#0EA5E9] transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  견적 예약
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 — 작업 프로세스 (Bento Container)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A1D37] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8] opacity-10 rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/20 px-3 py-1 rounded-full border border-[#38BDF8]/30">
                STEP BY STEP PROCESS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-white">
                어렵게 생각하지 마세요.<br />
                링크클린이 처음부터 안내해드립니다.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5">
                신청부터 청소 완료까지 투명하고 체계적인 5단계 프로세스를 진행합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
                  className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-[#38BDF8] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] font-black text-[#38BDF8] bg-[#38BDF8]/20 px-2 py-0.5 rounded border border-[#38BDF8]/30">
                        {p.step}
                      </span>
                      <span className="text-slate-500 text-xs font-bold">0{index + 1}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{p.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button
                onClick={() => goToReservationWithService('move-in')}
                className="px-8 py-3.5 rounded-xl bg-white text-[#0A1D37] hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#0A1D37]" />
                지금 방문 견적 예약하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 — BEFORE / AFTER
          "말보다 결과로 보여드리겠습니다." (Bento Frame)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            PROVEN RESULTS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-3">
            말보다 결과로 보여드리겠습니다.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
            실제 시공 현장의 청소 전/후 차이를 슬라이더를 통해 확인하세요.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {(['전체', '주방', '욕실', '거실', '창틀', '베란다', '상가', '쓰레기집', '기타'] as PortfolioCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveBeforeAfterCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeBeforeAfterCategory === cat
                  ? 'bg-[#0A1D37] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Interactive Before/After Stage in Bento card */}
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
          {featuredItem ? (
            <BeforeAfterSlider
              beforeImage={featuredItem.beforeImage}
              afterImage={featuredItem.afterImage}
              title={featuredItem.title}
              description={featuredItem.description}
            />
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              해당 카테고리의 청소사례를 준비 중입니다.
            </div>
          )}
        </div>

        {/* CTA to Portfolio */}
        <div className="text-center">
          <button
            onClick={() => setCurrentView('portfolio')}
            className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-white text-[#0A1D37] font-bold text-xs transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
            id="home-view-all-portfolio-btn"
          >
            전체 청소사례 보기
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 — 고객후기 (Bento Review Cards)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              REAL TESTIMONIALS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-2">
              고객님이 직접 말해주신 링크클린의 이야기
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              실제 방문 견적과 시공을 경험하신 고객님들의 진솔한 후기입니다.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('review')}
            className="self-start sm:self-auto text-xs font-bold text-[#38BDF8] hover:text-[#0EA5E9] flex items-center gap-1 cursor-pointer"
          >
            고객후기 더보기
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleReviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{rev.date}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-4">
                  "{rev.content}"
                </p>

                {rev.photos.length > 0 && (
                  <div className="mb-4 rounded-2xl overflow-hidden h-28 bg-slate-100">
                    <img
                      src={rev.photos[0]}
                      alt="후기 사진"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#0A1D37]">{rev.author}</span>
                <span className="text-[#38BDF8] bg-blue-50 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border border-blue-100">
                  {rev.serviceType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 08 — FINAL CTA (Bento Box)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#0A1D37] text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-sm border border-slate-800">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="text-[#38BDF8] font-bold text-[10px] uppercase tracking-wider bg-[#38BDF8]/20 px-3 py-1 rounded-full">
              간편하고 빠른 방문 예약
            </span>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              깨끗한 공간을 원하시나요?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              전화해서 기다릴 필요 없이<br />
              <strong className="text-white font-bold">원하는 날짜와 시간을 직접 선택하세요.</strong>
            </p>

            <div className="text-lg sm:text-xl font-bold text-[#38BDF8]">
              링크클린이 직접 찾아가겠습니다.
            </div>

            <div className="pt-2">
              <button
                onClick={() => goToReservationWithService('move-in')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-400/30 hover:shadow-blue-400/40 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                id="final-cta-reserve-btn"
              >
                <Calendar className="w-4 h-4 text-white" />
                방문 견적 예약하기
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-medium tracking-wide">
              원하는 날짜 선택 → 방문 확인 → 견적 안내
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons matching Bento Mockup */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        <a
          href="tel:064-763-4545"
          title="고객센터 전화 문의 (064-763-4545)"
          className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-[#0A1D37] rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform border border-slate-100 cursor-pointer"
          id="floating-call-btn"
        >
          <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-[#0A1D37]" />
        </a>
        <button
          onClick={() => goToReservationWithService('move-in')}
          title="방문 견적 예약하기"
          className="w-12 h-12 sm:w-14 sm:h-14 bg-[#38BDF8] text-white rounded-full shadow-xl shadow-blue-300/50 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
          id="floating-reserve-btn"
        >
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </div>
    </div>
  );
};
