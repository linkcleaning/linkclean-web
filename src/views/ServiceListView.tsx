import React from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_DETAILS } from '../data/initialData';
import { ServiceType } from '../types';
import { Calendar, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';

export const ServiceListView: React.FC = () => {
  const { goToServiceDetail, goToReservationWithService } = useApp();

  const SERVICE_IDS: ServiceType[] = [
    'move-in',
    'residential',
    'commercial',
    'office',
    'partial',
    'trash'
  ];

  const services = SERVICE_IDS.map((id) => SERVICE_DETAILS[id]).filter(Boolean);

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
          CLEANING SERVICES
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A1D37] tracking-tight">
          공간과 상황에 맞춘 전문 청소 서비스
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          전문 장비와 검증된 친환경 약품으로 공간 본연의 깨끗함을 되찾아드립니다.
        </p>
      </div>

      {/* Services Grid */}
      <div className="space-y-8">
        {services.map((svc, index) => {
          const isReversed = index % 2 === 1;

          return (
            <div
              key={svc.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Image Col */}
              <div className={`lg:col-span-5 h-64 sm:h-80 lg:h-auto relative overflow-hidden bg-slate-100 ${isReversed ? 'lg:order-2' : ''}`}>
                <img
                  src={svc.mainImage}
                  alt={svc.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0A1D37]/90 backdrop-blur-md text-[#38BDF8] font-bold text-xs font-mono">
                  0{index + 1}
                </div>
              </div>

              {/* Content Col */}
              <div className={`lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 ${isReversed ? 'lg:order-1' : ''}`}>
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-[#38BDF8] font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                    전문 맞춤 시공
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1D37]">
                    {svc.name}
                  </h2>
                  <p className="text-slate-700 font-semibold text-sm">
                    {svc.tagline}
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    {svc.description}
                  </p>

                  {/* Highlights */}
                  <div className="pt-2 space-y-1.5">
                    {svc.recommendedFor.slice(0, 2).map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => goToServiceDetail(svc.id as ServiceType)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#0A1D37] font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1"
                  >
                    서비스 자세히 보기
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => goToReservationWithService(svc.id as ServiceType)}
                    className="px-6 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                    방문 견적 예약
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
