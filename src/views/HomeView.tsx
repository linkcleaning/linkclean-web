import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { NaverBlogBanner } from '../components/NaverBlogBanner';
import { SonEopNeunNalModal } from '../components/SonEopNeunNalModal';
import { CleaningSoundboard } from '../components/CleaningSoundboard';
import { JejuWeatherWidget } from '../components/JejuWeatherWidget';
import { CleaningTipsBoard } from '../components/CleaningTipsBoard';
import { getMonthlySonEopNeunNal } from '../utils/lunarCalendar';
import { PortfolioCategory, ServiceType } from '../types';
import { PricingGuideSection } from '../components/PricingGuideSection';
import { HeroProcessSteps } from '../components/HeroProcessSteps';
import { HomeFaqSection } from '../components/HomeFaqSection';
import { MobileCollapse } from '../components/MobileCollapse';
import { PromoSongPlayer } from '../components/PromoSongPlayer';
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

export const HomeView: React.FC = () => {
  const {
    portfolio,
    reviews,
    setCurrentView,
    goToServiceDetail,
    goToReservationWithService,
    openRenewalNotice
  } = useApp();

  const [activeBeforeAfterCategory, setActiveBeforeAfterCategory] = useState<PortfolioCategory>('전체');
  const [isSonEopNeunNalModalOpen, setIsSonEopNeunNalModalOpen] = useState<boolean>(false);
  const [showFeeInfo, setShowFeeInfo] = useState<boolean>(false); // '0원 추가금' 설명 펼치기

  // Bento Cell 3 month navigation
  const [bentoMonthOffset, setBentoMonthOffset] = useState<number>(0);
  const bentoDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + bentoMonthOffset);
    return d;
  }, [bentoMonthOffset]);

  const bentoYear = bentoDate.getFullYear();
  const bentoMonth = bentoDate.getMonth() + 1;
  const bentoAuspiciousDays = useMemo(() => {
    return getMonthlySonEopNeunNal(bentoYear, bentoMonth);
  }, [bentoYear, bentoMonth]);

  // Filter portfolio items
  const filteredPortfolio = activeBeforeAfterCategory === '전체'
    ? portfolio
    : portfolio.filter((item) => item.category === activeBeforeAfterCategory);

  // Active item for the main featured comparison
  const featuredItem = filteredPortfolio[0] || portfolio[0];

  // Only visible reviews
  const visibleReviews = reviews.filter((r) => r.isVisible);

  return (
    <div className="space-y-6 sm:space-y-16 pb-12 sm:pb-16 bg-[#F8FAFC]">
      {/* =========================================================================
          SECTION 01 — HERO (스마트폰 최적화 모바일 + 데스크톱 와이드 BENTO)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        {/* Event Banner (공지·이벤트) */}
        <button
          type="button"
          onClick={() => setCurrentView('event')}
          className="w-full text-left mb-4 sm:mb-6 bg-gradient-to-r from-amber-50 via-white to-sky-50 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-amber-200 shadow-2xs hover:shadow-md transition-shadow flex items-center gap-3 cursor-pointer"
        >
          <span className="text-3xl sm:text-4xl shrink-0" aria-hidden="true">☕</span>
          <span className="flex-1 min-w-0">
            <span className="flex items-center gap-1.5 mb-0.5">
              <span className="bg-amber-400 text-[#0A1D37] text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded">
                EVENT
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                진행 중
              </span>
            </span>
            <span className="block text-[13px] sm:text-base font-extrabold text-[#0A1D37] leading-snug break-keep">
              후기 남기고 · 지인 소개하면<br className="sm:hidden" /> 스타벅스 커피 🎁
            </span>
            <span className="hidden sm:block text-xs text-slate-500">
              네이버 플레이스 후기 작성 또는 소개 계약 시 커피를 보내드려요
            </span>
          </span>
          <span className="shrink-0 px-2.5 sm:px-3 py-2 rounded-xl bg-[#0A1D37] text-white text-xs font-bold flex items-center gap-0.5 sm:gap-1">
            보기
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </button>

        {/* MOBILE VIEW (sm:hidden) — 스크롤 피로도를 완전히 없앤 스마트폰 최적화 컴팩트 레이아웃 */}
        <div className="sm:hidden space-y-2.5">
          {/* Main Mobile Brand Card */}
          <div className="bg-[#0A1D37] rounded-2xl p-5 text-white relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#38BDF8] opacity-10 rounded-full -mr-14 -mt-14 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#38BDF8] text-[#0A1D37] px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider">
                  제주 전지역 방문 실측
                </span>
                <span className="text-[10px] text-blue-200 font-medium">
                  비대면 사진 리포트 안심 시공
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black leading-tight mb-2 tracking-tight text-white">
                "제주에 없어도 괜찮아요.<br />
                <span className="text-[#38BDF8]">청소 전·후를 사진으로</span> 보내드립니다."
              </h1>
              {/* 4단계 진행 과정 (예전 아래쪽 섹션을 위로 합침) */}
              <HeroProcessSteps />

              {/* 3 Buttons Grid (전화 / 카톡 / 1분견적) */}
              <div className="grid grid-cols-3 gap-1.5 mb-3.5">
                <a
                  href="tel:064-763-4545"
                  className="bg-white/10 hover:bg-white/20 text-white py-2.5 px-1 rounded-xl font-bold text-[11px] transition-all flex flex-col items-center justify-center gap-1 border border-white/20 active:scale-95"
                  id="mobile-hero-phone-btn"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>전화 문의</span>
                </a>
                <a
                  href="https://pf.kakao.com/_xfxdrxmM?from=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FEE500] text-[#371D1E] py-2.5 px-1 rounded-xl font-black text-[11px] transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
                  id="mobile-hero-kakao-btn"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-[#371D1E]" />
                  <span>카톡 상담</span>
                </a>
                <button
                  onClick={() => {
                    goToReservationWithService('move-in');
                  }}
                  className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A1D37] py-2.5 px-1 rounded-xl font-black text-[11px] shadow-sm transition-all flex flex-col items-center justify-center gap-1 active:scale-95 cursor-pointer"
                  id="mobile-hero-reserve-btn"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#0A1D37]" />
                  <span>견적 신청</span>
                </button>
              </div>

              {/* 3 Metrics Row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-700/70 text-center">
                <div>
                  <div className="text-base font-black text-white">100%</div>
                  <div className="text-[10px] text-slate-400">사진 리포트</div>
                </div>
                <button type="button" onClick={() => setShowFeeInfo((v) => !v)} aria-expanded={showFeeInfo} className="cursor-pointer">
                  <div className="text-base font-black text-[#38BDF8]">0원</div>
                  <div className="text-[10px] text-slate-400 underline decoration-dotted underline-offset-2">당일 추가금 ⓘ</div>
                </button>
                <div>
                  <div className="text-base font-black text-white">후불제</div>
                  <div className="text-[10px] text-slate-400 leading-tight whitespace-nowrap">예약금<span className="text-[7px] mx-[1px] opacity-70">→</span>검수<span className="text-[7px] mx-[1px] opacity-70">→</span>잔금</div>
                </div>
              </div>
              {showFeeInfo && (
              <p className="mt-2 rounded-xl bg-white/10 border border-[#38BDF8]/40 px-3 py-2 text-left text-[11px] sm:text-xs text-slate-200 leading-relaxed animate-in fade-in duration-150">
                <b className="text-[#38BDF8]">추가금 안내</b> — 사진·통화로 안내받은 내용과 현장이 같다면 당일 추가금은 <b className="text-white">0원</b>입니다.
                다만 방문 당일 오염도·평수·짐 상태 등이 사진이나 통화 때와 다를 경우에는 추가금이 생길 수 있으며,
                이때는 <b className="text-white">작업 전에 먼저 설명드리고 동의를 받은 뒤</b> 진행합니다.
              </p>
              )}
            </div>
          </div>

          {/* Mobile Quick Cards — 손없는 날 한 줄 + 전/후 · 후기 */}
          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() => setIsSonEopNeunNalModalOpen(true)}
              className="col-span-2 p-2.5 bg-white rounded-xl border border-rose-200 shadow-xs text-left flex items-center gap-2 active:bg-rose-50 cursor-pointer"
            >
              <span className="shrink-0 flex items-center gap-1 text-xs font-black text-[#0A1D37]">
                <Calendar className="w-4 h-4 text-rose-500" />
                {bentoMonth}월 손없는 날
              </span>
              <span className="flex-1 min-w-0 flex gap-1 overflow-x-auto no-scrollbar">
                {bentoAuspiciousDays.map((d) => (
                  <span key={d.dateString} className="shrink-0 text-[10px] font-black text-white bg-red-500 px-1.5 py-0.5 rounded">
                    {d.day}일({d.dayOfWeek})
                  </span>
                ))}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            <button
              onClick={() => setCurrentView('portfolio')}
              className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-xs text-left flex items-center gap-2.5 active:bg-slate-50 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#0A1D37] truncate">시공 전/후 비교</div>
                <div className="text-[10px] text-slate-400 truncate">실제 사진 갤러리</div>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('review')}
              className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-xs text-left flex items-center gap-2.5 active:bg-slate-50 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 fill-rose-500" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#0A1D37] truncate">고객 리얼 후기</div>
                <div className="text-[10px] text-slate-400 truncate">평점 4.9 솔직 리뷰</div>
              </div>
            </button>
          </div>

          {/* 휴대폰에서도 제주 날씨 (제주시/서귀포시 · 1주일 예보) */}
          <JejuWeatherWidget compact className="rounded-2xl!" />
        </div>

        {/* DESKTOP BENTO GRID (hidden sm:grid) — 데스크톱에서는 4열 Bento Grid 고급 디자인 온전히 유지 */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Bento Cell 1: Main Brand Hero (col-span-2 row-span-2) */}
          <div className="sm:col-span-2 lg:col-span-12 bg-[#0A1D37] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-sm flex flex-col gap-7">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full -mr-20 -mt-20 pointer-events-none" />
            <div className="relative z-10 flex flex-col justify-between">
            <div>
              <span className="inline-block bg-[#38BDF8] text-[#0A1D37] px-3 py-1 rounded-full text-[11px] font-black mb-4 tracking-wider">
                제주 전지역 • 비대면 사진 리포트 안심 시공
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[34px] xl:text-[40px] font-black leading-[1.2] mb-5 tracking-tight text-white lg:whitespace-nowrap">
                "제주에 없어도 괜찮아요.<br className="lg:hidden" />{' '}
                <span className="text-[#38BDF8]">청소 전·후를 사진으로</span> 보내드립니다."
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mb-7 max-w-lg lg:max-w-none leading-relaxed">
                육지에서 이사 오시거나 현장에 직접 오지 못하셔도 걱정 마세요.<br />
                구역별 실시간 고화질 사진 전송과 고객 확인 후 안심 결제로 멀리서도 100% 믿고 맡기실 수 있습니다.
              </p>

              {/* 3 Buttons Grid (전화 / 카톡 / 견적) */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="tel:064-763-4545"
                  className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border border-white/20"
                >
                  <PhoneCall className="w-4 h-4 text-[#38BDF8]" />
                  <span>전화 문의 (064-763-4545)</span>
                </a>
                <a
                  href="https://pf.kakao.com/_xfxdrxmM?from=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FEE500] hover:bg-[#FDD835] text-[#371D1E] px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-[#371D1E]" />
                  <span>카톡 1:1 상담</span>
                </a>
                <button
                  onClick={() => {
                    goToReservationWithService('move-in');
                  }}
                  className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-[#0A1D37] px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Calendar className="w-4 h-4 text-[#0A1D37]" />
                  <span>사진 견적 신청</span>
                </button>
              </div>
            </div>

            {/* Trust Metrics footer in Cell 1 */}
            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-700/60 relative z-10 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-[11px] text-slate-400">현장 직접 실측</div>
              </div>
              <button type="button" onClick={() => setShowFeeInfo((v) => !v)} aria-expanded={showFeeInfo} className="text-left cursor-pointer group">
                <div className="text-xl sm:text-2xl font-black text-[#38BDF8]">0원</div>
                <div className="text-[11px] text-slate-400 underline decoration-dotted underline-offset-2 group-hover:text-slate-200">불합리 추가금 ⓘ</div>
              </button>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">4.9/5.0</div>
                <div className="text-[11px] text-slate-400">고객 만족도</div>
              </div>
            </div>
            {showFeeInfo && (
              <div className="relative z-10">
              <p className="mt-2 rounded-xl bg-white/10 border border-[#38BDF8]/40 px-3 py-2 text-left text-[11px] sm:text-xs text-slate-200 leading-relaxed animate-in fade-in duration-150">
                <b className="text-[#38BDF8]">추가금 안내</b> — 사진·통화로 안내받은 내용과 현장이 같다면 당일 추가금은 <b className="text-white">0원</b>입니다.
                다만 방문 당일 오염도·평수·짐 상태 등이 사진이나 통화 때와 다를 경우에는 추가금이 생길 수 있으며,
                이때는 <b className="text-white">작업 전에 먼저 설명드리고 동의를 받은 뒤</b> 진행합니다.
              </p>
              </div>
            )}
            </div>

            {/* 아래: 제주에 없어도 안심되는 4단계 진행 (가로 한 줄) */}
            <div className="relative z-10">
              <HeroProcessSteps variant="desktop" />
            </div>
          </div>

          {/* Bento Cell 2: 맞춤 서비스 — 가로 한 줄 */}
          <div className="sm:col-span-2 lg:col-span-12 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center gap-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-[#0A1D37] shrink-0">
              <span className="w-1.5 h-6 bg-[#38BDF8] rounded-full" />
              맞춤 서비스
            </h3>
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
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
            <button
              onClick={() => setCurrentView('services')}
              className="shrink-0 px-5 py-3 text-xs font-bold text-[#38BDF8] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer text-center"
            >
              전체 서비스 보기 →
            </button>
          </div>

          {/* Bento Cell 3: 손없는 날 — 가로 한 줄 */}
          <div
            id="bento-cell-son-eop-neun-nal"
            onClick={() => setIsSonEopNeunNalModalOpen(true)}
            className="sm:col-span-2 lg:col-span-12 bg-white rounded-3xl border border-rose-200/80 hover:border-rose-400 shadow-sm hover:shadow-md transition-all px-5 py-3.5 flex flex-wrap lg:flex-nowrap items-center gap-3 cursor-pointer group"
          >
            <span className="shrink-0 flex items-center gap-1.5 text-sm font-black text-[#0A1D37]">
              <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </span>
              손없는 날
            </span>
            <span className="shrink-0 flex items-center gap-0.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBentoMonthOffset((prev) => prev - 1);
                }}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-600 cursor-pointer"
                title="이전 달"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black text-[#0A1D37] whitespace-nowrap">
                {bentoYear}년 {bentoMonth}월
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBentoMonthOffset((prev) => prev + 1);
                }}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-600 cursor-pointer"
                title="다음 달"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </span>
            <span className="flex-1 min-w-0 flex gap-1.5 overflow-x-auto no-scrollbar">
              {bentoAuspiciousDays.map((d) => (
                <span
                  key={d.dateString}
                  className="shrink-0 text-[11px] font-black text-white bg-red-500 px-2 py-1 rounded-md whitespace-nowrap"
                >
                  {d.day}일({d.dayOfWeek})
                </span>
              ))}
              {bentoAuspiciousDays.length === 0 && <span className="text-xs text-slate-400">이 달은 손없는 날이 없습니다</span>}
            </span>
            <span className="shrink-0 text-[11px] font-bold text-[#38BDF8] group-hover:text-rose-600 flex items-center gap-0.5 whitespace-nowrap">
              달력 크게보기 <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Bento Cell 4: 제주도 날씨 & 1주일 청소 예보 (제주시 / 서귀포시) */}
          <JejuWeatherWidget compact className="sm:col-span-2 lg:col-span-12 rounded-3xl! px-5! py-3.5!" />
        </div>
      </section>

      {/* 링크클린 홍보송 플레이어 */}
      <PromoSongPlayer />

      {/* =========================================================================
          SECTION 02 — 현장 맞춤 견적 기준 & 작업 범위 가이드 (분쟁 없는 정직 견적)
      ========================================================================= */}
      <PricingGuideSection />


      {/* =========================================================================
          링크클린은 다릅니다 — 별도 페이지로 이동 (고객의 고민 / 깨끗함의 기준 / 진행 순서)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => {
            setCurrentView('why');
            window.scrollTo({ top: 0 });
          }}
          className="w-full text-left bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#38BDF8] transition-all p-4 sm:p-6 flex items-center gap-3 sm:gap-5 cursor-pointer"
        >
          <span className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-[#0A1D37] text-[#38BDF8] flex items-center justify-center text-xl sm:text-2xl">✨</span>
          <span className="flex-1 min-w-0">
            <span className="block text-[10px] sm:text-xs font-black text-[#38BDF8] tracking-wider">WHY LINKCLEAN</span>
            <span className="block text-base sm:text-xl font-black text-[#0A1D37]">링크클린은 다릅니다</span>
            <span className="block text-[11px] sm:text-sm text-slate-500 leading-snug">
              업체 고르기 고민 · 깨끗함의 기준 · 간단한 진행 순서
            </span>
          </span>
          <span className="shrink-0 px-3 py-2 rounded-xl bg-[#38BDF8] text-white text-xs sm:text-sm font-bold">보기 →</span>
        </button>
      </section>

      {/* 신축 입주 안내 — 피톤치드는 링크클린이, 베이크아웃은 고객님이 (누르면 방법 페이지) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => {
            setCurrentView('bakeout');
            window.scrollTo({ top: 0 });
          }}
          className="w-full text-left rounded-2xl sm:rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-emerald-50 shadow-sm hover:shadow-md transition-all p-4 sm:p-6 flex items-center gap-3 sm:gap-5 cursor-pointer"
        >
          <span className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-amber-100 flex items-center justify-center text-xl sm:text-2xl">🏠</span>
          <span className="flex-1 min-w-0">
            <span className="block text-[10px] sm:text-xs font-black text-amber-700 tracking-wider">신축 입주 고객님께</span>
            <span className="block text-sm sm:text-lg font-black text-[#0A1D37] leading-snug">
              피톤치드 도포는 링크클린이 해드려요.<br className="sm:hidden" /> 베이크아웃은 꼭 해주세요!
            </span>
            <span className="block text-[11px] sm:text-sm text-slate-500 leading-snug">새집 냄새 줄이는 베이크아웃 방법 · 순서 · 주의사항</span>
          </span>
          <span className="shrink-0 px-3 py-2 rounded-xl bg-amber-400 text-[#0A1D37] text-xs sm:text-sm font-black">방법 보기 →</span>
        </button>
      </section>

      {/* =========================================================================
          SECTION 04 — 서비스
          "공간에 맞는 청소를 선택하세요." (모바일 한 줄 가로 슬라이드 & 데스크톱 그리드)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 gap-2 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                OUR SERVICES
              </span>
              <span className="sm:hidden text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                좌우로 넘겨보세요 👈 👉
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-1.5 sm:mt-2">
              공간에 맞는 청소를 선택하세요.
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
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

        {/* Mobile: Single-row horizontal scrollable carousel / Desktop: 2-3 column grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:overflow-visible no-scrollbar">
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
              img: '/images/trash_house_before.jpg'
            }
          ].map((svc) => (
            <div
              key={svc.id}
              className="w-[230px] sm:w-auto shrink-0 snap-start bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-32 sm:h-48 overflow-hidden bg-slate-100">
                  <img
                    src={svc.img}
                    alt={svc.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D37]/75 via-[#0A1D37]/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 sm:bottom-3 sm:left-4 text-white font-bold text-sm sm:text-lg">
                    {svc.title}
                  </div>
                </div>

                <div className="p-3 sm:p-5">
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2 sm:line-clamp-none mb-1 sm:mb-4">
                    {svc.desc}
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-5 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between gap-1.5 sm:gap-2">
                <button
                  onClick={() => goToServiceDetail(svc.id)}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  id={`service-card-detail-${svc.id}`}
                >
                  상세보기
                </button>
                <button
                  onClick={() => goToReservationWithService(svc.id)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold text-white bg-[#38BDF8] hover:bg-[#0EA5E9] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  견적 예약
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          MIDWAY INTERACTIVE SOUNDBOARD — 청소 마스터 ASMR 리얼 사운드박스 & 선물 이벤트
      ========================================================================= */}
      <CleaningSoundboard />

      {/* =========================================================================
          SECTION 06 — BEFORE / AFTER
          "말보다 결과로 보여드리겠습니다." (Bento Frame)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-blue-100">
            PROVEN RESULTS
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-2 sm:mt-3">
            말보다 결과로 보여드리겠습니다.
          </h2>
          <p className="hidden sm:block text-slate-500 text-sm mt-1">
            실제 시공 현장의 청소 전/후 차이를 슬라이더를 통해 확인하세요.
          </p>
        </div>

        {/* Category Filter Tabs (Mobile: Horizontal Scrollable) */}
        <div className="flex overflow-x-auto gap-1.5 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center mb-3 sm:mb-8 no-scrollbar">
          {(['전체', '주방', '욕실', '거실', '창틀', '베란다', '상가', '쓰레기집', '기타'] as PortfolioCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveBeforeAfterCategory(cat)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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
        <div className="max-w-4xl mx-auto mb-4 sm:mb-8 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-slate-100 shadow-sm">
          {featuredItem ? (
            <BeforeAfterSlider
              beforeImage={featuredItem.beforeImage}
              afterImage={featuredItem.afterImage}
              title={featuredItem.title}
              description={featuredItem.description}
            />
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs sm:text-sm">
              해당 카테고리의 청소사례를 준비 중입니다.
            </div>
          )}
        </div>

        {/* 더 많은 사례: 갤러리 + 네이버 블로그 (한 줄) */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentView('portfolio')}
            className="py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#0A1D37] font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
            id="home-view-all-portfolio-btn"
          >
            청소사례 전체보기
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <a
            href="https://blog.naver.com/linkcleaning"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 rounded-xl bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 shadow-2xs"
            id="naver-blog-external-link-btn"
          >
            <span className="w-4 h-4 rounded bg-white text-[#03C75A] flex items-center justify-center font-black text-[10px] leading-none">N</span>
            블로그 사례 더보기
          </a>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06.5 — 전문가 청소 팁 & 프로모션 통합 게시판 (정보성/홍보성)
      ========================================================================= */}
      <CleaningTipsBoard />

      {/* =========================================================================
          SECTION 07 — 고객후기 (모바일 가로 스크롤 / 데스크톱 3열 그리드)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 gap-2 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-blue-100">
                REAL TESTIMONIALS
              </span>
              <span className="sm:hidden text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                좌우 스크롤 👈 👉
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-1.5 sm:mt-2">
              고객님이 직접 말해주신 링크클린의 이야기
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
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

        {/* Mobile: 1-row scroll / Desktop: 3-col grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:overflow-visible no-scrollbar">
          {visibleReviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="w-[270px] sm:w-auto shrink-0 snap-start bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{rev.date}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-4">
                  "{rev.content}"
                </p>

                {rev.photos.length > 0 && (
                  <div className="mb-3 sm:mb-4 rounded-xl sm:rounded-2xl overflow-hidden h-24 sm:h-28 bg-slate-100">
                    <img
                      src={rev.photos[0]}
                      alt="후기 사진"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
                <span className="font-bold text-[#0A1D37]">{rev.author}</span>
                <span className="text-[#38BDF8] bg-blue-50 px-2 py-0.5 rounded-full font-semibold text-[10px] sm:text-[11px] border border-blue-100">
                  {rev.serviceType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 07.5 — 자주 묻는 질문 (FAQ)
      ========================================================================= */}
      <HomeFaqSection />


      {/* =========================================================================
          SECTION 08 — FINAL CTA (Bento Box)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-[#0A1D37] text-white p-6 sm:p-14 text-center relative overflow-hidden shadow-sm border border-slate-800">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3 sm:space-y-5">
            <span className="text-[#38BDF8] font-bold text-[10px] uppercase tracking-wider bg-[#38BDF8]/20 px-2.5 py-0.5 rounded-full">
              간편하고 빠른 방문 예약
            </span>

            <h2 className="text-xl sm:text-4xl font-black tracking-tight text-white">
              깨끗한 공간을 원하시나요?
            </h2>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
              전화해서 기다릴 필요 없이<br />
              <strong className="text-white font-bold">원하는 날짜와 시간을 직접 선택하세요.</strong>
            </p>

            <div className="text-base sm:text-xl font-bold text-[#38BDF8]">
              링크클린이 직접 찾아가겠습니다.
            </div>

            <div className="pt-1 sm:pt-2">
              <button
                onClick={() => goToReservationWithService('move-in')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl sm:rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-400/30 hover:shadow-blue-400/40 transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98"
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

      {/* Son-eop-neun-nal Monthly Calendar Modal */}
      <SonEopNeunNalModal
        isOpen={isSonEopNeunNalModalOpen}
        onClose={() => setIsSonEopNeunNalModalOpen(false)}
      />
    </div>
  );
};
