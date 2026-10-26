import React, { useState } from 'react';
import { ChevronDown, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QNA_SECTIONS } from '../data/qnaGuide';

/** 제주 청소 Q&A·비용 안내 페이지 (/qna/) — 검색·AI가 그대로 인용하기 좋은 질문·답변 모음 */
export const QnaView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="py-6 sm:py-12 bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 space-y-5">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1D37]">제주 청소 Q&amp;A · 비용 안내</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            입주청소 비용, 예약 시기, 비대면 진행까지 — 고객님들이 가장 많이 묻는 질문을 모았습니다.
          </p>
        </div>

        {QNA_SECTIONS.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="text-sm sm:text-base font-extrabold text-[#0A1D37] px-1">{section.title}</h2>
            {section.items.map((item) => {
              const key = section.title + item.q;
              const isOpen = open === key;
              return (
                <div
                  key={key}
                  className={`rounded-2xl border bg-white overflow-hidden ${isOpen ? 'border-[#38BDF8]/60 shadow-sm' : 'border-slate-200'}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : key)}
                    aria-expanded={isOpen}
                    className="w-full px-4 py-3 sm:p-5 text-left flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <span className="text-sm font-extrabold text-[#0A1D37] leading-snug">Q. {item.q}</span>
                    <span
                      className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition-transform ${
                        isOpen ? 'rotate-180 bg-[#38BDF8] text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/60">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </section>
        ))}

        <a
          href="tel:064-763-4545"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#0A1D37] text-white text-sm font-bold"
        >
          <PhoneCall className="w-4 h-4" /> 전화로 견적 받기 064-763-4545
        </a>
        <button
          type="button"
          onClick={() => {
            setCurrentView('reservation');
            window.scrollTo({ top: 0 });
          }}
          className="w-full py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-[#0A1D37] cursor-pointer"
        >
          청소 날짜 먼저 예약하기
        </button>
      </div>
    </div>
  );
};
