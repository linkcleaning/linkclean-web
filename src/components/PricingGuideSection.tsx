import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, AlertCircle, Phone, Calendar, ShieldCheck, Scale, Sparkles, Building, Home } from 'lucide-react';
import { ServiceType } from '../types';
import { MobileCollapse } from './MobileCollapse';

export const PricingGuideSection: React.FC = () => {
  const { goToReservationWithService } = useApp();
  const [selectedTab, setSelectedTab] = useState<'movein' | 'airbnb' | 'residential' | 'commercial'>('movein');

  const criteriaData = {
    movein: {
      title: '입주·이사 청소 견적 기준',
      subtitle: '신축 입주 분진, 이전 세입자의 생활 오염도를 반영한 정직한 실측 견적',
      badge: '현장 실측 맞춤 견적',
      serviceType: 'move-in' as ServiceType,
      factors: [
        {
          label: '실측 평수 및 공간 구조',
          desc: '공급면적, 방과 욕실 개수, 베란다 확장/비확장 여부에 맞춘 최적 인원 투입',
        },
        {
          label: '창호 및 샤시 상태',
          desc: '창문 개수, 2중창 구조, 방충망 및 창틀의 묵은 먼지 오염도',
        },
        {
          label: '신축 분진 vs 생활 오염',
          desc: '신축 공사 분진(벽지/서랍/걸레받이) 또는 구축 찌든 기름때와 묵은때 상태',
        },
        {
          label: '작업 환경 및 동선',
          desc: '엘리베이터 유무, 층고, 현장 장비 진입 환경 등을 종합 진단',
        },
      ],
    },
    airbnb: {
      title: '숙소·펜션·에어비앤비 관리 기준',
      subtitle: '제주 독채 풀빌라, 타운하우스, 게스트하우스 운영 특화 맞춤 관리',
      badge: '정기 협의 맞춤 견적',
      serviceType: 'partial' as ServiceType,
      factors: [
        {
          label: '숙소 규모 및 운영 형태',
          desc: '원룸형 스튜디오부터 40평 이상 독채 풀빌라까지 공간 맞춤 세팅',
        },
        {
          label: '침구 세탁 및 교체 범위',
          desc: '호텔식 베딩 턴오버, 수건/어메니티 재비치 및 다림질 케어',
        },
        {
          label: '정기 관리 주기 및 빈도',
          desc: '게스트 퇴실 주기별 턴오버 또는 월 단위 정기 클리닝 계약',
        },
        {
          label: '실내 항균 및 소독 관리',
          desc: '천연 피톤치드 연무 소독, 바비큐존 및 수영장 주변 정리 협의',
        },
      ],
    },
    residential: {
      title: '거주 대청소 견적 기준',
      subtitle: '가구와 생활 짐이 있는 상태에서 진행하는 디테일 케어',
      badge: '오염도 진단 맞춤 견적',
      serviceType: 'residential' as ServiceType,
      factors: [
        {
          label: '생활 짐과 가구 배치 상태',
          desc: '가구 보호 보양 작업 및 대형 집기 이동 가능 범위 확인',
        },
        {
          label: '주방 찌든 기름때 오염도',
          desc: '후드 필터, 가스레인지/인덕션 주변 굳은 기름때의 박리 난이도',
        },
        {
          label: '욕실 물때 및 결로 곰팡이',
          desc: '타일 줄눈, 실리콘, 천장 환풍기의 오염 깊이 진단',
        },
        {
          label: '맞춤형 집중 구역 선택',
          desc: '주방+욕실 집중 케어 또는 집 전체 풀케어 등 원하는 범위 선택',
        },
      ],
    },
    commercial: {
      title: '상가·사무실 청소 견적 기준',
      subtitle: '매장, 카페, 식당, 오피스 오픈 전/후 위생 청소 및 바닥 관리',
      badge: '업종별 맞춤 실측',
      serviceType: 'commercial' as ServiceType,
      factors: [
        {
          label: '전용 면적 및 집기 구조',
          desc: '테이블, 파티션, 진열대 등 매장 내 집기 배치와 동선 환경',
        },
        {
          label: '바닥 재질 및 코팅 필요 여부',
          desc: '데코타일, 대리석, 에폭시 기계 세척 및 왁스 코팅 회수',
        },
        {
          label: '유리창 및 쇼윈도우 범위',
          desc: '1층 로드샵 통유리 및 매장 전면 유리창 케어 범위',
        },
        {
          label: '영업 시간대 맞춤 일정',
          desc: '오픈 전 새벽 청소, 마감 후 야간 청소 등 맞춤 작업 시간 조율',
        },
      ],
    },
  };

  const currentTabInfo = criteriaData[selectedTab];

  return (
    <section id="pricing-guide-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-10">
      <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-10">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          TAILORED ESTIMATE
        </span>
        <h2 className="text-xl sm:text-3xl font-extrabold text-[#0A1D37] tracking-tight mt-1.5 sm:mt-2">
          현장 맞춤 견적 기준 &amp; 작업 범위
        </h2>
        <p className="sm:hidden text-slate-600 text-xs mt-1 leading-relaxed">
          평수·창문·오염도를 보고 <strong>현장 실측·사진으로 1:1 맞춤 견적</strong>을 드립니다.
        </p>
        <p className="hidden sm:block text-slate-600 text-sm mt-1.5 leading-relaxed">
          공간마다 평수, 창문 개수, 묵은 오염도가 모두 다릅니다. 링크클린은 획일화된 임의 가격으로 인한 현장 분쟁을 방지하기 위해, <strong>100% 현장 실측 및 사진 기반의 정직한 1:1 맞춤 견적</strong>을 원칙으로 합니다.
        </p>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 sm:flex justify-center gap-1 sm:gap-2 mt-3 sm:mt-5 p-1 bg-slate-100 rounded-2xl max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => setSelectedTab('movein')}
            className={`px-2 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTab === 'movein'
                ? 'bg-white text-[#0A1D37] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏡 입주·이사청소
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('airbnb')}
            className={`px-2 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTab === 'airbnb'
                ? 'bg-white text-[#0A1D37] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏖️ 숙소·펜션관리
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('residential')}
            className={`px-2 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTab === 'residential'
                ? 'bg-white text-[#0A1D37] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛋️ 거주 대청소
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('commercial')}
            className={`px-2 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTab === 'commercial'
                ? 'bg-white text-[#0A1D37] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏢 상가·사무실
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-6 sm:border-b border-slate-100 gap-2 sm:gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0284C7] bg-blue-50 px-2.5 py-1 rounded-md mb-1">
              <Scale className="w-3.5 h-3.5" />
              <span>{currentTabInfo.badge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-[#0A1D37] leading-snug">
              {currentTabInfo.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentTabInfo.subtitle}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[11px] sm:text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              당일 바가지 추가금 0원 원칙
            </span>
            <p className="hidden sm:block text-[11px] text-slate-400 mt-1">
              사진 확인 후 사전 안내된 범위 내 책임 시공
            </p>
          </div>
        </div>

        {/* 모바일: 견적 기준·작업 범위는 접어두고 버튼으로 펼침 */}
        <MobileCollapse label="견적 기준 · 작업 범위 자세히 보기" className="mt-1 sm:mt-0">
        {/* 4 Core Estimation Factors Grid */}
        <div className="mb-6 sm:my-6">
          <div className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>정직한 견적 산정 4대 기준</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentTabInfo.factors.map((factor, idx) => (
              <div
                key={idx}
                className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between hover:border-[#38BDF8] transition-all"
              >
                <div>
                  <div className="text-[10px] font-black text-[#38BDF8] font-mono mb-1">
                    FACTOR 0{idx + 1}
                  </div>
                  <div className="text-xs font-extrabold text-[#0A1D37] leading-snug mb-1.5">
                    {factor.label}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {factor.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scope comparison: 기본 포함 항목 vs 특수 작업 사전 협의 항목 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* 기본 포함 항목 */}
          <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#0284C7]">
              <span className="w-5 h-5 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-[10px]">
                ✓
              </span>
              <span>기본 청소 포함 항목 (추가 비용 0원)</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                <span><strong>창문·창틀:</strong> 외창을 제외한 내부 전체 유리창 및 틈새 창틀 먼지 완벽 세척</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                <span><strong>주방 딥클린:</strong> 싱크대 상·하부장 분리 탈거 청소, 걸레받이 하부 분진 제거</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                <span><strong>욕실 스팀살균:</strong> 환풍기 커버 및 배수구 거름망 탈거 세척, 140℃ 고온 멸균 소독</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                <span><strong>방·거실·베란다:</strong> 전등갓 탈거, 콘센트/스위치 닦기, 바닥 3회 이상 전용 습식 세척</span>
              </li>
            </ul>
          </div>

          {/* 특수 작업 사전 협의 항목 */}
          <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>특수 작업 사전 협의 항목 (현장 사전 안내제)</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>심한 곰팡이:</strong> 벽지나 실리콘 내부에 깊게 박힌 특수 약품 박리 시공</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>시트지·스티커·뽁뽁이:</strong> 열풍기 및 스크래퍼를 이용한 특수 접착제 제거 작업</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>가전제품 내부:</strong> 에어컨 필터 분해, 냉장고 내부 음식물 정리 세척 (옵션 선택)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>특수 작업 환경:</strong> 엘리베이터가 없는 3층 이상 계단 수작업, 대량 쓰레기 폐기 배출</span>
              </li>
            </ul>
          </div>
        </div>
        </MobileCollapse>

      </div>
    </section>
  );
};
