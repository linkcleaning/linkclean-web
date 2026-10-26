import React, { useState } from 'react';
import { HOME_FAQS } from '../data/homeFaqs';
import { ChevronDown, HelpCircle, PhoneCall, MessageCircle } from 'lucide-react';

export const HomeFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const faqs = HOME_FAQS;

  return (
    <section id="faq-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-6">
      {/* 제목을 누르면 질문 목록이 펼쳐짐 */}
      <button
        type="button"
        onClick={() => {
          setShowAll((v) => !v);
          setOpenIndex(null);
        }}
        aria-expanded={showAll}
        className={`w-full flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 sm:px-6 sm:py-5 text-left shadow-xs cursor-pointer transition-colors ${
          showAll ? 'border-[#38BDF8]/60' : 'border-slate-200 hover:border-[#38BDF8]/50'
        }`}
      >
        <span className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-blue-50 text-[#38BDF8] font-black flex items-center justify-center text-base sm:text-lg">Q</span>
        <span className="flex-1 min-w-0">
          <span className="block text-base sm:text-2xl font-extrabold text-[#0A1D37] tracking-tight">자주 묻는 질문</span>
          <span className="block text-[11px] sm:text-sm text-slate-500">
            {showAll ? '궁금한 질문을 눌러 답변을 확인하세요' : `고객님들이 가장 많이 묻는 ${faqs.length}가지 · 눌러서 보기`}
          </span>
        </span>
        <span
          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-transform duration-200 ${
            showAll ? 'rotate-180 bg-[#38BDF8] text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {showAll && (
      <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3 animate-in fade-in duration-200">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                isOpen ? 'border-[#38BDF8]/60 shadow-sm' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-4 py-3 sm:p-5 text-left flex items-start justify-between gap-3 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-2.5">
                  <span className="hidden sm:inline text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-[#0A1D37] shrink-0 mt-0.5">
                    {faq.category}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#0A1D37] leading-snug">
                    {faq.q}
                  </span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#38BDF8] text-white' : 'text-slate-500'
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/60 animate-in fade-in duration-200">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

    </section>
  );
};
