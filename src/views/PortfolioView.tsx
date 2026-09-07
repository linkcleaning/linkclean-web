import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PortfolioCategory, PortfolioItem } from '../types';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { NaverBlogBanner } from '../components/NaverBlogBanner';
import { Sparkles, Calendar, Filter, X, ArrowLeftRight } from 'lucide-react';

const CATEGORIES: PortfolioCategory[] = [
  '전체',
  '주방',
  '욕실',
  '거실',
  '창틀',
  '베란다',
  '상가',
  '쓰레기집',
  '기타'
];

export const PortfolioView: React.FC = () => {
  const { portfolio, goToReservationWithService } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>('전체');
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);

  const filteredItems = selectedCategory === '전체'
    ? portfolio
    : portfolio.filter((item) => item.category === selectedCategory);

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
          CLEANING PORTFOLIO
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A1D37] tracking-tight">
          실제 시공 사례 (Before & After)
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          링크클린의 손길을 거쳐 달라진 공간들을 카테고리별로 직접 비교해보세요.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#0A1D37] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <p className="text-slate-400 text-sm">해당 카테고리의 시공 사례가 아직 등록되지 않았습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail with interactive slider trigger */}
                <div
                  className="relative h-56 overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => setActiveModalItem(item)}
                >
                  <img
                    src={item.representativeImage || item.afterImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0A1D37]/90 backdrop-blur-md text-[#38BDF8] font-bold text-[10px]">
                    {item.category}
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#38BDF8] text-white font-bold text-xs flex items-center gap-1 shadow-sm">
                    <ArrowLeftRight className="w-3 h-3" />
                    B/A 비교 보기
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-[11px] text-slate-400 font-mono">{item.createdAt}</div>
                  <h3 className="font-bold text-[#0A1D37] text-sm sm:text-base leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between">
                <button
                  onClick={() => setActiveModalItem(item)}
                  className="text-xs font-bold text-[#38BDF8] hover:text-[#0EA5E9] transition-colors cursor-pointer"
                >
                  상세 비교 뷰어 열기 →
                </button>
                <button
                  onClick={() => goToReservationWithService('move-in')}
                  className="text-xs font-semibold text-slate-500 hover:text-[#0A1D37]"
                >
                  견적 문의
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Before / After Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-[#0A1D37]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in duration-200">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#38BDF8] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 mb-2">
                {activeModalItem.category} 시공사례
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0A1D37]">
                {activeModalItem.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                {activeModalItem.description}
              </p>
            </div>

            {/* Interactive Slider inside modal */}
            <BeforeAfterSlider
              beforeImage={activeModalItem.beforeImage}
              afterImage={activeModalItem.afterImage}
              title="청소 전/후 비교 슬라이더"
              description="중앙의 흰색 바를 좌우로 드래그하여 전/후 오염 제거 결과를 확인하세요."
            />

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-mono">
                등록일: {activeModalItem.createdAt}
              </span>
              <button
                onClick={() => {
                  setActiveModalItem(null);
                  goToReservationWithService('move-in');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                이와 같은 청소 방문 견적 신청하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Naver Blog Showcase */}
      <NaverBlogBanner />

      {/* Bottom CTA */}
      <div className="bg-[#0A1D37] text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#38BDF8] opacity-10 rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            원하는 공간의 깨끗한 변화, 링크클린과 함께하세요.
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm">
            전문가가 직접 공간을 확인하고 정직한 시공을 약속드립니다.
          </p>
          <div className="pt-2">
            <button
              onClick={() => goToReservationWithService('move-in')}
              className="px-8 py-3.5 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
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
