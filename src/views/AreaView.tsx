import React from 'react';
import { MapPin, Phone, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceType } from '../types';
import seoData from '../data/seoPages.json';

// 지역별 안내 페이지 (/jeju-si/, /seogwipo/) — 글은 src/data/seoPages.json 의 같은 항목을 씀
type AreaPage = { area: string; h1: string; areaName: string; match: string[]; body: string[] };
const AREA_PAGES = (seoData.pages as unknown as (AreaPage & { view: string })[]).filter((p) => p.view === 'area');

const SERVICE_LINKS: { id: ServiceType; label: string }[] = [
  { id: 'move-in', label: '입주·이사청소' },
  { id: 'residential', label: '거주청소' },
  { id: 'commercial', label: '상가청소' },
  { id: 'office', label: '사무실청소' },
  { id: 'partial', label: '부분청소' },
  { id: 'trash', label: '쓰레기집청소' },
  { id: 'memorial', label: '유품정리·특수청소' },
];

export const AreaView: React.FC = () => {
  const { selectedAreaId, portfolio, goToServiceDetail, goToArea, setCurrentView } = useApp();
  const page = AREA_PAGES.find((p) => p.area === selectedAreaId) || AREA_PAGES[0];
  const cases = portfolio
    .filter((item) => page.match.some((m) => `${item.location || ''} ${item.title}`.includes(m)))
    .slice(0, 4);
  const others = AREA_PAGES.filter((p) => p.area !== page.area);

  return (
    <div className="py-10 sm:py-16 space-y-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="bg-[#0A1D37] rounded-3xl p-7 sm:p-10 text-white">
        <span className="inline-flex items-center gap-1.5 bg-[#38BDF8] text-[#0A1D37] px-3 py-1 rounded-full text-[11px] font-black">
          <MapPin className="w-3.5 h-3.5" />
          {page.areaName} 전지역 방문
        </span>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-4 leading-tight">{page.h1}</h1>
        <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">{page.body[0]}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-7">
          <button
            onClick={() => setCurrentView('reservation')}
            className="inline-flex items-center justify-center gap-2 bg-[#38BDF8] text-[#0A1D37] font-black px-6 py-3.5 rounded-xl cursor-pointer"
          >
            <Calendar className="w-4 h-4" /> 청소 날짜 예약하기
          </button>
          <a
            href="tel:064-763-4545"
            className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-6 py-3.5 rounded-xl"
          >
            <Phone className="w-4 h-4" /> 064-763-4545
          </a>
        </div>
      </header>

      <section className="space-y-4">
        {page.body.slice(1).map((text) => (
          <p key={text} className="flex gap-3 text-slate-700 text-sm sm:text-base leading-relaxed">
            <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
            <span>{text}</span>
          </p>
        ))}
      </section>

      {cases.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37] tracking-tight mb-5">
            {page.areaName} 실제 청소 현장
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {cases.map((item) => (
              <article key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200">
                <div className="grid grid-cols-2">
                  <img src={item.beforeImage} alt={`${item.location || page.areaName} 청소 전`} loading="lazy" className="w-full h-36 object-cover" />
                  <img src={item.afterImage} alt={`${item.location || page.areaName} 청소 후`} loading="lazy" className="w-full h-36 object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0A1D37] text-sm leading-snug">{item.title}</h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-3">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
          <button
            onClick={() => setCurrentView('portfolio')}
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#0A1D37] cursor-pointer"
          >
            청소 사례 전체 보기 <ChevronRight className="w-4 h-4" />
          </button>
        </section>
      )}

      <section>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37] tracking-tight mb-5">
          {page.areaName}에서 하는 청소 서비스
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SERVICE_LINKS.map((s) => (
            <button
              key={s.id}
              onClick={() => goToServiceDetail(s.id)}
              className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#0A1D37] hover:border-[#38BDF8] cursor-pointer"
            >
              {page.areaName.replace('시', '')} {s.label}
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <nav className="text-sm text-slate-500">
          다른 지역:{' '}
          {others.map((o) => (
            <button key={o.area} onClick={() => goToArea(o.area)} className="font-bold text-[#0A1D37] underline cursor-pointer ml-1">
              {o.h1}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};
