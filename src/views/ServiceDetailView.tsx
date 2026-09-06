import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_DETAILS } from '../data/initialData';
import { ServiceType } from '../types';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Award,
  ChevronRight
} from 'lucide-react';

export const ServiceDetailView: React.FC = () => {
  const { selectedServiceId, setCurrentView, goToReservationWithService } = useApp();

  const service = SERVICE_DETAILS[selectedServiceId] || SERVICE_DETAILS['move-in'];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="py-10 sm:py-16 space-y-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb / Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('services')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-[#0A1D37] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          전체 서비스 목록으로 돌아가기
        </button>

        <span className="text-xs font-bold text-[#38BDF8] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          {service.name}
        </span>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-sm bg-[#0A1D37] text-white">
        <div className="h-64 sm:h-96 relative">
          <img
            src={service.mainImage}
            alt={service.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1D37] via-[#0A1D37]/60 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] text-xs font-bold border border-[#38BDF8]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              링크클린 프리미엄 라인
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {service.name}
            </h1>
            <p className="text-slate-300 font-medium text-xs sm:text-sm max-w-2xl">
              {service.tagline}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10 bg-[#0A1D37] border-t border-slate-800/80">
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {service.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={() => goToReservationWithService(service.id)}
              className="px-6 py-3 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-white" />
              이 서비스 방문 견적 예약하기
            </button>
          </div>
        </div>
      </div>

      {/* 추천 고객 (이런 고객에게 추천합니다) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold text-[#0A1D37] tracking-tight mb-5 flex items-center gap-2">
          <span className="w-2 h-5 bg-[#38BDF8] rounded-full inline-block" />
          이런 고객님께 적극 추천합니다
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {service.recommendedFor.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-100"
            >
              <div className="w-5 h-5 rounded-full bg-blue-50 text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 주요 청소 범위 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0A1D37] tracking-tight flex items-center gap-2">
            <span className="w-2 h-5 bg-[#38BDF8] rounded-full inline-block" />
            주요 청소 상세 범위
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            보이지 않는 틈새와 탈거 가능한 모든 부품을 분리하여 정밀 시공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {service.scopeList.map((scope, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3"
            >
              <h3 className="font-bold text-[#0A1D37] text-sm pb-2 border-b border-slate-200/60 flex items-center justify-between">
                <span>{scope.title}</span>
                <span className="text-[10px] font-bold text-[#38BDF8] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  정밀 케어
                </span>
              </h3>
              <ul className="space-y-2">
                {scope.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-[#38BDF8] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 작업 사진 갤러리 */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#0A1D37] tracking-tight flex items-center gap-2">
          <span className="w-2 h-5 bg-[#38BDF8] rounded-full inline-block" />
          실제 작업 현장 사진
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {service.workImages.map((imgUrl, i) => (
            <div key={i} className="h-52 rounded-3xl overflow-hidden border border-slate-100 shadow-sm group">
              <img
                src={imgUrl}
                alt="시공 현장"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 작업 프로세스 */}
      <div className="bg-[#0A1D37] text-white rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm border border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/20 px-2.5 py-1 rounded-full border border-[#38BDF8]/30">WORKFLOW</span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-2 text-white">
            {service.name} 작업 진행 순서
          </h2>
        </div>

        <div className="space-y-3">
          {service.processSteps.map((step) => (
            <div
              key={step.step}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-[#38BDF8]/40 transition-colors"
            >
              <div className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-[#38BDF8] text-white shrink-0">
                {step.step}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm">{step.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0A1D37] tracking-tight flex items-center gap-2">
            <span className="w-2 h-5 bg-[#38BDF8] rounded-full inline-block" />
            자주 묻는 질문 (FAQ)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {service.name}에 대해 궁금해하시는 질문들을 모았습니다.
          </p>
        </div>

        <div className="space-y-3">
          {service.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="border border-slate-100 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 flex items-center justify-between font-bold text-[#0A1D37] hover:bg-slate-50 transition-colors text-xs sm:text-sm cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-[#38BDF8] font-mono">Q.</span>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                    <p className="flex items-start gap-2">
                      <span className="text-[#38BDF8] font-mono font-bold">A.</span>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* REQUIRED FINAL CTA BUTTON */}
      <div className="bg-[#0A1D37] text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            {service.name}, 지금 실시간 방문 견적을 신청하세요.
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
            담당자가 직접 방문하여 투명한 견적을 안내해드립니다. 원하는 날짜와 시간을 선택하세요.
          </p>
          <div className="pt-2">
            <button
              onClick={() => goToReservationWithService(service.id)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-400/20 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              id="service-detail-final-cta-btn"
            >
              <Calendar className="w-4 h-4 text-white" />
              방문 견적 예약하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
